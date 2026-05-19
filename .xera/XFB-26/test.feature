Feature: XFB-26: US-502 — Overview Dashboard
  As a Member
  I want to see a work overview immediately upon login
  So that I can quickly understand the status of my tasks

  Background:
    Given I am logged in as "alice@example.com" with password "Secret123!"
    And I am on the Dashboard page

  Scenario: Overview shows three statistics: Total Tasks, In Progress, and Completed
    Then I should see a statistic labelled "Total Tasks"
    And I should see a statistic labelled "In Progress"
    And I should see a statistic labelled "Completed"

  Scenario: Each statistic displays a numeric value
    Then the "Total Tasks" statistic should display a non-negative integer
    And the "In Progress" statistic should display a non-negative integer
    And the "Completed" statistic should display a non-negative integer

  Scenario: Recent tasks list shows at most 5 items
    Then I should see a "Recent tasks" section
    And the section should list at most 5 tasks

  Scenario: Each recent task row shows Status, Priority, and creation date
    Then every recent task row should display a Status
    And every recent task row should display a Priority
    And every recent task row should display a creation date

  Scenario: Clicking a recent task opens its detail page
    Given the recent tasks list is not empty
    When I click the first recent task
    Then I should be navigated to the task's detail page

  Scenario: "View all" link navigates to the full tasks list
    When I click the "View all" link
    Then I should be navigated to the all-tasks page

  # Note: AC "Figures only count tasks in projects the user belongs to" is asserted
  # by comparing the Total Tasks figure in the UI against the count returned by
  # GET /api/v1/tasks for the same authenticated user (which the backend already
  # scopes to projects the user belongs to).
  Scenario: Statistics count only tasks from projects the user belongs to
    Given I capture the count of tasks returned by the tasks API for the current user
    Then the "Total Tasks" statistic should equal the captured count
