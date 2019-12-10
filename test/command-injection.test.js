const {Builder, By, Key, until, DesiredCapabilities, logging} = require('selenium-webdriver');
const {expect} = require('chai');
var chai = require('chai');


const util = require('util');
const fs = require('fs');
const resemble = require('resemblejs');
var chaiFiles = require('chai-files');

chai.use(chaiFiles);
var file = chaiFiles.file;


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
               driver.quit();
        });


        it('Command', async () => {

            await driver.findElement(By.id('contributions-menu-link')).click();

            await driver.findElement(By.name("preTax")).clear();

            await driver.findElement(By.name("preTax")).sendKeys(
                ` var exec = require('child_process').exec;` +
                `function execute(command, callback) {` +
                `exec("dir", function (error, stdout, stderr) {` +
                `const fs = require('fs');` +
                `fs.writeFile("./logs.txt", stdout, function (err) {` +
                `if (err) {return console.log(err);}` +
                `console.log("The file was saved!");});})}` +
                `execute("dir", '');`,
                Key.ENTER);


            expect(file('./logs.txt')).to.exist;
            expect(file('./logs.txt')).to.not.contain('Directory of');


        }).timeout(30000);


    }
);
