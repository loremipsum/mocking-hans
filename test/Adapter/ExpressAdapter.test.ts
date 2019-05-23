import {Container} from '../../src/Utility';
import {ExpressAdapter} from '../../src/Adapter';
import {App, Get} from '../../src/Decorator';
import * as http from 'http';
import {when} from 'jest-when';

jest.mock('../../src/Utility/Container');

describe('ExpressAdapter', () => {
  test('register', () => {
    @App({
      name: 'test',
      port: 1337
    })
    class TestApp {
      @Get('/')
      foo() {
      }
    }

    const container: jest.Mocked<Container> = new Container() as any;
    container.has.mockReturnValue(false);
    when(container.get).calledWith('express_app').mockReturnValue({
      get: () => {
      }
    });

    const expressAdapter = new ExpressAdapter();
    const server         = expressAdapter.register(TestApp, container);

    expect(server).toBeInstanceOf(http.Server);
    expect(container.set).toBeCalled();

    server.close();
  });

  test('configure', () => {
    const expressAdapter = new ExpressAdapter();
    const cb             = jest.fn(() => {
    });
    expressAdapter.configure(cb);
    expect(cb).toBeCalled();
  })
});
