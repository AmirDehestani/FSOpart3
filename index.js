const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person.js');

app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('build'));

morgan.token('data', function (request, response) {
  return request.method === 'POST' ? JSON.stringify(request.body) : null;
});
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
);

app.get('/info', (request, response) => {
  const currentTime = Date();
  Person.count().then((personsCount) => {
    response.send(
      `<p>Phonebook has info for ${personsCount} people</p>
      <p>${currentTime}</p>`
    );
  });
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

// Doesn't work for now
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post('/api/persons/', (request, response) => {
  const name = request.body.name;
  const number = request.body.number;

  if (!name || !number) {
    return response.status(400).json({
      error: 'name or number missing',
    });
  }

  const person = new Person({
    name: name,
    number: number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => console.log('Failed to add person', error.message));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
