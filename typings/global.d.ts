declare namespace NodeJS {
  /**
   * Add custom environment variables
   */
  interface ProcessEnv {
    readonly PORT: string;
  }
}

declare type Nullable<T> = T | null;
