import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import log from './helpers/bunyan';
import config from './helpers/config';


const app: express.Express = express();

// Show environment in output
if (config.hasOwnProperty('environment')) {
    log.info('Environment = ' + config.environment);
}

// View engine setup (This is only ever used for displaying error pages)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Set up request logging
app.use(function (req, res, next) {
    // bunyan-debug-stream does magic things when passing an object with a req property
    // into it, so we don't have to do any special kind of formatting for the output
    const status: number = res.statusCode;

    if (status < 300) {
        log.info({req: req, res: res});
    } else if (status >= 300 && status < 400) {
        log.warn({req: req, res: res});
    } else if (status >= 400 && status < 500) {
        log.warn({req: req, res: res});
    } else if (status >= 500) {
        log.error({req: req, res: res});
    } else {
        log.info({req: req, res: res});
    }

    next();
});

// Create Express routes using all files in the routes directory
log.info('Create express routes...');
const routeModules = require('require-all')({
    dirname: __dirname + '/routes',
    filter: /^([^\.].*)\.(ts|js)$/,
    map: name => '/' + name
});

function resolve(root: string, modules): void {
    for (const name of Object.keys(modules)) {
        if (!name.startsWith('/')) {
            return;
        }
        const module = modules[name];
        if (module.default && module.default.route) {
            log.info(`Add router ${root + name}`);
            const router = module.default as express.Router;
            app.use(root, router);
        } else {
            resolve(root + name, module);
        }
    }
}

resolve('', routeModules);

// CORS middleware
const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};
// Uncomment this line if you expect to receive API requests from other domains
// app.use(allowCrossDomain);

// Default to main page. Angular route takes over from there.
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Handle errors
app.use((error: any, req, res, next) => {

    // Handle 404 as an error
    if (error.status === 404) {
        res.status(404).json({
            status: 404,
            message: 'Not found.'
        });
    } else if (error.name === 'UnauthorizedError' || error.status === 401) {
        res.status(401).json({
            status: 401,
            message: 'Not authorized.'
        });
    } else {
        // Handle everything else
        log.error(error);
        res.status(error.statusCode || 500).json(error);
    }
});

export default app;
