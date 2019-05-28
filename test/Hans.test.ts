import {App, Get, Hans} from '../src';

describe("Hans", () => {
  test('bootstrap', async () => {
    @App({
      name: 'test',
      port: 1337,
      configure: container => container.get('http_server').close()
    })
    class TestApp {
      @Get('/')
      foo() {
      }
    }

    const hans = new Hans([TestApp]);
    hans.bootstrap().then((instances: Map<string, any>) => {
      expect(instances).toBeInstanceOf(Map);
      expect(instances.size).toBe(1);
      expect(instances.get('test')).toBeInstanceOf(TestApp);
    })
  });

  test('bootstrap without apps', async () => {
    const hans = new Hans([]);
    hans.bootstrap().then((instances: Map<string, any>) => {
      expect(instances).toBeInstanceOf(Map);
      expect(instances.size).toBe(0);
    })
  });
});
