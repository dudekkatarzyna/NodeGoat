const {Builder, By, Key, until} = require('selenium-webdriver');
const {expect} = require('chai');

const util = require('util');
const fs = require('fs');
const resemble = require('resemblejs');



describe('Command Injection', function () {

    const driver = new Builder().forBrowser('chrome').build();

    before(async function () {
        console.log("before");
        const r1=await driver.get('localhost:4000/login');
        console.log("r1",r1);
        await driver.findElement(By.name('userName')).sendKeys('user1');
        await driver.findElement(By.name('password')).sendKeys('User1_123', Key.ENTER);
    });
    after(async () =>{
        //   requester.close();
        driver.quit();
    });


    it('Command', async () => {


    }).timeout(30000);




});
