import express from 'express';
import * as usersService from './users.service';
import { z } from 'zod';

const router = express.Router();

const createSchema = z.object({ email: z.string().email(), password: z.string().min(8), name: z.string().optional() });

router.post('/', async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const u = await usersService.createUser(data.email, data.password, data.name);
    res.status(201).json({ id: u.id, email: u.email, name: u.name });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const users = await usersService.listUsers(0, 100);
    res.json(users.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role })));
  } catch (err) {
    next(err);
  }
});

export default router;
