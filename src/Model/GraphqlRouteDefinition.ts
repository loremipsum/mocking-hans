export interface GraphqlRouteDefinition {
  // Path to our route
  path: string;
  // Graphql schema
  schema: string;
  // Method name within our class responsible for this route
  methodName: string;
}
