import { httpClient } from './http-client.js';

class UserApi {
	async getAll() {
		const response = await httpClient.get('/api/users');
		return response.users;
	}

	async getById(id) {
		return await httpClient.get(`/api/users/${id}`);
	}

	async create(userData) {
		return await httpClient.post('/api/users', userData);
	}

	async update(id, userData) {
		return await httpClient.put(`/api/users/${id}`, userData);
	}

	async delete(id) {
		return await httpClient.delete(`/api/users/${id}`);
	}

	async updatePassword(id, passwordData) {
		return await httpClient.patch(`/api/users/${id}/password`, passwordData);
	}
}

export const userApi = new UserApi();
export default userApi;
