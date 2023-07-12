import axios from 'axios';
const url = '/api/persons';

const getAll = () => {
  const request = axios.get(url);
  return request.then((response) => response.data);
};

const create = (newPerson) => {
  const request = axios.post(url, newPerson);
  return request.then((response) => response.data);
};

const remove = (id) => {
  return axios.delete(`${url}/${id}`);
};

const update = (id, updatedPerson) => {
  const request = axios.put(`${url}/${id}`, updatedPerson);
  return request.then((response) => response.data);
};

const phonebookService = { getAll, create, remove, update };

export default phonebookService;
