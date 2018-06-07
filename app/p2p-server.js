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

        //  ad ogni connessione, viene pushato il socket nuovo
        server.on('connection', socket => this.connectSocket(socket));

        this.connectToPeers();
    }

    connectToPeers()
    {
        peers.forEach(peer =>
        {
            const socket = new Websocket(peer);
            socket.on('open', () => this.connectSocket(socket));
        });
    }

    connectSocket(socket)
    {
        this.sockets.push(socket);
        console.log('Socket connected');
    }
}

module.exports = P2pServer;
