const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const docSchema = new Schema({
    filename : {type:String, required:true },
    filePath : {type:String,required:true,},
    uploadBy:{type:any,ref:'User',required:true}
})

module.exports = mongoose.model('Document',docSchema);