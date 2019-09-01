// CRUD: Simple Create, Read, Update, Delete api operations for data management.

import { Router } from 'express';
import log from '../../helpers/bunyan';
import { Results } from '../../models/results';


const modelName = 'handshake'; // This needs to exactly match the corresponding file name under /server/models/, minus the extension

const crudRouter = Router();

log.info(`Creating CRUD routes for ${modelName}`);

// Create routes for plural object fetching
crudRouter.route('/' + modelName)
// R(ead) all documents from model
.get((req: any, res: any, next: any) => {

    const results: Results = {};

    results.info = 'Handshake with BFF successful!';
    results.success = true;
    results.data = {};

    return res.json(results);
});

export default crudRouter;
