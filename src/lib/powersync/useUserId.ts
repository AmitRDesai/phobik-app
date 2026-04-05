import { useSession } from '@/lib/auth';

export function useUserId(): string | undefined {
  const { data: session } = useSession();
  return session?.user?.id;
}
