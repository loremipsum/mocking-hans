# Mocking Hans

[![npm version](https://badge.fury.io/js/%40loremipsum%2Fmocking-hans.svg)](https://badge.fury.io/js/%40loremipsum%2Fmocking-hans)
[![Build Status](https://travis-ci.org/loremipsum/mocking-hans.svg?branch=master)](https://travis-ci.org/loremipsum/mocking-hans)
[![Coverage Status](https://coveralls.io/repos/github/loremipsum/mocking-hans/badge.svg?branch=master)](https://coveralls.io/github/loremipsum/mocking-hans?branch=master)

> You don't mock the Hans, he's mocking you.

## Features

- Multi-port/app API mocking
- Express, Socket.io and native WebSocket support
- Local and app-shared global state
- Middleware support (for faking authentication, ...)
- Common Response objects
- [Faker](https://github.com/marak/Faker.js/) integration

## Installation

1. Install Hans via npm/yarn `npm i @loremipsum/mocking-hans` / `yarn add @loremipsum/mocking-hans`

2. Create your APIs (recommended in an `apps/` directory):

```typescript
// apps/Example.ts

import {Get, App, Response} from '@loremipsum/mocking-hans';

@App({
  name: 'example',
  port: 4999,
})
export class Example {
  /**
   * A simple text response
   */
  @Get('/')
  index() {
    return new Response('Hello there!');
  }
}
```

3. Hans can be started with either `./node_modules/.bin/hans apps` or add to your `scripts` section in your `package.json`:

```json
"scripts": {
  "hans": "hans apps"
}
```

> It's recommended to install the [ts-node-dev](https://www.npmjs.com/package/ts-node-dev) package which automatically 
  reloads Hans on changes. Install the package and extend your change your hans script to:

```json
"scripts": {
  "start": "ts-node-dev ./node_modules/.bin/hans apps --disable-compilation"
}
```

_Note:_ The `--disable-compilation` flag is required when using custom compilation like via `ts-node-dev`.

4. Create a `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es6",
    "moduleResolution": "node",
    "types": [
      "node",
      "ws"
    ],
    "experimentalDecorators": true
  }
}
```

5. **Done**!

### Application coupling

Due to its packaged nature it's possible to ship Hans directly within the application (and its corresponding repository) 
consuming the API. This could additionally be useful for running functional testing within a CI environment.

To make use of this simply follow the instructions above within the repository of your application _and_ install 
Hans with the `--save-dev` (for npm) / `--dev` (for yarn) 
flag. The additional flags prevents Hans from being shipped in production.

> Keep in mind that running Hans this way requires you to pass the `--project <tsconfig path>.json` flag when starting 
Hans to ensure the proper tsconfig to be used.

In case of an Angular application consuming the Twitter API your structure might look like this:

```
src/
  // your angular application 
api-mock/
  Twitter.ts    <- Mocked Twitter API
  tsconfig.json <- tsconfig for Hans
.gitignore
README.md
package.json
```

## Usage

Basically all features covered by Hans are implemented as an example within the `examples` directory. To run this 
examples simply clone this repository, install the dependencies and run `npm run example`.

### Apps

Apps represent a *single* API. For example, if you'd like to mock the Facebook and Twitter API you'd create two 
different applications.

#### Implementing Apps

Apps **must** be decorated with the `@App` decorator:

```typescript
@App({
  name: 'twitter',
  port: 61000
})
export class Twitter {
  @Get("/1.1/search/tweets.json")
  getTweets() {
    return new JsonResponse({
      "statuses": [
        {
          "created_at": "Sun Feb 25 18:11:01 +0000 2018",
          "id": 967824267948773377,
          "id_str": "967824267948773377",
          "text": "From pilot to astronaut, Robert H. Lawrence was the first African-American to be selected as an astronaut by any na… https://t.co/FjPEWnh804",
          "truncated": true
        }
      ]
    })
  }
}
```

When manually creating the Hans instance apps needs to be registered to Hans; registered apps are passed to Hans when 
instantiating the class, e.g.:

```typescript
(new Hans([Twitter])).bootstrap().then(() => {
  console.log(chalk.blue(chalk.bold('\nAre you ready to ... MOCK?\n')));
});
```

Starting Hans will now result in:

```
> npm start

    ✔ Started twitter on localhost:61000
```

The `@App` options are:

- `name` (string): Application name
- `port` (string): Application port
- `middleware` (Array<string>): Used middleware (**only works for http routes!**)
- `publicDirectory` (string): Path to the public directory of this application (defaults to `public`)
- `configure`: Callback (`(container) => void`) for configuring the application

#### Implementing interfaces

Even though your app is loaded, it doesn't expose any interfaces yet. Interfaces are 
represented as single methods and need to be decorated with a proper decorator which represents the request 
method (`@Get`, `@Post`, `@Put` or `@Delete`). In 
case of our Twitter app you may be going for an implementation like:

```typescript
@App({
  name: 'twitter',
  port: 61000
})
export class Twitter {
  @Get("/1.1/search/tweets.json")
  getTweets() {
    return new JsonResponse({
      "statuses": [
        {
          "created_at": "Sun Feb 25 18:11:01 +0000 2018",
          "id": 967824267948773377,
          "id_str": "967824267948773377",
          "text": "From pilot to astronaut, Robert H. Lawrence was the first African-American to be selected as an astronaut by any na… https://t.co/FjPEWnh804",
          "truncated": true,
          // even more fields
        }
      ]
    })
  }
}
```

Going to `http://localhost:61000/1.1/search/tweets.json` will now return valid JSON containing
the given tweet.

#### Sockets with socket.io

Every app is started alongside a socket server. Socket interfaces are implemented the same way 
as HTTP routes, but with the `@Socket` decorator:

```typescript
@Socket('connection')
onConnect() {
  console.log(`Someone connected to Example.`);
}
```

The `@Socket` decorator accepts two parameters:

1. The event (in this case `connection`)
2. The namespace (by default `/`)

Using sockets on your client requires the `socket.io-client` library to be installed.

```html
<script src="node_modules/socket.io-client/dist/socket.io.js"></script>
<script>
  let socket = io.connect('http://localhost:61000');

  socket.on('news', data => {
    console.log(data);
  });
</script>
```

See `client-socketio.html` for a more detailed example.

#### WebSockets

WebSocket interfaces are implemented much like Sockets, but with the `@Websocket` decorator:

```typescript
@Websocket('connection')
onConnect() {
  console.log(`Someone connected to / via Websocket.`);
}
```

The `@Websocket` decorator accepts two parameters:

1. The event (in this case `connection`)
2. The topic or path (by default `/`)

See `client-websocket.html` for an example of a client using the WebSocket API.

#### Configuration

The `@App` decorator makes it possible to configure your app on its lowest level; think of using custom middleware for
Express.

```typescript
@App({
  name: 'example',
  port: 4999,
  configure: container => {
    const express = container.get('express_app');
    express.use(/** your middleware **/);
  }
})
```

The `Container` does keep track of all applications and adapters (e.g. Express, SocketIO, ...):

- `Container.get('http_server')`: the used HTTP server for this application
- `Container.get('express_app')'`: the express instance for this application
- `Container.get('io')`: the io instance for this application

### API

#### `@Get`, `@Post`, `@Put` and `@Delete`

These decorators expose a method as an interface through the desired request method. Methods decorated with one of these 
do have access to the following params:

1. `req` - The request object ([reference](http://expressjs.com/de/api.html#req))
2. `res` - The response object ([reference](http://expressjs.com/de/api.html#res))
3. `next` - A function which tells the server to continue handling routes (see Troubleshooting).
4. `io` - The Socket.IO object ([reference](https://socket.io/docs/server-api/))

An example of these params can be found within the example app:

```typescript
@Get("/broadcast")
broadcast(req, res, next, io) {
  io.emit('news', {message: req.query.message, time: +(new Date())});
  return new JsonResponse({success: 1});
}
```

Sending a HTTP GET to `/broadcast?message=foobar` emits the message `foobar` to all connected sockets.

#### Responses

For convenience Hans provides several `Response` objects:

##### - `JsonResponse`

JSON formatted response.

```typescript
return new JsonResponse({
  message: 'foo'
});

// Outputs:
// {
//   message: 'foo'
// }
```

##### - `XmlFromJsonResponse`

XML formatted response based on JSON.

```typescript
return new XmlFromJsonResponse({
  message: 'foo'
});

// Outputs:
// <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
// <message>foo</message>
```

##### - `Response`

Basic text response. Additionally parent to all response objects.

```typescript
return new Response('Hello there');

// Outputs:
// Hello there
```

##### - `FileResponse`

Response from file.

```typescript
return new FileResponse('filename.ext');

// Outputs the given file
```

> Files are served from your public directory which must be specified when bootstraping Hans:

```typescript
(new Hans(apps)).bootstrap({ publicDirectory: 'public' })
```

##### - `TemplateResponse`

Response from placeholders. Content can be either a `string` or a `json` file (via `require`).

```typescript
return new TemplateResponse('hello %name%', { name: 'John' });

// Outputs:
// Hello John
```

##### Response settings

All `Response` objects do allow setting the status code and/or headers via the constructor:

```typescript
return new JsonResponse({ error: 'nope' }, 400);
```

### Middleware

Hans allows the usage of *middleware*, which is executed before an API (or an entire app) is called. An example 
would be pseudo-authentication where the API would require proper authorizations headers:

```typescript
export function IsAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!req.headers.authorization) {
    return res.status(403).json({error: 'You are not logged in!'});
  }
  next();
}
```

This middleware can be applied to a method by:

```typescript
@Get('/authenticated')
@Middleware([IsAuthenticated])
authenticated() {
  return new JsonResponse({
    message: 'Hello there'
  });
}
```

Or to the entire application by passing it to the `@App` options:

```typescript
@App({
  name: 'example',
  port: 4999,
  middleware: [IsAuthenticated]
})
```

Trying to access your application will now most likely return an error due to not having proper headers set. If accessed
via

```bash
curl -H "Authorization: Token abcd" http://localhost:4999/authenticated 
``` 

the API will return a friendly _"Hello there"_.

Since middlewares are passed as an array it's possible to attach as many middlewares per app or method as you'd like to. 
Execution order is based on the order in the array.

> **Important:** Middleware does ___not___ evaluate `Response` objects, meaning it's __your__ responsibility to take care 
of sending a response. This can either be done by calling either `return res.send(your response)` or `next()`. Sending a 
response yourself will prevent further actions while `next` simply continues the request. Neither calling 
`res.send` nor `next` will result in a stuck request!

### State

Hans does implement a _very_ simple basic state (which is basically just a `Map`). There's two different states 
which can be useful for you:

#### Application / local state

The application or local state can simply be implemented with class properties:

```typescript
export class Example {
  private localState: State = new State();
  
  @Get('/state')
  stateExample() {
    let counter = this.localState.get('counter', 0);

    this.localState.set('counter', counter + 1);

    return new JsonResponse({
      localState: this.localState.get('counter'),
    });
  }
}
```

This state will persevere throughout all requests as long as Hans is not restarted .

#### Hans-wide state

Additionally to the local state Hans implements its own state which is available across _all_ registered applications. 
This state is automatically injected into every applications constructor first argument:

```typescript
export class Example {
  constructor(private globalState: State) {
  }
    
  @Get('/state')
  stateExample() {
    let globalCounter = this.globalState.get('counter', 0);
    
    this.globalState.set('counter', globalCounter + 1);

    return new JsonResponse({
      globalState: this.globalState.get('counter')
    });
  }
}
```

This state will persevere throughout all requests as long as Hans is not restarted and is shared across all applications.

### Faker and Utility

Hans integrates [Faker](https://github.com/marak/Faker.js/) by default, providing useful methods for generating fake
data.

Additionally there's a custom utility helper for biased random elements based on a given probability:

```typescript
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

const e = Helper.getRandomElementByProbability(elements);
// 70% chance for 'bar', 20% chance for 'foo', 10% chance for 'lorem'
```

## Troubleshooting 

### Responses take forever

For API methods: most likely you've forgotten to wrap your response in a `Response` object. To prevent stuck requests 

- return a `Response` object
- call `res.send` by yourself
- call `next()` by yourself

The same also applies for middleware __but__ keep in mind that middleware does not support `Response` objects, which means 
returning a `Response` object would not work and you'd call `res.send` or `next` by yourself.
