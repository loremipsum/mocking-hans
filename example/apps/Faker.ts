import {Get, App} from '@loremipsum/mocking-hans/decorators';
import {JsonResponse} from '@loremipsum/mocking-hans';
import * as faker from 'faker';

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
}
