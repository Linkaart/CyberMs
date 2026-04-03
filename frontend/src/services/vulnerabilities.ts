import api from '../api/apiClient';

export const fetchVulnerabilities = async (params: any) => {
  const res = await api.get('/vulnerabilities', { params });
  return res.data;
};

export const createVulnerability = async (payload: any) => {
  const res = await api.post('/vulnerabilities', payload);
  return res.data;
};

export const fetchVulnerability = async (id: string) => {
  const res = await api.get(`/vulnerabilities/${id}`);
  return res.data;
};

export const updateVulnerability = async (id: string, payload: any) => {
  const res = await api.patch(`/vulnerabilities/${id}`, payload);
  return res.data;
};

export const deleteVulnerability = async (id: string) => {
  const res = await api.delete(`/vulnerabilities/${id}`);
  return res.data;
};
