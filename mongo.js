const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log(
        "Please provide the password as an argument: node mongo.js <password>"
    );
    process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://AleksandarAlimpic:${password}@cluster0.9ph3j.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model("Person", personSchema);
if (!name && !number) {
    Person.find({}).then((result) => {
        console.log("Phonebook:");
        result.forEach((person) => {
            console.log(person.name, person.number);
        });
        mongoose.connection.close();
    });
} else {
    const person = new Person({
        name,
        number,
    });

    person.save().then((result) => {
        console.log(
            `Added ${result.name} number ${result.number} to phonebook`
        );
        mongoose.connection.close();
    });
}