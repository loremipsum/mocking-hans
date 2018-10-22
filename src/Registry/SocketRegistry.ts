import "reflect-metadata";
import {HttpMethod} from "../Enum/HttpMethod";

export const SocketRegistry = (new class {
    protected routes: {
        target: object,
        property: string,
        path: string,
        httpMethod: HttpMethod
    }[] = [];

    public add(target: object, property: string, path: string, httpMethod: HttpMethod) {
        this.routes.push({
            target,
            property,
            path,
            httpMethod
        });
    }

    public getRoutes() {
        return this.routes;
    }
});
