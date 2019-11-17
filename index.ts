import * as core from '@actions/core';
import * as request from 'request';
import * as str from 'underscore.string';
import * as fs from 'fs';
import * as path from 'path';

const getValue = (path: string) : string => {
    const value = core.getInput(path);
    if (str.isBlank(value)) {
        const errorMessage = `Parameter '${path}' is required.`;
        core.setFailed(errorMessage);
        throw new Error(errorMessage);
    }

    return value;
}

const login = getValue('login');
const password = getValue('password');
const project = getValue('project');
const environments = getValue('environments');
const configsPath = getValue('configs-path');

const splittedEnvironments = environments.split(',');
for (const environment of splittedEnvironments) {
    const options = {
        url: `https://nexus-services.directcrm.ru/projects/configuration?projectSystemName=${project}&environment=${environment}`,
        auth: {
            username: login,
            password: password
        }
    };

    core.info(`Requesting '${options.url}'`);

    request.get(options, (error, response, body) => {
        if (response && response.statusCode == 200) {
            const fileName = `application.config.${str.decapitalize(environment)}`;
            const filePath = path.join(configsPath, fileName);
            
            fs.writeFileSync(filePath, body);

            core.info(`Project configuration '${filePath}' saved`);
        }
        else {
            const errorMessage = `Error while getting '${options.url}': '${error}', response code: ${response && response.statusCode}`;
            core.setFailed(errorMessage);
            throw new Error(errorMessage);
    }});   
}