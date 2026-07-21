import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

const NOMBRE_CLIENTE = `TEST_Cliente_${Date.now()}`;
const ID_DISCORD = Math.floor(Math.random() * 1000000).toString();

test.describe('Pedido Robux', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.click('[data-testid="link-clientes"]');
    await page.waitForSelector('[data-testid="clientes-title"]');
    await page.fill('[data-testid="input-nombre-discord"]', NOMBRE_CLIENTE);
    await page.fill('[data-testid="input-id-discord"]', ID_DISCORD);
    await page.click('[data-testid="btn-agregar-cliente"]');
    await page.waitForTimeout(1000);

    await page.click('[data-testid="link-robux"]');
    await page.waitForSelector('[data-testid="robux-title"]');
  });

  test('selector de moneda carga opciones', async ({ page }) => {
    const select = page.locator('[data-testid="select-robux-moneda"]');
    const opciones = await select.locator('option').count();
    expect(opciones).toBeGreaterThan(1);
  });

  test('registrar pedido y verifica en lista', async ({ page }) => {
    await page.fill('[data-testid="input-robux-cliente"]', NOMBRE_CLIENTE);
    await page.fill('[data-testid="input-robux-usuario"]', 'test_player');
    await page.fill('[data-testid="input-robux-cantidad"]', '1000');
    await page.fill('[data-testid="input-robux-precio"]', '12.50');
    await page.selectOption('[data-testid="select-robux-metodo"]', 'Gamepass');

    await page.click('[data-testid="btn-registrar-robux"]');
    await page.waitForTimeout(1500);

    const tabla = page.locator('[data-testid="tabla-robux"] tbody');
    await expect(tabla).toContainText(NOMBRE_CLIENTE);
  });

  test('bloquea envio sin datos obligatorios', async ({ page }) => {
    await page.click('[data-testid="btn-registrar-robux"]');
    await expect(page.locator('[data-testid="robux-error"]')).toBeVisible();
  });
});
