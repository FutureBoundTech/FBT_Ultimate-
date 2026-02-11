
export enum Role {
  ADMIN = 'ADMIN',
  SALES = 'SALES',
  AGENT = 'AGENT',
  CLIENT = 'CLIENT'
}

export enum ServiceSector {
  NONE = 'NONE',
  IT_RETURN = 'IT_RETURN',
  GST = 'GST',
  LIC_POLICY = 'LIC_POLICY'
}

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  LOST = 'LOST'
}

export enum CallStatus {
  PENDING = 'PENDING',
  NOT_CONNECTED = 'NOT_CONNECTED',
  UNANSWERED = 'UNANSWERED',
  REQUEST_CALLBACK = 'REQUEST_CALLBACK',
  NOT_INTERESTED = 'NOT_INTERESTED',
  INTERESTED = 'INTERESTED'
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  uploadedAt: string;
  url?: string;
}

export interface ITData {
  incomeSalary: number;
  incomeHouse: number;
  incomeOther: number;
  deduction80C: number;
  deduction80D: number;
  taxPaid: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  source: string;
  status: LeadStatus;
  callStatus: CallStatus;
  sector: ServiceSector;
  assignedAgentId?: string;
  assignedSalesId?: string;
  notes: string[];
  messages: Message[];
  documents: Document[];
  itData?: ITData;
  lastUpdated: string;
  progress: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  sector?: ServiceSector;
}

export interface AuthState {
  user: User | (User & { clientId?: string }) | null;
  isAuthenticated: boolean;
}
