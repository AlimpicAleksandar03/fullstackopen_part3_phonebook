const mongoose = require("mongoose");
const url = process.env.MONGODB_URI;
const uniqueValidator = require("mongoose-unique-validator");
mongoose.connect(url).catch((err) => {
    console.log("error connecting to mongodb: ", err);
});

const personSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
    },
    number: {
        type: String,
        minLength: 8,
    },
});
personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
personSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Person", personSchema);
