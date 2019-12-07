const {Builder, By, Key, until} = require('selenium-webdriver');
const {expect} = require('chai');


describe('timeouts', function () {

    const driver = new Builder().forBrowser('chrome').build();

    before(async function () {
        this.enableTimeouts(false);
        await driver.get('localhost:4000/login');

        await driver.findElement(By.name('userName')).sendKeys('user1');
        await driver.findElement(By.name('password')).sendKeys('User1_123', Key.ENTER);
    });

    after(async () => {
        //  requester.close();
        driver.quit();
    });

    const sleep = ms => new Promise(res => setTimeout(res, ms));
    it('Denial of service', async () => {


        await driver.get('localhost:4000');
        await driver.findElement(By.id('contributions-menu-link')).click();

        await driver.findElement(By.name("preTax")).clear();

        let isResolved=false;
        const response = driver.findElement(By.name("preTax")).sendKeys("while(1);", Key.ENTER);
        await sleep(3000);

        response.then(function () {
            isResolved=true
        });


        expect(isResolved).to.equal(true);


    }).timeout(10000);


});
