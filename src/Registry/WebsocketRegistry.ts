import "reflect-metadata";

export const WebsocketRegistry = (new class {
    protected sockets: {
        target: object,
        property: string,
        event: string,
        namespace: string
    }[] = [];

    public add(target: object, property: string, event: string, namespace: string = '/') {
        this.sockets.push({
            target,
            property,
            event,
            namespace
        });
    }

    public getSockets() {
        return this.sockets;
    }
});
