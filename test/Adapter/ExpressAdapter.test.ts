import {Container} from '../../src/Utility';
import {ExpressAdapter} from '../../src/Adapter';
import {App, Get} from '../../src/Decorator';
import * as http from 'http';
import {when} from 'jest-when';
import {JsonResponse} from "../../src/Response";

jest.mock('../../src/Utility/Container');

describe('ExpressAdapter', () => {
  test('register', () => {
    @App({
      name: 'test',
      port: 1337
    })
    class TestApp {
      @Get('/bar')
      foo() {
      }
    }

    const response = {status: jest.fn(), set: jest.fn(), send: jest.fn()};
    const jsonResponse = new JsonResponse('content', 201, ['CustomHeader']);

    const container: jest.Mocked<Container> = new Container() as any;
    container.has.mockReturnValue(false);
    when(container.get).calledWith('test').mockReturnValue({
      foo: (req, res, next) => {
        expect(req).toBe('request');
        expect(res).toBe(response);
        expect(next).toBe('next');
        return jsonResponse;
      }
    });
    when(container.get).calledWith('express_app').mockReturnValue({
      get: (path, cb) => {
        expect(path).toBe('/bar');
        cb('request', response, 'next');
      }
    });

    const expressAdapter = new ExpressAdapter();
    const server = expressAdapter.register(TestApp, container);

    expect(server).toBeInstanceOf(http.Server);
    expect(container.set).toBeCalled();
    expect(response.status).toBeCalledWith(201);
    expect(response.set).toBeCalledWith(["CustomHeader", "Content-Type: application/json"]);
    expect(response.send).toBeCalledWith('content');

    server.close();
  });

  test('configure', () => {
    const expressAdapter = new ExpressAdapter();
    const cb = jest.fn(() => {
    });
    expressAdapter.configure(cb);
    expect(cb).toBeCalled();
  })
});
