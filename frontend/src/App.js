import { useState, useEffect } from 'react';
import Persons from './components/Persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import phonebookService from './services/phonebookService';
import Message from './components/Message';

const App = () => {
  // App compontent state
  const [persons, setPersons] = useState([]);
  const [newPerson, setnewPerson] = useState({ name: '', number: '' });
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([
    { name: '', numebr: '' },
  ]);
  const [message, setMessage] = useState({
    message: null,
    type: null,
  });

  // Load the data from database
  useEffect(() => {
    phonebookService
      .getAll()
      .then((respond) => setPersons(respond))
      .catch((error) => {
        setMessage({ message: error.response.data.error, type: 'error' });
        setTimeout(() => {
          setMessage({ message: null, type: null });
        }, 5000);
      });
  }, []);

  // Handlers
  const handleNameChange = (event) => {
    setnewPerson({ name: event.target.value, number: newPerson.number });
  };

  const handleNumberChange = (event) => {
    setnewPerson({ name: newPerson.name, number: event.target.value });
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setSearchResults(
      persons.filter((person) =>
        person.name.toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
  };

  const handleNameSubmit = (event) => {
    event.preventDefault();
    const personExists = persons.find(
      (person) => JSON.stringify(person.name) === JSON.stringify(newPerson.name)
    );

    // Person exists, ask user if they want to update the existing number
    if (personExists) {
      if (
        window.confirm(
          `${newPerson.name} is already added to the phonebook, replace the old number with a new one?`
        )
      ) {
        const id = personExists.id;
        phonebookService
          .update(id, newPerson)
          .then((response) => {
            setPersons(
              persons.map((person) => (person.id !== id ? person : response))
            );
            setnewPerson({ name: '', number: '' });
            setMessage({
              message: `Updated ${response.name}`,
              type: 'success',
            });
            setTimeout(() => {
              setMessage({ message: null, type: null });
            }, 5000);
          })
          .catch((error) => {
            setMessage({ message: error.response.data.error, type: 'error' });
            setTimeout(() => {
              setMessage({ message: null, type: null });
            }, 5000);
          });
      }

      // Person doesn't already exist, add it
    } else {
      phonebookService
        .create(newPerson)
        .then((response) => {
          setPersons(persons.concat(response));
          setnewPerson({ name: '', number: '' });
          setMessage({ message: `Added ${response.name}`, type: 'success' });
          setTimeout(() => {
            setMessage({ message: null, type: null });
          }, 5000);
        })
        .catch((error) => {
          setMessage({ message: error.response.data.error, type: 'error' });
          setTimeout(() => {
            setMessage({ message: null, type: null });
          }, 5000);
        });
    }
  };

  const handleDelete = (person) => {
    const name = person.name;
    const id = person.id;
    if (window.confirm(`Delete ${name}?`)) {
      phonebookService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          setMessage({ message: error.response.data.error, type: 'error' });
          setTimeout(() => {
            setMessage({ message: null, type: null });
          }, 5000);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Message message={message.message} type={message.type} />
      <Filter searchQuery={search} handleChange={handleSearchChange} />

      <h2>add a new</h2>
      <PersonForm
        handleSubmit={handleNameSubmit}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        person={newPerson}
      />

      <h2>Numbers</h2>
      <Persons
        persons={!search ? persons : searchResults}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default App;
