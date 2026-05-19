import type { Page, Locator } from '@playwright/test';

/**
 * Page Object for the Overview Dashboard (US-502).
 *
 * SUT shape (from a real run snapshot):
 *   <main>
 *     <h1>Dashboard</h1>
 *     <p>Total Tasks</p><p>50</p>
 *     <p>In Progress</p><p>16</p>
 *     <p>Completed</p><p>17</p>
 *     <h2>Recent Tasks</h2>
 *     <a href="...">View all →</a>
 *     <table>
 *       <thead><tr><th>Title</th><th>Status</th><th>Priority</th><th>Created</th></tr></thead>
 *       <tbody><tr>…5 rows…</tr></tbody>
 *     </table>
 *   </main>
 *
 * Selectors avoid the inner DOM details and anchor on accessible roles / visible text.
 */
export class DashboardPage {
  readonly page: Page;
  readonly main: Locator;
  readonly pageHeading: Locator;
  readonly recentTasksHeading: Locator;
  readonly recentTasksTable: Locator;
  readonly recentTaskRows: Locator;
  readonly viewAllLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.main = page.getByRole('main');
    this.pageHeading = page.getByRole('heading', { name: 'Dashboard', level: 1 });
    this.recentTasksHeading = page.getByRole('heading', { name: /recent tasks/i, level: 2 });
    this.recentTasksTable = this.main.getByRole('table');
    // Data rows live in the second rowgroup (tbody). The first rowgroup is the
    // header (thead). All accessible roles — no CSS traversal.
    this.recentTaskRows = this.recentTasksTable.getByRole('rowgroup').last().getByRole('row');
    this.viewAllLink = page.getByRole('link', { name: /view all/i });
  }

  async goto() {
    await this.page.goto('/');
  }

  /**
   * Parse the numeric value of a labelled statistic by reading the visible
   * text under <main> and matching "<label>\s+<digits>". Avoids brittle
   * sibling/parent-traversal selectors.
   */
  async readStat(label: string): Promise<number> {
    const text = await this.main.innerText();
    const re = new RegExp(`${label.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*(-?\\d+)`, 'i');
    const m = text.match(re);
    if (!m || m[1] === undefined) return Number.NaN;
    return Number.parseInt(m[1], 10);
  }
}
