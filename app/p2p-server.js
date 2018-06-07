const Websocket = require('ws');

//  default port 5001
const P2P_PORT = process.env.P2P_PORT || 5001;

//  check if appears environment variable that is a stream that contains a list of web socket addresses
//  if is present an environment variable it takes this one, although it takes an empty array
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pServer
{
    constructor(blockchain) 
    {
        this.blockchain = blockchain;
        this.sockets = [];
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

    //  per ogni nuovo socket, prende il messaggio da lui ricevuto, effettua un parsing del 'data' ricevuto
    messageHandler(socket)
    {
        socket.on('message', message =>
        {
            //  lo strasforma in un tipo javascript
            const data  =   JSON.parse(message);

            this.blockchain.replaceChain(data);
        });
    }

    sendChain(socket)
    {
        socket.send(JSON.stringify(this.blockchain.chain));
    }

    syncChains()
    {
        this.sockets.forEach(socket =>
        {
            this.sockets.forEach(socket => this.sendChain(socket));
        });
    }
}

module.exports = P2pServer;