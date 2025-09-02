import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HttpClient } from './http-client.js';
import { mockFetchResponse, mockFetchError } from '../test/setup.js';

describe('HttpClient', () => {
  let httpClient;

  beforeEach(() => {
    httpClient = new HttpClient('http://localhost:3000');
  });

  afterEach(() => {
    fetch.mockClear();
  });

  describe('constructor', () => {
    it('should create instance with baseURL', () => {
      expect(httpClient.baseURL).toBe('http://localhost:3000');
    });

    it('should create instance without baseURL', () => {
      const client = new HttpClient();
      expect(client.baseURL).toBe('');
    });
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockData = { users: [{ id: 1, name: 'Test User' }] };
      mockFetchResponse(mockData);

      const result = await httpClient.get('/api/users');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/users',
        expect.objectContaining({
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should handle GET request error', async () => {
      mockFetchError('Failed to fetch users', 500);

      await expect(httpClient.get('/api/users')).rejects.toThrow('Failed to fetch users');
    });
  });

  describe('POST requests', () => {
    it('should make successful POST request', async () => {
      const postData = { username: 'testuser', email: 'test@example.com' };
      const mockResponse = { message: 'User created', id: 1 };
      mockFetchResponse(mockResponse);

      const result = await httpClient.post('/api/users', postData);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/users',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData)
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle POST request error', async () => {
      const postData = { username: 'testuser' };
      mockFetchError('Missing required fields', 400);

      await expect(httpClient.post('/api/users', postData)).rejects.toThrow('Missing required fields');
    });
  });

  describe('PUT requests', () => {
    it('should make successful PUT request', async () => {
      const putData = { username: 'updateduser', email: 'updated@example.com' };
      const mockResponse = { message: 'User updated' };
      mockFetchResponse(mockResponse);

      const result = await httpClient.put('/api/users/1', putData);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/users/1',
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(putData)
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('DELETE requests', () => {
    it('should make successful DELETE request', async () => {
      const mockResponse = { message: 'User deleted' };
      mockFetchResponse(mockResponse);

      const result = await httpClient.delete('/api/users/1');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/users/1',
        expect.objectContaining({
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('PATCH requests', () => {
    it('should make successful PATCH request', async () => {
      const patchData = { password: 'newpassword' };
      const mockResponse = { message: 'Password updated' };
      mockFetchResponse(mockResponse);

      const result = await httpClient.patch('/api/users/1/password', patchData);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/users/1/password',
        expect.objectContaining({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patchData)
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('custom headers', () => {
    it('should include custom headers', async () => {
      const customHeaders = { 'Authorization': 'Bearer token123' };
      mockFetchResponse({ success: true });

      await httpClient.get('/api/users', { headers: customHeaders });

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/users',
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer token123'
          }
        })
      );
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      fetch.mockRejectedValue(new Error('Network error'));

      await expect(httpClient.get('/api/users')).rejects.toThrow('Network error');
    });

    it('should handle non-JSON responses', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => { throw new Error('Invalid JSON'); },
        text: async () => 'Internal Server Error'
      });

      await expect(httpClient.get('/api/users')).rejects.toThrow('HTTP error! status: 500');
    });
  });
});
