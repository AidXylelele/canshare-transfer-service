declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONOG_DB_URI: string;
      ACCESS_SECRET: string;
      REFRESH_SECRET: string;
      ACCESS_EXPIRATION: string;
      REFRESH_EXPIRATION: string;
      RABBIT_MQ_URI: string;
      CENSHARE_API_URL: string;
      HASH_SALT: string;
      REDIS_PORT: string;
      REDIS_HOST: string;
      REDIS_PASSWORD: string;
      WIX_REDIS_DB: string;
      CENSHARE_REDIS_DB: string;
      ASSETS_REDIS_DB: string;
    }
  }
}

export {};
