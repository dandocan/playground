import { vi } from 'vitest';

const { listen } = vi.hoisted(() => ({ listen: vi.fn() }));

vi.mock('@nestjs/core', () => ({
  NestFactory: { create: vi.fn(async () => ({ listen })) },
}));

describe('API bootstrap', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it.each([
    [undefined, undefined, 3001],
    [undefined, '4001', '4001'],
    ['5001', '4001', '5001'],
  ])('uses PORT=%s and API_PORT=%s to listen on %s', async (port, apiPort, expected) => {
    vi.stubEnv('PORT', port);
    vi.stubEnv('API_PORT', apiPort);
    vi.resetModules();

    await import('./main.js');

    await vi.waitFor(() => expect(listen).toHaveBeenCalledExactlyOnceWith(expected));
  });
});
