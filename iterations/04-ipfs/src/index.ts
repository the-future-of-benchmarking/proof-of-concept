import { IEvents } from "./interfaces/IEvents"
import { createServer, Server as HttpServer } from "http";
import { Server } from "socket.io";
import { WalletListener } from "./wallet/WalletListener";
import { WebsocketListener } from "./websocket/WebsocketListener"
import Emittery from "emittery";
import { log } from "./util";

class MainApplication {
    activeListeners: any[];
    httpServer: HttpServer;
    eventEmitter: Emittery<IEvents>;
    socketServer: Server;
    constructor() {
        this.httpServer = createServer();
        this.socketServer = new Server(this.httpServer, {
            cors: {
                origin: '*',
            }
        });
        log(this.constructor.name, "Server initialized")

        this.eventEmitter = new Emittery<IEvents>();
        this.activeListeners = [];
        log(this.constructor.name, "Emitter initialized")

        // Listeners
        const walletListener = new WalletListener(this.eventEmitter);
        const webSocketListener = new WebsocketListener(this.eventEmitter, this.socketServer)
        log(this.constructor.name, "Listener initialized")

        this.activeListeners.push(walletListener, webSocketListener)
    }
    start() {
        log(this.constructor.name, "Websocket Server Listening on", 8080)
        this.httpServer.listen(8080)
    }
}

const app = new MainApplication();
app.start();