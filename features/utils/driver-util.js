import { Builder } from 'selenium-webdriver';

const initDriver = () => {
    let driver = new Builder()
    .forBrowser('chrome')
    .build();
    return driver;
}

export default initDriver;