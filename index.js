const core = require('@actions/core');
const request = require('request');

const login = core.getInput('login');
const password = core.getInput('password');
const project = core.getInput('project');
const environment = core.getInput('environment');

const options = {
    url: `https://nexus-services.directcrm.ru/projects/configuration?projectSystemName=${project}&environment=${environment}`,
    auth: {
        username: login,
        password: password
    }
};

request(options, (error, response, body) => {
    if (response && response.statusCode == 200) {
        core.setOutput('project-config', '');
    }
    else {
        core.setFailed(`Can't get project config. Error: ${error}, response code: ${response && response.statusCode}`);
    }
});