const {Builder, By, Key, until} = require('selenium-webdriver');
const {expect} = require('chai');

const util = require('util');
const fs = require('fs');
const resemble = require('resemblejs');

const chai = require('chai')
    , chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Code Injection', function () {

    const driver = new Builder().forBrowser('chrome').build();
    // var requester = chai.request(server).keepOpen();
    before(async function () {
        this.enableTimeouts(false)

        fs.writeFile('.hacked2', 'Hello content!', function (err) {
            if (err) throw err;
            console.log('Saved!');

        });

        await driver.get('localhost:4000/login');
        try {
            await driver.findElement(By.name('userName')).sendKeys('user1');
            await driver.findElement(By.name('password')).sendKeys('User1_123', Key.ENTER);
        } catch (e) {
            console.log(e)
        }

    });

/*
    after(async () => {
        //requester.close();
        driver.quit();
    });
*/

    it('FS Access Pre-Tax', async () => {

        await driver.get('localhost:4000');

        await driver.findElement(By.id('contributions-menu-link')).click();

        await driver.findElement(By.name("preTax")).clear();
        await driver.findElement(By.name("preTax")).sendKeys("res.send(require('fs').readdirSync('.').toString())", Key.ENTER);

        let errorText = '';
        try {
            errorText = await driver.findElement(By.className("alert")).getText();
            console.log(errorText)

        } catch (error) {
            console.log(error)
        }


        expect(errorText).to.equal("×\nInvalid contribution percentages")

    }).timeout(30000);

    it('FS Access Roth', async () => {

        await driver.get('localhost:4000');

        await driver.findElement(By.id('contributions-menu-link')).click();

        await driver.findElement(By.name("roth")).clear();
        await driver.findElement(By.name("roth")).sendKeys("res.send(require('fs').readdirSync('.').toString())", Key.ENTER);

        let errorText = '';
        try {
            errorText = await driver.findElement(By.className("alert")).getText();
            console.log(errorText)

        } catch (error) {
            console.log(error)
        }


        expect(errorText).to.equal("×\nInvalid contribution percentages")

    }).timeout(30000);

    it('FS Access After-Tax', async () => {

        await driver.get('localhost:4000');

        await driver.findElement(By.id('contributions-menu-link')).click();

        await driver.findElement(By.name("afterTax")).clear();
        await driver.findElement(By.name("afterTax")).sendKeys("res.redirect(require('fs').readdirSync('.').toString())", Key.ENTER);

        let errorText = '';
        try {
            errorText = await driver.findElement(By.className("alert")).getText();
            console.log(errorText)

        } catch (error) {
            console.log(error)
        }


        expect(errorText).to.equal("×\nInvalid contribution percentages")

    }).timeout(30000);

    it('File Modification', async () => {
        await driver.get('localhost:4000');

        await driver.findElement(By.id('contributions-menu-link')).click();

        await driver.findElement(By.name("preTax")).clear();
        await driver.findElement(By.name("preTax")).sendKeys("res.send(require('fs').readdirSync('.').toString())", Key.ENTER);
        let response = await driver.findElement(By.css("body")).getText();

        response = response.split(",");
        console.log(response);
        await driver.get('localhost:4000/contributions');
        await driver.findElement(By.name("preTax")).clear();
        await driver.findElement(By.name("preTax")).sendKeys("var fs = require('fs');var currentFile = '" + response[0] + "';fs.writeFileSync(currentFile,  'hacked' + fs.readFileSync(currentFile))", Key.ENTER);

        const readFileAsync = fs.readFileSync("./" + response[0], 'utf8');

        expect(readFileAsync).to.not.contains('hacked');


    }).timeout(30000);

    it('Log Injection', async () => {
        this.skip();
        await driver.get('localhost:4000');

        await driver.findElement(By.id('logout-menu-link')).click();

        let myText=`user1\\nError: alex moldovan failed $1,000,000 transaction`;
        console.log(myText)

        chai.request('localhost:4000')
            .post('/login')
            .type('form')
            .send({
                '_method': 'post',
                'userName': 'vyva%0aError: alex moldovan failed $1,000,000 transaction',
                'password': 'Admin_123&_csrf='
            });

        /*await driver.findElement(By.name('userName')).sendKeys(myText);
        const res=await driver.findElement(By.name('password')).sendKeys('User1_123', Key.ENTER);
*/
       //console.log(res);

        expect(true).to.equal(false);


    }).timeout(30000);


});
