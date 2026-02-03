import { client } from '@/utils/http';

export const getUsers = async (userId) => {
  const response = await client
  .get(`/users/${userId}`);

  return response.data;
};

export const createUser = async (name, email) => {
  const response = await client.
  post('/users', {
    name,
    email,
  });

  return response.data;
};

export const updateUser = async ({ id, name, email }) => {
  const response = await client.
  patch(`/users/${id}`, {
    name,
    email,
  });

  return response.data;
};

export const deleteUser = async id => {
  const response = await client
  .delete(`/users/${id}`);

  return response.data;
};


