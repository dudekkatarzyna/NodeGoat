
const {Builder, By, Key, until} = require('selenium-webdriver');
const {expect} = require('chai');

const util = require('util');
const fs = require('fs');
const resemble = require('resemblejs');
var request = require('superagent');


describe('NoSql Injection', function () {

    var superagent = request.agent()


    before(() => {
        return new Promise((resolve) => {
            this.enableTimeouts(false)
            superagent
                .post('http://localhost:4000/login')
                .send({
                    userName: 'user1',
                    password: 'User1_123'
                })
                .then((err) => {
                    console.log("logged in");
                    resolve()
                });
        })

    });

    it('Get Another User Allocations', async (done) => {


        superagent
            .get('http://localhost:4000/allocations/1')
            .end(function (err, res) {
                expect(res.status).eql(500)
                done()
            })

    }).timeout(30000);

    it.only('Get Assets Allocations for All', async () => {

        let text
        await superagent
            .get('http://localhost:4000/allocations/2')
            .query({
                threshold: "1'; return 1 == '1"
            })
            .then(function (response) {
                //    console.log("response", response.text);

                text = response.text.split('Asset Allocations for')

            });
        let users = []
        for (let line of text) {
            //    console.log(line)

            line = line.substring(0, line.indexOf('<'));
           // console.log(line)
            users.push(line)

        }
      //  console.log(new Set(users).size);
        expect(new Set(users).size).to.equal(1);


    }).timeout(30000);




});
