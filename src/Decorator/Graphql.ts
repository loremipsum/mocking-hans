import 'reflect-metadata';
import {MetadataKey, GraphqlRouteDefinition} from '../Model';
import {Metadata, Type} from '../Utility';
import {AdapterInterface, ExpressAdapter, GraphqlAdapter} from '../Adapter';

export const Graphql = (path: string, schema: string): MethodDecorator => {
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  return (target: object, propertyKey: string): void => {
    const adapter = Metadata.get<Array<Type<AdapterInterface>>>(target.constructor, MetadataKey.Adapter, []);
    const routes = Metadata.get<Array<GraphqlRouteDefinition>>(target.constructor, MetadataKey.GraphqlRoutes, []);

    if (!adapter.find(e => e === ExpressAdapter)) {
      adapter.push(ExpressAdapter);
    }
    if (!adapter.find(e => e === GraphqlAdapter)) {
      adapter.push(GraphqlAdapter);
    }

    routes.push({
      path,
      schema,
      methodName: propertyKey,
    });

    Metadata.set(target.constructor, MetadataKey.Adapter, adapter);
    Metadata.set(target.constructor, MetadataKey.GraphqlRoutes, routes);
  };
};
