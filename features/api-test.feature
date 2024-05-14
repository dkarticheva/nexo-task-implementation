Feature: Test BTC-USD price changes through the API

@API-test @BTC-USD
Scenario Outline: BTC-USD has stable average price within 1% deviation in a given time period
    When initial price of BTC-USD is recorded
    And gets the price every 10 seconds for a given total <amount> minutes of time
    Then the average price has not varied by more than 1% from itially recorded value
Examples:
    | amount |
    | 1      |
    | 3      |
    | 5      |

@API-test @BTC-USD
Scenario Outline: BTC-USD has stable prices throughout a given time period with no 2 values varied by more than 2%
    When gets the price every 10 seconds for a given total <amount> minutes of time
    Then the value of all recorded prices does not vary by more than 2%
 Examples:   
    | amount |
    | 1      |
    | 3      |
    | 5      |