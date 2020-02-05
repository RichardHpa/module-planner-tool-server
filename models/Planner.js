const mongoose = require('mongoose');

const plannerSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    data: String
});

module.exports = mongoose.model('Planner', plannerSchema);
