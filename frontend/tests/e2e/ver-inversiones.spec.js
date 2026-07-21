import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

const NOMBRE_CLIENTE = `TEST_Cliente_${Date.now()}`;
const ID_DISCORD = Math.floor(Math.random() * 1000000).toString();

test.describe('Ver Inversiones', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    // Crear cliente
    await page.click('[data-testid="link-clientes"]');
    await page.waitForSelector('[data-testid="clientes-title"]');
    await page.fill('[data-testid="input-nombre-discord"]', NOMBRE_CLIENTE);
    await page.fill('[data-testid="input-id-discord"]', ID_DISCORD);
    await page.click('[data-testid="btn-agregar-cliente"]');
    await page.waitForTimeout(1000);

    // Crear inversion
    await page.click('[data-testid="link-nueva-inversion"]');
    await page.waitForSelector('[data-testid="nueva-inversion-title"]');
    await page.fill('[data-testid="input-inversion-cliente"]', NOMBRE_CLIENTE);
    await page.fill('[data-testid="input-inversion-monto"]', '300');
    await page.fill('[data-testid="input-inversion-porcentaje"]', '8');
    await page.fill('[data-testid="input-inversion-fecha"]', '2026-07-20');
    await page.click('[data-testid="btn-registrar-inversion"]');
    await page.waitForTimeout(1500);

    await page.click('[data-testid="link-ver-inversiones"]');
    await page.waitForSelector('[data-testid="ver-inversiones-title"]');
  });

  test('tabla de inversiones carga', async ({ page }) => {
    await expect(page.locator('[data-testid="tabla-inversiones"]')).toBeVisible();
  });

  test('buscador filtra por nombre de cliente', async ({ page }) => {
    const countSpan = page.locator('[data-testid="inversiones-count"]');
    const totalAntes = await countSpan.textContent();

    await page.fill('[data-testid="input-filtro-inversiones"]', NOMBRE_CLIENTE);
    await page.waitForTimeout(1000);

    const body = page.locator('[data-testid="tabla-inversiones"] tbody');
    await expect(body).toContainText(NOMBRE_CLIENTE);
  });

  test('abre modal de historial y lo cierra', async ({ page }) => {
    await page.waitForTimeout(1000);
    const fila = page.locator('[data-testid="tabla-inversiones"] tbody tr').first();
    await fila.click();

    await page.waitForSelector('[data-testid="modal-historial"]', { timeout: 5000 });
    await expect(page.locator('[data-testid="modal-historial"]')).toBeVisible();

    await page.click('[data-testid="btn-cerrar-historial"]');
    await expect(page.locator('[data-testid="modal-historial"]')).not.toBeVisible();
  });

  test('abre modal de agregar capital y lo cierra', async ({ page }) => {
    await page.waitForTimeout(1000);
    const btnCapital = page.locator('[data-testid^="btn-capital-"]').first();
    await btnCapital.click();

    await expect(page.locator('[data-testid="modal-capital"]')).toBeVisible();
    await page.click('[data-testid="btn-cerrar-modal-capital"]');
    await expect(page.locator('[data-testid="modal-capital"]')).not.toBeVisible();
  });
});
