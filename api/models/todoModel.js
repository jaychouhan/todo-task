var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TaskSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the task'
  },
  active:{
      type:Number,
      default:1
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
  completed: {
    type: Boolean,
    default: false
  }
});

TaskSchema.index({
    name: 'text',
  });

module.exports = mongoose.model('Tasks', TaskSchema);