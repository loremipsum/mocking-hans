import {Container} from '../../src/Utility';
import {GraphqlAdapter} from '../../src/Adapter';
import {App, Graphql} from '../../src/Decorator';
import {when} from 'jest-when';

jest.mock('../../src/Utility/Container');

describe('GraphlqlAdapter', () => {
  test('register without express', () => {
    @App({
      name: 'test',
      port: 1337
    })
    class TestApp {
      @Graphql('/', ``)
      foo() {
      }
    }

    const container: jest.Mocked<Container> = new Container() as any;
    container.has.mockReturnValue(false);

    const graphqlAdapter = new GraphqlAdapter();
    expect(() => graphqlAdapter.register(TestApp, container)).toThrow(Error);
  });

  test('register with express', () => {
    @App({
      name: 'test',
      port: 1337
    })
    class TestApp {
      @Graphql('/', `type Query { hello: String }`)
      foo() {
      }
    }

    const container: jest.Mocked<Container> = new Container() as any;
    container.has.mockReturnValue(true);
    when(container.get).calledWith('express_app').mockReturnValue({
      use: () => {
      }
    });
    when(container.get).calledWith('test').mockReturnValue({
      foo: () => {
      }
    });

    const graphqlAdapter = new GraphqlAdapter();
    graphqlAdapter.register(TestApp, container);
    expect(container.get).toBeCalled();
  });

  test('configure', () => {
    const graphqlAdapter = new GraphqlAdapter();
    const cb             = jest.fn(() => {
    });
    graphqlAdapter.configure(cb);
    expect(cb).toBeCalled();
  });
});
