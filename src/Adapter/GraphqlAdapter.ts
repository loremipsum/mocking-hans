import {AdapterInterface} from './AdapterInterface';
import {Container} from '../Utility/Container';
import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import {buildSchema} from 'graphql';
import {Metadata} from "../Utility";
import {MetadataKey, GraphqlRouteDefinition} from "../Model";
import {RequestHandler} from "express-serve-static-core";

export class GraphqlAdapter implements AdapterInterface {
  protected container: Container;

  protected express: express.Application;

  public configure(cb: (container: Container) => void) {
    cb(this.container);
  }

  public register(app: object, container: Container) {
    this.container = container;

    if (!this.container.has('express_app')) {
      throw new Error("no express app");
    }
    this.express = this.container.get('express_app') as express.Application;

    this.registerRoutes(app);
  }

  private registerRoutes(app) {
    const appName    = Metadata.get<string>(app, MetadataKey.Name);
    const routes     = Metadata.get<Array<GraphqlRouteDefinition>>(app, MetadataKey.GraphqlRoutes);
    const middleware = Metadata.get<Map<string, RequestHandler>>(app, MetadataKey.Middleware, new Map());
    const instance   = this.container.get(appName);

    routes.forEach(route => {
      const callbacks = middleware.get(route.methodName);
      if (Array.isArray(callbacks)) {
        callbacks.forEach(callback => this.express.use(route.path, callback));
      }

      this.express.use(route.path, graphqlHTTP({
        schema: buildSchema(route.schema),
        rootValue: instance[route.methodName](),
        graphiql: true,
      }));
    });
  }
}
