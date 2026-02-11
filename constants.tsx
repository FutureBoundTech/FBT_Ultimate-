
import React from 'react';
import { ShieldCheck, FileText, PieChart, Users, TrendingUp, CheckCircle, Award, Scale, Briefcase } from 'lucide-react';

export const BRAND_NAME = 'Future Bound Tech';

export const SERVICES = [
  {
    id: 'IT_RETURN',
    title: 'Income Tax Filing',
    description: 'End-to-end IT return preparation and e-filing. Our professional CAs ensure maximum deductions and 100% compliance with current tax laws.',
    longDescription: 'Our IT specialists help salaried individuals, freelancers, and businesses navigate complex tax codes. We handle Form 16, capital gains, and international income reporting.',
    icon: <FileText className="w-8 h-8 text-blue-600" />,
    features: ['Max Tax Savings', 'CA Certified Review', 'Audit Protection']
  },
  {
    id: 'GST',
    title: 'GST Compliance',
    description: 'Comprehensive GST solutions including registration, monthly/quarterly filings, and reconciliation to keep your business running smoothly.',
    longDescription: 'Complete GST management for SMEs and large enterprises. We handle GSTR-1, 3B, and 9 filings, ensuring your input tax credit is maximized and errors are minimized.',
    icon: <PieChart className="w-8 h-8 text-indigo-600" />,
    features: ['Error-free Filings', 'ITC Optimization', 'Compliance Alerts']
  },
  {
    id: 'LIC_POLICY',
    title: 'LIC & Insurance',
    description: 'Expert guidance on Life Insurance Corporation (LIC) policies and general insurance to secure your family\'s future and build long-term wealth.',
    longDescription: 'Strategic financial planning through diverse insurance products. We assist with policy selection, premium management, and smooth claim settlements.',
    icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
    features: ['Wealth Planning', 'Claim Assistance', 'Portfolio Review']
  }
];

export const TEAM_QUALITIES = [
  { title: 'Chartered Accountants', icon: <Scale className="w-6 h-6 text-blue-500" />, desc: 'Certified CA professionals for tax audits and complex computations.' },
  { title: 'Tax Consultants', icon: <Briefcase className="w-6 h-6 text-indigo-500" />, desc: 'Dedicated advisors to guide you through every financial step.' },
  { title: 'Compliance Experts', icon: <Award className="w-6 h-6 text-emerald-500" />, desc: 'Ensuring your filings always meet the latest legal standards.' }
];

export const APP_FEATURES = [
  { title: 'Automated Routing', icon: <TrendingUp /> },
  { title: 'Secure Document Vault', icon: <ShieldCheck /> },
  { title: 'Real-time Progress', icon: <CheckCircle /> }
];
