const express   =   require('express');
const Blockchain    =   require('../blockchain');

//  se il client non richiede una porta specifica, prende la default 3001
const HTTP_PORT =   process.env.HTTP_PORT || 3001;

/* esempio richiesta porta specifica
$ HTTP_PORT =   3002 npm run dev
*/

//oggetto di express
const app   =   express();
const bc    =   new Blockchain();

app.get('/blocks', (req, res) =>
{
    res.json(bc.chain);
});

app.listen(HTTP_PORT, () =>
    console.log(`Listening on port ${HTTP_PORT}`)
);