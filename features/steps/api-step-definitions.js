import {When, Then } from '@cucumber/cucumber';
import request from 'supertest';
import { expect } from 'chai';
import { GOOGLE_FINANCE_BTC_USD_URL, GOOGLE_FINANCE_BTC_USD_FORM_DATA } from "../config/api-data-config.js";
import { sleep } from '../utils/sleep-util.js';

async function getCurrentPriceOfBTC() {
    const { body, _ } = await request(GOOGLE_FINANCE_BTC_USD_URL)
      .post('/')
      .send(GOOGLE_FINANCE_BTC_USD_FORM_DATA)
      .buffer(true)
      .parse((response, callback) => {
        let data = Buffer.from("");
        response.on("data", function(chunk) {
        data = Buffer.concat([data, chunk]);
        });
        response.on("end", function() {
          callback(null, data.toString());
        });
      });

    const pattern = /\[\["wrb.fr","Ba1tad","\[\[\[null,\[(.*?),/g;
    const it = body.matchAll(pattern);
    return it.next().value[1];
}

let initialBTCPrice;
When('initial price of BTC-USD is recorded', async () => {
    const unformattedInitialBTCPrice = await getCurrentPriceOfBTC();
    initialBTCPrice = parseFloat(unformattedInitialBTCPrice);
});

let prices = [];
When('gets the price every {int} seconds for a given total {int} minutes of time', {timeout: 10 * 60000}, async (interval, totalTime) => {
    let timeCounter = 0;
    while (timeCounter < totalTime*60) {
        const currentBTCPrice = await getCurrentPriceOfBTC();
        prices.push(parseFloat(currentBTCPrice));
        await sleep(interval*1000);
        timeCounter += interval;
    }
});

Then('the average price has not varied by more than {int}% from itially recorded value', (expectedDeviationPercentage) => {
    const averageBTCPrice = prices.reduce(function (sum, value) {
        return sum + value;
    }, 0) / prices.length;
    const roundedAverageBTCPrice = Math.round((averageBTCPrice + Number.EPSILON) * 100) / 100;
    const priceDifference = Math.abs(initialBTCPrice - roundedAverageBTCPrice);
    const actualDeviation = priceDifference / initialBTCPrice;
    expect(actualDeviation).to.be.lessThanOrEqual(expectedDeviationPercentage/100);
});

Then('the value of all recorded prices does not vary by more than {int}%', async (expectedDeviationPercentage) => {
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceDifference = maxPrice - minPrice;
    const actualDeviation = priceDifference / ((maxPrice + minPrice) /2.);
    expect(actualDeviation).to.be.lessThanOrEqual(expectedDeviationPercentage/100);
});