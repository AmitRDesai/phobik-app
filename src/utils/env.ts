const variables = {
  ENV: process.env.EXPO_PUBLIC_ENV,
  API_ENDPOINT: process.env.EXPO_PUBLIC_API_ENDPOINT,
};

type VariableKey = keyof typeof variables;

export const env = {
  isEnv: (env: 'development' | 'preview' | 'production'): boolean => {
    return variables.ENV === env;
  },

  get(key: VariableKey): string {
    if (variables[key] === void 0) {
      throw new Error(`Environment variable ${key} is not set.`);
    }
    return variables[key]!;
  },
};
