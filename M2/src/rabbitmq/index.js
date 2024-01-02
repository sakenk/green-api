const amqp = require('amqplib/callback_api');
const dotenv = require('dotenv');
dotenv.config();

let amqpConn = null;

module.exports = {
  sendToQueue: async (queue, msg) => {

    amqp.connect(process.env.RABBITMQ_URL, (err, connection) => {
      connection.createChannel((err, ch) => {
        if (closeOnErr(err)) return;

        ch.on('error', function (err) {
          console.error('[AMQP] channel error', err.message);
        });

        ch.on('close', function () {
          console.log('[AMQP] channel closed');
        });

        ch.assertQueue(queue, { durable: true }, (err, _ok) => {
          if (closeOnErr(err)) return;

          // send message to queue
          console.log('channel connected#$$');
          console.log('THIS IT THE QUEUE SENT:::', queue);
          ch.sendToQueue(queue, msg);
        });
      });
    });
  },
  startConsumer: async (queue, fnConsumer) => {
    amqp.connect(process.env.RABBITMQ_URL, (errrm, connection) => {
      if (errrm) {
        console.log(errrm);
        return;
      }

      connection.createChannel((errr, ch) => {
        if (closeOnErr(errr)) return;

        ch.on('error', function (errrr) {
          console.error('[AMQP] channel error', errrr.message);
        });

        ch.on('close', function () {
          console.log('[AMQP] channel closed');
        });

        ch.prefetch(10);

        //connect to queue
        ch.assertQueue(queue, { durable: true }, (errx, _ok) => {
          if (closeOnErr(errx)) return;

          //consume incomming messages
          ch.consume(queue, proccessMsg, { noAck: false });
        });

        function proccessMsg(msg) {
          // Process incoming messages and send them to fnConsumer
          // Here we need to send a callback(true) for acknowledge the message or callback(false) for reject them
          fnConsumer(msg, function (ok) {
            try {
              ok ? ch.ack(msg) : ch.reject(msg, true);
            } catch (e) {
              closeOnErr(e);
            }
          });
        }
      });
    });
  }
};

function closeOnErr(err) {
  if (!err) return false;
  console.error('[AMQP] error', err);
  amqpConn.close();
  return true;
}