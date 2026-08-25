import { test, expect } from '@playwright/test'

test.describe('EduMatrix ERP Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login with demo teacher credentials
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('professor@edumatrix.com')
    await page.getByLabel(/senha/i).fill('professor123')
    await page.getByRole('button', { name: /entrar/i }).click()
    await expect(page).toHaveURL(/.*dashboard/)
  })

  test('dashboard displays stats and quick actions', async ({ page }) => {
    await expect(page.getByText('Turmas')).toBeVisible()
    await expect(page.getByText('Alunos')).toBeVisible()
    await expect(page.getByText('Continuar de onde parei')).toBeVisible()
    await expect(page.getByRole('link', { name: /Nova Aula/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Resolver Questão/i })).toBeVisible()
  })

  test('universal solver calculates step by step', async ({ page }) => {
    await page.goto('/exercises/solver')
    await expect(page.getByText(/Resolvedor Universal/i)).toBeVisible()
    await page.getByRole('button', { name: /Resolver Passo a Passo/i }).click()
    await expect(page.getByText(/Passo 1/i)).toBeVisible()
  })

  test('repository allows folder navigation and file listing', async ({ page }) => {
    await page.goto('/repository')
    await expect(page.getByText('Meu Repositório')).toBeVisible()
    await expect(page.getByRole('button', { name: /Nova Pasta/i })).toBeVisible()
  })

  test('planning page displays 8-block lesson creator', async ({ page }) => {
    await page.goto('/planning')
    await expect(page.getByText(/Planejamento/i)).toBeVisible()
    await expect(page.getByText(/Criador de Aula/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /Salvar Plano/i })).toBeVisible()
  })

  test('question bank filters and displays questions', async ({ page }) => {
    await page.goto('/question-bank')
    await expect(page.getByText('Banco de Questões')).toBeVisible()
    await expect(page.getByPlaceholder(/Buscar por palavras-chave/i)).toBeVisible()
  })
})
