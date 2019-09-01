// Set up Bunyan for logging
import * as bunyan from 'bunyan';
import config from './config';


const bunyanDebugStream: any = require('bunyan-debug-stream');
const logStreams: any = [
    {
        level: config.log_level, // must be one of "fatal", "error", "warn", "info", "debug", "trace".  See https://github.com/trentm/node-bunyan#levels.
        type: 'raw',
        stream: bunyanDebugStream({
            // Output to the console should be pretty-printed for human consumption
            basepath: __dirname,
            forceColor: true
        })
    }
];
const log = bunyan.createLogger({
    name: 'logger',
    streams: logStreams,
    serializers: bunyanDebugStream.serializers
});

export default log;
