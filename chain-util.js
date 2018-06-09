//usa questo modulo che posside funzioni matematiche avanzate
const EC      = require('elliptic').ec;
const EC      = new EC('secp256k1');
const uuidV1  = require('uuid/V1');

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
}

module.exports = ChainUtil;