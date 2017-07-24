#!/usr/bin/env node

const amqp = require('amqplib')
const amqpuri = require('amqpuri')
const shuffle = require('lodash.shuffle')
const ProgressBar = require('progress')
const args = require('./args')

async function fetchMessagesAsync(channel, queue, messageCount) {
    const consumerTag = 'qshuffle'
    let messages = []
    let progress = new ProgressBar('Fetching Messages :percent [:bar] :etas', { width: 40, total: messageCount })

    return new Promise((resolve, reject) => {
        channel.consume(queue, (message) => {
            messages.push(message)
            progress.tick()
            if (progress.complete) {
                channel.ack(message, true)
                channel.cancel(consumerTag)
                    .then(() => resolve(messages))
            }
        }, { consumerTag, exclusive: true })
    })
}

function myxMessages(messages) {
    let progress = new ProgressBar('Myxing Messages   :percent [:bar] :etas', { width: 40, total: messages.length })
    let indices = Array(messages.length).fill().map((_, i) => i)
    let shuffledIndices = shuffle(indices)
    let shuffledMessages = []

    for (let index of shuffledIndices) {
        shuffledMessages.push(messages[index])
        progress.tick()
    }

    return shuffledMessages
}

async function sendMessagesAsync(channel, queue, messages, callback) {
    let progress = new ProgressBar('Sending Messages  :percent [:bar] :etas', { width: 40, total: messages.length })

    function drain (channel) {
        return new Promise((resolve, reject) => {
            function listener () {
                channel.removeListener('drain', listener)
                resolve()
            }
            channel.on('drain', listener)
        })
    }

    for (let message of messages) {
        if (await channel.sendToQueue(queue, message.content, message.properties) == false) {
            await drain(channel)
        }

        progress.tick()
    }
}

async function main (args) {
    console.log(' _____ _ _ _ _ _ _')
    console.log('|     | | |_\'_| | |')
    console.log('|_|_|_|_  |_,_|_  |')
    console.log('      |___|   |___|')

    let uri = amqpuri.format({
        hostname: args.host,
        port: args.port,
        vhost: args.vhost,
        username: args.login,
        password: args.password
    })

    let connection = await amqp.connect(uri)
    let channel = await connection.createChannel()
    let { queue, messageCount, consumerCount } = await channel.checkQueue(args.queue)

    if (messageCount == 0) {
        console.log('There are no messages on the queue')
        connection.close()
        return
    }

    if (consumerCount > 0) {
        console.log(`Queue has ${consumerCount} consumer(s), please shut them down and try again`)
        connection.close()
        return
    }

    let messages = await fetchMessagesAsync(channel, queue, messageCount)
    let shuffledMessages = myxMessages(messages)
    await sendMessagesAsync(channel, queue, shuffledMessages)

    setTimeout(() => {
        channel.close()
        connection.close()
    }, 1000)
}

main(args)
