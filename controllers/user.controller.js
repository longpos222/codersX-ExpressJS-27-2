const db = require('../db.js');
const shortid = require('shortid');

module.exports.index = (req, res) => {
  var q = req.query.q;
  var users = db.get('users').value();
  if(!q) {
    res.render('users/index',{
        users: users,
        value: q
      });
  } else {
    filterUsers = users.filter((val)=>{
      return val.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });
    res.render('users/index',{
      users: filterUsers,
      value: q
    });
  }
};

module.exports.add = (req, res) => {
  req.body._id = shortid();
  var errors = [];
  if(!req.body.name) {
    errors.push('User name can not be empty.');
  }

  if(req.body.name.length > 30) {
    errors.push('User name can not longer than 30 chars.');
  }
  
  if(!req.body.email) {
    errors.push('Email can not be empty.');
  }

  if(errors.length) {
    var users = db.get('users').value();
    res.render('users/index',{
      users: users,
      errors : errors
    });
    return;
  }

  db.get('users').push(req.body).write();
  res.redirect('/users');
}; 

module.exports.delete = (req, res) => {
  db.get('users').remove({_id : req.params._id}).write();
  res.redirect('/users');
};

module.exports.update = (req, res) => {
  var [user] = db.get('users').filter({_id : req.params._id}).value();
  res.render('users/update',{
    user: user
  });
};

module.exports.postUpdate = (req, res) => {
  db.get('users')
  .find({_id : req.params._id})
  .assign({name: req.body.name})
  .write();
  res.redirect('/users');
};