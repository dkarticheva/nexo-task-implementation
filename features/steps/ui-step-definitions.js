import {When, Then, After, Before, Given } from '@cucumber/cucumber'
import { expect } from 'chai';
import initDriver from '../utils/driver-util.js';
import { BitcoinUSDQuotePage } from '../models/bitcoin-usd-quote-page.js';
import { BeforeYouContinueToGooglePage } from '../models/before-you-continue-to-google-page.js';
import { sleep } from '../utils/sleep-util.js';

let driver, bitcoinUSDQuotePage, beforeYouContinueToGooglePage;
Before({tags: "@UI-test"}, function () {
    driver = initDriver();
    bitcoinUSDQuotePage = new BitcoinUSDQuotePage(driver);
    beforeYouContinueToGooglePage = new BeforeYouContinueToGooglePage(driver);
});

After({tags: "@UI-test"}, async function () {
    driver.quit();
});

Given('user is navigated to BTC-USD price quote page on Google finance', async () => {
    await bitcoinUSDQuotePage.navigate();
    await beforeYouContinueToGooglePage.clickAcceptAllButton();
});

let initialBTCPrice;
When('the user records initial price of BTC-USD', async () => {
    const unformattedInitialBTCPrice = await bitcoinUSDQuotePage.getCurrentPrice();
    initialBTCPrice = parseFloat(unformattedInitialBTCPrice.replace(/,/g, ''));
});

let prices = [];
When('keeps looking up the price every {int} seconds for a given total {int} minutes of time', {timeout: 10 * 60000}, async (interval, totalTime) => {
    let timeCounter = 0;
    while (timeCounter < totalTime*60) {
        const currentBTCPrice = await bitcoinUSDQuotePage.getCurrentPrice();
        prices.push(parseFloat(currentBTCPrice.replace(/,/g, '')));
        await sleep(interval*1000);
        timeCounter += interval;
  }
});

Then('the user sees the average price has not varied by more than {int}% from itially recorded value', (expectedDeviationPercentage) => {
    const averageBTCPrice = prices.reduce(function (sum, value) {
        return sum + value;
    }, 0) / prices.length;
    const roundedAverageBTCPrice = Math.round((averageBTCPrice + Number.EPSILON) * 100) / 100;
    const priceDifference = Math.abs(initialBTCPrice - roundedAverageBTCPrice);
    const actualDeviation = priceDifference / initialBTCPrice;
    expect(actualDeviation).to.be.lessThanOrEqual(expectedDeviationPercentage/100);
});

Then('the user sees the value of all recorded prices does not vary by more than {int}%', async (expectedDeviationPercentage) => {
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceDifference = maxPrice - minPrice;
    const actualDeviation = priceDifference / ((maxPrice + minPrice) / 2.);
    expect(actualDeviation).to.be.lessThanOrEqual(expectedDeviationPercentage/100);
});
