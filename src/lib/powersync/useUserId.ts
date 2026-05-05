import { useSession } from '@/hooks/auth/useAuth';

export function useUserId(): string | undefined {
  const { data: session } = useSession();
  return session?.user?.id;
}
