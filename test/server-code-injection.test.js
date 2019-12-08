const sleep = require("./utils/sleep");

const {Builder, By, Key, until} = require('selenium-webdriver');
const {expect} = require('chai');
const chai = require('chai')
    , chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('timeouts', function () {

    const driver = new Builder().forBrowser('chrome').build();

    before(async function () {
        this.enableTimeouts(false);
        // await chai.request('http://localhost:4000').get('/login');
        await driver.get('localhost:4000/login');

        await driver.findElement(By.name('userName')).sendKeys('user1');
        await driver.findElement(By.name('password')).sendKeys('User1_123', Key.ENTER);
    });

    after(async () => {
        //  requester.close();
        driver.quit();
    });


    it('Denial of service', async () => {

        await preparePreTaxInput();
        //expect(await isServerResponsive()).to.equal(true);

        driver.findElement(By.name("preTax")).sendKeys(`((blockTimeInSec) => {while(Date.now() < (Date.now() + (blockTimeInSec * 1000))){}})(10);`, Key.ENTER);

        await sleep(3000);

        expect(await isServerResponsive()).to.equal(true);


    }).timeout(0);

    async function preparePreTaxInput() {
        await driver.get('localhost:4000');
        await driver.findElement(By.id('contributions-menu-link')).click();
        await driver.findElement(By.name("preTax")).clear();
    }

    const isServerResponsive = async (timeout = 3000) =>

        new Promise(resolve => {
            const timer = setTimeout(() => resolve(false), timeout);
            console.log(timer);
            chai.request('http://localhost:4000')
                .get('/')
                .end((err, res) => {
                    console.log("resolving")
                    clearInterval(timer);
                    resolve(res && res.status === 200);
                });
        })


});
