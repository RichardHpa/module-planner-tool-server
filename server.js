const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const mongoose = require('mongoose');

const Planner = require('./models/planner');

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER_NAME}.mongodb.net/${process.env.MONGO_TABLE_NAME}?retryWrites=true&w=majority`, {useUnifiedTopology: true});

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

app.get('/plan/:id', function(req, res){
    const id = req.params.id;
    Planner.findById(id, function(err, plan) {
        if (err) {
            res.send(err);
        } else {
            res.send(plan);
        }
    });
});

app.post('/addPlanner', function(req, res){
    const plan = new Planner({
        _id: new mongoose.Types.ObjectId(),
        data: req.body.itemString
    });

    plan.save().then(result => {
        res.send('saved to database');
    }).catch(err => res.send(err));
});

app.patch('/updatePlan/:id', function(req, res){
    const id = req.params.id;
    Planner.findById(id, function(err, plan){
        const updatedPlan = {
            data: req.body.itemString
        };
        Planner.updateOne({ _id : id }, updatedPlan).then(result => {
            res.send('plan has been updated');
        }).catch(err => res.send(err));
    }).catch(err => res.send('cannot find plan with that id'));
})

app.listen(port, () => {
    console.clear();
    console.log(`application is running on port ${port}`)
});
