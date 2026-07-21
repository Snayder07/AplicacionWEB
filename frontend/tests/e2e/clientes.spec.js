import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

const NOMBRE_TEST = `TEST_Cliente_${Date.now()}`;
const ID_TEST = Math.floor(Math.random() * 1000000).toString();

test.describe('Clientes', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.click('[data-testid="link-clientes"]');
    await page.waitForSelector('[data-testid="clientes-title"]');
  });

  test('tabla de clientes carga', async ({ page }) => {
    await expect(page.locator('[data-testid="tabla-clientes"]')).toBeVisible();
  });

  test('crear un cliente y verifica que aparece en la tabla', async ({ page }) => {
    await page.fill('[data-testid="input-nombre-discord"]', NOMBRE_TEST);
    await page.fill('[data-testid="input-id-discord"]', ID_TEST);
    await page.click('[data-testid="btn-agregar-cliente"]');

    await page.waitForTimeout(1000);
    const body = page.locator('[data-testid="tabla-clientes"] tbody');
    await expect(body).toContainText(NOMBRE_TEST);
    await expect(body).toContainText(ID_TEST);
  });

  test('bloquea formulario vacio y muestra error', async ({ page }) => {
    await page.click('[data-testid="btn-agregar-cliente"]');
    await expect(page.locator('[data-testid="clientes-error"]')).toBeVisible();
  });

  test('buscador filtra por ID de Discord', async ({ page }) => {
    await page.fill('[data-testid="input-nombre-discord"]', NOMBRE_TEST);
    await page.fill('[data-testid="input-id-discord"]', ID_TEST);
    await page.click('[data-testid="btn-agregar-cliente"]');
    await page.waitForTimeout(1000);

    await page.fill('[data-testid="input-filtro-clientes"]', ID_TEST);
    await page.waitForTimeout(1000);

    const body = page.locator('[data-testid="tabla-clientes"] tbody');
    const filas = await body.locator('tr').count();
    expect(filas).toBeGreaterThanOrEqual(1);
  });
});
