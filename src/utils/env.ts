import { z } from 'zod';

const envSchema = z.object({
  ENV: z.enum(['development', 'preview', 'production']).default('development'),
  API_ENDPOINT: z.url(),
  API_URL: z.url(),
  APP_SCHEME: z.string().min(1),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse({
    ENV: process.env.EXPO_PUBLIC_ENV,
    API_ENDPOINT: process.env.EXPO_PUBLIC_API_ENDPOINT,
    API_URL: process.env.EXPO_PUBLIC_API_URL,
    APP_SCHEME: process.env.EXPO_PUBLIC_APP_SCHEME,
  });

  if (!result.success) {
    console.error('Invalid environment variables:');
    console.error(z.prettifyError(result.error));
    throw new Error('Invalid environment variables');
  }

  return result.data;
}

const validated = validateEnv();

export const env = {
  isEnv: (e: Env['ENV']): boolean => {
    return validated.ENV === e;
  },

  get<K extends keyof Env>(key: K): Env[K] {
    return validated[key];
  },
};
