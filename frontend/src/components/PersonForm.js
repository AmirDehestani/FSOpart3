const PersonForm = ({
  handleSubmit,
  handleNameChange,
  handleNumberChange,
  person,
}) => (
  <form onSubmit={handleSubmit}>
    <div>
      name: <input onChange={handleNameChange} value={person.name} />
    </div>
    <div>
      number: <input onChange={handleNumberChange} value={person.number} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

export default PersonForm;
