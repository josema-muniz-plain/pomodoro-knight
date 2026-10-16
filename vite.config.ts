import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  // El sitio se publica en https://<usuario>.github.io/pomodoro-knight/
  base: '/pomodoro-knight/',
  test: {
    globals: true,
    environment: 'node',
  },
});
