import type { Report } from '../components/admin/reports/ReportsTable';
import type { VerificationRequest } from '../components/admin/verification/VerificationTable';

export type RawVerification = {
  verification_id: number; agency_id?: string; guide_id?: string; verification_document?: string;
  created_at: string; status: VerificationRequest['status'];
  agency?: { agency_name: string; support_email: string; phone_number: string; agency_description: string };
  guide?: { guide_name: string; support_email: string; phone_number: string; guide_description: string };
};
export type VerificationDetail = VerificationRequest & { actualId: string; phone: string; description: string; verificationDocument?: string };
export function mapVerification(row: RawVerification, type: 'Agency' | 'Guide'): VerificationDetail {
  return { id: row.verification_id, agencyId: row.agency_id, guideId: row.guide_id, actualId: String(row.agency_id || row.guide_id), type,
    name: row.agency?.agency_name || row.guide?.guide_name || 'Unnamed provider', email: row.agency?.support_email || row.guide?.support_email || 'Not provided',
    phone: row.agency?.phone_number || row.guide?.phone_number || 'Not provided', description: row.agency?.agency_description || row.guide?.guide_description || '',
    registrationDate: new Date(row.created_at).toLocaleDateString(), status: row.status.toLowerCase() as VerificationRequest['status'], verificationDocument: row.verification_document };
}
export type RawReport = { report_id: number; post_id?: number; reporter_name?: string; reported_name?: string; post_owner_name?: string; post_title?: string; post_text?: string; location?: string; reason: string; report_message?: string; date: string; status: string; reported_agency?: string; reported_guide?: string; reported_traveller?: string };
export function mapReport(row: RawReport, type: 'post' | 'account'): Report {
  return { id: `${type}-${row.report_id}`, reportId: row.report_id, reportType: type, reporterName: row.reporter_name || 'Unknown', reportedName: row.post_owner_name || row.reported_name || 'Unavailable',
    message: row.report_message || '', postTitle: row.post_title || 'Unavailable post', text: row.post_text || '', reason: row.reason, location: row.location || 'Community', date: new Date(row.date).toLocaleDateString(), status: ['open', 'pending'].includes(row.status.toLowerCase()) ? 'open' : 'resolved' };
}
