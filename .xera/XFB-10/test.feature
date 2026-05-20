Feature: XFB-10: US-105 — Update Profile
  As a Member
  I want to update my name and password
  So that my account information stays current

  Background:
    Given I am signed in as a regular member
    And I am on the "/settings/profile" page

  Scenario: Changing the display name and saving persists the new name
    When I change the "Name" field to "Updated Tester"
    And I click the "Save changes" button
    Then I should see a confirmation message indicating the profile was saved
    When I reload the page
    Then the "Name" field shows "Updated Tester"

  Scenario: Changing the password requires a new password of at least 8 characters
    When I enter "user123" in the "Current password" field
    And I enter "short" in the "New password" field
    And I click the "Change password" button
    Then the "New password" field is reported as invalid
    And no confirmation message is displayed

  Scenario: Changing the password with a valid new password shows a confirmation message
    When I enter "user123" in the "Current password" field
    And I enter "newvalid123" in the "New password" field
    And I click the "Change password" button
    Then I should see a confirmation message indicating the password was changed
