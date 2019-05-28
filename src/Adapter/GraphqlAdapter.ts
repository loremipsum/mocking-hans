import {AdapterInterface} from './';
import {Container, Metadata} from '../Utility';
import {MetadataKey, GraphqlRouteDefinition} from '../Model';
import {RequestHandler} from 'express-serve-static-core';
import {buildSchema} from 'graphql';
import * as graphqlHTTP from 'express-graphql';

export class GraphqlAdapter implements AdapterInterface {
  protected container: Container;

  public configure(cb: (container: Container) => void) {
    cb(this.container);
  }

  public register(app: object, container: Container) {
    this.container = container;

    if (!this.container.has('express_app')) {
      throw new Error('express_app not found');
    }

    this.registerRoutes(app);
  }

  private registerRoutes(app) {
    const appName    = Metadata.get<string>(app, MetadataKey.Name);
    const routes     = Metadata.get<Array<GraphqlRouteDefinition>>(app, MetadataKey.GraphqlRoutes, []);
    const middleware = Metadata.get<Map<string, RequestHandler>>(app, MetadataKey.Middleware, new Map());
    const instance   = this.container.get(appName);
    const expressApp = this.container.get('express_app');

    routes.forEach(route => {
      const callbacks = middleware.get(route.methodName);
      if (Array.isArray(callbacks)) {
        callbacks.forEach(callback => expressApp.use(route.path, callback));
      }

      expressApp.use(route.path, graphqlHTTP({
        schema: buildSchema(route.schema),
        rootValue: instance[route.methodName](),
        graphiql: true,
      }));
    });
  }
}
