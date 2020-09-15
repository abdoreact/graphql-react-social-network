const {model, Schema} = require("mongoose")
const {hash} = require('argon2')
const userSchema=new Schema({
    username:{
        type:String,
        minlength:[2, 'Error. Username below two characters.'],
        validate:[(username) => {
            return /^[0-9a-zA-Z_.-]+$/.test(username);
        }, "Error. Username's can not container special characters."],
        unique:true,
        maxlength:[30, "Error. Username longer than 30 characters."]
    },
    email:{
        type:String,
        unique:true,
        validate:[(email) => {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }, 'Error. Invalid Email.']
    },
    password:{
        type:String,
        minlength:[8, "Error. Password below eight characters."]
    }
})
userSchema.pre('save', async function(next){
    this.password=await hash(this.password)
    next();
})
module.exports=model('User', userSchema)