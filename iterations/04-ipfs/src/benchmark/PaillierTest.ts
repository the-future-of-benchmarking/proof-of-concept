import { generateRandomKeys, KeyPair, PrivateKey } from "paillier-bigint";
import { Encryption } from "./Encryption";
const {writeFile} = require('fs/promises');
const secrets = require('secrets.js-grempe');

// https://www.chosenplaintext.ca/articles/beginners-guide-constant-time-cryptography.html
async function main(){
    let sharedKeys = await generateRandomKeys(3072, true);


    let alice_value = 3n;
    let bob_value = 3n;
    let charlie_value = 3n;

    let alice_c = sharedKeys.publicKey.encrypt(alice_value);
    let bob_c = sharedKeys.publicKey.encrypt(bob_value);
    let charlie_c = sharedKeys.publicKey.encrypt(charlie_value);

    let new_result = sharedKeys.publicKey.addition(alice_c, bob_c);

    let final_result = sharedKeys.publicKey.addition(new_result, charlie_c);

    let dodecrypt = (p: KeyPair, f:bigint) => {
        console.log("Alice", p.privateKey.decrypt(f))
    }

    
    // Lambda
    let hexL = secrets.str2hex(sharedKeys.privateKey.lambda.toString());
    console.log("Hex Length", hexL.length)

    // Mu
    let hexM = secrets.str2hex(sharedKeys.privateKey.mu.toString())
    console.log("Hex Length", hexM.length)

    //@ts-ignore
    const [shareLAlice, shareLBob, shareLCharlie] = secrets.share(hexL, 3, 2);

    //@ts-ignore
    const [shareMAlice, shareMBob, shareMCharlie] = secrets.share(hexM, 3, 2);

    

    await writeFile('log.json', JSON.stringify({keyPair: Encryption.serializeKeyPair(sharedKeys), sharesLambda: [shareLAlice, shareLBob, shareLCharlie], sharesMu: [shareMAlice, shareMBob, shareMCharlie]}, null, 4))




    const combinationL = BigInt(secrets.hex2str(secrets.combine([shareLBob, shareLCharlie])))

    const combinationM = BigInt(secrets.hex2str(secrets.combine([shareMBob, shareMCharlie])))


    const privateKey = new PrivateKey(combinationL, combinationM, sharedKeys.publicKey);

    console.log("Crowdsourced", privateKey.decrypt(final_result))

    dodecrypt(sharedKeys, final_result);


    
}

main()