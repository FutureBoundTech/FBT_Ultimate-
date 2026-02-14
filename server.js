import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://basha:king@basha.vrlvzbl.mongodb.net/FBT-finance';

// CORS configuration for production
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB:', MONGODB_URI))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Schemas
const clientSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  address: String,
  profession: String,
  annualIncome: Number,
  source: String,
  status: String,
  callStatus: String,
  sector: String,
  assignedAgentId: String,
  assignedSalesId: String,
  notes: [String],
  privateNotes: [{ 
    note: String, 
    addedBy: String, 
    addedByName: String,
    addedAt: { type: Date, default: Date.now },
    isPrivate: { type: Boolean, default: true }
  }],
  messages: { type: [mongoose.Schema.Types.Mixed], default: [] },
  documents: { type: [mongoose.Schema.Types.Mixed], default: [] },
  itData: { type: mongoose.Schema.Types.Mixed, default: {} },
  gstData: { type: mongoose.Schema.Types.Mixed, default: {} },
  licData: { type: mongoose.Schema.Types.Mixed, default: {} },
  lastUpdated: String,
  progress: Number
}, { strict: false });

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  sector: String,
  phone: String
});

const leadSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  sector: String,
  status: String,
  assignedAgentId: String,
  source: String,
  createdAt: { type: Date, default: Date.now }
});

// Models
const Client = mongoose.model('Client', clientSchema);
const User = mongoose.model('User', userSchema);
const Lead = mongoose.model('Lead', leadSchema);

// API Routes

// Clients
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients.map(c => transformClient(c)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.json(transformClient(client));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update client by ID
app.put('/api/clients/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: new Date().toISOString() },
      { new: true, runValidators: false }
    );
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(transformClient(client));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add private note to client
app.post('/api/clients/:id/private-notes', async (req, res) => {
  try {
    const { note, addedBy, addedByName } = req.body;
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { 
          privateNotes: { 
            note, 
            addedBy, 
            addedByName,
            addedAt: new Date(),
            isPrivate: true 
          } 
        },
        lastUpdated: new Date().toISOString()
      },
      { new: true }
    );
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(transformClient(client));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete all clients
app.delete('/api/clients', async (req, res) => {
  try {
    const result = await Client.deleteMany({});
    res.json({ message: `Deleted ${result.deletedCount} clients` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete single client by ID
app.delete('/api/clients/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/clients/:email', async (req, res) => {
  try {
    const client = await Client.findOne({ email: req.params.email });
    res.json(transformClient(client));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Users (Staff)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users.map(u => transformUser(u)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(transformUser(user));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    res.json(transformUser(user));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper function to transform MongoDB document to frontend format
const transformUser = (doc) => {
  if (!doc) return null;
  const obj = doc.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
};

const transformClient = (doc) => {
  if (!doc) return null;
  const obj = doc.toObject();
  obj.id = obj._id.toString();
  obj.role = 'CLIENT'; // Add role for client
  delete obj._id;
  delete obj.__v;
  return obj;
};

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Ensure default users exist
    await User.findOneAndUpdate(
      { email: 'admin@futurebound.tech' },
      { name: 'Admin', email: 'admin@futurebound.tech', password: 'admin123', role: 'ADMIN' },
      { upsert: true, new: true }
    );
    await User.findOneAndUpdate(
      { email: 'sarah@fbt.com' },
      { name: 'Sarah CA', email: 'sarah@fbt.com', password: 'agent123', role: 'AGENT', sector: 'IT_RETURN' },
      { upsert: true, new: true }
    );
    await User.findOneAndUpdate(
      { email: 'sales1@fbt.com' },
      { name: 'Sales Manager', email: 'sales1@fbt.com', password: 'sales123', role: 'SALES' },
      { upsert: true, new: true }
    );
    
    // Check users (staff)
    let user = await User.findOne({ email, password });
    if (user) {
      return res.json({ user: transformUser(user), type: 'staff' });
    }
    
    // Check clients
    const client = await Client.findOne({ email, password });
    if (client) {
      return res.json({ user: transformClient(client), type: 'client' });
    }
    
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leads
const transformLead = (doc) => {
  if (!doc) return null;
  const obj = doc.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
};

app.get('/api/leads', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads.map(l => transformLead(l)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.json(transformLead(lead));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed default data
app.post('/api/seed', async (req, res) => {
  try {
    // Create default admin
    await User.findOneAndUpdate(
      { email: 'admin@futurebound.tech' },
      { name: 'Admin', email: 'admin@futurebound.tech', password: 'admin123', role: 'ADMIN' },
      { upsert: true, new: true }
    );
    
    // Create default sales
    await User.findOneAndUpdate(
      { email: 'sales1@fbt.com' },
      { name: 'Sales Manager', email: 'sales1@fbt.com', password: 'sales123', role: 'SALES', sector: 'SALES' },
      { upsert: true, new: true }
    );
    
    // Create default agent
    await User.findOneAndUpdate(
      { email: 'sarah@fbt.com' },
      { name: 'Sarah CA', email: 'sarah@fbt.com', password: 'agent123', role: 'AGENT', sector: 'IT_RETURN' },
      { upsert: true, new: true }
    );
    
    res.json({ message: 'Default users created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
