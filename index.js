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
  const id = request.params.id;

  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        return response.status(404).json({
          error: `Person with id "${id}" not found`,
        });
      }
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

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        return response.status(404).json({
          error: `Information of ${body.name} has already been removed from the server`,
        });
      }
    })
    .catch((error) => {
      console.log('error sent');
      next(error);
    });
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
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);
