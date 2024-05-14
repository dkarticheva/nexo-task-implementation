import { By } from 'selenium-webdriver';

export class BitcoinUSDQuotePage {
    driver;

    constructor(loadedDriver) {
        this.driver = loadedDriver;
    }

    async navigate() {
       await this.driver.get('https://www.google.com/finance/quote/BTC-USD');
    }

    async getCurrentPrice() {
        return await this.driver.findElement(By.css('[data-source="BTC"] .YMlKec')).getText();
    }
}