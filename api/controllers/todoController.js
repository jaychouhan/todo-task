var mongoose = require('mongoose'),
Task = mongoose.model('Tasks');

exports.paginated_list_all_tasks = function(req, res) {
    var pageNo = parseInt(req.query.pageNo)
    var size = parseInt(req.query.size)
    
    if(pageNo < 0 || pageNo === 0) {
          response = {"error" : true,"message" : "invalid page number, should start with 1"};
          return res.json(response)
    }

    skipDocuments = size * (pageNo - 1)
    
    Task.find({active:1},function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  }).limit(size).skip(skipDocuments);
};

exports.textual_search = function(req, res) {
    Task.find({
        $text: { $search: req.query.keyword },
      }, function(err, task) {
      if (err)
        res.send(err);
      res.json(task);
    });
  };

  exports.list_all_tasks = function(req, res) {
    Task.find({active:1}, function(err, task) {
      if (err)
        res.send(err);
      res.json(task);
    });
  };

exports.create_a_task = function(req, res) {
  var new_task = new Task(req.body);
  new_task.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.update_a_task = function(req, res) {
  Task.findOneAndUpdate({_id: req.params.taskId}, {completed:req.body.completed}, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.soft_delete_a_task = function(req, res) {
    Task.findOneAndUpdate({_id: req.params.taskId}, {active: 0}, {new: true}, function(err, task) {
        if (err)
          res.send(err);
          res.json(task);
      });
};