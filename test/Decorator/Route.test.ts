import {Delete, Get, Post, Put} from '../../src/Decorator';
import {Metadata} from '../../src/Utility';
import {HttpMethod, MetadataKey, RouteDefinition} from '../../src/Model';
import {ExpressAdapter} from '../../src/Adapter';

describe("Route decorators (@Get, @Post, @Delete, @Put)", () => {
  test('set metadata', () => {
    class App {
      @Get('getPath')
      getMethod() {}

      @Post('postPath')
      postMethod() {}

      @Delete('deletePath')
      deleteMethod() {}

      @Put('putPath')
      putMethod() {}
    }

    const routes = Metadata.get<Array<RouteDefinition>>(App, MetadataKey.Routes);
    expect(routes).toEqual([
      {
        path: '/getPath',
        requestMethod: HttpMethod.GET,
        methodName: 'getMethod'
      },
      {
        path: '/postPath',
        requestMethod: HttpMethod.POST,
        methodName: 'postMethod'
      },
      {
        path: '/deletePath',
        requestMethod: HttpMethod.DELETE,
        methodName: 'deleteMethod'
      },
      {
        path: '/putPath',
        requestMethod: HttpMethod.PUT,
        methodName: 'putMethod'
      },
    ]);

    expect(Metadata.get(App, MetadataKey.Adapter)).toEqual([ExpressAdapter]);
  });
});
