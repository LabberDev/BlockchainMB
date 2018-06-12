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

    createTransaction(recipient, amount, blockchain, transactionPool)
    {
        this.balance    =   this.calculateBalance(blockchain);

        if (amount > this.balance)
        {
            console.log(`Amount: ${amount}, exceeds current balance: ${this.balance}`);
            return;
        }
      
        let transaction = transactionPool.existingTransaction(this.publicKey);
        //  se esiste nella pool, la inserisce nelle transazioni
        //  viene fatta quando si vuole aggiungere una operazione alla transazione
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

    calculateBalance(blockchain)
    {
        //  |__| effettuare il controllo prima di riempire l'array transactions[] |__|
        let balance         =   this.balance;
        let transactions    =   [];
        let startTime       =   0;

        //  per ogni blocco della chain
        blockchain.chain.forEach(block =>
        {
            //  pusha tutte le transazioni
            block.data.forEach(transaction =>
            {
                transactions.push(transaction);
            });    
        });
        //  attualmente transactions[] contiene tutte le transazioni della blockchain

        //  prende tutte le transazioni che ha fatto lui
        const walletInputTs =   transactions
            .filter(transaction => transaction.input.address === this.publicKey);

        //  se è stata fatta almeno una transazione
        if (walletInputTs.length > 0)
        {
            //  prende l'ultima transazione da lui eseguita (prev contiene sempre l'ultima)
            const recentInput   =   walletInputTs.reduce( (prev, current) =>
            {
                prev.input.timestamp > current.input.timestamp ? prev : current
            });

            //  dell'ultima transazione prende l'output che ha il suo indirizzo (soldi di ritorno)
            balance     =   recentInput.outputs.find(output =>
            {
                output.address === this.publicKey
            }).amount;
            
            //  timestamp dell'ultimo blocco con sua transazione in output
            startTime   =   recentInputT.input.timestamp;
        }

        transactions.forEach(transaction =>
        {
            //  per ogni transazione di input effettuata dopo l'ultima di output, somma quelle in ingresso verso di sè
            if (transaction.input.timestamp > startTime)
            {
                transaction.output.find(output =>
                {
                    if (output.address === this.publicKey)
                    {
                        balance +=  output.amount;
                    }
                });
            }
        });

        return balance;
    }
    
    static blockchainWallet()
    {
        const blockchainWallet      =   new this();
        blockchainWallet.address    =   'blockchain-wallet';
        return blockchainWallet;
    }
}

module.exports = Wallet;