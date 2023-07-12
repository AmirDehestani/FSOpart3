const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

app = express();
app.use(cors());
app.use(express.json());

morgan.token('data', function (request, response) {
  return request.method === 'POST' ? JSON.stringify(request.body) : null;
});
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
);

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

const generateId = () => {
  const id = Math.floor(Math.random() * 1000000);
  return id;
};

app.get('/info', (request, response) => {
  const personsCount = persons.length;
  const currentTime = Date();
  response.send(
    `<p>Phonebook has info for ${personsCount} people</p>
    <p>${currentTime}</p>`
  );
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).json({
      error: 'Person not found',
    });
  }
});

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
  } else if (persons.find((person) => person.name === name)) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  }

  const person = {
    id: generateId(),
    name: name,
    number: number,
  };

  persons = persons.concat(person);
  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
