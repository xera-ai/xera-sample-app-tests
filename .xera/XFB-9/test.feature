Feature: XFB-9: US-104 — Manage API Keys
  As a Member
  I want to create and revoke API keys
  So that I can access the API from external tools (Postman, scripts) without a password

  Background:
    Given I am signed in as a regular member
    And I am on the "/settings/api-keys" page

  Scenario: The API keys page displays the list of existing keys
    Then I should see the "API Keys" heading
    And I should see a list of my existing API keys

  Scenario: Creating a new key requires a name
    When I click the "Create key" button
    And I submit the form without entering a name
    Then I should see a validation message indicating a name is required
    And no new key is added to the list

  Scenario: Creating a new key with a valid name shows the raw key exactly once
    When I click the "Create key" button
    And I enter "Postman integration" as the key name
    And I submit the form
    Then I should see the newly created raw API key displayed
    And I should see a warning that the key will not be shown again
    When I dismiss the new-key dialog
    Then the raw key value is no longer visible anywhere on the page
    And the key "Postman integration" appears in the list of existing keys

  Scenario: Revoking an existing key removes it from the list
    Given I have an existing API key named "Old script"
    When I revoke the key named "Old script"
    And I confirm the revocation
    Then the key "Old script" no longer appears in the list of existing keys

  Scenario: A revoked key stops working immediately
    Given I have an existing API key named "Soon to revoke" with a known raw value
    When I revoke the key named "Soon to revoke"
    And I confirm the revocation
    And I send an authenticated API request using that revoked raw key
    Then the API responds with a 401 Unauthorized status
