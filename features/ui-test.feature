Feature: Test BTC-USD price changes through the UI

@UI-test @BTC-USD
Scenario Outline: User sees BTC-USD has stable average price within 1% deviation in a given time period
    Given user is navigated to BTC-USD price quote page on Google finance
    When the user records initial price of BTC-USD
    And keeps looking up the price every 10 seconds for a given total <amount> minutes of time
    Then the user sees the average price has not varied by more than 1% from itially recorded value
Examples:
    | amount |
    | 1      |
    | 3      |
    | 5      |

@UI-test @BTC-USD
Scenario Outline: User sees BTC-USD has stable prices throughout a given time period with no 2 values varied by more than 2%
    Given user is navigated to BTC-USD price quote page on Google finance
    When keeps looking up the price every 10 seconds for a given total <amount> minutes of time
    Then the user sees the value of all recorded prices does not vary by more than 2%
 Examples:   
    | amount |
    | 1      |
    | 3      |
    | 5      |