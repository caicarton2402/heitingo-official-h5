/**
 * HEITINGO API Module (V1.0)
 * Handles all frontend-to-backend communication.
 */

const API_BASE_URL = 'http://localhost:3000/api'; // Change to production URL later

const HeitingoAPI = {
    // --- Authentication ---
    async login(username, password) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (data.token) {
            localStorage.setItem('heitingo_token', data.token);
            localStorage.setItem('heitingo_user', JSON.stringify(data.user));
        }
        return data;
    },

    async register(userData) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await response.json();
    },

    logout() {
        localStorage.removeItem('heitingo_token');
        localStorage.removeItem('heitingo_user');
    },

    getAuthHeader() {
        const token = localStorage.getItem('heitingo_token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    },

    // --- Short Video ---
    async getFeed() {
        const response = await fetch(`${API_BASE_URL}/video/feed`);
        return await response.json();
    },

    async likeVideo(videoId) {
        const response = await fetch(`${API_BASE_URL}/video/${videoId}/like`, {
            method: 'POST',
            headers: { ...this.getAuthHeader() }
        });
        return await response.json();
    },

    // --- Talent (玩) ---
    async getTalentList() {
        const response = await fetch(`${API_BASE_URL}/talent/list`);
        return await response.json();
    },

    async getTalentJumpLink(talentId, level) {
        const response = await fetch(`${API_BASE_URL}/talent/${talentId}/link?userLevel=${level}`);
        return await response.json();
    },

    // --- Mall & Orders ---
    async getProducts() {
        const response = await fetch(`${API_BASE_URL}/mall/products`);
        return await response.json();
    },

    async createOrder(productId) {
        const user = JSON.parse(localStorage.getItem('heitingo_user'));
        if (!user) throw new Error('User not logged in');

        const response = await fetch(`${API_BASE_URL}/mall/order`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                ...this.getAuthHeader() 
            },
            body: JSON.stringify({ userId: user.id, productId })
        });
        return await response.json();
    }
};

window.HeitingoAPI = HeitingoAPI;
