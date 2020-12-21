declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly POSTGRES_HOST: string;
      readonly POSTGRES_USERNAME: string;
      readonly POSTGRES_PASSWORD: string;
      readonly POSTGRES_PORT: string;
      readonly POSTGRES_DB: string;
      readonly POSTGRES_RETRY_ATTEMPTS: string;
      readonly POSTGRES_RETRY_DELAY: string;
      readonly SERVICE_API_PORT: string;
    }
  }
}

export {};
