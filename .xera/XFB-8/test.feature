Feature: XFB-8: US-103 — Log Out
  As a Member
  I want to log out of the system
  So that my account is protected on shared machines

  Background:
    Given I am logged in as "alice@example.com" with password "Secret123!"

  Scenario: Sign-out button is visible in the navigation bar on the Dashboard
    When I am on the Dashboard page
    Then I should see a "Sign out" button in the navigation bar

  Scenario: Sign-out button is visible on a non-Dashboard authenticated page
    When I navigate to my profile page
    Then I should see a "Sign out" button in the navigation bar

  Scenario: Clicking Sign out redirects to the login page
    Given I am on the Dashboard page
    When I click the "Sign out" button
    Then I should be redirected to the login page

  # Note: AC "Refresh token is immediately invalidated" is asserted by calling
  # POST /auth/refresh with the captured refresh_token after logout and
  # expecting a 4xx response. The Gherkin keeps the step user-facing.
  Scenario: Refresh token is invalidated immediately after logout
    Given I have captured my refresh token
    When I click the "Sign out" button
    And I attempt to refresh the access token using the captured refresh token
    Then the refresh attempt should be rejected

  # Note: AC "Old access tokens cannot be reused after logout" is asserted by
  # calling an authenticated endpoint with the pre-logout access token and
  # expecting 401.
  Scenario: Old access token cannot be reused after logout
    Given I have captured my access token
    When I click the "Sign out" button
    And I call an authenticated endpoint with the captured access token
    Then the response status should be 401
