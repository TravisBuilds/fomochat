declare module 'react-native-fetch-api' {
  export type RequestInfo = string | Request;
  export type RequestInit = {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
  };
} 