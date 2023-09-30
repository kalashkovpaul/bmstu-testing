import { spawn } from 'child_process';
import { logConfig } from './configs/log.config';
import {pino} from 'pino';
import { PassThrough } from 'stream';


// Environment variables
const cwd = process.cwd()
const { env } = process
const logPath = `${cwd}/log`

// Create a stream where the logs will be written
const logThrough = new PassThrough()
const logger = pino(logThrough)

// Log to multiple files using a separate process
const child = spawn(process.execPath, [
  require.resolve('pino-tee'),
  'info', `${logPath}/${logConfig.infoPath}`,
  'error', `${logPath}/${logConfig.errorPath}`,
], { cwd, env, stdio: ['pipe', 'inherit', 'inherit']});



// createLogger({
//     level: "info",
//     format: format.combine(
//         format.timestamp(),
//         format.printf(({timestamp, level, message}) => {
//             return `[${timestamp}] ${level}: ${message}`
//         })
//     ),
//     transports: [
//         new transports.File({filename: logConfig.errorPath, level: "warn"}),
//         new transports.File({filename: logConfig.infoPath}),
//         new transports.DailyRotateFile({
//             filename: logConfig.errorPath,
//             level: "warn",
//             datePattern: 'YYYY-MM-DD-HH',
//             zippedArchive: true,
//             maxSize: '20m'
//         }),
//         new transports.DailyRotateFile({
//             filename: logConfig.infoPath,
//             datePattern: 'YYYY-MM-DD-HH',
//             zippedArchive: true,
//             maxSize: '20m'
//         }),
//     ],
// });

export default logger;