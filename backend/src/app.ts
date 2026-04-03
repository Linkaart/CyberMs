import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { json } from 'body-parser';
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import vulnerabilitiesRoutes from './modules/vulnerabilities/vulnerabilities.routes';
import auditRoutes from './modules/audit-log/audit.routes';
import errorMiddleware from './middleware/error.middleware';

dotenv.config();

const app = express();

app.use(helmet());
app.use(json());
app.use(cookieParser());

const corsOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: corsOrigin }));

const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 100,
});
app.use(limiter);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/vulnerabilities', vulnerabilitiesRoutes);
app.use('/api/v1/audit-logs', auditRoutes);

app.use(errorMiddleware);

export default app;
