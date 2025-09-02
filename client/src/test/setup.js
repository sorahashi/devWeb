import { vi } from 'vitest';

// 環境変数のモック
vi.mock('$env/dynamic/public', () => ({
  env: {
    VITE_API_URL: 'http://localhost:3000'
  }
}));

// fetchのモック
global.fetch = vi.fn();

// テスト用のユーティリティ関数
export const mockFetchResponse = (data, status = 200, ok = true) => {
  global.fetch.mockResolvedValue({
    ok,
    status,
    headers: {
      get: vi.fn((name) => {
        if (name === 'content-length') return null;
        return 'application/json';
      })
    },
    json: async () => data,
    text: async () => JSON.stringify(data)
  });
};

export const mockFetchError = (error, status = 500) => {
  global.fetch.mockResolvedValue({
    ok: false,
    status,
    headers: {
      get: vi.fn((name) => {
        if (name === 'content-length') return null;
        return 'application/json';
      })
    },
    json: async () => ({ error }),
    text: async () => JSON.stringify({ error })
  });
};

// テスト後のクリーンアップ
afterEach(() => {
  vi.clearAllMocks();
});
