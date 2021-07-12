const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const truffle_connect = require('./connection/app.js');
const bodyParser = require('body-parser');
const paillierBigint = require('paillier-bigint')
const fs = require('fs/promises');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/', express.static('public_static'));

app.listen(port, async () => {

  const secrets = JSON.parse(await fs.readFile('pubkey.json'))
  const privateSecrets = JSON.parse(await fs.readFile('privkey.json'))

  const publicKey = new paillierBigint.PublicKey(BigInt(secrets.n), BigInt(secrets.g))
  const privateKey = new paillierBigint.PrivateKey(BigInt(privateSecrets.lambda), BigInt(privateSecrets.mu), publicKey)

  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  // truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

  console.log("Express Listening at http://localhost:" + port);

   
  //const m1 = 12345678901234567890n
  //const m2 = 5n

  //const uncrypted = 2n;

  //const crypted = 0x2a6a2efecccf5f09e883b87528104e505dedb63fee8de93ccc059116bf32ae5fn;

  // encryption/decryption
  //console.log('0x'+bigintConversion.bigintToHex(publicKey.encrypt(uncrypted)))
  let value = await truffle_connect.getPBalance()
  console.log(privateKey.decrypt(value))
 
  // console.log(publicKey.encrypt(-35n))

  let newValue = await truffle_connect.addPBalance(publicKey.encrypt(2n))
  console.log(privateKey.decrypt(newValue))

  

});
