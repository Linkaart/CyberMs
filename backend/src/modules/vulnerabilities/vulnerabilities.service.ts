import * as repo from './vulnerabilities.repository';

export const create = (data: any) => repo.createVuln(data);
export const get = (id: string) => repo.findById(id);
export const list = (skip = 0, take = 20, filters: any = {}) => repo.list(skip, take, filters);
export const update = (id: string, data: any) => repo.updateVuln(id, data);
export const remove = (id: string) => repo.softDelete(id);
