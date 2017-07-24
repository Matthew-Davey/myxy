const yargs = require('yargs')

let args = yargs(process.argv)
    .options({
        'h': {
            alias: 'host',
            default: 'localhost',
            describe: 'Hostname of the AMQP broker',
            type: 'string'
        },
        'p': {
            alias: 'port',
            default: 5672,
            describe: 'AMQP broker port number',
            type: 'number'
        },
        'u': {
            alias: 'login',
            default: 'guest',
            describe: 'AMQP login user name',
            type: 'string'
        },
        'P': {
            alias: 'password',
            default: 'guest',
            describe: 'AMQP user password',
            type: 'string'
        },
        'v': {
            alias: 'vhost',
            default: '/',
            describe: 'AMQP virtual host',
            type: 'string'
        },
        'q': {
            alias: 'queue',
            demandOption: true,
            describe: 'The queue to be myxed',
            type: 'string'
        }
    }).argv

module.exports = args