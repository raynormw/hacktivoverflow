var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var threadsSchema = new Schema({
  question:   String,
  answers_id: [{ type: Schema.Types.ObjectId, ref: 'answers' }],
  user_id:    { type: Schema.Types.ObjectId, ref: 'users' },
  vote:       Number,
  created_at: Date,
  updated_at: Date
});

var Threads = mongoose.model('threads', threadsSchema);

module.exports = Threads;