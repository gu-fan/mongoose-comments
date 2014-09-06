'use strict';

/**
 *  Moongoose-Comments plugin.
 *
 *  options: 
 *  ref: the comment's User model ref, default is 'User'.
 */
var mongoose = require('mongoose'), 
    Schema = mongoose.Schema, 
    ObjectId = mongoose.Schema.ObjectId;


function comments(schema, options) {
  options = options ||  {} ;
  var userModelName = options.ref || 'User';

  var commentSchema = new Schema({
      user: {type:ObjectId, ref:userModelName},
      index: {type:Number, default:0},
      content: String,
      created: {type:Date, default:Date.now},
      is_removed: {type:Boolean, default:false }
  });

  schema.add({
    comments:[commentSchema],
    total_comments : {type:Number, default:0}
  });
    
  schema.methods.listComments = function listComments(){
        return this.comments;
  };
  schema.methods.getComment = function getComment(id ){
        return this.comments.id(id);
  };

  // 1 based index.
  schema.methods.getCommentByIndex1 = function getCommentByIndex1(index ){
        return this.comments[index-1];
  };
  
  schema.methods.addComment = function addComment(param, fnFactory){
    // fnFactory is a function receive subdoc
    // and returns the callback function(err, res) for save()

    var user = param.user, content = param.content;
    if (user === null ){
      throw new Error('Should be a valid user');
    }

    var index = this.comments.length + 1;
    this.comments.push({'user': user, 'content':content, 'index':index});
    var subdoc = this.comments[this.comments.length-1];
    this.total_comments += 1;
    if (2 === arguments.length) {
      // Passing the subdoc to save, ,
      this.save(fnFactory(subdoc));
    }
  };
  schema.methods.updateComment = function updateComment(param, fn){
    var user = param.user, content = param.content, id = param.id;
    var subdoc = this.comments.id(id);
    if (user === null ){
      throw new Error('Should be a valid user');
    }
    if (subdoc === null ){
      throw new Error('Not found');
    }
    // Check if user have auth.
    // populated subdoc's user have attr 'id'
    if ((user.id.toString()  !== subdoc.user.toString()) && (user.id.toString()  !== subdoc.user.id.toString()) )
    {
        throw new Error('Not authorized ');
    }
    subdoc.content = content;
    if (2 === arguments.length) {
      this.save(fn);
    }
  };
  
  schema.methods.delComment = function delComment(param, fn){
    var user = param.user, id = param.id;
    // Remove comment if the user delete it.
    var subdoc = this.comments.id(id);
    // The _id are objects thus assert.equal can not be done.
    if (subdoc === null ){
      throw new Error('Not found');
    }
    if ((user.id.toString()  !== subdoc.user.toString()) && (user.id.toString()  !== subdoc.user.id.toString()) )
    {
      throw new Error('Not authorized ');
    } else {
        subdoc.is_removed = true;
        this.total_comments -= 1;
    }
    if (2 === arguments.length) {
      this.save(fn);
    }
  };
  schema.methods.totalComments = function totalComments(){
    return this.total_comments;
  };
}

module.exports = exports = comments;
