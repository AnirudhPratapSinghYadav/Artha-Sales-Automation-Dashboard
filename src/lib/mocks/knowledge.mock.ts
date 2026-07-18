import * as Types from '../types';

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60000).toISOString();

export const mockKnowledgeDocs: Types.KnowledgeDoc[] = [
  { id: 'K001', title: 'Artha Platform Overview', filename: 'artha-platform-overview.pdf', category: 'Product Doc', industry_tag: 'General', date_added: daysAgo(60), uploaded_by: 'Anirudh Yadav', file_size: 2457600, status: 'ready' },
  { id: 'K002', title: 'Master Data Management Guide', filename: 'mdm-guide-v2.pdf', category: 'Product Doc', industry_tag: 'General', date_added: daysAgo(45), uploaded_by: 'Anirudh Yadav', file_size: 1843200, status: 'ready' },
  { id: 'K003', title: 'Banking Case Study — DBS', filename: 'case-study-dbs.pdf', category: 'Case Study', industry_tag: 'Banking', date_added: daysAgo(30), uploaded_by: 'Sales Team', file_size: 921600, status: 'ready' },
  { id: 'K004', title: 'Data Insights Platform (DIP) Spec', filename: 'dip-product-spec.pdf', category: 'Product Doc', industry_tag: 'General', date_added: daysAgo(25), uploaded_by: 'Anirudh Yadav', file_size: 3276800, status: 'ready' },
  { id: 'K005', title: 'Competitor Analysis — Informatica vs Artha', filename: 'competitor-informatica.pdf', category: 'Competitor Intel', industry_tag: 'General', date_added: daysAgo(20), uploaded_by: 'Sales Team', file_size: 614400, status: 'ready' },
  { id: 'K006', title: 'BETL Product Sheet', filename: 'betl-product-sheet.pdf', category: 'Product Doc', industry_tag: 'General', date_added: daysAgo(15), uploaded_by: 'Anirudh Yadav', file_size: 1228800, status: 'ready' },
  { id: 'K007', title: 'Oil & Gas Case Study — ADNOC', filename: 'case-study-adnoc.pdf', category: 'Case Study', industry_tag: 'Oil & Gas', date_added: daysAgo(10), uploaded_by: 'Sales Team', file_size: 1024000, status: 'ready' },
  { id: 'K008', title: 'Sales Objection Handling Playbook', filename: 'objection-handling.pdf', category: 'Sales Tactic', industry_tag: 'General', date_added: daysAgo(5), uploaded_by: 'Sales Team', file_size: 512000, status: 'ready' },
];

// ---------------------------------------------------------------------------
// UNANSWERED QUESTIONS (Knowledge Gap Detector)
// ---------------------------------------------------------------------------

export const mockUnansweredQuestions: Types.UnansweredQuestion[] = [
  { id: 'UQ001', question: 'What are your pricing tiers for enterprise customers?', lead_name: 'Sarah Tan', lead_id: 'L002', asked_at: daysAgo(3), similarity_score: 0.23, times_asked: 5 },
  { id: 'UQ002', question: 'Do you support on-premise deployment in air-gapped environments?', lead_name: 'Mohammed Al Rashid', lead_id: 'L020', asked_at: daysAgo(2), similarity_score: 0.31, times_asked: 3 },
  { id: 'UQ003', question: 'What SLA do you offer for 99.99% uptime?', lead_name: 'Wei Chen', lead_id: 'L007', asked_at: daysAgo(1), similarity_score: 0.18, times_asked: 4 },
  { id: 'UQ004', question: 'How does your platform handle GDPR and PDPA compliance simultaneously?', lead_name: 'Tan Boon Keat', lead_id: 'L021', asked_at: hoursAgo(12), similarity_score: 0.29, times_asked: 2 },
  { id: 'UQ005', question: 'Can you integrate with SAP S/4HANA?', lead_name: 'Deepak Mehta', lead_id: 'L015', asked_at: hoursAgo(6), similarity_score: 0.15, times_asked: 3 },
];

// ---------------------------------------------------------------------------
// USERS
// ---------------------------------------------------------------------------

