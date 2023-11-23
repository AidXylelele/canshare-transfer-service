declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONOG_DB_URI: string;
      ACCESS_SECRET: string;
      REFRESH_SECRET: string;
      ACCESS_EXPIRATION: string;
      REFRESH_EXPIRATION: string;
      RABBIT_MQ_URI: string;
      HASH_SALT: string;
    }
  }
}

export {};
