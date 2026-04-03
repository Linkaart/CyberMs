import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export default function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err?.status || 500;
  const message = status === 500 ? 'Internal server error' : err.message;

  // Log full error server-side (stack, request id if available)
  logger.error('Error: %s %s %o', req.method, req.originalUrl, { message: err.message, stack: err.stack });

  // Do not expose stack or sensitive data to client
  res.status(status).json({ message });
}
