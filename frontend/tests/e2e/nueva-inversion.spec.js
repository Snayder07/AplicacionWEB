import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

const NOMBRE_CLIENTE = `TEST_Cliente_${Date.now()}`;
const ID_DISCORD = Math.floor(Math.random() * 1000000).toString();

test.describe('Nueva Inversion', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    // Crear cliente
    await page.click('[data-testid="link-clientes"]');
    await page.waitForSelector('[data-testid="clientes-title"]');
    await page.fill('[data-testid="input-nombre-discord"]', NOMBRE_CLIENTE);
    await page.fill('[data-testid="input-id-discord"]', ID_DISCORD);
    await page.click('[data-testid="btn-agregar-cliente"]');
    await page.waitForTimeout(1000);

    await page.click('[data-testid="link-nueva-inversion"]');
    await page.waitForSelector('[data-testid="nueva-inversion-title"]');
  });

  test('registrar inversion y muestra confirmacion', async ({ page }) => {
    await page.fill('[data-testid="input-inversion-cliente"]', NOMBRE_CLIENTE);
    await page.fill('[data-testid="input-inversion-monto"]', '500');
    await page.fill('[data-testid="input-inversion-porcentaje"]', '10');
    await page.fill('[data-testid="input-inversion-fecha"]', '2026-07-20');

    await page.click('[data-testid="btn-registrar-inversion"]');
    await page.waitForTimeout(1500);

    const mensaje = page.locator('[data-testid="inversion-exito"]');
    await expect(mensaje).toBeVisible();
    await expect(mensaje).toContainText(NOMBRE_CLIENTE);
  });

  test('bloquea sin datos obligatorios', async ({ page }) => {
    await page.click('[data-testid="btn-registrar-inversion"]');
    await expect(page.locator('[data-testid="nueva-inversion-error"]')).toBeVisible();
  });
});
