const Websocket =   require('ws');

//  default port 5001
const P2P_PORT  =   process.env.P2P_PORT || 5001;

//  check if appears environment variable that is a stream that contains a list of web socket addresses
//  if is present an environment variable it takes this one, although it takes an empty array
const peers     =   process.env.PEERS ? process.env.PEERS.split(',') : [];

//  contiene l'etichetta del messaggio
const MESSAGE_TYPES =
{
    chain:              'CHAIN',
    transaction:        'TRANSACTION',
    clear_transactions: 'CLEAR_TRANSACTIONS'
};

class P2pServer
{
    constructor(blockchain, transactionPool) 
    {
        this.blockchain         =   blockchain;
        this.sockets            =   [];
        this.transactionPool    =   transactionPool;
    }

    listen()
    {
        const server = new Websocket.Server({ port: P2P_PORT });

        //  ad ogni connessione, viene chiamata la connectSocket
        server.on('connection', socket => this.connectSocket(socket));

        this.connectToPeers();

        console.log(`Listening for peer-to-peer connections: ${P2P_PORT}`);
    }

    //  il client richiederà la connessione a certi peers, questa funzione li connette se possibile
    connectToPeers()
    {
        peers.forEach(peer =>
        {
            const socket = new Websocket(peer);
            socket.on('open', () => this.connectSocket(socket));
        });
    }

    //  aggiunge all'array 'sockets' il nuovo socket
    connectSocket(socket)
    {
        this.sockets.push(socket);
        console.log('Socket connected');

        this.messageHandler(socket);
        
        this.sendChain(socket);
    }

    //  quando un host effettua la send questa funzione lo riceve
    //  per ogni nuovo socket, prende il messaggio da lui ricevuto, effettua un parsing del 'data' ricevuto
    messageHandler(socket)
    {
        socket.on('message', message =>
        {
            //  lo strasforma in un tipo javascript
            const data  =   JSON.parse(message);

            switch(data.type)
            {
                case MESSAGE_TYPES.chain:
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MESSAGE_TYPES.transaction:
                    this.transactionPool.updateOrAddTransaction(data.transaction);
                    break;
                case MESSAGE_TYPES.clear_transactions:
                    this.transactionPool.clear();
                    break;
            }
        });
    }

    //  invia il messaggio di tipo chain e la chain stessa
    sendChain(socket)
    {
        socket.send(JSON.stringify(
        {
            type:   MESSAGE_TYPES.chain,
            chain:  this.blockchain.chain
        }));
    }

    //  invia il messaggio di tipo transazione e la transazione stessa
    sendTransaction(socket, transaction)
    {
        //  .send funzione della libreria ws
        socket.send(JSON.stringify(
        {   
            type:   MESSAGE_TYPES.transaction,
            transaction
        }));
    }

    //  invia ad ogni socket la chain aggiornata
    syncChains()
    {
        this.sockets.forEach(socket =>
        {
            this.sockets.forEach(socket => this.sendChain(socket));
        });
    }

    //  per ogni socket richiama la sendTransaction()
    broadcastTransaction(transaction)
    {
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
    }

    broadcastClearTransactions()
    {
        this.sockets.forEach(socket => socket.send(JSON.stringify({
            type: MESSAGE_TYPES.clear_transactions
        })));
    }
}

module.exports = P2pServer;