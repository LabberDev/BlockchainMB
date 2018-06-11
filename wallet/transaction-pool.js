const Transaction   =   require('../wallet/transaction');

class TransactionPool
{
    constructor()
    {
        this.transactions = [];
    }
  
    updateOrAddTransaction(transaction)
    {
        let transactionWithId = this.transactions.find(t => t.id === transaction.id);

        //  se esiste sostituisce quella vecchia con la nuova (potrebbe essere stato fatto un update)
        if (transactionWithId) 
        {
            //  transactionWithId = transaction;    forse è uguale
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
        } 
        else 
        {
            this.transactions.push(transaction);
        }
    }

    //   controlla se esiste nella pool, non nelle transazioni
    existingTransaction(address)
    {
        return this.transactions.find(transaction => transaction.input.address === address);
    }

    validTransactions()
    {
        return this.transactions.filter(transaction =>
        {
            //  reduce() somma tutti i return.
            //  total è un accumulatore usato da reduce()
            //  output fa riferimento ad ogni istanza di outputs
            //  0 indica il valore di partenza di total 
            const outputTotal   =   transaction.outputs.reduce((total, output) =>
            {
                return total + output.amount;
            }, 0);

            //  nelle transazioni vi sarà anche l'output con destinazione mittente
            if (transaction.input.amount !== outputTotal)
            {
                console.log(`Invalid transaction from ${transaction.input.address}.`);
                return;
            }
            
            //  se non restituisce undefined
            if (!Transaction.verifyTransaction(transaction))
            {
                console.log(`Invalid signature from ${transaction.input.address}.`);
                return;
            }

            return transaction;
        })
    }

    clear()
    {
        this.transactions   =   [];
    }
}
  
module.exports = TransactionPool;
  