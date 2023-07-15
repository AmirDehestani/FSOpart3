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

app.get('/info', (request, response, next) => {
  const currentTime = Date();
  Person.count()
    .then((personsCount) => {
      response.send(
        `<p>Phonebook has info for ${personsCount} people</p>
      <p>${currentTime}</p>`
      );
    })
    .catch((error) => next(error));
});

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person);
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndRemove(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post('/api/persons/', (request, response, next) => {
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
    .catch((error) => next(error));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});

const errorHandler = (error, request, response, next) => {
  console.log('error name:', error.name);
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};
app.use(errorHandler);
