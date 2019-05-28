import {AdapterInterface} from './AdapterInterface';
import {MetadataKey, SocketDefinition} from '../Model';
import {Container, Metadata} from '../Utility';
import chalk from 'chalk';

export class SocketIOAdapter implements AdapterInterface {
  protected container: Container;

  protected io;

  public configure(cb: (container: Container) => void) {
    cb(this.container);
  }

  public register(app: object, container: Container) {
    const port = Metadata.get<string>(app, MetadataKey.Port);

    this.container = container;

    if (!this.container.has('http_server')) {
      this.container.set('http_server', require('http').createServer().listen(port));
    }

    this.io = require('socket.io')(this.container.get('http_server'));

    this.container.set('io', this.io);

    this.registerSockets(app);
  }

  private registerSockets(app: object) {
    const appName    = Metadata.get<string>(app, MetadataKey.Name);
    const routes     = Metadata.get<Array<SocketDefinition>>(app, MetadataKey.SocketIORoutes);
    const middleware = Metadata.get<Map<string, (socket) => void>>(app, MetadataKey.Middleware);
    const instance   = this.container.get(appName);

    routes.forEach(socket => {
      const s = this.io.of(socket.namespace);
      s.on(socket.event, sock => {
        const callbacks = middleware.get(socket.methodName);
        if (Array.isArray(callbacks)) {
          // tslint:disable-next-line
          console.error(chalk.red.bold('Error: Middleware is not supported for sockets yet.'));
        }

        instance[socket.methodName](sock);
      });
    });
  }
}
