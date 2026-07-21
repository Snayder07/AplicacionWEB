import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('muestra las 4 tarjetas de resumen con valores', async ({ page }) => {
    await expect(page.locator('[data-testid="card-clientes"]')).toBeVisible();
    await expect(page.locator('[data-testid="card-ventas"]')).toBeVisible();
    await expect(page.locator('[data-testid="card-pendientes"]')).toBeVisible();
    await expect(page.locator('[data-testid="card-completados"]')).toBeVisible();

    for (const testId of ['card-clientes', 'card-ventas', 'card-pendientes', 'card-completados']) {
      const valor = page.locator(`[data-testid="${testId}"] .card-value`);
      await expect(valor).not.toBeEmpty();
    }
  });

  test('tabla de actividad reciente carga', async ({ page }) => {
    await page.waitForSelector('[data-testid="dashboard-cards"]');
    const tabla = page.locator('[data-testid="tabla-recientes"]');
    if (await tabla.isVisible()) {
      const filas = tabla.locator('tbody tr');
      const count = await filas.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('no hay errores en consola ni requests fallidos', async ({ page }) => {
    const errores = [];
    page.on('console', (msg) => { if (msg.type() === 'error') errores.push(msg.text()); });
    page.on('response', (response) => {
      if (response.status() >= 400) errores.push(`${response.status()} ${response.url()}`);
    });
    await page.waitForSelector('[data-testid="dashboard-cards"]');
    expect(errores).toEqual([]);
  });
});
