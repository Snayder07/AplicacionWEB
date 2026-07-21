export async function login(page) {
  const usuario = process.env.TEST_USER || 'admin';
  const contrasena = process.env.TEST_PASS || 'admin';
  await page.goto('/login');
  await page.fill('[data-testid="input-usuario"]', usuario);
  await page.fill('[data-testid="input-contrasena"]', contrasena);
  await page.click('[data-testid="btn-ingresar"]');
  await page.waitForURL('/');
}

export async function navegarA(page, testId) {
  await page.click(`[data-testid="${testId}"]`);
}

export async function verificarSinErroresConsola(page) {
  const errores = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errores.push(msg.text());
  });
  page.on('response', (response) => {
    if (response.status() >= 400) {
      errores.push(`${response.status()} ${response.url()}`);
    }
  });
  return errores;
}
