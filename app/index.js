const express           =   require('express');
const bodyParser        =   require('body-parser');
const Blockchain        =   require('../blockchain');
const P2pServer         =   require('./p2p-server');
const Wallet            =   require('../wallet');
const TransactionPool   =   require('../wallet/transaction-pool');

//  se il client non richiede una porta specifica, prende la default 3001
const HTTP_PORT =   process.env.HTTP_PORT || 3001;

/* esempio richiesta porta specifica
$ HTTP_PORT =   3002 npm run dev
*/

//oggetto di express
const app       =   express();
const bc        =   new Blockchain();
const wallet    =   new Wallet();
const tp        =   new TransactionPool();
const p2pServer =   new P2pServer(bc, tp);

app.use(bodyParser.json());

app.get('/blocks', (req, res) =>
{
    res.json(bc.chain);
});

app.post('/mine', (req, res) => 
{
    const block =   bc.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);

    p2pServer.syncChains();

    res.redirect('/blocks');
});

app.listen(HTTP_PORT, () =>
    console.log(`Listening on port ${HTTP_PORT}`)
);

app.get('/transaction', (req, res) =>
{
    res.json(tp.transactions);
});

app.post('/transact', (req, res) =>
{
    const { recipient, amount } =   req.body;
    const transaction           =   wallet.createTransaction(recipient, amount, tp);
    p2pServer.broadcastTransaction(transaction);
    res.redirect('/transaction');
})

p2pServer.listen();