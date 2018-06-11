const ChainUtil             =   require('../chain-util');
const Transaction           =   require('./transaction');
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

    createTransaction(recipient, amount, transactionPool)
    {
        if (amount > this.balance)
        {
            console.log(`Amount: ${amount}, exceeds current balance: ${this.balance}`);
            return;
        }
      
        let transaction = transactionPool.existingTransaction(this.publicKey);
        //  se esiste nella pool, la inserisce nelle transazioni
        if (transaction)
        {
            transaction.update(this, recipient, amount);
        }
        //  se non esiste nella pool, crea una transazione e la mette nella pool
        else
        {
            transaction = Transaction.newTransaction(this, recipient, amount);
            transactionPool.updateOrAddTransaction(transaction);
        }
      
        return transaction;
      }
}

module.exports = Wallet;