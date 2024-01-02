const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./common/logger');
const app = express();
const PORT = process.env.PORT || 3000;
const { startConsumer } = require('./rabbitmq/index');
const routes = require('./routes/index');
const processCompleteHandler = require('./rabbitmq/consumer');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

startConsumer('completed', processCompleteHandler);


app.listen(PORT, () => {
    logger.info(`M1 Microservice listening on port ${PORT}`);
});
