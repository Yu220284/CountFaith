declare namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_GENAI_API_KEY: string;
    MAPBOX_ACCESS_TOKEN: string;
    BLAXEL_API_KEY: string;
    CRUSTDATA_API_KEY: string;
    NEXT_PUBLIC_BLAXEL_API_KEY?: string;
    NEXT_PUBLIC_CRUSTDATA_API_KEY?: string;
  }
}
