declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CONVEX_URL: string;
      CLERK_PUBLISHABLE_KEY: string;
    }
  }
}

export {};