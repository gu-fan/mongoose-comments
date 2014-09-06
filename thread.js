var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var comments = require('./comments.js');

mongoose.connect('mongodb://localhost/mn-cmts');

var threadSchema = new Schema({
    thread: 'String',
});
threadSchema.plugin(comments);

module.exports= mongoose.model('Thread', threadSchema);
