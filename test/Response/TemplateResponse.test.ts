import {TemplateResponse} from '../../src/Response';

describe("TemplateResponse", () => {
  test("getters with string input", () => {
    const response = new TemplateResponse('Test %var1% %var2%.', {
      var1: 'Foo',
      var2: 'Bar'
    }, 400);

    expect(response.getContent()).toEqual('Test Foo Bar.');
    expect(response.getStatusCode()).toEqual(400);
  });

  test("getters with object input", () => {
    const response = new TemplateResponse({'foo': '%var1%', 'bar': '%var2%'}, {
      var1: 'bar',
      var2: 'foo'
    });

    expect(response.getContent()).toEqual({foo:'bar',bar:'foo'});
  })
});
