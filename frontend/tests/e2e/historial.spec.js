import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('Historial', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.click('[data-testid="link-historial"]');
    await page.waitForSelector('[data-testid="historial-title"]');
  });

  test('tabla de historial carga', async ({ page }) => {
    await expect(page.locator('[data-testid="tabla-historial"]')).toBeVisible();
  });

  test('cambiar filtro a Robux muestra pedidos de Robux', async ({ page }) => {
    await page.selectOption('[data-testid="select-filtro-historial"]', 'Robux');
    await page.waitForTimeout(1000);

    const tabla = page.locator('[data-testid="tabla-historial"] tbody');
    const filas = await tabla.locator('tr').count();
    if (filas > 0) {
      const celdasTipo = tabla.locator('tr').first().locator('td:nth-child(2)');
      await expect(celdasTipo).toContainText('Robux');
    }
  });

  test('cambiar filtro a Streaming muestra pedidos de Streaming', async ({ page }) => {
    await page.selectOption('[data-testid="select-filtro-historial"]', 'Streaming');
    await page.waitForTimeout(1000);

    const tabla = page.locator('[data-testid="tabla-historial"] tbody');
    const filas = await tabla.locator('tr').count();
    if (filas > 0) {
      const celdasTipo = tabla.locator('tr').first().locator('td:nth-child(2)');
      await expect(celdasTipo).toContainText('Streaming');
    }
  });

  test('cambiar filtro a General muestra todos', async ({ page }) => {
    await page.selectOption('[data-testid="select-filtro-historial"]', 'General');
    await page.waitForTimeout(1000);
    await expect(page.locator('[data-testid="tabla-historial"]')).toBeVisible();
  });
});
