# Mocking Hans

> You don't mock the Hans, he's mocking you.

## Installation

1. Clone the repository
2. Install npm dependencies (`npm install`)
3. Start with `npm start`

## Usage

### Apps

Apps, residing in `apps/`, represent a *single* interface. So let's say
you're going to mock APIs for Facebook and Twitter you're going to have two Apps, one 
for Facebook and one for Twitter.

#### Implementing Apps

Apps must be decorated with the `@App` decorator:

```typescript
@App({
    name: 'twitter',
    port: 61000
})
export class Twitter {
}
```

Additionally you need to register your app within the `apps` array in the `index.ts` file.

Starting Hans now results in:

```
> npm start

    ✔ Started twitter on localhost:61000
```

#### Implementing interfaces

Even though your app is loaded, it doesn't expose any interfaces yet. Interfaces are 
represented as single methods and need to be decorated with the `@Route` decorator. In 
case of our Twitter app you may are going for an implementation like:

```typescript
@App({
    name: 'twitter',
    port: 61000
})
export class Twitter {
    @Route("/1.1/search/tweets.json", HttpMethod.GET)
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

#### Sockets

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

See `client.html` for a more detailed example.

### API

#### `@Route`

`@Route` decorated methods do have up to three params:

1. `req` - The request object ([reference](http://expressjs.com/de/api.html#req))
2. `res` - The response object ([reference](http://expressjs.com/de/api.html#res))
3. `next` - A function which tells the server to continue handling routes (see Troubleshooting).
4. `io` - The Socket.IO object ([reference](https://socket.io/docs/server-api/))

An example of these params can be found within the example app:

```typescript
@Route("/broadcast", HttpMethod.GET)
broadcast(req, res, next, io) {
    io.emit('news', {message: req.query.message, time: +(new Date())});
    return new JsonResponse({success: 1});
}
```

Sending a HTTP GET to `/broadcast?message=foobar` emits the message `foobar` to all connected sockets.

#### Responses

For convenience Hans provides several `Response` objects:

- `JsonResponse`: for JSON formatted responses
- `XmlFromJsonResponse`: for XML formatted responses which originates from JSON
- `Response`: a simple text response

All `Response` objects do allow setting the status code and/or headers via the constructor:

```typescript
export class Response {
    constructor(protected content: any = '', protected statusCode: number = 200, protected headers = []) {
    }
    
    // ...
}
```

## Troubleshooting 

### Responses take forever

Most likely you've forgotten to wrap your response within a `Response` object. In case you're doing this on purpose you 
are going to need to use `res` to send the response (see [here](http://expressjs.com/de/api.html#res)).

If you don't want your responses to be returned at all, e.g. just calling a `console.log` statement without sending any 
response:

```typescript
@Route("/test", HttpMethod.GET)
broadcast(req, res, next) {
    console.log("Hello there");
    next(); // the important thing here!
}
```

The `next()` function call prevents the server to be stuck within this route forever.
