import {Graphql} from '../../src/Decorator';
import {Metadata} from '../../src/Utility';
import {MetadataKey} from '../../src/Model';
import {ExpressAdapter, GraphqlAdapter} from '../../src/Adapter';

describe("@Graphql class decorator", () => {
  test('set metadata', () => {
    class App {
      @Graphql('graphqlfoo', `
        type Query {
          hello: String
        }
      `)
      foo() {}

      @Graphql('graphqlbar', ``)
      bar() {}
    }

    expect(Metadata.get(App, MetadataKey.Adapter)).toEqual([ExpressAdapter, GraphqlAdapter]);
    expect(Metadata.get(App, MetadataKey.GraphqlRoutes)).toEqual([{
      path: '/graphqlfoo',
      schema: `
        type Query {
          hello: String
        }
      `,
      methodName: 'foo'
    }, {
      path: '/graphqlbar',
      schema: ``,
      methodName: 'bar'
    }]);
  });
});
