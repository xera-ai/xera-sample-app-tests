Feature: XFB-6: US-101 — Register an Account
  As a Guest
  I want to create a new account with a name, email, and password
  So that I can log in and use the system

  Background:
    Given I am on the registration page

  Scenario: Registration form displays Name, Email, and Password fields
    Then I should see a "Name" input field
    And I should see an "Email" input field
    And I should see a "Password" input field
    And I should see a "Create account" button

  Scenario: Successful registration logs the user in and redirects to Dashboard
    When I enter "Alice Example" into the "Name" field
    And I enter "alice.new@example.com" into the "Email" field
    And I enter "Secret123!" into the "Password" field
    And I click the "Create account" button
    Then I should be redirected to the Dashboard page
    And I should be authenticated

  Scenario: Duplicate email shows a clear error
    Given a user with email "alice@example.com" is already registered
    When I enter "Alice Example" into the "Name" field
    And I enter "alice@example.com" into the "Email" field
    And I enter "Secret123!" into the "Password" field
    And I click the "Create account" button
    Then I should see the error "Email is already taken"
    And the response status should be 409
    And I should remain on the registration page

  Scenario: Password shorter than 8 characters shows an error
    When I enter "Alice Example" into the "Name" field
    And I enter "alice.short@example.com" into the "Email" field
    And I enter "Short1!" into the "Password" field
    And I click the "Create account" button
    Then I should see an error indicating the password must be at least 8 characters
    And the response status should be 400
    And I should remain on the registration page

  Scenario: Invalid email format shows an error
    When I enter "Alice Example" into the "Name" field
    And I enter "not-an-email" into the "Email" field
    And I enter "Secret123!" into the "Password" field
    And I click the "Create account" button
    Then I should see an error indicating the email is invalid
    And I should remain on the registration page

  Scenario: Desktop layout shows the 2-panel design
    Given my viewport is 1280 by 800 pixels
    Then I should see the dark branding panel on the left
    And I should see the registration form panel on the right

  Scenario: Mobile layout collapses the branding panel
    Given my viewport is 375 by 812 pixels
    Then the branding panel should be hidden
    And the registration form should occupy the full width
