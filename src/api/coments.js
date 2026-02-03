import { client } from '@/utils/http';

export const getComments = async (postId) => {
  const response = await client
  .get(`/comments?postId=${postId}`);

  return response.data;
};

export const createComments = async (postId, body) => {
  const response = await client.
  post('/comments', {
    postId,
    body,
  });

  return response.data;
};
export const updateComments = async ({ id, title,body }) => {
  const response = await client.
  patch(`/comments/${id}`, {
    title,
    body,

  });

  return response.data;
};

export const deleteComments = async id => {
  const response = await client
  .delete(`/comments/${id}`);

  return response.data;
};
