import {AdapterInterface} from './AdapterInterface';
import {Container} from '../Utility/Container';
import {Metadata, Type} from '../Utility';
import {MetadataKey, RouteDefinition} from '../Model';
import {Response} from '../Response';
import chalk from 'chalk';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import {RequestHandler} from 'express-serve-static-core';

export class ExpressAdapter implements AdapterInterface {
  protected express: express.Application;

  protected container: Container;

  public constructor() {
    this.express = express();
  }

  public register(app: Type<object>, container: Container) {
    this.container = container;
    this.container.set('express_app', this.express);

    this.express.use(bodyParser.json());
    this.express.use('/robots.txt', (req, res, next) => next());
    this.express.use('/favicon.ico', (req, res, next) => next());

    this.applyLogger(app);
    this.registerRoutes(app);

    if (!this.container.has('http_server')) {
      const server = this.express.listen(Metadata.get<string>(app, MetadataKey.Port));
      this.container.set('http_server', server);
    }
  }

  public configure(cb: (container: Container) => void) {
    cb(this.container);
  }

  private registerRoutes(app) {
    const appName    = Metadata.get<string>(app, MetadataKey.Name);
    const routes     = Metadata.get<Array<RouteDefinition>>(app, MetadataKey.Routes);
    const middleware = Metadata.get<Map<string, RequestHandler>>(app, MetadataKey.Middleware, new Map());
    const instance   = this.container.get(appName);

    const appMiddleware = Metadata.get<Array<RequestHandler>>(app, MetadataKey.AppMiddleware, []);
    appMiddleware.forEach(callback => this.express.use(callback));

    routes.forEach(route => {
      const callbacks = middleware.get(route.methodName);
      if (Array.isArray(callbacks)) {
        callbacks.forEach(callback => this.express.use(route.path, callback));
      }

      this.express[route.requestMethod]
      (route.path, (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const cb = instance[route.methodName](req, res, next);
        return this.handleResponse(res, cb);
      });
    });
  }

  private handleResponse(res, cb) {
    if (!(cb instanceof Response)) {
      return cb;
    }

    res.status(cb.getStatusCode());
    res.set(cb.getHeaders());

    return res.send(cb.getContent());
  }

  private applyLogger(app) {
    const name = Metadata.get<string>(app, MetadataKey.Name);
    const port = Metadata.get<string>(app, MetadataKey.Port);

    this.express.use(morgan((tokens, req, res) => {
      const status = tokens.status(req, res);

      return `${chalk.underline(name)} (:${port}): ` + [
        tokens.method(req, res),
        tokens.url(req, res),
        status.toString().charAt(0) === '4' ? chalk.red.bold(status) : chalk.bold(status),
        tokens['response-time'](req, res),
        'ms',
      ].join(' ');
    }));
  }
}
