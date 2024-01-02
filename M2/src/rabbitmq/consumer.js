const { sendToQueue } = require('./index');
const logger = require('../common/logger');

const processHanlder = async (msg, callback) => {
    try {
        const job = JSON.parse(msg.content.toString());
        logger.info(`Job received: ${job}`);
        const result = await processJob(job);
        sendToQueue('completed', Buffer.from(result.toString()), {
            correlationId: msg.properties.correlationId,
        });
        callback(true);
    }
    catch (e) {
        logger.error('Process handler error: ', e);
        callback(false);
    }
}

async function processJob(job) {
    const inputNumber = job.inputNumber;
    logger.info(`Processing job: ${inputNumber}`);
    // Simulating a 5-second job processing delay
    await new Promise(resolve => setTimeout(resolve, 5000));
    const result = inputNumber * 2;
    logger.info(`Job processed. Result: ${result}`);
    return result;
}

module.exports = processHanlder;