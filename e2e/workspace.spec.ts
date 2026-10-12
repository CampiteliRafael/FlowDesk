import { expect, test } from "@playwright/test";

test("enters the demo and creates a ticket", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("E-mail").fill("demo@flowdesk.local");
  await page.getByLabel("Senha", { exact: true }).fill("demonstracao");
  await page.getByRole("button", { name: "Acessar demonstração" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await page.getByRole("link", { name: "Nova solicitação" }).click();
  await page.getByLabel("Título").fill("Ajustar integração de dados");
  await page
    .getByLabel("Descrição")
    .fill("A integração precisa de uma revisão nas credenciais.");
  await page.getByLabel("Categoria").selectOption("Integrações");
  await page.getByRole("button", { name: "Criar solicitação" }).click();

  await expect(page).toHaveURL(/\/tickets\/FD-\d+/);
  await expect(
    page.getByRole("heading", { name: "Ajustar integração de dados" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Sair da conta" }).click();
  await expect(page).toHaveURL("/");
  await expect(
    page.getByRole("heading", { name: "Entre na sua conta" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Acessar demonstração" }),
  ).toBeEnabled();
});

test("recovers from a simulated API failure without clearing the form", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("E-mail").fill("demo@flowdesk.local");
  await page.getByLabel("Senha", { exact: true }).fill("demonstracao");
  await page.getByRole("button", { name: "Acessar demonstração" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.getByRole("link", { name: "Nova solicitação" }).click();

  await page.getByLabel("Título").fill("Revisar permissão de acesso");
  await page
    .getByLabel("Descrição")
    .fill("A equipe precisa revisar a permissão desta solicitação.");
  await page.getByLabel("Categoria").selectOption("Acesso");
  await page
    .getByRole("button", { name: "Ativar simulação de falha da API" })
    .click();
  await page.getByRole("button", { name: "Criar solicitação" }).click();

  await expect(
    page.locator('p[role="alert"]').filter({
      hasText: "Não foi possível concluir a solicitação",
    }),
  ).toContainText("Desative a simulação");
  await expect(page.getByLabel("Título")).toHaveValue(
    "Revisar permissão de acesso",
  );
  await page
    .getByRole("button", { name: "Desativar simulação de falha da API" })
    .click();
  await page.getByRole("button", { name: "Criar solicitação" }).click();

  await expect(page).toHaveURL(/\/tickets\/FD-\d+/);
  await expect(
    page.getByRole("heading", { name: "Revisar permissão de acesso" }),
  ).toBeVisible();
});
