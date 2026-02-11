
import { Client, User, Role, LeadStatus, ServiceSector, CallStatus } from './types';

const CLIENTS_KEY = 'fbt_clients_v3';
const USERS_KEY = 'fbt_users_v3';

export const initialUsers: User[] = [
  { id: 'admin-1', name: 'FBT Admin', email: 'admin@futurebound.tech', role: Role.ADMIN },
  { id: 'sales-1', name: 'John Sales', email: 'john@sales.com', role: Role.SALES },
  { id: 'agent-1', name: 'Sarah CA', email: 'sarah@agent.com', role: Role.AGENT, sector: ServiceSector.IT_RETURN },
  { id: 'agent-2', name: 'Mike GST', email: 'mike@agent.com', role: Role.AGENT, sector: ServiceSector.GST },
];

export const initialClients: Client[] = [
  {
    id: 'c-1',
    name: 'Alice Johnson',
    email: 'alice@client.com',
    phone: '555-0101',
    password: 'password123',
    source: 'Website Registration',
    status: LeadStatus.QUALIFIED,
    callStatus: CallStatus.INTERESTED,
    sector: ServiceSector.IT_RETURN,
    assignedAgentId: 'agent-1',
    notes: ['Self-registered for IT Return'],
    messages: [],
    documents: [],
    lastUpdated: new Date().toISOString(),
    progress: 10
  }
];

export const getStoredClients = (): Client[] => {
  const stored = localStorage.getItem(CLIENTS_KEY);
  return stored ? JSON.parse(stored) : initialClients;
};

export const setStoredClients = (clients: Client[]) => {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
};

export const getStoredUsers = (): User[] => {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : initialUsers;
};

export const setStoredUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Round-Robin Logic for Sales
export const distributeLeadsToSales = (newClients: Client[], salesUsers: User[]) => {
  if (salesUsers.length === 0) return newClients;
  return newClients.map((client, index) => ({
    ...client,
    assignedSalesId: salesUsers[index % salesUsers.length].id
  }));
};

// Round-Robin Logic for Agents per Sector
export const getNextAgentForSector = (sector: ServiceSector, clients: Client[], agents: User[]): string | undefined => {
  const sectorAgents = agents.filter(a => a.role === Role.AGENT && a.sector === sector);
  if (sectorAgents.length === 0) return undefined;
  
  const lastAssignedIndex = clients.filter(c => c.sector === sector && c.assignedAgentId).length;
  return sectorAgents[lastAssignedIndex % sectorAgents.length].id;
};
