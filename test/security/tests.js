const {Builder, By, Key, until} = require('selenium-webdriver');
const {expect} = require('chai');

const util = require('util')
const fs = require('fs')
const resemble = require('resemblejs')

describe('Injection Attacks', function () {

    const driver = new Builder().forBrowser('chrome').build();

    before(async function () {
        await driver.get('localhost:4000/login');

        await driver.findElement(By.name('userName')).sendKeys('user1');
        await driver.findElement(By.name('password')).sendKeys('User1_123', Key.ENTER);
    });

    it('No SQL Injection', async () => {

        await driver.findElement(By.id('profile-menu-link')).click();
        const name = await driver.findElement(By.name("firstName")).getAttribute('value');
        const last_name = await driver.findElement(By.name("lastName")).getAttribute('value');

        await driver.findElement(By.id('allocations-menu-link')).click();
        await driver.findElement(By.name("threshold")).sendKeys("1'; return 1 == '1", Key.ENTER);

        const response = await driver.findElement(By.tagName("body")).getText();
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

    it.only('FS Access', async () => {

        await driver.findElement(By.id('contributions-menu-link')).click();

        await driver.findElement(By.name("preTax")).clear();
        await driver.findElement(By.name("preTax")).sendKeys("res.end(require('fs').readdirSync('.').toString())", Key.ENTER);
        /*            await driver.findElement(By.name("preTax")).clear();
                      await driver.findElement(By.name("preTax")).sendKeys("79", Key.ENTER);*/

        let errorText = '';
        try {
            errorText = await driver.findElement(By.className("alert")).getText();
            console.log(errorText)

        } catch (error) {
            console.log(error)
        }


        expect(errorText).to.equal("×\nInvalid contribution percentages")

    }).timeout(30000);

    // after(async () => driver.quit());

});
