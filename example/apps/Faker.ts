import {Get, App} from '@loremipsum/mocking-hans/decorators';
import {JsonResponse} from '@loremipsum/mocking-hans';
import * as faker from 'faker';
import {Helper} from '@loremipsum/mocking-hans/utility';

@App({
  name: 'faker',
  port: 65500
})
export class Faker {
  @Get('/person')
  public person() {
    return new JsonResponse({
      name: faker.name.findName(),
      dateOfBirth: faker.date.past(50),
      address: faker.address.streetAddress(),
      username: faker.internet.userName(),
      email: faker.internet.email()
    });
  }

  @Get('random')
  public randomArrayElement() {
    return new JsonResponse({
      fromArray: faker.helpers.randomize(['foo', 'bar', 'whatever']),
      fromObject: faker.helpers.randomize([{elem: 1}, {elem: 2}, {elem: 3}]),
      shuffle: faker.helpers.shuffle([1, 2, 3, 4, 5]),
      uuid: faker.random.uuid(),
      sentence: faker.fake('{{name.firstName}} says: {{random.words}}'),
      lorem: faker.lorem.words(5),
    });
  }

  @Get('/date')
  public date() {
    return new JsonResponse({
      past: faker.date.past(),
      soon: faker.date.future(0.1, new Date()),
      between: faker.date.between(faker.date.past(), new Date()),
    });
  }

  @Get('/probability')
  public probability() {
    const elements = [{
      element: 'foo',
      probability: 0.2
    }, {
      element: 'bar',
      probability: 0.7
    }, {
      element: 'lorem',
      probability: 0.1
    }];

    const distribution = { 'foo': 0, 'bar': 0, 'lorem': 0 };
    for(let i = 1; i <= 1000; i++) {
      const e = Helper.getRandomElementByProbability(elements);
      distribution[e.element]++;
    }

    return new JsonResponse({
      elements,
      current: Helper.getRandomElementByProbability(elements),
      distributionFor1k: distribution
    });
  }
}
