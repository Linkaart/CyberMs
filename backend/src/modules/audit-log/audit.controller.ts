import express from 'express';
import * as auditService from './audit.service';
import { authorize } from '../../middleware/rbac.middleware';

const router = express.Router();

router.get('/', authorize(['ADMIN', 'ANALYST']), async (req, res, next) => {
  try {
    const skip = Number(req.query.skip) || 0;
    const take = Number(req.query.take) || 50;
    const list = await auditService.list(skip, take);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

export default router;
