import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const certifyDocument = async (file, organization) => {
    const formData = new FormData();
    formData.append('documentPath', file.path);
    formData.append('org', organization);

    try {
        const response = await axios.post(`${API_URL}/certify`, {
            documentPath: file.path,
            org: organization
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Erreur de certification');
    }
};

export const verifyDocument = async (file, organization) => {
    try {
        const response = await axios.post(`${API_URL}/verify`, {
            documentPath: file.path,
            org: organization
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Erreur de vérification');
    }
};
