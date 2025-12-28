import api from './api';

// Dashboard Stats
export const getDashboardStats = async () => {
    const response = await api.get(`/verification/getDashboardStats`);
    return response.data;
};

// Verification Requests
export const getAgencyVerifications = async () => {
    const response = await api.get(`/verification/getAgencyVerifications`);
    return response.data;
};

export const getGuideVerifications = async () => {
    const response = await api.get(`/verification/getGuideVerifications`);
    return response.data;
};

export const approveVerification = async (acc_type: string, id: string) => {
    const response = await api.post(`/verification/approveVerification`, {
        acc_type,
        id
    });
    return response.data;
};

// Reports
export const getPostReports = async () => {
    const response = await api.get(`/report/getPostReports`);
    return response.data;
};

export const getAccReports = async () => {
    const response = await api.get(`/report/getAccReports`);
    return response.data;
};

export const getPostReportDetails = async (report_id: number) => {
    const response = await api.get(`/report/getPostReportDetails/${report_id}`);
    return response.data;
};

export const getAccReportDetails = async (report_id: number) => {
    const response = await api.get(`/report/getAccReportDetails/${report_id}`);
    return response.data;
};

export const deletePost = async (report_id: number) => {
    const response = await api.post(`/report/deletePost`, { report_id });
    return response.data;
};
