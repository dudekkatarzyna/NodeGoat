const sleep = require("./utils/sleep");
var request = require('superagent');

const {Builder, By, Key, until} = require('selenium-webdriver');
const {expect} = require('chai');
const chai = require('chai')
    , chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('timeouts', function () {


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


    it('Denial of service', async () => {

        var plus = encodeURIComponent('+');
        return new Promise(async (fulfill, reject) => {

            superagent
                .post('http://localhost:4000/contributions')
                .send(
                    'preTax=((blockTimeInSec) => {while(Date.now() < (Date.now()' + plus + '(blockTimeInSec * 1000))){}})(10);'
                    //'preTax=10'
                )
                .then(async () => {
                    await sleep(3000);

                })
            if(await isServerResponsive()){fulfill()}else {reject(new Error("timeout"))}

        });



    }).timeout(0);


    const isServerResponsive = async (timeout = 3000) =>

        new Promise(resolve => {
            const timer = setTimeout(() => resolve(false), timeout);
            console.log(timer);

            superagent
                .get('http://localhost:4000/')
                .end((err, res) => {
                    console.log("resolving");
                    clearInterval(timer);
                    resolve(res && res.status === 200);
                })


        })


});
