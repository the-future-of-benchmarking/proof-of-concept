const openpgp = require('openpgp');
const fs = require('fs/promises');
const fsr = require('fs');



(async () => {

    const publicKeyArmored = await fs.readFile('0x98754928-pub.asc', 'utf8');
    const privateKeyArmored = await fs.readFile('0x98754928-sec.asc', 'utf8'); // encrypted private key
    const passphrase = `test123`;
	
	const { keys: [privateKey] } = await openpgp.key.readArmored(privateKeyArmored);
    await privateKey.decrypt(passphrase);

    const { data: cleartext } = await openpgp.sign({
        message: openpgp.cleartext.fromText(await fs.readFile('test.txt', 'utf8')), 
        privateKeys: [privateKey]                             
    });
    console.log(cleartext); 
	await fs.writeFile('test.txt.sig', cleartext);

    const verified = await openpgp.verify({
        message: await openpgp.cleartext.readArmored(await fs.readFile('test.txt.sig', 'utf8')),           // parse armored message
        publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys // for verification
    });
    const { valid } = verified.signatures[0];
    if (valid) {
		console.log(verified.signatures[0])
        console.log('signed by key id ' + verified.signatures[0].keyid.toHex());
    } else {
        throw new Error('signature could not be verified');
    }
	
})();