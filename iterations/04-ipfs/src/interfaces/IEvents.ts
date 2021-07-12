import { IBenchmarkData } from "./IBenchmarkData";
import { IEthereumConfigurationOutput } from "./IEthereumConfiguration";

export interface IDataRequest {
    benchmarks: IBenchmarkData[];
    ethConfiguration: IEthereumConfigurationOutput;
}

export interface IEvents {

    // IPFS Connection
    "ipfsConnected": undefined,
    "ipfsDisconnected": undefined,

    // IPFS Cluster
    "ipfsClusterConnected": undefined,
    "ipfsClusterDisconnected": undefined,

    // Ethereum Wallet related
    "walletConfigure": {provider: string, password: string},
    "walletConfigured": undefined,
    "walletConfigureError": undefined,
    

    "walletSeed": string,


    "walletUnlock": string,
    "walletUnlocked": boolean,

    "walletGetAddresses": undefined,
    "walletGotAddresses": string[],

    "walletGetNewAddress": undefined,
    "walletGotNewAddress": string,

    // Application Related
    "benchmarkAdded": string,
    "benchmarkRemoved": string,
    "benchmarkSynced": Array<{benchmarkId: string, benchmarkData: IBenchmarkData}>,

    "dataRequest": IDataRequest,

    // Websocket Related
    "clientConnected": string,
    "clientDisconnected": string

}
