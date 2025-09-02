class HttpClient {
	constructor(baseURL = '') {
		this.baseURL = baseURL;
	}

	async request(endpoint, options = {}) {
		const url = `${this.baseURL}${endpoint}`;
		const config = {
			headers: {
				'Content-Type': 'application/json',
				...options.headers,
			},
			...options,
		};

		try {
			const response = await fetch(url, config);
			
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
			}

			// レスポンスが空の場合はnullを返す
			if (response.status === 204 || response.headers.get('content-length') === '0') {
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error(`HTTP request failed: ${url}`, error);
			throw error;
		}
	}

	async get(endpoint, options = {}) {
		return this.request(endpoint, {
			method: 'GET',
			...options,
		});
	}

	async post(endpoint, data, options = {}) {
		return this.request(endpoint, {
			method: 'POST',
			body: JSON.stringify(data),
			...options,
		});
	}

	async put(endpoint, data, options = {}) {
		return this.request(endpoint, {
			method: 'PUT',
			body: JSON.stringify(data),
			...options,
		});
	}

	async delete(endpoint, options = {}) {
		return this.request(endpoint, {
			method: 'DELETE',
			...options,
		});
	}

	async patch(endpoint, data, options = {}) {
		return this.request(endpoint, {
			method: 'PATCH',
			body: JSON.stringify(data),
			...options,
		});
	}
}

// デフォルトのHTTPクライアントインスタンスを作成
const httpClient = new HttpClient(import.meta.env.VITE_API_URL || 'http://localhost:3000');

export { HttpClient, httpClient };
export default httpClient;
