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

    existingTransaction(address)
    {
        return this.transactions.find(transaction => transaction.input.address === address);
    }
}
  
module.exports = TransactionPool;
  