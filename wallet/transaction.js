const ChainUtil =   require('../chain-util');
const Transaction = require('./transaction');

class Transaction
{
    constructor()
    {
        this.id         =   ChainUtil.id();
        this.input      =   null;

        //  n oggetti. Il primo è fatto dal saldo e dalla chiave pubblica del mittente
        //  Dal secondo in poi possiedono il saldo da inviare e l'indirizzo del destinatario
        this.outputs    =   [];
    }

    //  viene fatta quando ad una transazione vuole essere aggiunta un'altra operazione
    update(senderWallet, recipient, amount)
    {
        //  restituisce un puntatore all'oggetto output, tale che output.address === senderWallet.publicKey
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);
    
        if (amount > senderOutput.amount)
        {
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }
    
        senderOutput.amount = senderOutput.amount - amount;
        this.outputs.push({ amount, address: recipient });
        Transaction.signTransaction(this, senderWallet);
    
        return this;
    }

    static newTransaction(senderWallet, recipient, amount)
    {
        if (amount > senderWallet.balance)
        {
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }

        const transaction = new this();

        transaction.outputs.push(...[
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
            { amount, address: recipient }
        ]);
        Transaction.signTransaction(transaction, senderWallet);

        return transaction;
    }

    static signTransaction(transaction, senderWallet)
    {
        transaction.input   =   
        {
            timestamp:  Date.now(),
            amount:     senderWallet.balance,
            address:    senderWallet.publicKey,
            signature:  senderWallet.sign(ChainUtil.hash(transaction.outputs))
        }
    }

    static verifyTransaction(transaction)
    {
        return ChainUtil.verifySignature
        (
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)
        );
    }
    
}

module.exports = Transaction;