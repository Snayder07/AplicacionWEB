import { test as setup } from '@playwright/test';

const AUTH_FILE = 'playwright/.auth/user.json';

setup('autenticar con credenciales de prueba', async ({ page }) => {
  const usuario = process.env.TEST_USER || 'admin';
  const contrasena = process.env.TEST_PASS || 'admin';

  await page.goto('/login');
  await page.fill('[data-testid="input-usuario"]', usuario);
  await page.fill('[data-testid="input-contrasena"]', contrasena);
  await page.click('[data-testid="btn-ingresar"]');
  await page.waitForURL('/');
  await page.context().storageState({ path: AUTH_FILE });
});
