import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { authClient } from '@/lib/auth';
import { env } from '@/utils/env';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  status?: 'sending' | 'sent' | 'error';
  failedContent?: string; // original message text for retry
};

const THREAD_STORAGE_KEY = 'coach-active-thread-id';
const API_URL = env.get('API_URL');

const GREETING =
  "Hey! I'm your Phobik Coach. I'm here to help you manage anxiety, practice grounding techniques, and build resilience. How are you feeling today?";

type RawMessage = {
  id: string;
  role: string;
  content: unknown;
  createdAt?: string;
};

function parseRawMessages(raw: unknown[]): ChatMessage[] {
  return raw.reduce<ChatMessage[]>((acc, m) => {
    const msg = m as RawMessage;
    if (msg.role !== 'user' && msg.role !== 'assistant') return acc;
    const content = extractText(msg.content);
    if (content.length === 0) return acc;
    acc.push({
      id: msg.id,
      role: msg.role as 'user' | 'assistant',
      content,
      timestamp: msg.createdAt ? new Date(msg.createdAt).getTime() : Date.now(),
      status: 'sent',
    });
    return acc;
  }, []);
}

async function apiFetch(path: string, options?: RequestInit) {
  // @ts-expect-error getCookie is added by the Expo plugin at runtime
  const cookies = authClient.getCookie() as string | undefined;
  const { fetch: expoFetch } = await import('expo/fetch');

  return expoFetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(cookies ? { Cookie: cookies } : {}),
      ...options?.headers,
    },
  });
}

async function persistThreadId(id: string | null) {
  if (id) {
    await AsyncStorage.setItem(THREAD_STORAGE_KEY, JSON.stringify(id));
  } else {
    await AsyncStorage.removeItem(THREAD_STORAGE_KEY);
  }
}

export function useCoachChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const threadIdRef = useRef<string | null>(null);
  const mountedRef = useRef(true);
  const abortRef = useRef<AbortController | null>(null);
  const firstTokenRef = useRef(false);

  // On mount: read persisted threadId and load history from Mastra memory
  useEffect(() => {
    mountedRef.current = true;

    (async () => {
      try {
        if (!mountedRef.current) return;

        const stored = await AsyncStorage.getItem(THREAD_STORAGE_KEY);
        const storedThreadId = stored ? JSON.parse(stored) : null;

        if (!mountedRef.current) return;

        if (storedThreadId && typeof storedThreadId === 'string') {
          threadIdRef.current = storedThreadId;
          setThreadId(storedThreadId);

          if (!mountedRef.current) return;

          const res = await apiFetch(
            `/api/memory/threads/${encodeURIComponent(storedThreadId)}/messages`,
          );
          const data = await res.json();

          if (!mountedRef.current) return;

          const rawMessages = Array.isArray(data)
            ? data
            : (data.messages ?? []);

          const history = parseRawMessages(rawMessages);

          if (history.length > 0) {
            setMessages(history);
          } else {
            threadIdRef.current = null;
            setThreadId(null);
            await AsyncStorage.removeItem(THREAD_STORAGE_KEY);
          }
        }
      } catch {
        threadIdRef.current = null;
        setThreadId(null);
        await AsyncStorage.removeItem(THREAD_STORAGE_KEY);
      } finally {
        if (mountedRef.current) setIsLoadingHistory(false);
      }
    })();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    setError(null);
    firstTokenRef.current = false;

    if (!threadIdRef.current) {
      const newId = `thread-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      threadIdRef.current = newId;
      setThreadId(newId);
      persistThreadId(newId);
    }
    const currentThreadId = threadIdRef.current;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
      status: 'sent',
    };
    setMessages((prev) => [...prev, userMsg]);

    const assistantId = `assistant-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        status: 'sending',
      },
    ]);
    setIsLoading(true);

    try {
      const controller = new AbortController();
      abortRef.current = controller;

      const response = await apiFetch('/api/coach/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: content.trim(),
          threadId: currentThreadId,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(errBody || `HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Haptic on first token
        if (!firstTokenRef.current) {
          firstTokenRef.current = true;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;
          if (data === '[ERROR]') {
            throw new Error(
              'The coach ran into a problem responding. Please try again.',
            );
          }
          const text = JSON.parse(data) as string;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? { ...msg, content: msg.content + text }
                : msg,
            ),
          );
        }
      }

      // Mark as sent
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId ? { ...msg, status: 'sent' } : msg,
        ),
      );
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      const errMessage =
        err instanceof Error ? err.message : 'Something went wrong';
      setError(errMessage);
      // Mark failed or remove empty
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== assistantId) return msg;
          if (msg.content.length > 0) {
            return { ...msg, status: 'sent' };
          }
          return {
            ...msg,
            status: 'error',
            content: '',
            failedContent: content.trim(),
          };
        }),
      );
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const retry = (messageId: string) => {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg?.failedContent) return;
    // Remove the failed message and its preceding user message
    setMessages((prev) => {
      const idx = prev.findIndex((m) => m.id === messageId);
      if (idx <= 0) return prev;
      return prev.filter((_, i) => i !== idx && i !== idx - 1);
    });
    sendMessage(msg.failedContent);
  };

  const stop = () => {
    abortRef.current?.abort();
  };

  const startNewSession = () => {
    setMessages([]);
    setError(null);
    threadIdRef.current = null;
    setThreadId(null);
    persistThreadId(null);
  };

  const switchThread = async (newThreadId: string) => {
    if (newThreadId === threadIdRef.current) return;

    setMessages([]);
    setError(null);
    setIsLoadingHistory(true);
    threadIdRef.current = newThreadId;
    setThreadId(newThreadId);
    persistThreadId(newThreadId);

    try {
      const res = await apiFetch(
        `/api/memory/threads/${encodeURIComponent(newThreadId)}/messages`,
      );
      const data = await res.json();
      const rawMessages = Array.isArray(data) ? data : (data.messages ?? []);

      const history = parseRawMessages(rawMessages);

      setMessages(history);
    } catch {
      threadIdRef.current = null;
      setThreadId(null);
      persistThreadId(null);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Whether to show greeting (no messages, not loading, no active thread)
  const showGreeting = !isLoadingHistory && messages.length === 0 && !threadId;

  return {
    messages,
    sendMessage,
    isLoading,
    isLoadingHistory,
    error,
    stop,
    retry,
    startNewSession,
    switchThread,
    threadId,
    greeting: showGreeting ? GREETING : null,
  };
}

/** Extract plain text from Mastra message content */
function extractText(content: unknown): string {
  if (typeof content === 'string') return content;

  if (
    typeof content === 'object' &&
    content !== null &&
    !Array.isArray(content)
  ) {
    const obj = content as Record<string, unknown>;
    if (typeof obj.content === 'string' && obj.content.length > 0) {
      return obj.content;
    }
    if (Array.isArray(obj.parts)) {
      return extractTextFromParts(obj.parts);
    }
  }

  if (Array.isArray(content)) {
    return extractTextFromParts(content);
  }

  return '';
}

function extractTextFromParts(parts: unknown[]): string {
  return parts
    .filter(
      (p): p is { type: 'text'; text: string } =>
        typeof p === 'object' &&
        p !== null &&
        (p as { type: string }).type === 'text',
    )
    .map((p) => p.text)
    .join('');
}
