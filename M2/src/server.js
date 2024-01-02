const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./common/logger');
const app = express();
const PORT = process.env.PORT || 4000;
const { startConsumer } = require('./rabbitmq/index');
const processHanlder = require('./rabbitmq/consumer');


app.get('/', (req, res) => {
    res.status(200).json({ message: 'M2 Microservice' });
});

app.use(bodyParser.json());

startConsumer('jobs', processHanlder);

app.listen(PORT, () => {
    logger.info(`M2 Microservice listening on port ${PORT}`);
});