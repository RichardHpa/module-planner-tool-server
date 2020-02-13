const express = require('express');
const app = express();
// const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const mongoose = require('mongoose');
const router = express.Router();

const plans = require('./routes/planner');
const users = require('./routes/users');

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER_NAME}.mongodb.net/${process.env.MONGO_TABLE_NAME}?retryWrites=true&w=majority`, {useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected to mongo db');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(cors());

app.use(function(req, res, next){
    console.log(`${req.method} request for ${req.url}`);
    next();
});

app.get('/', function(req, res){
    res.send('Welcome to the Planner API');
});

app.use('/plans', plans);
app.use('/users', users);


app.set('port', process.env.PORT || 8000);
app.listen(app.get('port'), () => {
    console.clear();
    console.log(`application is running on port ${app.get('port')}`);
});
