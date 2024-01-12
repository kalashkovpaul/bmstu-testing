Feature: 2 factor authentication (2FA)

    Scenario: Use 2FA
        When we open main page
        Then we should have login page opened
        When we try to authenticate
        Then we see main page
        When we logout
        Then we should have login page opened
        When we try to change password
        Then we should get 2FA info message
        When we try to open mail inbox
        Then we see new 2FA email message
        When we click 2FA link
        Then we see 2FA success message
        When we open main page
        Then we see main page
