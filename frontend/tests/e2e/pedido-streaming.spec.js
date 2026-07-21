import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

const NOMBRE_CLIENTE = `TEST_Cliente_${Date.now()}`;
const ID_DISCORD = Math.floor(Math.random() * 1000000).toString();

test.describe('Pedido Streaming', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    // Crear cliente de prueba primero
    await page.click('[data-testid="link-clientes"]');
    await page.waitForSelector('[data-testid="clientes-title"]');
    await page.fill('[data-testid="input-nombre-discord"]', NOMBRE_CLIENTE);
    await page.fill('[data-testid="input-id-discord"]', ID_DISCORD);
    await page.click('[data-testid="btn-agregar-cliente"]');
    await page.waitForTimeout(1000);

    await page.click('[data-testid="link-streaming"]');
    await page.waitForSelector('[data-testid="streaming-title"]');
  });

  test('selector de moneda carga opciones', async ({ page }) => {
    const select = page.locator('[data-testid="select-streaming-moneda"]');
    const opciones = await select.locator('option').count();
    expect(opciones).toBeGreaterThan(1);
  });

  test('registrar pedido y verifica en lista', async ({ page }) => {
    await page.fill('[data-testid="input-streaming-cliente"]', NOMBRE_CLIENTE);
    await page.selectOption('[data-testid="select-streaming-plataforma"]', 'Netflix');
    await page.fill('[data-testid="input-streaming-correo"]', 'test@correo.com');
    await page.fill('[data-testid="input-streaming-contrasena"]', 'pass123');
    await page.fill('[data-testid="input-streaming-vencimiento"]', '2026-12-31');
    await page.fill('[data-testid="input-streaming-precio"]', '15.00');

    await page.click('[data-testid="btn-registrar-streaming"]');
    await page.waitForTimeout(1500);

    const tabla = page.locator('[data-testid="tabla-streaming"] tbody');
    await expect(tabla).toContainText(NOMBRE_CLIENTE);
  });

  test('bloquea envio sin cliente ni correo', async ({ page }) => {
    await page.click('[data-testid="btn-registrar-streaming"]');
    await expect(page.locator('[data-testid="streaming-error"]')).toBeVisible();
  });
});
