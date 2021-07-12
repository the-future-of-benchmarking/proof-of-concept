import Emittery from "emittery";
import { Socket, Server } from "socket.io";
import { IEvents } from "../interfaces/IEvents";
import { log } from "../util";

export class WebsocketListener {
    private _server: Server
    private _emitter: Emittery<IEvents>
    constructor(emitter: Emittery<IEvents>, server: Server) {
        this._server = server;
        this._emitter = emitter;

        this._server.on("connection", this.handleWebSocketConnection)

    }

    handleWebSocketConnection = (socket: Socket) => {
        log(this.constructor.name, socket.id, "connected")
         this._emitter.emit("clientConnected", socket.id);
        socket.on("disconnect", () => {
            log(this.constructor.name, socket.id, "disconnected")
            this._emitter.emit("clientDisconnected", socket.id)
        })

        
        socket.on("walletConfigure", async ({provider, password}: {provider: string, password: string}) => await this._emitter.emit("walletConfigure", {provider, password}))
        socket.on("walletUnlock", async (password: string) => await this._emitter.emit("walletUnlock", password))
        socket.on("walletGetAddresses", async () => await this._emitter.emit("walletGetAddresses"))
        socket.on("walletGetNewAddress", async () => await this._emitter.emit("walletGetNewAddress"))

        this._emitter.on("walletSeed", (seed: string) => { socket.emit("walletSeeded", seed) })
        this._emitter.on("walletConfigured", () => { socket.emit("walletConfigured") })
        this._emitter.on("walletUnlocked", (unlocked: boolean) => { socket.emit("walletUnlocked", unlocked) })
        this._emitter.on("walletGotAddresses", (addresses: string[]) => { socket.emit("walletGotAdresses", addresses) })
        this._emitter.on("walletGotNewAddress", (address: string) => { socket.emit("walletGotNewAddress", address) })
        this._emitter.on("walletConfigureError", () => { socket.emit("walletConfigureError")})
    }

    // walletConfigureProvider => walletSeeded
    // walletCreate => walletCreated
    // walletUnlock => walletUnlocked
    // walletGetAddresses => walletGotAddresses
    // walletGetNewAddress => walletGotNewAddress


}