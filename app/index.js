const express   =   require('express');
const bodyParser    =   require('body-parser');
const Blockchain    =   require('../blockchain');
const P2pServer =   require('./p2p-server');

//  se il client non richiede una porta specifica, prende la default 3001
const HTTP_PORT =   process.env.HTTP_PORT || 3001;

/* esempio richiesta porta specifica
$ HTTP_PORT =   3002 npm run dev
*/

//oggetto di express
const app   =   express();
const bc    =   new Blockchain();
const p2pServer =   new P2pServer(bc);

app.use(bodyParser.json());

app.get('/blocks', (req, res) =>
{
    res.json(bc.chain);
});

app.post('/mine', (req, res) => 
{
    const block =   bc.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);

    //  richiama app.get
    res.redirect('/blocks');
});

app.listen(HTTP_PORT, () =>
    console.log(`Listening on port ${HTTP_PORT}`)
);

p2pServer.listen();