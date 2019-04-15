import 'reflect-metadata';
import {MetadataKey} from './Model';
import {Metadata, State, Type} from './Utility';
import chalk from 'chalk';
import * as url from 'url';
import {AdapterInterface} from './Adapter';
import {Container} from './Utility/Container';

// Let's be honest here: I've always wanted to name a class "Hans".
export class Hans {
  private appInstances: Map<string, object> = new Map<string, object>();

  /**
   * Hans-wide state, shared across all applications; will be injected to application constructors as first argument.
   */
  private state: State = new State();

  constructor(protected apps: Array<{ new(...args: any[]) }>) {
  }

  public async bootstrap() {
    if (this.apps.length === 0) {
      // tslint:disable-next-line
      console.error('Nothing to mock. Farewell, friend.');
    }

    this.apps.forEach((app) => {
      const port          = Metadata.get<string>(app, MetadataKey.Port);
      const name          = Metadata.get<string>(app, MetadataKey.Name);
      const adapter       = Metadata.get<Array<Type<AdapterInterface>>>(app, MetadataKey.Adapter);
      const configuration = Metadata.get<() => void>(app, MetadataKey.Configuration);
      const container     = new Container();

      container.set(name, this.getAppInstance(app));

      adapter.forEach(adapter => {
        const adapterInstance = new adapter();
        adapterInstance.register(app, container);
        adapterInstance.configure(configuration);
      });

      // tslint:disable-next-line
      console.info(`\t✔️  Started ${chalk.underline(name)} on localhost:${chalk.bold(port)}`);

      // const expressApp: express.Application = express();
      // expressApp.use(express.static(options.publicDirectory));
      // expressApp.use(bodyParser.json());
      //
      // this.applyLogger(expressApp, name, port);
      //
      // const server = require('http').Server(expressApp);
      // server.listen(port, () => {
      // });
      // const io = require('socket.io')(server);
      // this.registerSockets(app, io);
      // this.registerWebsockets(app, server);
      // this.registerRoutes(app, expressApp, io);
    });
  }

  // private registerWebsockets(app, server) {
  //   const sockets  = Reflect.getMetadata(Metadata.NativeSocketRoutes, app) as Array<SocketDefinition>;
  //   const port     = Reflect.getMetadata(Metadata.Port, app);
  //   const name     = Reflect.getMetadata(Metadata.Name, app);
  //   const instance = this.getAppInstance(app);
  //
  //   sockets.forEach(websocket => {
  //     const wss = new WebSocket.Server({
  //       noServer: true,
  //       perMessageDeflate: false,
  //     });
  //
  //     wss.on(websocket.event, function (ws) {
  //       instance[websocket.methodName](ws);
  //     });
  //
  //     server.on('upgrade', function (request, socket, head) {
  //       if (url.parse(request.url).pathname !== websocket.namespace) {
  //         return;
  //       }
  //       // tslint:disable-next-line
  //       console.info(`${chalk.underline(name)} (:${port}): ` + [
  //         'WS',
  //         chalk.bold(websocket.event),
  //         websocket.namespace,
  //       ].join(' '));
  //       wss.handleUpgrade(request, socket, head, function done(ws) {
  //         wss.emit(websocket.event, ws, request);
  //       });
  //     });
  //   });
  // }
  //

  private getAppInstance(app: { new(...args: any[]) }) {
    const name = Reflect.getMetadata(MetadataKey.Name, app);

    if (!this.appInstances.has(name)) {
      this.appInstances.set(name, new app(this.state));
    }

    return this.appInstances.get(name);
  }
}
