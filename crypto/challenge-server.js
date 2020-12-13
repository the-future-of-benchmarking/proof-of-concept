import * as openpgp from 'openpgp';
import { v4 as uuid } from 'uuid';
import {readFile, writeFile} from 'fs/promises'


(async () => {

    

    if(process.argv[2] === 'generate'){
        let challenge = uuid();
        await writeFile('challenge.txt', challenge)
        await insertTransaction(challenge, 'test')
        console.log('generated')
    }
    
    if(process.argv[2] === 'verify'){
        let inputSig = await readFile('challenge.txt.sig', 'utf8')
        const publicKey = getPublicKey('test');
        let success = await verifyChallenge(publicKey, inputSig)
        console.log(success)
    }



     
     
	
})();

async function verifyChallenge(pubkey, signedChallenge){
    
    try{
        let message = await openpgp.cleartext.readArmored(signedChallenge);
        let {text} = message
        let publicKeys = (await openpgp.key.readArmored(await getPublicKey(await findByTransactionId(text)))).keys
        
        
        const verified = await openpgp.verify({
            message,
            publicKeys
        });

        for(let signature of verified.signatures){
            const { valid, keyid } = signature;
            if (valid) {
                console.log('signed by key id ' + keyid.toHex());
                await deleteTransaction(text);
                return true;
            }
        }
        return false;  

    }catch(e){
        console.error(e)
        return false;
    }
}

async function findByTransactionId(id){
    let database = JSON.parse(await readFile('database.json', 'utf8'))
    let foundRecord = database.find((found) => found.id === id);
    if(foundRecord){
        return foundRecord
    }else{
        throw new Error("could not find transaction");
    }
}

async function insertTransaction(id, pseudonym){
    let database = JSON.parse(await readFile('database.json', 'utf8'))
    database.push({id,pseudonym});
    await writeFile('database.json', JSON.stringify(database))
}

async function deleteTransaction(id){
    let database = JSON.parse(await readFile('database.json', 'utf8'))
    let foundRecord = database.findIndex((found) => found.id === id);
    if(foundRecord > -1){
        database.splice(foundRecord, 1)
    }
    await writeFile('database.json', JSON.stringify(database))
}

async function getPublicKey(pseudonym){
    return await readFile('0x98754928-pub.asc', 'utf8')
}