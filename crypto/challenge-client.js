import * as openpgp from 'openpgp';
import {readFile, writeFile} from 'fs/promises'


(async () => {

    const privateKeyArmored = await readFile('0x98754928-sec.asc', 'utf8');
    const passphrase = `test123`;
    const challenge = await readFile('challenge.txt', 'utf8');
	
	const { keys: [privateKey] } = await openpgp.key.readArmored(privateKeyArmored);
    await privateKey.decrypt(passphrase);

    const { data: cleartext } = await openpgp.sign({
        message: openpgp.cleartext.fromText(challenge), 
        privateKeys: [privateKey]                             
    });
    await writeFile('challenge.txt.sig', cleartext);
	
})();