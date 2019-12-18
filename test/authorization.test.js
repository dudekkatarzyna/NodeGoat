const {Builder, By, Key, until} = require('selenium-webdriver');
const {expect} = require('chai');

const util = require('util');
const fs = require('fs');
const resemble = require('resemblejs');
var request = require('superagent');
const sinon = require('sinon');
const {MongoClient} = require('mongodb');
var RandExp = require('randexp');

const chai = require('chai')
    , chaiHttp = require('chai-http');
var assert = require('assert');

chai.use(chaiHttp);


describe('Authorization', function () {

    var superagent = request.agent()
    var clock;
    let connection;
    let db;
    var config = require("../config/config"); // Application config properties

    before(async () => {
        db = await MongoClient.connect(config.db)

    });
    /*    after(()=>{
            clock.restore();
        })*/

    it('Get Another User Allocations', async (done) => {

        superagent
            .post('http://localhost:4000/login')
            .send({
                userName: 'user1',
                password: 'User1_123'
            })
            .then((res) => {
                console.log("logged in", res);
            });

        superagent
            .get('http://localhost:4000/allocations/1')
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done()
            })

    }).timeout(30000);

    it('Login Should Expire After A Year', async (done) => {


        clock = sinon.useFakeTimers(new Date(2019, 9, 1).getTime());

        superagent
            .post('http://localhost:4000/login')
            .send({
                userName: 'user1',
                password: 'User1_123'
            })
            .then((res) => {
                console.log("logge d in");
            });

        clock = sinon.useFakeTimers(new Date(2020, 9, 1).getTime());

        superagent
            .get('http://localhost:4000/dashboard')
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done()
            })


    }).timeout(30000);

    it('Password should not be saved as plain text', async () => {

        const unique_passwd = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
        const unique_usernName = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);

        await superagent
            .post('http://localhost:4000/signup')
            .send({
                email: 'emailVal@123.pl',
                userName: unique_usernName,
                password: unique_passwd,
                firstName: 'firstNameVal',
                lastName: 'lastNameVal',
                verify: unique_passwd,
            })
            .then((res) => {
                console.log("user created");
            });


        const user_array = await db.collection('users').find().toArray();

        let matchedPassword = false;
        if (user_array.some(e => e.password === unique_passwd)) {
            matchedPassword = true;
        }

        expect(matchedPassword).to.equal(false);


    }).timeout(30000);





});
