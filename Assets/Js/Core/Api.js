import CONFIG from './config.js';

export const apiClient = {
    async get(endpoint) {
        const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error('Məlumat alınmadı');
        return await response.json();
    },

    async post(endpoint, data) {
        const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    }
};