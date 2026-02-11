
import { Client, User, Role, LeadStatus, ServiceSector, CallStatus } from './types';

const CLIENTS_KEY = 'fbt_v4_clients';
const USERS_KEY = 'fbt_v4_users';

export const initialUsers: User[] = [
  { id: 'admin-1', name: 'FBT Master Admin', email: 'admin@futurebound.tech', role: Role.ADMIN },
  { id: 'sales-1', name: 'Sales Agent Alpha', email: 'sales1@fbt.com', role: Role.SALES },
  { id: 'sales-2', name: 'Sales Agent Beta', email: 'sales2@fbt.com', role: Role.SALES },
  { id: 'agent-1', name: 'Sarah (CA - IT Expert)', email: 'sarah@fbt.com', role: Role.AGENT, sector: ServiceSector.IT_RETURN },
  { id: 'agent-2', name: 'Mike (GST Specialist)', email: 'mike@fbt.com', role: Role.AGENT, sector: ServiceSector.GST },
];

export const initialClients: Client[] = [
  {
    id: 'c-1',
    name: 'Alice Johnson',
    email: 'alice@client.com',
    phone: '9876543210',
    password: 'password123',
    source: 'Website Registration',
    status: LeadStatus.QUALIFIED,
    callStatus: CallStatus.INTERESTED,
    sector: ServiceSector.IT_RETURN,
    assignedAgentId: 'agent-1',
    notes: ['Direct registration for IT Return'],
    messages: [],
    documents: [],
    itData: { incomeSalary: 850000, incomeHouse: 0, incomeOther: 12000, deduction80C: 150000, deduction80D: 25000, taxPaid: 45000 },
    lastUpdated: new Date().toISOString(),
    progress: 25
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

/**
 * CIRCULAR ASSIGNMENT LOGIC
 * Assigns a lead to the next agent in sequence for that sector
 */
export const getNextAgentForSector = (sector: ServiceSector): string | undefined => {
  const users = getStoredUsers();
  const clients = getStoredClients();
  const sectorAgents = users.filter(u => u.role === Role.AGENT && u.sector === sector);
  
  if (sectorAgents.length === 0) return undefined;

  // Find how many clients have been assigned to this sector to determine the next index
  const previousAssignments = clients.filter(c => c.sector === sector && c.assignedAgentId).length;
  const nextIndex = previousAssignments % sectorAgents.length;
  
  return sectorAgents[nextIndex].id;
};

/**
 * SALES CHUNKING LOGIC
 * Filters leads for sales persons based on unique 20-unit chunks
 */
export const getLeadsForSalesPerson = (salesUserId: string, allClients: Client[]): Client[] => {
  const users = getStoredUsers();
  const salesUsers = users.filter(u => u.role === Role.SALES);
  const salesIndex = salesUsers.findIndex(u => u.id === salesUserId);
  
  if (salesIndex === -1) return [];

  const unassignedLeads = allClients.filter(c => c.status === LeadStatus.NEW || !c.assignedAgentId);
  const chunkSize = 20;
  
  // If there are enough leads to support chunking
  if (unassignedLeads.length >= salesUsers.length * chunkSize) {
    const start = salesIndex * chunkSize;
    return unassignedLeads.slice(start, start + chunkSize);
  }
  
  // Random/Fair Distribution if pool is small
  return unassignedLeads.filter((_, idx) => idx % salesUsers.length === salesIndex);
};
