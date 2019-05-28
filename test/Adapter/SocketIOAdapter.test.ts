import {when} from 'jest-when';
import {Container} from '../../src/Utility';
import {SocketIOAdapter} from '../../src/Adapter';
import {App, Socket} from '../../src/Decorator';

jest.mock('../../src/Utility/Container');

describe('SocketIOAdapter', () => {
  test('register', () => {
    @App({
      name: 'test',
      port: 1337
    })
    class TestApp {
      @Socket('/')
      foo() {
      }

      @Socket('/bar')
      bar() {
      }
    }

    const container: jest.Mocked<Container> = new Container() as any;
    container.has.mockReturnValue(true);

    const expressAdapter = new SocketIOAdapter();
    expressAdapter.register(TestApp, container);

    expect(container.set).toHaveBeenCalledWith('io', expect.any(Object));
  });

  test('configure', () => {
    const graphqlAdapter = new SocketIOAdapter();
    const cb             = jest.fn(() => {
    });
    graphqlAdapter.configure(cb);
    expect(cb).toBeCalled();
  });
});
