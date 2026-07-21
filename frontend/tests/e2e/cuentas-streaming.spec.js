import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

const CORREO_TEST = `test_${Date.now()}@ejemplo.com`;

test.describe('Cuentas Streaming', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.click('[data-testid="link-cuentas-streaming"]');
    await page.waitForSelector('[data-testid="cuentas-streaming-title"]');
  });

  test('crear cuenta y aparece en inventario', async ({ page }) => {
    await page.fill('[data-testid="input-cuenta-plataforma"]', 'Netflix');
    await page.fill('[data-testid="input-cuenta-correo"]', CORREO_TEST);
    await page.fill('[data-testid="input-cuenta-contrasena"]', 'pass123');
    await page.fill('[data-testid="input-cuenta-precio"]', '5.00');

    await page.click('[data-testid="btn-guardar-cuenta"]');
    await page.waitForTimeout(1500);

    const tabla = page.locator('[data-testid="tabla-cuentas"] tbody');
    await expect(tabla).toContainText(CORREO_TEST);
  });

  test('eliminar cuenta recien creada', async ({ page }) => {
    await page.fill('[data-testid="input-cuenta-plataforma"]', 'Disney+');
    await page.fill('[data-testid="input-cuenta-correo"]', CORREO_TEST);
    await page.fill('[data-testid="input-cuenta-contrasena"]', 'pass456');
    await page.fill('[data-testid="input-cuenta-precio"]', '4.50');
    await page.click('[data-testid="btn-guardar-cuenta"]');
    await page.waitForTimeout(1500);

    page.on('dialog', (dialog) => dialog.accept());
    const btnEliminar = page.locator(`[data-testid="btn-eliminar-cuenta-"]`).last();
    await btnEliminar.click();
    await page.waitForTimeout(1000);

    const tabla = page.locator('[data-testid="tabla-cuentas"] tbody');
    await expect(tabla).not.toContainText(CORREO_TEST);
  });
});
