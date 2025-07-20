const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  qty: Number,
  price: Number
});

const proposalSchema = new mongoose.Schema({
  clientName: String,
  contact: String,
  description: String,
  items: [itemSchema],
  total: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Proposal', proposalSchema);
