const DeleteButton = ({ handleClick, person }) => {
  return <button onClick={() => handleClick(person)}>Delete</button>;
};

const Persons = ({ persons, handleDelete }) =>
  persons.map((person) => (
    <p key={person.name}>
      {person.name} {person.number}{' '}
      <DeleteButton handleClick={handleDelete} person={person} />
    </p>
  ));

export default Persons;
