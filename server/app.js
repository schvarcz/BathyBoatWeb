var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var bodyParser = require('body-parser');

var dataClient = require('./tcp/data_client');
var commandClient = require('./tcp/command_client');
var mapDownloader = require('./utils/map_downloader');

var dataRouter = require('./routes/data');
var videoRouter = require('./routes/video');
var commandRouter = require('./routes/command');


// Global data
global.globalData = {
    pos: [],
    mot: [],
    batt: [],
    data: []
};
global.commandTCP = undefined;
global.dataTCP = undefined;

// TCP Client
global.rosIP = '192.168.43.224';
dataClient();
commandClient();

// Express App
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(mapDownloader);
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser);
app.use(cors());

// Routers
app.use(dataRouter);
app.use(videoRouter);
app.use(commandRouter);

app.listen(29201);