const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    listId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"List",
        required: true
    },
    description:{
        type: String,
        required: true
    },
    isCompleted:{
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
});


TaskSchema.pre("save", function (next){
    this.updatedAt = Date.now();
    next();
});


module.exports = mongoose.model("Task", TaskSchema);