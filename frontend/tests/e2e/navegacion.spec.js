import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('Navegacion', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  const rutas = [
    { testId: 'link-dashboard', titulo: 'Dashboard', url: '/' },
    { testId: 'link-clientes', titulo: 'Clientes', url: '/clientes' },
    { testId: 'link-streaming', titulo: 'Nuevo pedido de Streaming', url: '/streaming' },
    { testId: 'link-robux', titulo: 'Nuevo pedido de Robux', url: '/robux' },
    { testId: 'link-nueva-inversion', titulo: 'Nueva inversión', url: '/nueva-inversion' },
    { testId: 'link-ver-inversiones', titulo: 'Ver inversiones', url: '/ver-inversiones' },
    { testId: 'link-cuentas-streaming', titulo: 'Cuentas Streaming', url: '/cuentas-streaming' },
    { testId: 'link-historial', titulo: 'Historial de pedidos', url: '/historial' },
  ];

  for (const ruta of rutas) {
    test(`navegar a ${ruta.titulo} desde el sidebar`, async ({ page }) => {
      const errores = [];
      page.on('console', (msg) => { if (msg.type() === 'error') errores.push(msg.text()); });
      page.on('response', (response) => {
        if (response.status() >= 400) errores.push(`${response.status()} ${response.url()}`);
      });

      await page.click(`[data-testid="${ruta.testId}"]`);
      await page.waitForURL(`**${ruta.url}`);
      await page.waitForTimeout(1000);

      await expect(page).toHaveURL(ruta.url);
      await expect(page.locator(`[data-testid="${ruta.testId.replace('link-', '')}-title"]`)).toBeVisible();
      expect(errores).toEqual([]);
    });
  }

  test('cerrar sesion redirige a login', async ({ page }) => {
    await page.click('[data-testid="btn-cerrar-sesion"]');
    await page.waitForURL('/login');
    await expect(page.locator('[data-testid="login-page"]')).toBeVisible();
  });

  test('despues de cerrar sesion no se puede acceder al dashboard', async ({ page }) => {
    await page.click('[data-testid="btn-cerrar-sesion"]');
    await page.waitForURL('/login');
    await page.goto('/clientes');
    await expect(page).toHaveURL('/login');
  });
});
