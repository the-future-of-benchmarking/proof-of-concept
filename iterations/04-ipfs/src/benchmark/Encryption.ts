import {
    generateRandomKeys, KeyPair, PrivateKey, PublicKey
} from 'paillier-bigint'
const secrets = require('secrets.js-grempe');

// The native type includes unescessary info
export interface PaillerPublicKey {
    n: string;
    g: string;
}

export interface PaillerPrivateKey {
    lambda: string;
    mu: string;
}

export interface PaillierKeyPair {
    publicKey: PaillerPublicKey
    privateKey: PaillerPrivateKey
}

export class Encryption {
    static async getKeys(): Promise<KeyPair> {
        return await generateRandomKeys(3072, true)
    }

    static split(privateKey: PaillerPrivateKey, n: number = 3, quorum:number = 2): {lambda:string[], mu: string[]} {
        // Lambda
        let hexL = secrets.str2hex(privateKey.lambda.toString());
    
        // Mu
        let hexM = secrets.str2hex(privateKey.mu.toString())

        return {lambda: secrets.share(hexL, n, quorum), mu: secrets.share(hexM, n, quorum)};
    }

    // This is only for testing purposes
    static combine(lambdaParts: string[], muParts: string[]): PaillerPrivateKey{
        const combinationL = BigInt(secrets.hex2str(secrets.combine(lambdaParts)))

        const combinationM = BigInt(secrets.hex2str(secrets.combine(muParts)))

        return {lambda:combinationL.toString(), mu:combinationM.toString()}
    }

    static encrypt(i:bigint, publicKey: PaillerPublicKey): bigint {
        let pubKey = new PublicKey(BigInt(publicKey.n), BigInt(publicKey.g))
        return pubKey.encrypt(i)
    }

    static serializeKeyPair(input: KeyPair): PaillierKeyPair {
        return {
            publicKey: Encryption.serializePublicKey(input.publicKey),
            privateKey: Encryption.serializePrivateKey(input.privateKey)
        }
    }

    static deSerializeKeyPair(input: PaillierKeyPair): KeyPair {
        let publicKey = Encryption.deSerializePublicKey(input.publicKey)
        return {
            publicKey,
            privateKey: Encryption.deSerializePrivateKey(input.privateKey, publicKey)
        }
    }

    static deSerializePublicKey(publicKey: PaillerPublicKey): PublicKey {
        return new PublicKey(BigInt(publicKey.n), BigInt(publicKey.g))
    }

    static serializePublicKey(publicKey: PublicKey): PaillerPublicKey {
        return {
            n: publicKey.n.toString(),
            g: publicKey.g.toString()
        }
    }


    static deSerializePrivateKey(privateKey: PaillerPrivateKey, publicKey: PublicKey): PrivateKey {
        return new PrivateKey(BigInt(privateKey.lambda), BigInt(privateKey.mu), publicKey)
    }

    static serializePrivateKey(privateKey: PrivateKey): PaillerPrivateKey {
        return {
            lambda: privateKey.lambda.toString(),
            mu: privateKey.mu.toString()
        }
    }

}