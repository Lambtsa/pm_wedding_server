declare namespace NodeJS {
  /**
   * Add custom environment variables
   */
  interface ProcessEnv {
    readonly PORT: string;

    readonly POSTGRES_HOST: string;
    readonly POSTGRES_PORT: number;
    readonly POSTGRES_USER: string;
    readonly POSTGRES_PASSWORD: string;
    readonly POSTGRES_DB: string;
    readonly POSTGRES_HOST_AUTH_METHOD: string;
  }
}

declare type Nullable<T> = T | null;
