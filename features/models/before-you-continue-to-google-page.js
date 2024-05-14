import { By } from 'selenium-webdriver';

export class BeforeYouContinueToGooglePage {
    driver;

    constructor(loadedDriver) {
        this.driver = loadedDriver;
    }

    async clickAcceptAllButton() {
        await this.driver.findElement(By.xpath("//button/span[text()='Accept all']")).click();
    }
}