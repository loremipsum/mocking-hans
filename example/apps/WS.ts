import WebSocket = require('ws');
import {App, Websocket} from '../../src/Decorator';

@App({
  name: 'WS',
  port: 65000
})
export class WS {
  /**
   * On connection to /.
   */
  @Websocket('connection')
  onConnect(ws: WebSocket) {
    console.log(`Someone connected to /.`);
    ws.on('message', (message) => {
      console.log(`Incoming message: ${message}`);
      ws.send('shove', (error) => error && this.onError(error, ws));
    });
  }

  /**
   * On connection to a certain topic.
   */
  @Websocket('connection', '/topic')
  onTopic(ws: WebSocket) {
    console.log('Someone connected to /topic');
    ws.on('message', function (message) {
      console.log(`Incoming message: ${message}`);
    });
    const interval = setInterval(() => {
      ws.send('news at ' + (new Date()), (error) => {
        if (error) {
          this.onError(error, ws);
          clearInterval(interval);
        }
      });
    }, 1000);
  }

  onError(error: Error, ws: WebSocket) {
    console.error(error);
    ws.close();
  }
}
