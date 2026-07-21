import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('muestra error con credenciales incorrectas y no navega', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('[data-testid="login-page"]')).toBeVisible();

    await page.fill('[data-testid="input-usuario"]', 'usuario_falso');
    await page.fill('[data-testid="input-contrasena"]', 'clave_falsa');
    await page.click('[data-testid="btn-ingresar"]');

    await expect(page.locator('[data-testid="login-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-error"]')).not.toBeEmpty();
    await expect(page).toHaveURL('/login');
  });

  test('login exitoso redirige al dashboard', async ({ page }) => {
    const usuario = process.env.TEST_USER || 'admin';
    const contrasena = process.env.TEST_PASS || 'admin';

    await page.goto('/login');
    await page.fill('[data-testid="input-usuario"]', usuario);
    await page.fill('[data-testid="input-contrasena"]', contrasena);
    await page.click('[data-testid="btn-ingresar"]');

    await page.waitForURL('/');
    await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible();
  });

  test('ruta protegida redirige a login sin sesion', async ({ page }) => {
    await page.goto('/clientes');
    await expect(page).toHaveURL('/login');
  });
});
