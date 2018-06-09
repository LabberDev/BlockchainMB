//usa questo modulo che posside funzioni matematiche avanzate
const EC      = require('elliptic').ec;
const ec      = new EC('secp256k1');
const uuidV1  = require('uuid/V1');
const SHA256	=	require('crypto-js/sha256');

class ChainUtil
{
  static genKeyPair()
  {
    return ec.genKeyPair();
  }

  static id()
  {
    return uuidV1();
  }

  static hash(data)
  {
    return SHA256(JSON.stringify(data)).toString();
  }

  static verifySignature(publicKey, signature, dataHash)
  {
    //  keyFromPublic() metodo di elliptic, data una chiave pubblica di un certo tipo, la trasforma in un oggetto
    let keyObject = ec.keyFromPublic(publicKey, 'hex');

    //  verify() è una funzione dell'oggetto keyObject
    return keyObject.verify(dataHash, signature);
  }
}

module.exports = ChainUtil;