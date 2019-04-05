import {App} from "../../src/Decorator/App";
import {JsonResponse} from "../../src/Response/JsonResponse";
import {Get} from '../../src/Decorator/Route';

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
