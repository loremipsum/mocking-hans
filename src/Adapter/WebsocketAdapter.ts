import {AdapterInterface} from './AdapterInterface';
import {Container} from '../Utility/Container';
import {Metadata} from '../Utility';
import {MetadataKey, SocketDefinition} from '../Model';
import WebSocket = require('ws');
import chalk from 'chalk';
import * as url from 'url';

export class WebsocketAdapter implements AdapterInterface {
  protected container: Container;

  public configure(cb: (container: Container) => void) {
    cb(this.container);
  }

  public register(app: object, container: Container) {
    this.container = container;

    const appName  = Metadata.get<string>(app, MetadataKey.Name);
    const sockets  = Metadata.get<Array<SocketDefinition>>(app, MetadataKey.NativeSocketRoutes);
    const port     = Metadata.get<string>(app, MetadataKey.Port);
    const instance = this.container.get(appName);

    if (!this.container.has('http_server')) {
      this.container.set('http_server', require('http').createServer().listen(port));
    }

    const server = this.container.get('http_server');

    sockets.forEach(websocket => {
      const wss = new WebSocket.Server({
        noServer: true,
        perMessageDeflate: false,
      });

      wss.on(websocket.event, function (ws) {
        instance[websocket.methodName](ws);
      });

      server.on('upgrade', function (request, socket, head) {
        if (url.parse(request.url).pathname !== websocket.namespace) {
          return;
        }
        // tslint:disable-next-line
        console.info(`${chalk.underline(appName)} (:${port}): ` + [
          'WS',
          chalk.bold(websocket.event),
          websocket.namespace,
        ].join(' '));
        wss.handleUpgrade(request, socket, head, function done(ws) {
          wss.emit(websocket.event, ws, request);
        });
      });
    });
  }
}
