Feature: XFB-7: US-102 — Log In
  As a Guest
  I want to log in with my email and password
  So that I can access my account

  Background:
    Given I am on the login page

  Scenario: Login form displays Email and Password fields
    Then I should see an "Email" input field
    And I should see a "Password" input field
    And I should see a "Sign in" button

  Scenario: Successful login redirects to Dashboard
    Given a user with email "alice@example.com" and password "Secret123!" is registered
    When I enter "alice@example.com" into the "Email" field
    And I enter "Secret123!" into the "Password" field
    And I click the "Sign in" button
    Then I should be redirected to the Dashboard page

  Scenario: Invalid credentials display an error message
    When I enter "alice@example.com" into the "Email" field
    And I enter "WrongPassword!" into the "Password" field
    And I click the "Sign in" button
    Then I should see the error "Invalid credentials"
    And I should remain on the login page

  Scenario: Session is persisted after a page reload
    Given a user with email "alice@example.com" and password "Secret123!" is registered
    And I have logged in as "alice@example.com" with password "Secret123!"
    When I reload the page
    Then I should still be authenticated
    And I should be on the Dashboard page

  # Note: Token-refresh after 15 minutes of inactivity is exercised by advancing the
  # virtual clock or by directly invoking the refresh endpoint; the test relies on
  # time-mocking rather than waiting 15 real minutes.
  Scenario: Access token is automatically refreshed after 15 minutes of inactivity
    Given I have logged in as "alice@example.com" with password "Secret123!"
    When 15 minutes of inactivity have passed
    And I perform an authenticated action
    Then the access token should have been refreshed
    And I should remain on the Dashboard page

  Scenario: Rate limit blocks after 20 failed login attempts in one minute
    When I submit invalid credentials 20 times within one minute
    And I submit invalid credentials one more time
    Then I should see a rate-limit error
    And the response status should be 429

  Scenario: Desktop layout shows the 2-panel design
    Given my viewport is 1280 by 800 pixels
    Then I should see the dark branding panel on the left
    And I should see the login form panel on the right

  Scenario: Mobile layout collapses the branding panel
    Given my viewport is 375 by 812 pixels
    Then the branding panel should be hidden
    And the login form should occupy the full width
