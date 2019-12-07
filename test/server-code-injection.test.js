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

    const sleep = ms => new Promise(res => setTimeout(res, ms));
    it('Denial of service', async () => {


        await driver.get('localhost:4000');
        await driver.findElement(By.id('contributions-menu-link')).click();
        await driver.findElement(By.name("preTax")).clear();
        expect(await isAlive()).to.equal(true);


        driver.findElement(By.name("preTax")).sendKeys("while(1);", Key.ENTER);
        await sleep(3000);
        console.log("after sleep");

        const result = await isAlive();
        console.log(result);
        expect(result).to.equal(true);


    }).timeout(0);


    async function isAlive(timeout = 3000) {

        return new Promise(resolve => {
            const timer = setTimeout(() => {
                console.log("working")
                resolve(false);
            }, timeout);
            console.log(timer);
            chai.request('http://localhost:4000')
                .get('/')
                .end((err, res) => {
                    console.log("TIMERRRRR", timer);
                    clearInterval(timer);
                    resolve(res && res.status === 200);
                });
        })
    }
});
