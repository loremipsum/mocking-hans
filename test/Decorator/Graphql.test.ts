import {Graphql} from '../../src/Decorator';
import {Metadata} from '../../src/Utility';
import {MetadataKey} from '../../src/Model';
import {ExpressAdapter, GraphqlAdapter} from '../../src/Adapter';

describe("@Graphql class decorator", () => {
  test('set metadata', () => {
    class App {
      @Graphql('graphql', `
        type Query {
          hello: String
        }
      `)
      foo() {}
    }

    expect(Metadata.get(App, MetadataKey.Adapter)).toEqual([ExpressAdapter, GraphqlAdapter]);
    expect(Metadata.get(App, MetadataKey.GraphqlRoutes)).toEqual([{
      path: '/graphql',
      schema: `
        type Query {
          hello: String
        }
      `,
      methodName: 'foo'
    }]);
  });
});
