// CRUD: Simple Create, Read, Update, Delete api operations for data management.

import { Router } from 'express';
const request = require('request');
const path = require('path');
const fs = require('fs');

import log from '../../helpers/bunyan';
import appConfig from '../../helpers/config';
import { Results } from '../../models/results';
import Config from '../../models/config';
import { appDefaultConfig } from '../../../src/app/_internal/configuration/configuration';


const modelName = 'config'; // This needs to exactly match the corresponding file name under /server/models/, minus the extension
const endpointUrl = appConfig.api_domain + '/' + appConfig.api_path + '/' + appConfig.api_selfTenant;
const crudRouter = Router();


log.info(`Creating CRUD routes for ${modelName}`);

// Create routes for singular object fetching
crudRouter.route('/' + modelName)
// R(ead) all documents from model
.get((req: any, res: any, next: any) => {

    const results: Results = {};
    const config: Config = appDefaultConfig; // By default the config is set to match that from /src/app/_internal/configuration/configuration

    results.info = 'Retrieved ' + modelName + ' from BFF';
    results.success = true;
    results.data = config;

    return res.json(results);
});

export default crudRouter;
