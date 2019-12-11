const {Builder, By, Key, until, DesiredCapabilities, logging} = require('selenium-webdriver');
const {expect} = require('chai');
var chai = require('chai');


const util = require('util');
const fs = require('fs');
const resemble = require('resemblejs');
var chaiFiles = require('chai-files');
var request = require('superagent');

chai.use(chaiFiles);
var file = chaiFiles.file;


describe('Command Injection', function () {
        var superagent = request.agent()


        before(() => {
            return new Promise((resolve) => {
                this.enableTimeouts(false)

                fs.writeFile('.hacked2', 'Hello content!', function (err) {
                    if (err) throw err;
                    console.log('Saved!');

                });

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


        it('Command', async () => {


            await superagent
                .post('http://localhost:4000/contributions')
                .send(
                    `preTax= var exec = require('child_process').exec;`
                    + `function execute(command, callback) {`
                    + `exec(\"dir\", function (error, stdout, stderr) {`
                    + `const fs = require('fs');`
                    + `fs.writeFile(\"./logs.txt\", stdout, function (err) {`
                    + `if (err) {return console.log(err);}`
                    + `console.log(\"The file was saved!\");});})}`
                    + `execute(\"dir\", '');`
                );


            expect(file('./logs.txt')).to.exist;
            expect(file('./logs.txt')).to.not.contain('Directory of');


        }).timeout(30000);


    }
);
