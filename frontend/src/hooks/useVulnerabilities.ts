import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as svc from '../services/vulnerabilities';

export function useVulnerabilities(params = { skip: 0, take: 20 }) {
  return useQuery({ queryKey: ['vulnerabilities', params], queryFn: () => svc.fetchVulnerabilities(params) });
}

export function useVulnerability(id?: string) {
  return useQuery({ queryKey: ['vulnerability', id], queryFn: () => (id ? svc.fetchVulnerability(id) : null), enabled: !!id });
}

export function useCreateVulnerability() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (payload: any) => svc.createVulnerability(payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['vulnerabilities'] }) });
}

export function useUpdateVulnerability() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, payload }: any) => svc.updateVulnerability(id, payload), onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['vulnerabilities'] });
    qc.invalidateQueries({ queryKey: ['vulnerability'] });
  } });
}

export function useDeleteVulnerability() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => svc.deleteVulnerability(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['vulnerabilities'] }) });
}
