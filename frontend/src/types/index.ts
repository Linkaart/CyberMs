export type Vulnerability = {
  id: string;
  title: string;
  description?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'WONTFIX';
  application?: string;
  assignedToUserId?: number;
  createdAt?: string;
};
