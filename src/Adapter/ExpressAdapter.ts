import {AdapterInterface} from './AdapterInterface';
import {Container, Metadata, Type} from '../Utility';
import {MetadataKey, RouteDefinition} from '../Model';
import {FileResponse, Response} from '../Response';
import chalk from 'chalk';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import {RequestHandler} from 'express-serve-static-core';
import * as path from 'path';

export class ExpressAdapter implements AdapterInterface {
  protected express: express.Application;

  protected container: Container;

  public constructor() {
    this.express = express();
  }

  public register(app: Type<object>, container: Container) {
    this.container = container;
    this.container.set('express_app', this.express);

    this.express.use(express.static(Metadata.get<string>(app, MetadataKey.PublicDirectory)));
    this.express.use(bodyParser.json());
    this.express.use('/robots.txt', (req, res, next) => next());
    this.express.use('/favicon.ico', (req, res, next) => next());

    this.applyLogger(app);
    this.registerRoutes(app);

    let server = this.container.get('http_server');
    if (!server) {
      server = this.express.listen(Metadata.get<string>(app, MetadataKey.Port));
      this.container.set('http_server', server);
    }

    return server;
  }

  public configure(cb: (container: Container) => void) {
    cb(this.container);
  }

  private registerRoutes(app) {
    const appName    = Metadata.get<string>(app, MetadataKey.Name);
    const routes     = Metadata.get<Array<RouteDefinition>>(app, MetadataKey.Routes, []);
    const middleware = Metadata.get<Map<string, RequestHandler>>(app, MetadataKey.Middleware, new Map());
    const instance   = this.container.get(appName);
    const expressApp = this.container.get('express_app');

    const appMiddleware = Metadata.get<Array<RequestHandler>>(app, MetadataKey.AppMiddleware, []);
    appMiddleware.forEach(callback => expressApp.use(callback));

    routes.forEach(route => {
      const callbacks = middleware.get(route.methodName);
      if (Array.isArray(callbacks)) {
        callbacks.forEach(callback => expressApp.use(route.path, callback));
      }

      expressApp[route.requestMethod]
      (route.path, (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const cb = instance[route.methodName](req, res, next);
        return this.handleResponse(res, cb, Metadata.get<string>(app, MetadataKey.PublicDirectory));
      });
    });
  }

  private handleResponse(res: express.Response, cb, publicDirectory?: string) {
    if (!(cb instanceof Response)) {
      return cb;
    }

    res.status(cb.getStatusCode());
    res.set(cb.getHeaders());

    if (cb instanceof FileResponse) {
      return res.sendFile(path.join(publicDirectory, cb.getFilename()));
    }

    return res.send(cb.getContent());
  }

  private applyLogger(app) {
    const name = Metadata.get<string>(app, MetadataKey.Name);
    const port = Metadata.get<string>(app, MetadataKey.Port);

    this.express.use(morgan((tokens, req, res) => {
      const status = tokens.status(req, res);

      if (!status) {
        return;
      }

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
