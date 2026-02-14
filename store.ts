
import { Client, User, Role, LeadStatus, ServiceSector, CallStatus } from './types';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// API helper
async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}

// Default users for fallback
const defaultUsers: User[] = [
  { id: 'admin-1', name: 'FBT Master Admin', email: 'admin@futurebound.tech', password: 'admin123', role: Role.ADMIN },
  { id: 'sales-1', name: 'Sales Agent Alpha', email: 'sales1@fbt.com', password: 'sales123', role: Role.SALES },
  { id: 'agent-1', name: 'Sarah (CA - IT Expert)', email: 'sarah@fbt.com', password: 'agent123', role: Role.AGENT, sector: ServiceSector.IT_RETURN },
];

const defaultClients: Client[] = [
  {
    id: 'c-1',
    name: 'Alice Johnson',
    email: 'alice@client.com',
    phone: '9876543210',
    password: 'password123',
    address: '123 Main St, City',
    profession: 'Salaried',
    annualIncome: 1000000,
    source: 'Website Registration',
    status: LeadStatus.QUALIFIED,
    callStatus: CallStatus.INTERESTED,
    sector: ServiceSector.IT_RETURN,
    assignedAgentId: 'agent-1',
    notes: ['Direct registration for IT Return'],
    messages: [],
    documents: [],
    lastUpdated: new Date().toISOString(),
    progress: 25
  }
];

// Export for use in components
export const getStoredClients = async (): Promise<Client[]> => {
  try {
    return await fetchAPI('/clients');
  } catch {
    return defaultClients;
  }
};

export const setStoredClients = async (client: Client): Promise<Client> => {
  return await fetchAPI('/clients', {
    method: 'POST',
    body: JSON.stringify(client),
  });
};

// Update existing client
export const updateClient = async (id: string, clientData: Partial<Client>): Promise<Client> => {
  return await fetchAPI(`/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(clientData),
  });
};

// Add private note to client
export const addPrivateNote = async (clientId: string, note: string, addedBy: string, addedByName: string): Promise<Client> => {
  return await fetchAPI(`/clients/${clientId}/private-notes`, {
    method: 'POST',
    body: JSON.stringify({ note, addedBy, addedByName }),
  });
};

export const getStoredUsers = async (): Promise<User[]> => {
  try {
    return await fetchAPI('/users');
  } catch {
    return defaultUsers;
  }
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  return await fetchAPI('/users', {
    method: 'POST',
    body: JSON.stringify(user),
  });
};

export const loginUser = async (email: string, password: string): Promise<{ user: User; type: string } | null> => {
  try {
    const response = await fetchAPI('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response;
  } catch {
    return null;
  }
};

export const seedDatabase = async (): Promise<void> => {
  try {
    await fetchAPI('/seed', { method: 'POST' });
  } catch (err) {
    console.error('Seed error:', err);
  }
};

// Keep these for backward compatibility
export const getNextAgentForSector = async (sector: ServiceSector): Promise<string | undefined> => {
  const users = await getStoredUsers();
  const clients = await getStoredClients();
  const sectorAgents = users.filter(u => u.role === Role.AGENT && u.sector === sector);
  
  if (sectorAgents.length === 0) return undefined;

  const previousAssignments = clients.filter(c => c.sector === sector && c.assignedAgentId).length;
  const nextIndex = previousAssignments % sectorAgents.length;
  
  return sectorAgents[nextIndex].id;
};

export const getLeadsForSalesPerson = async (salesUserId: string): Promise<Client[]> => {
  const users = await getStoredUsers();
  const clients = await getStoredClients();
  const salesUsers = users.filter(u => u.role === Role.SALES);
  const salesIndex = salesUsers.findIndex(u => u.id === salesUserId);
  
  if (salesIndex === -1) return [];

  const unassignedLeads = clients.filter(c => c.status === LeadStatus.NEW || !c.assignedAgentId);
  const chunkSize = 20;
  
  if (unassignedLeads.length >= salesUsers.length * chunkSize) {
    const start = salesIndex * chunkSize;
    return unassignedLeads.slice(start, start + chunkSize);
  }
  
  return unassignedLeads.filter((_, idx) => idx % salesUsers.length === salesIndex);
};
