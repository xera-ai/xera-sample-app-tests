import { test, expect, request as playwrightRequest } from '@playwright/test';
import { DashboardPage } from './page-objects/DashboardPage';

const API_BASE = process.env.XERA_HTTP_BASE_URL ?? 'http://localhost:3000/api/v1';
const REGULAR_EMAIL = process.env.TEST_REGULAR_EMAIL ?? 'alice@example.com';
const REGULAR_PWD = process.env.TEST_REGULAR_PWD ?? 'Secret123!';
const STORAGE_STATE = '.xera/.auth/.cache/regular.json';

/**
 * Log in via the API and count every task in every project the user belongs to.
 * Uses full URLs (not baseURL + leading-slash) to dodge Playwright's URL
 * resolution dropping the /api/v1 prefix — see AGENTS.md.
 */
async function countTasksForCurrentUser(): Promise<number> {
  const ctx = await playwrightRequest.newContext();
  try {
    const loginRes = await ctx.post(`${API_BASE}/auth/login`, {
      data: { email: REGULAR_EMAIL, password: REGULAR_PWD },
    });
    expect(loginRes.status()).toBe(200);
    const { access_token: token } = await loginRes.json();
    expect(token).toBeTruthy();

    const auth = { Authorization: `Bearer ${token}` };
    const projectsRes = await ctx.get(`${API_BASE}/projects/`, { headers: auth });
    expect(projectsRes.status()).toBe(200);
    const projectsBody = await projectsRes.json();
    const projects: Array<{ id: string }> = Array.isArray(projectsBody)
      ? projectsBody
      : (projectsBody.items ?? projectsBody.data ?? []);

    let total = 0;
    for (const project of projects) {
      const tasksRes = await ctx.get(`${API_BASE}/projects/${project.id}/tasks`, {
        headers: auth,
      });
      expect(tasksRes.status()).toBe(200);
      const body = await tasksRes.json();
      const list: unknown[] = Array.isArray(body) ? body : (body.items ?? body.data ?? []);
      total += list.length;
    }
    return total;
  } finally {
    await ctx.dispose();
  }
}

test.describe('XFB-26: US-502 — Overview Dashboard', () => {
  test.use({ storageState: STORAGE_STATE });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeVisible();
  });

  test('Overview shows three statistics: Total Tasks, In Progress, and Completed', async ({
    page,
  }) => {
    const dashboard = new DashboardPage(page);
    // Scope to paragraph roles so we don't collide with the status pills inside
    // the Recent Tasks table (which also render the words "In Progress" / "Completed").
    const paragraphs = dashboard.main.getByRole('paragraph');
    await expect(paragraphs.filter({ hasText: /^Total Tasks$/ })).toBeVisible();
    await expect(paragraphs.filter({ hasText: /^In Progress$/ })).toBeVisible();
    await expect(paragraphs.filter({ hasText: /^Completed$/ })).toBeVisible();
  });

  test('Each statistic displays a numeric value', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const total = await dashboard.readStat('Total Tasks');
    const inProgress = await dashboard.readStat('In Progress');
    const completed = await dashboard.readStat('Completed');
    expect(Number.isFinite(total), `Total Tasks → ${total}`).toBe(true);
    expect(total).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(inProgress), `In Progress → ${inProgress}`).toBe(true);
    expect(inProgress).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(completed), `Completed → ${completed}`).toBe(true);
    expect(completed).toBeGreaterThanOrEqual(0);
  });

  test('Recent tasks list shows at most 5 items', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await expect(dashboard.recentTasksHeading).toBeVisible();
    await expect(dashboard.recentTasksTable).toBeVisible();
    const count = await dashboard.recentTaskRows.count();
    expect(count).toBeLessThanOrEqual(5);
  });

  test('Each recent task row shows Status, Priority, and creation date', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await expect(dashboard.recentTasksTable).toBeVisible();
    const count = await dashboard.recentTaskRows.count();
    test.skip(count === 0, 'No recent tasks seeded — row-shape assertion not applicable');

    for (let i = 0; i < count; i++) {
      const row = dashboard.recentTaskRows.nth(i);
      const text = (await row.innerText()).toLowerCase();
      const hasStatus =
        /\b(todo|to[\s-]?do|in[\s-]?progress|in[\s-]?review|done|completed|blocked|backlog)\b/.test(
          text,
        );
      const hasPriority = /\b(low|medium|high|urgent|p[0-4])\b/.test(text);
      const hasDate =
        /\d{4}-\d{2}-\d{2}/.test(text) ||
        /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/.test(text) ||
        /\b\d+\s*(min|h|hr|hour|d|day|w|wk|week|mo|month|y|yr)s?\s*ago\b/.test(text);
      expect(hasStatus, `row ${i} status — '${text}'`).toBe(true);
      expect(hasPriority, `row ${i} priority — '${text}'`).toBe(true);
      expect(hasDate, `row ${i} date — '${text}'`).toBe(true);
    }
  });

  test('Clicking a recent task opens its detail page', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await expect(dashboard.recentTasksTable).toBeVisible();
    const count = await dashboard.recentTaskRows.count();
    test.skip(count === 0, 'No recent tasks seeded — click-through not applicable');

    const before = new URL(page.url()).pathname;
    // Click the title link inside the first row.
    await dashboard.recentTaskRows
      .first()
      .getByRole('link')
      .first()
      .click();
    await page.waitForURL((url) => /\/tasks?\/[\w-]+/.test(url.pathname), { timeout: 5_000 });
    expect(new URL(page.url()).pathname).not.toBe(before);
    expect(new URL(page.url()).pathname).toMatch(/\/tasks?\/[\w-]+/);
  });

  test('"View all" link navigates to the full tasks list', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await expect(dashboard.viewAllLink).toBeVisible();
    await dashboard.viewAllLink.click();
    // Expect the all-tasks page (/tasks). Accept /tasks or /tasks/anything as a
    // valid "tasks list view"; reject if the link goes to a project-scoped page
    // like /projects/<id>, which would mean "View all" doesn't actually show all
    // tasks for the user.
    await page.waitForLoadState('domcontentloaded');
    const pathname = new URL(page.url()).pathname;
    expect(pathname, 'View all should lead to a global tasks list').toMatch(/^\/tasks(\b|\/)/);
  });

  // AC-4: Figures only count tasks in projects the user belongs to.
  // Verify by comparing the UI's Total Tasks figure with the count returned by
  // the user-scoped tasks API (which is the source of truth for project membership).
  test('Statistics count only tasks from projects the user belongs to', async ({ page }) => {
    const apiCount = await countTasksForCurrentUser();
    const dashboard = new DashboardPage(page);
    const uiTotal = await dashboard.readStat('Total Tasks');
    expect(Number.isFinite(uiTotal), `Total Tasks → ${uiTotal}`).toBe(true);
    expect(uiTotal, `API counted ${apiCount} tasks across user's projects`).toBe(apiCount);
  });
});
