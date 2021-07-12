import { IEvents } from "../interfaces/IEvents";
const EthereumWallet = require("@nguansak/node-ethereum-wallet");
import { log } from "../util";
import Emittery from "emittery";
import {resolve} from "path"


export class WalletListener {
    private _emitter: Emittery<IEvents>;
    private _wallet!: typeof EthereumWallet;

    constructor(emitter: Emittery<IEvents>){
        this._emitter = emitter;
        this._emitter.on("walletConfigure", this.handleConfigureProvider)
        this._emitter.on("walletUnlock", this.handleWalletUnlock)
        this._emitter.on("walletGetAddresses", this.handleWalletGetAdresses)
        this._emitter.on("walletGetNewAddress", this.handleWalletGetNewAddress)
    }

    handleConfigureProvider = async({provider, password}: {provider: string, password: string}): Promise<void> =>{
        try{
            log(this.constructor.name, "Provider",provider)
            this._wallet = new EthereumWallet();

            await this._wallet.init(resolve("~/benchmark-keystore"));
                
            log(this.constructor.name, "Configured provider, syncing wallet with provider");

            if(await this._wallet.hasKeystore){
                // Already seeded 
                log(this.constructor.name, "Keystore exists")
            }else{
                log(this.constructor.name, "Keystore creation")
                let seed = this._wallet.generateSeed()
                this._emitter.emit("walletSeed",seed)
                await this._wallet.createKeystore(password, seed);
            }

            

            await this._wallet.setProvider(provider)

            let syncStatus = await this._wallet.isSyncing
            while(typeof syncStatus !== "boolean"){
                syncStatus = await this._wallet.isSyncing;
            }

            this._emitter.emit("walletConfigured")
    
            log(this.constructor.name, "Synced wallet with provider");
        }catch(e){
            log(this.constructor.name, " Invalid Provider",provider)
            console.error(e)
            this._emitter.emit("walletConfigureError");
        }
        
    }

    handleWalletUnlock = async(password: string): Promise<void> =>{
        if(this._wallet.isUnlocked){
            this._emitter.emit("walletUnlocked",true)
        }else{
            let result = await this._wallet.unlock(password)
            this._emitter.emit("walletUnlocked",result)
        }
    }

    handleWalletGetAdresses = async(): Promise<void> =>{
        this._emitter.emit("walletGotAddresses",this._wallet.addresses);
    }

    handleWalletGetNewAddress = async(): Promise<void> =>{
        let result: string = await this._wallet.getNewAddress(1);
        this._emitter.emit("walletGotNewAddress",result);
    }

}