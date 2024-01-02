const logger = require('../common/logger');

const processCompleteHandler = async (msg, callback) => {
    try {
        const job = JSON.parse(msg.content.toString());
        logger.info(`Job received from M2 in M1: ${job}`);
        callback(true);
    }
    catch (e) {
        logger.error('Process complete handler error: ', e);
        callback(false);
    }
}

module.exports = processCompleteHandler;