import express from 'express';
import { z } from 'zod';
import * as service from './vulnerabilities.service';

const router = express.Router();

const createSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  severity: z.string().optional(),
  status: z.string().optional(),
  source: z.string().optional(),
  relatedAsset: z.string().optional(),
  application: z.string().optional(),
  assignedToUserId: z.number().optional(),
  dueDate: z.string().optional(),
});

router.post('/', async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const v = await service.create({ ...data });
    res.status(201).json(v);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const skip = Number(req.query.skip) || 0;
    const take = Number(req.query.take) || 20;
    const filters: any = {};
    if (req.query.severity) filters.severity = req.query.severity;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.application) filters.application = req.query.application;
    const list = await service.list(skip, take, filters);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const v = await service.get(req.params.id);
    if (!v || v.isDeleted) return res.status(404).json({ message: 'Not found' });
    res.json(v);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const v = await service.update(req.params.id, req.body);
    res.json(v);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
