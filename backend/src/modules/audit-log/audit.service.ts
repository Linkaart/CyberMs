import * as repo from './audit.repository';

export const create = (data: any) => repo.createLog(data);
export const list = (skip = 0, take = 50) => repo.listLogs(skip, take);
