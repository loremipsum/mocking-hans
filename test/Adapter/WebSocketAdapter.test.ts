import {Container} from '../../src/Utility';
import {WebsocketAdapter} from '../../src/Adapter';
import {App, Websocket} from '../../src/Decorator';
import {when} from 'jest-when';

jest.mock('../../src/Utility/Container');

describe('WebSocketAdapter', () => {
  test('register', () => {
    @App({
      name: 'test',
      port: 1337
    })
    class TestApp {
      @Websocket('/')
      foo() {
      }
    }

    const container: jest.Mocked<Container> = new Container() as any;
    container.has.mockReturnValue(true);
    when(container.get).calledWith('http_server').mockReturnValue({
      on: () => {
      }
    });

    const webSocketAdapter = new WebsocketAdapter();
    webSocketAdapter.register(TestApp, container);
  });

  test('configure', () => {
    const graphqlAdapter = new WebsocketAdapter();
    const cb             = jest.fn(() => {
    });
    graphqlAdapter.configure(cb);
    expect(cb).toBeCalled();
  });
});
