const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.static("build"));

app.use(
    morgan((tokens, req, resp) => {
        console.log("METHOD: ", req.method);
        console.log("BODY: ", req.body);
        console.log("PATH: ", req.path);
    })
);

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

app.get("/", (req, resp) => {
    resp.send(`<h1>Hello Wolrd!</h1>`);
});
app.get("/api/persons", (req, resp) => {
    resp.send(persons);
});
app.get("/info", (req, resp) => {
    resp.send(`
        <p>Phone book has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `);
});
app.get("/api/persons/:id", (req, resp) => {
    const id = Number(req.params.id);
    const person = persons.find((p) => p.id === id);
    if (!person) return resp.status(404).end();
    resp.json(person);
});
app.delete("/api/persons/:id", (req, resp) => {
    const id = Number(req.params.id);
    const person = persons.find((p) => p.id === id);
    persons = persons.filter((p) => p.id != person.id);
    resp.status(204).end();
});
app.post("/api/persons", (req, resp) => {
    const body = req.body;
    if (!body.name) return resp.status(400).json({ error: "Name is missing" });
    if (!body.number)
        return resp.status(400).json({ error: "Number is missing" });
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    };
    if (persons.find((p) => p.name === person.name))
        return resp.status(400).json({ error: "Name must be unique" });
    while (persons.find((p) => p.id === person.id)) {
        person.id = generateId();
    }
    persons = persons.concat(person);
    resp.json(person);
});
const generateId = () => {
    return Math.round(Math.random() * 100000);
};
const PORT = process.env.PORT || 3001;
app.listen(PORT);
