module.exports = function(app) {
    var todoList = require('../controllers/todoController');
  
    // todoList Routes
    app.route('/tasks')
      .get(todoList.list_all_tasks)
      .post(todoList.create_a_task)

      app.route('/paginatedTasks')
      .get(todoList.paginated_list_all_tasks)
      
      app.route('/textualSearch')
      .get(todoList.textual_search)
  
    app.route('/tasks/:taskId')
    .put(todoList.update_a_task)
    .delete(todoList.soft_delete_a_task);
  };