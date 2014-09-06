var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Thread = require('../thread.js');
var User = require('../user.js');
var should = require('should');

var user, thread;

describe('Comment Plugin Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			name: 'Kim',
		});

        thread = new Thread({thread:'001'});

		user.save(function() {
          thread.addComment({user:user,content:'init'})
		  thread.save(function(){
              done();
		  });
		});
	});

	describe('List comments', function() {
		it('should be able to list comments', function(done) {
                  comments = thread.listComments();
                  should(comments.length).eql(1);
                  should(comments[0].content).eql('init');
                  done();
          });
    });

	describe('Get comment', function() {
		it('should be able to get comment by id', function(done) {
		    var id = thread.comments[0].id;
            should(thread.getComment(id).index).eql(comments[0].index);
            done();
          });
    });
	describe('Get comment by index', function() {
		it('should be able to get comment by index1', function(done) {
            should(thread.getCommentByIndex1(1).index).eql(comments[0].index);
            done();
          });
    });
	describe('Add comment', function() {
		it('should be able to add comment', function(done) {
		    thread.addComment({user:user, content:'Hello'}, 
		      function(subdoc){
		        return function(err, res){
                  should(err).not.ok;
                  should(subdoc.index).eql(2);
                  should(subdoc).eql(res.comments[1]);
                  should(res.comments.length).eql(2);
                  should(res.comments[1].content).eql('Hello');
                  done();
		        }
		    });
      });

	});

	describe('update comment', function() {
		it('should be able to update comment', function(done) {
		    Thread.findOne({thread:'001'}).exec(function(err, res){

                id = res.comments[0]._id
                res.updateComment({user:user, id:id, content:'DDDD'}, 
                  function(err, res){
                    should(err).not.ok;
                    should(res.totalComments()).eql(1);
                    should(res.comments.id(id).content).eql('DDDD');
                    done();
                });
		    });
      });
	});
	describe('Delete comment', function() {
		it('should be able to del comment', function(done) {
		    Thread.findOne({thread:'001'}).exec(function(err, res){

                id = res.comments[0]._id
                res.delComment({user:user, id:id}, 
                  function(err, res){
                    should(err).not.ok;
                    should(res.comments[0].is_removed).eql(true);
                    should(res.totalComments()).eql(0);
                    should(res.comments.length).eql(1);
                    done();
                });
		    });
      });
	});
	afterEach(function(done) {
		User.remove().exec();
		Thread.remove().exec();
		done();
	});
});

