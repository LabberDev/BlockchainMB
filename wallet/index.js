const ChainUtil             =   require('../chain-util');
const { INITIAL_BALANCE }   =   require('../config');

class Wallet
{
    constructor()
    {
        this.balance    =   INITIAL_BALANCE;
    	this.keyPair    =   ChainUtil.genKeyPair();
        this.publicKey  =   this.keyPair.getPublic().encode('hex');
    }

    toString()
    {
        return `
        Wallet -
        publicKey : ${this.publicKey.toString()}
        balance   : ${this.balance}
        `;
    }

    sign(dataHash)
    {
        //  effettua un return di dataHash crittato.
        //  il modulo ellittic, con la funzione genKeyPair() genera un oggetto keyPair che tramite la
        //  sua funzione sign() critterà il messaggio
        return  this.keyPair.sign(dataHash);
    }
}

module.exports = Wallet;