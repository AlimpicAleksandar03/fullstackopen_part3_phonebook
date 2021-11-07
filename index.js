require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const logger = morgan((tokens, req, resp) => {
    console.log("METHOD: ", req.method);
    console.log("BODY: ", req.body);
    console.log("PATH: ", req.path);
});
app.use(cors());
app.use(express.json());
app.use(express.static("build"));
app.use(logger);

app.get("/", (req, resp) => {
    resp.send(`<h1>Hello Wolrd!</h1>`);
});
app.get("/api/persons", (req, resp) => {
    Person.find({})
        .then((people) => {
            resp.json(people);
        })
        .catch((err) => next(err));
});
app.get("/info", (req, resp) => {
    Person.find({}).then((people) => {
        resp.send(`
        <p>Phone book has info for ${people.length} people</p>
        <p>${new Date()}</p>
        `);
    });
});
app.get("/api/persons/:id", (req, resp) => {
    Person.findById(req.params.id).then((person) => {
        resp.json(person);
    });
});
app.delete("/api/persons/:id", (req, resp, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then((result) => {
            resp.status(204).end();
        })
        .catch((error) => next(error));
});
app.put("/api/persons/:id", (req, resp, next) => {
    const body = req.body;
    const person = {
        name: body.name,
        number: body.number,
    };
    Person.findByIdAndUpdate(req.params.id, person, {
        new: person.number,
    })
        .then((result) => {
            resp.json(result);
        })
        .catch((err) => next(err));
});
app.post("/api/persons", (req, resp, next) => {
    const body = req.body;
    if (!body.name) return resp.status(400).json({ error: "Name is missing" });
    if (!body.number)
        return resp.status(400).json({ error: "Number is missing" });
    const person = new Person({
        name: body.name,
        number: body.number,
    });
    person
        .save()
        .then((savedPerson) => {
            resp.json(savedPerson);
        })
        .catch((err) => next(err));
});
const errorHandler = (err, req, resp, next) => {
    console.log(err);
    if (err.name === "CastError") {
        return resp.status(400).send({ error: "malformatted id" });
    } else if (err.name === "ValidationError") {
        return resp.status(400).json({ error: err.message });
    }
    next(err);
};
app.use(errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT);
