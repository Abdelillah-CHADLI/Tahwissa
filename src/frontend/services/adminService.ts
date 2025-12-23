import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Dashboard Stats
export const getDashboardStats = async () => {
    const response = await axios.get(`${API_BASE_URL}/verification/getDashboardStats`);
    return response.data;
};

// Verification Requests
export const getAgencyVerifications = async () => {
    const response = await axios.get(`${API_BASE_URL}/verification/getAgencyVerifications`);
    return response.data;
};

export const getGuideVerifications = async () => {
    const response = await axios.get(`${API_BASE_URL}/verification/getGuideVerifications`);
    return response.data;
};

export const approveVerification = async (acc_type: string, id: string) => {
    const response = await axios.post(`${API_BASE_URL}/verification/approveVerification`, {
        acc_type,
        id
    });
    return response.data;
};

// Reports
export const getPostReports = async () => {
    const response = await axios.get(`${API_BASE_URL}/report/getPostReports`);
    return response.data;
};

export const getAccReports = async () => {
    const response = await axios.get(`${API_BASE_URL}/report/getAccReports`);
    return response.data;
};

export const getPostReportDetails = async (report_id: number) => {
    const response = await axios.get(`${API_BASE_URL}/report/getPostReportDetails/${report_id}`);
    return response.data;
};

export const getAccReportDetails = async (report_id: number) => {
    const response = await axios.get(`${API_BASE_URL}/report/getAccReportDetails/${report_id}`);
    return response.data;
};

export const deletePost = async (report_id: number) => {
    const response = await axios.post(`${API_BASE_URL}/report/deletePost`, { report_id });
    return response.data;
};
