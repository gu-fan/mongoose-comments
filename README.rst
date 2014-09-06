Mongoose Comments
=================

:version: 0.1.1

A comments plugin for mongoose schemas.

github: http://github.com/rykka/mongoose-comments

Install
-------

::
[npm install mongoose-comments]

Usage
-----

.. code:: javascript

    var comments = require('mongoose-comments');

    articleSchema.plugin(comments, {ref:'User'});

Schema
------

comment
    user: the reference of 'User'.

    index: the comment index start from 1.

    content: the comment content.

    created: created time.

    is_removed: whether the comment is removed.

        :NOTE: The comment is not really removed, only 
               ``is_removed`` is set to ``true``.

              So to get undeleted comments only, 
              you must filter the response with it.
    
total_comment
    the total number of undeleted comment.


Methods
-------

listComments()
    list current's thread's comments

getComment(id)
    get comment by id

getCommentByIndex1(index)
    get comment by index start from 1.

addComment({user:user, content:content}, callbackFactory)
    add comment.

    the callbackFactory is a function with argument of subdoc.
    and return a function for using in save();

    As the save will return the parent document only.

    e.g.::

          function(subdoc){
            return function(err, res){
                if(err) {return handleError(err)};
                console.log(subdoc);
                console.log(res);
            }
        }

delComment({user:user,id:id }, callback)
    delete comment
    The id is the object id of comment.

updateComment({user:user,id:id,content,content}, callback)
    update comment


Test
----


A test is included. 

Firs install mocha with ``npm install -g mocha``
And install mongoose by ``npm install``.

Then just run ``mocha``
