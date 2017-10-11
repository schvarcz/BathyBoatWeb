var net = require('net');

var client = new net.Socket();
client.setEncoding('utf8');

function initConnection() {
    //console.log('Connection...');
    client.connect(29200, '192.168.0.11');
}

client.on('connect', function() {
    console.log('Connected');
});

client.on('close', function(had_error) {
    //console.log('Connection closed');
    setTimeout(initConnection, 500);
});

client.on('error', function() {
    //console.log('Error');
});

function splitData(raw) {
    var splitted = raw.split(';');
    if (splitted.length < 2) {
        return null;
    }
    var msg = {
        type: splitted[0],
        date: splitted[1],
        content: {}
    };
    if (msg.type === '$POS') {
        msg.content.lat = splitted[2];
        msg.content.long = splitted[3];
        msg.content.yaw = splitted[4];
        msg.content.pitch = splitted[5];
        msg.content.roll = splitted[6];
        msg.content.speed = splitted[7];
        msg.content.signal = splitted[8];
    } else if (msg.type === '$DATA') {
        msg.content.temp = splitted[2];
        msg.content.hydro1 = splitted[3];
        msg.content.hydro2 = splitted[4];
    } else if (msg.type === '$BATT') {
        msg.content.m1 = splitted[2];
        msg.content.m2 = splitted[3];
        msg.content.elec = splitted[4];
    } else if (msg.type === '$MOT') {
            msg.content.m1 = splitted[2];
            msg.content.m2 = splitted[3];
            msg.content.fidelity = splitted[4];
    } else {
        return null;
    }
    return msg;
}

function initClient(receiveCallback) {
    initConnection();

    var readBuffer = '';
    client.on('data', function(data) {
        readBuffer += data;
        var msg = readBuffer.split('\n');
        for (var i = 0; i < msg.length - 1; i++) {
            receiveCallback(splitData(msg[i]));
        }
        readBuffer = msg[msg.length - 1];
    });

    return client;
}

module.exports = initClient;