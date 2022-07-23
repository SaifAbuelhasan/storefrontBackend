// add userId property to request object in express

declare namespace Express {
  export interface Request {
    userId?: number;
  }
}
