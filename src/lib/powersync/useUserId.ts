import { useSession } from '@/modules/auth/hooks/useAuth';

export function useUserId(): string | undefined {
  const { data: session } = useSession();
  return session?.user?.id;
}
