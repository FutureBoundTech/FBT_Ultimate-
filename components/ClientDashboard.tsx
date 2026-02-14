
import React, { useState, useEffect } from 'react';
import { Client, Message, ServiceSector, Document, GSTData, LICData } from '../types';
import { getStoredClients, updateClient } from '../store';
import { CheckCircle2, MessageSquare, Clock, Send, ShieldCheck, FileText, Upload, AlertCircle, FileDigit, Building2, Car, IndianRupee, Calendar, User, FileCheck } from 'lucide-react';

interface ClientDashboardProps {
  clientId: string;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ clientId }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [msgText, setMsgText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showGSTForm, setShowGSTForm] = useState(false);
  const [showLICForm, setShowLICForm] = useState(false);
  const [gstForm, setGstForm] = useState<Partial<GSTData>>({});
  const [licForm, setLicForm] = useState<Partial<LICData>>({});

  useEffect(() => {
    loadClient();
  }, [clientId]);

  const loadClient = async () => {
    setLoading(true);
    const clients = await getStoredClients();
    const foundClient = clients.find(c => c.id === clientId) || null;
    setClient(foundClient);
    if (foundClient?.gstData) setGstForm(foundClient.gstData);
    if (foundClient?.licData) setLicForm(foundClient.licData);
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!msgText.trim() || !client) return;
    const newMessage: Message = { id: `msg-${Date.now()}`, senderId: client.id, text: msgText, timestamp: new Date().toISOString() };
    const updatedClient = { ...client, messages: [...client.messages, newMessage], lastUpdated: new Date().toISOString() };
    await updateClient(client.id, updatedClient);
    setClient(updatedClient);
    setMsgText('');
  };

  const handleFileUpload = async (docName: string) => {
    if (!client) return;
    const newDoc: Document = { id: `doc-${Date.now()}`, name: docName, type: 'PDF', status: 'PENDING', uploadedAt: new Date().toISOString() };
    const updatedClient = { ...client, documents: [...client.documents, newDoc], notes: [...client.notes, `Uploaded ${docName}`] };
    await updateClient(client.id, updatedClient);
    setClient(updatedClient);
  };

  const saveGSTData = async () => {
    if (!client) return;
    const updatedClient = { ...client, gstData: gstForm as GSTData, lastUpdated: new Date().toISOString() };
    await updateClient(client.id, updatedClient);
    setClient(updatedClient);
    setShowGSTForm(false);
  };

  const saveLICData = async () => {
    if (!client) return;
    const updatedClient = { ...client, licData: licForm as LICData, lastUpdated: new Date().toISOString() };
    await updateClient(client.id, updatedClient);
    setClient(updatedClient);
    setShowLICForm(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500">Loading your dashboard...</p>
      </div>
    );
  }

  if (!client) return <div className="text-center py-12">Client not found.</div>;

  const isIT = client.sector === ServiceSector.IT_RETURN;
  const isGST = client.sector === ServiceSector.GST;
  const isLIC = client.sector === ServiceSector.LIC_POLICY;

  // Document checklists for each sector
  const itDocuments = ['Form 16 / Salary Slips', 'Bank Statements', '80C Investment Proof', 'PAN & Aadhaar', 'Form 26AS', 'Tax Payment Challans'];
  const gstDocuments = ['GST Registration Certificate', 'Bank Statement', 'Purchase Bills', 'Sales Invoices', 'Expense Bills', 'GST-3B Returns'];
  const licDocuments = ['Policy Document', 'Premium Receipts', 'KYC Documents', 'Nominee Details', 'Bank Account Proof', 'Identity Proof'];

  const currentDocuments = isIT ? itDocuments : isGST ? gstDocuments : isLIC ? licDocuments : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] -mr-32 -mt-32" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/30 text-blue-200 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-blue-500/30"><ShieldCheck className="w-3 h-3"/> Future Bound Tech Security</div>
          <h1 className="text-4xl md:text-5xl font-black">Hello, {client.name}</h1>
          <p className="text-slate-400 mt-2 font-medium">Your <span className="text-white font-bold">{client.sector?.replace('_', ' ')}</span> filing is currently being processed by a certified CA expert.</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Filing Timeline */}
          <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3"><Clock className="w-6 h-6 text-blue-600"/> Filing Timeline</h2>
            <div className="space-y-6">
              <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden"><div className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-1000" style={{ width: `${client.progress}%` }}/></div>
              <div className="grid grid-cols-4 gap-2">
                {['ONBOARDING', 'DOCUMENTS', 'COMPUTATION', 'FILING'].map((s, i) => (
                  <div key={s} className={`text-[9px] font-black text-center tracking-widest ${client.progress >= (i+1)*25 ? 'text-blue-600' : 'text-slate-300'}`}>{s}</div>
                ))}
              </div>
            </div>
          </section>

          {/* GST Information Section */}
          {isGST && (
            <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3"><Building2 className="w-6 h-6 text-purple-600"/> GST Information</h2>
                <button 
                  onClick={() => setShowGSTForm(!showGSTForm)} 
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl text-sm font-bold hover:bg-purple-200 transition-all"
                >
                  {client.gstData ? 'Update' : 'Add Details'}
                </button>
              </div>
              
              {showGSTForm ? (
                <div className="space-y-4 bg-slate-50 p-6 rounded-2xl">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">GSTIN *</label>
                      <input 
                        type="text" 
                        value={gstForm.gstin || ''} 
                        onChange={e => setGstForm({...gstForm, gstin: e.target.value})}
                        placeholder="22AAAAA0000A1Z5"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Business Name *</label>
                      <input 
                        type="text" 
                        value={gstForm.businessName || ''} 
                        onChange={e => setGstForm({...gstForm, businessName: e.target.value})}
                        placeholder="Your Business Name"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Business Type</label>
                      <select 
                        value={gstForm.businessType || ''} 
                        onChange={e => setGstForm({...gstForm, businessType: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400"
                      >
                        <option value="">Select Type</option>
                        <option value="PROPRIETORSHIP">Proprietorship</option>
                        <option value="PARTNERSHIP">Partnership</option>
                        <option value="PVT_LTD">Private Limited</option>
                        <option value="LLP">LLP</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Annual Turnover (Rs.)</label>
                      <input 
                        type="number" 
                        value={gstForm.turnover || ''} 
                        onChange={e => setGstForm({...gstForm, turnover: Number(e.target.value)})}
                        placeholder="1000000"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Registration Type</label>
                      <select 
                        value={gstForm.registrationType || ''} 
                        onChange={e => setGstForm({...gstForm, registrationType: e.target.value as GSTData['registrationType']})}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400"
                      >
                        <option value="">Select Type</option>
                        <option value="REGULAR">Regular</option>
                        <option value="COMPOSITION">Composition</option>
                        <option value="UNREGISTERED">Unregistered</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Filing Frequency</label>
                      <select 
                        value={gstForm.filingFrequency || ''} 
                        onChange={e => setGstForm({...gstForm, filingFrequency: e.target.value as GSTData['filingFrequency']})}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400"
                      >
                        <option value="">Select Frequency</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="QUARTERLY">Quarterly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">GST Portal Username</label>
                      <input 
                        type="text" 
                        value={gstForm.gstUsername || ''} 
                        onChange={e => setGstForm({...gstForm, gstUsername: e.target.value})}
                        placeholder="Username"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">GST Portal Password</label>
                      <input 
                        type="password" 
                        value={gstForm.gstPassword || ''} 
                        onChange={e => setGstForm({...gstForm, gstPassword: e.target.value})}
                        placeholder="Password"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <button onClick={saveGSTData} className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all">Save GST Details</button>
                    <button onClick={() => setShowGSTForm(false)} className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all">Cancel</button>
                  </div>
                </div>
              ) : client.gstData ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="text-xs font-bold text-purple-500 mb-1">GSTIN</div>
                    <div className="font-bold text-slate-900">{client.gstData.gstin}</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="text-xs font-bold text-purple-500 mb-1">Business Name</div>
                    <div className="font-bold text-slate-900">{client.gstData.businessName}</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="text-xs font-bold text-purple-500 mb-1">Business Type</div>
                    <div className="font-bold text-slate-900">{client.gstData.businessType || 'N/A'}</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="text-xs font-bold text-purple-500 mb-1">Registration Type</div>
                    <div className="font-bold text-slate-900">{client.gstData.registrationType}</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="text-xs font-bold text-purple-500 mb-1">Filing Frequency</div>
                    <div className="font-bold text-slate-900">{client.gstData.filingFrequency}</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="text-xs font-bold text-purple-500 mb-1">Annual Turnover</div>
                    <div className="font-bold text-slate-900">Rs. {client.gstData.turnover?.toLocaleString() || 'N/A'}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No GST details added yet. Click "Add Details" to provide your GST information.</p>
                </div>
              )}
            </section>
          )}

          {/* LIC Information Section */}
          {isLIC && (
            <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3"><FileCheck className="w-6 h-6 text-green-600"/> LIC Policy Details</h2>
                <button 
                  onClick={() => setShowLICForm(!showLICForm)} 
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-bold hover:bg-green-200 transition-all"
                >
                  {client.licData ? 'Update' : 'Add Policy'}
                </button>
              </div>
              
              {showLICForm ? (
                <div className="space-y-4 bg-slate-50 p-6 rounded-2xl">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Policy Number *</label>
                      <input 
                        type="text" 
                        value={licForm.policyNumber || ''} 
                        onChange={e => setLicForm({...licForm, policyNumber: e.target.value})}
                        placeholder="Policy Number"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Policy Name *</label>
                      <input 
                        type="text" 
                        value={licForm.policyName || ''} 
                        onChange={e => setLicForm({...licForm, policyName: e.target.value})}
                        placeholder="Policy Name"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Policy Type</label>
                      <select 
                        value={licForm.policyType || ''} 
                        onChange={e => setLicForm({...licForm, policyType: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
                      >
                        <option value="">Select Type</option>
                        <option value="TERM">Term Insurance</option>
                        <option value="ENDOWMENT">Endowment</option>
                        <option value="MONEY_BACK">Money Back</option>
                        <option value="ULIP">ULIP</option>
                        <option value="PENSION">Pension Plan</option>
                        <option value="HEALTH">Health Insurance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Sum Assured (Rs.)</label>
                      <input 
                        type="number" 
                        value={licForm.sumAssured || ''} 
                        onChange={e => setLicForm({...licForm, sumAssured: Number(e.target.value)})}
                        placeholder="1000000"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Annual Premium (Rs.)</label>
                      <input 
                        type="number" 
                        value={licForm.premium || ''} 
                        onChange={e => setLicForm({...licForm, premium: Number(e.target.value)})}
                        placeholder="50000"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Premium Due Date</label>
                      <input 
                        type="date" 
                        value={licForm.premiumDueDate || ''} 
                        onChange={e => setLicForm({...licForm, premiumDueDate: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Maturity Date</label>
                      <input 
                        type="date" 
                        value={licForm.maturityDate || ''} 
                        onChange={e => setLicForm({...licForm, maturityDate: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Nominee Name</label>
                      <input 
                        type="text" 
                        value={licForm.nominee || ''} 
                        onChange={e => setLicForm({...licForm, nominee: e.target.value})}
                        placeholder="Nominee Name"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <button onClick={saveLICData} className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all">Save Policy Details</button>
                    <button onClick={() => setShowLICForm(false)} className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all">Cancel</button>
                  </div>
                </div>
              ) : client.licData ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="text-xs font-bold text-green-500 mb-1">Policy Number</div>
                    <div className="font-bold text-slate-900">{client.licData.policyNumber}</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="text-xs font-bold text-green-500 mb-1">Policy Name</div>
                    <div className="font-bold text-slate-900">{client.licData.policyName}</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="text-xs font-bold text-green-500 mb-1">Policy Type</div>
                    <div className="font-bold text-slate-900">{client.licData.policyType || 'N/A'}</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="text-xs font-bold text-green-500 mb-1">Sum Assured</div>
                    <div className="font-bold text-slate-900">Rs. {client.licData.sumAssured?.toLocaleString() || 'N/A'}</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="text-xs font-bold text-green-500 mb-1">Annual Premium</div>
                    <div className="font-bold text-slate-900">Rs. {client.licData.premium?.toLocaleString() || 'N/A'}</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="text-xs font-bold text-green-500 mb-1">Nominee</div>
                    <div className="font-bold text-slate-900">{client.licData.nominee || 'N/A'}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <FileCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No LIC policy details added yet. Click "Add Policy" to provide your policy information.</p>
                </div>
              )}
            </section>
          )}

          {/* Document Checklist */}
          {currentDocuments.length > 0 && (
            <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <FileDigit className={`w-6 h-6 ${isIT ? 'text-indigo-600' : isGST ? 'text-purple-600' : 'text-green-600'}`}/> 
                {isIT ? 'IT Return' : isGST ? 'GST' : 'LIC'} Document Checklist
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {currentDocuments.map(docName => {
                  const uploaded = client.documents.some(d => d.name === docName);
                  return (
                    <div key={docName} className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${uploaded ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-dashed border-slate-200'}`}>
                      <div className="flex items-center gap-3">
                        {uploaded ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-slate-300" />}
                        <span className={`text-sm font-bold ${uploaded ? 'text-emerald-900' : 'text-slate-400'}`}>{docName}</span>
                      </div>
                      {!uploaded && <button onClick={() => handleFileUpload(docName)} className="p-2 bg-white text-blue-600 rounded-xl border border-blue-100 shadow-sm hover:bg-blue-50 transition-all"><Upload className="w-4 h-4"/></button>}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Chat Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col h-[650px] sticky top-24">
          <div className="bg-slate-900 p-8 text-white"><h3 className="font-black flex items-center gap-3 text-lg"><MessageSquare className="w-5 h-5 text-blue-400"/> Expert Support</h3></div>
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {client.messages.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No messages yet. Start a conversation with your CA expert.</p>
              </div>
            ) : (
              client.messages.map(m => (
                <div key={m.id} className={`max-w-[85%] p-4 rounded-2xl text-sm ${m.senderId === clientId ? 'bg-blue-600 text-white ml-auto' : 'bg-white text-slate-800 shadow-sm border border-slate-100'}`}>{m.text}</div>
              ))
            )}
          </div>
          <div className="p-6 border-t border-slate-100 bg-white flex gap-2">
            <input type="text" value={msgText} onChange={e => setMsgText(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Message your CA expert..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none"/>
            <button onClick={sendMessage} className="p-4 bg-blue-600 text-white rounded-xl active:scale-95 transition-all"><Send className="w-5 h-5"/></button>
          </div>
        </div>
      </div>
    </div>
  );
};
