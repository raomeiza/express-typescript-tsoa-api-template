declare module 'http' {
  interface IncomingMessage {
      rawBody: any;
  }
  interface Request {
      rawBody: any;
      isXHub: boolean;
      isXHubValid: boolean;
  }
}
