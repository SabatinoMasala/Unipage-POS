const io = require('socket.io')();
const port = 37001;
io.listen(port);

class SocketHelper {
    clients = [];
    listeners = [];
    io = false;
    onClientConnect = (client) => {
        this.clients.push(client);
        this.onUpdate(this.clients);
    };
    onClientDisconnect = (client) => {
        this.clients.splice(this.clients.indexOf(client), 1);
        this.onUpdate(this.clients);
    };
    onUpdate() {
        this.listeners.forEach(listener => {
            listener.handleClientUpdate(this.clients);
        });
    }
    addListener(element) {
        this.listeners.push(element);
        this.onUpdate();
    };
    removeListener(element) {
        this.listeners.splice(element, 1);
        this.onUpdate();
    };
}

const socketHelper = new SocketHelper();
socketHelper.io = io;

io.on('connection', function(client) {
    socketHelper.onClientConnect(client);
    client.on('disconnect', function() {
        socketHelper.onClientDisconnect(client);
    });
});

export default socketHelper;