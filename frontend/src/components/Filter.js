const Filter = ({ searchQuery, handleChange }) => {
  return (
    <div>
      filter shown with <input onChange={handleChange} value={searchQuery} />
    </div>
  );
};

export default Filter;
