export interface IEthereumInitialConfigurationOutput {
    seed: string;
}

export interface IEthereumConfigurationOutput {
    address: string;
    privKey?: string;
}

export interface IEthereumConfigurationInput {
    password: string;
}