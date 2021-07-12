export interface IBenchmarkData {
    id: string;
    isInitiator: boolean;
    ethAdress: string;
    publicKeyAdress: string;
    contribution: {
        value: number;
        time: Date;
    },
    privateKey: string;
    sum: number;
    lastSynced: Date;

}