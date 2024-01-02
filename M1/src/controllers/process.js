const { sendToQueue } = require('../rabbitmq/index');
const logger = require('../common/logger');

module.exports = {
    processJobs: async (req, res) => {
        console.log('processJobs');
        try {
            const inputNumber = req.body.number;
            console.log('THIS IS THE REQ BODY:::', req.body);
            sendToQueue('jobs', Buffer.from(JSON.stringify({ inputNumber })));

            logger.info(`Job sent to RabbitMQ: ${inputNumber}`);
            res.status(200).json({ message: 'Job submitted successfully.' });
        } catch (error) {
            logger.error(`Error processing request: ${error.message}`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
