const {Builder, By, Key, until} = require('selenium-webdriver');
const {expect} = require('chai');

const util = require('util');
const fs = require('fs');
const resemble = require('resemblejs');



describe('NoSql Injection', function () {

    const driver = new Builder().forBrowser('chrome').build();
   // var requester = chai.request(server).keepOpen();
    before(async function () {
        this.enableTimeouts(false)

        await driver.get('localhost:4000/login');

        await driver.findElement(By.name('userName')).sendKeys('user1');
        await driver.findElement(By.name('password')).sendKeys('User1_123', Key.ENTER);
    });

    after(async () =>{
        // requester.close();
        driver.quit();
    });

    it('Assets Allocations', async () => {

        await driver.get('localhost:4000');

        await driver.findElement(By.id('profile-menu-link')).click();
        const name = await driver.findElement(By.name("firstName")).getAttribute('value');
        const last_name = await driver.findElement(By.name("lastName")).getAttribute('value');

        await driver.findElement(By.id('allocations-menu-link')).click();
        await driver.findElement(By.name("threshold")).sendKeys("1'; return 1 == '1", Key.ENTER);

        const response = await driver.findElement(By.css("body")).getText();
        const fields = response.split('Asset Allocations for ');
        fields.splice(0, 1);

        const name_array = [];
        for (const field of fields) {
            const field_1 = field.substring(0, field.indexOf('\n'));
            if (name_array.includes(field_1)) {
                continue
            }
            name_array.push(field_1)
        }

        expect(name_array.length).to.equal(1);
        expect(name_array[0]).to.equal(name + " " + last_name)

    }).timeout(30000);



});
