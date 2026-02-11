
import React from 'react';
import { Client, LeadStatus, ServiceSector } from '../types';
import { Badge } from './ui/Badge';

interface LeadTableProps {
  clients: Client[];
  actions?: (client: Client) => React.ReactNode;
}

export const LeadTable: React.FC<LeadTableProps> = ({ clients, actions }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-bottom border-slate-200">
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Client</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Contact</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Sector</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Progress</th>
            {actions && <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium text-slate-900">{client.name}</div>
                <div className="text-xs text-slate-500">Source: {client.source}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-slate-700">{client.email}</div>
                <div className="text-xs text-slate-500">{client.phone}</div>
              </td>
              <td className="px-6 py-4">
                <Badge variant={client.sector === ServiceSector.NONE ? 'outline' : 'info'}>
                  {client.sector.replace('_', ' ')}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <Badge variant={client.status === LeadStatus.COMPLETED ? 'success' : 'warning'}>
                  {client.status}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <div className="w-full bg-slate-200 rounded-full h-1.5 max-w-[100px]">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${client.progress}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500">{client.progress}%</span>
              </td>
              {actions && (
                <td className="px-6 py-4 text-right">
                  {actions(client)}
                </td>
              )}
            </tr>
          ))}
          {clients.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                No clients found in this category.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
