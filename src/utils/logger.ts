const isDev = __DEV__;

export const log = {
  info: (message: string, context?: Record<string, unknown>) => {
    if (!isDev) {
      return;
    }

    if (context) {
      console.log(`[CAPIRE] ${message}`, context);
      return;
    }

    console.log(`[CAPIRE] ${message}`);
  },
  error: (message: string, error?: unknown) => {
    if (!isDev) {
      return;
    }

    if (error instanceof Error) {
      console.error(`[CAPIRE] ${message}`, { name: error.name, message: error.message });
      return;
    }

    if (error && typeof error === 'object') {
      const record = error as Record<string, unknown>;
      const safePayload = {
        code: record.code,
        name: record.name,
        status: record.status,
      };
      console.error(`[CAPIRE] ${message}`, safePayload);
      return;
    }

    console.error(`[CAPIRE] ${message}`);
  },
};
