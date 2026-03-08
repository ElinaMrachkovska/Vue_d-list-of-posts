<script setup lang="ts">
import { ref, watch } from 'vue';
import { Post } from '../types/Post';
import { Comment } from '../types/Comment';
import client from '../utils/http.js';
import Loader from './loader.vue';
import CommentItem from './commentItem.vue';
import NewCommentForm from './newCommentForm.vue';

const props = defineProps<{ post: Post }>();
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'delete', postId: number): void
  (e: 'edit', post: Post): void
}>();

const comments = ref<Comment[]>([]);
const isLoading = ref(false);
const isFormVisible = ref(false);
const commentsError = ref('');

const isEditing = ref(false);
const editTitle = ref('');
const editBody = ref('');

const startEdit = () => {
  isEditing.value = true;
  editTitle.value = props.post.title;
  editBody.value = props.post.body;
};

const cancelEdit = () => {
  isEditing.value = false;
};

const saveEdit = () => {
  if (!editTitle.value.trim() || !editBody.value.trim()) return;
  emit('edit', { ...props.post, title: editTitle.value.trim(), body: editBody.value.trim() });
  isEditing.value = false;
};

const fetchComments = async (postId: number) => {
  isLoading.value = true;
  commentsError.value = '';
  try {
    const response = await client.get<Comment[]>(`/comments?postId=${postId}`);
    comments.value = response.data;
  } catch {
    commentsError.value = 'Something went wrong';
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => props.post,
  (newPost) => {
    if (newPost) {
      fetchComments(newPost.id);
      isFormVisible.value = false;
      isEditing.value = false;
    }
  },
  { immediate: true }
);

const handleCommentAdded = (newComment: Comment) => {
  comments.value.push(newComment);
};

// Негайне видалення без очікування сервера (UX)
const handleCommentDelete = (id: number) => {
  comments.value = comments.value.filter(c => c.id !== id);
  client.delete(`/comments/${id}`).catch(() => {
    console.error('Failed to delete comment on server');
  });
};
</script>

<template>
  <div class="content" data-cy="PostDetails">

    <!-- Звичайний перегляд поста -->
    <template v-if="!isEditing">
      <div class="block">
        <div class="is-flex is-justify-content-space-between is-align-items-center">
          <h2>#{{ post.id }}: {{ post.title }}</h2>
          <div class="is-flex">
            <span
              class="icon is-small is-right is-clickable"
              @click="startEdit"
              data-cy="PostEditButton"
            >
              <i class="fas fa-pen-to-square"></i>
            </span>
            <span
              class="icon is-small is-right has-text-danger is-clickable ml-3"
              @click="emit('delete', post.id)"
              data-cy="PostDeleteButton"
            >
              <i class="fas fa-trash"></i>
            </span>
          </div>
        </div>
        <p data-cy="PostBody">{{ post.body }}</p>
      </div>
    </template>

    <!-- Режим редагування поста -->
    <template v-else>
      <div class="block">
        <h2>#{{ post.id }}</h2>
        <form @submit.prevent="saveEdit">
          <div class="field">
            <label class="label">Title</label>
            <div class="control">
              <input v-model="editTitle" class="input" placeholder="Post title" />
            </div>
          </div>
          <div class="field">
            <label class="label">Body</label>
            <div class="control">
              <textarea v-model="editBody" class="textarea" rows="4" placeholder="Post body" />
            </div>
          </div>
          <div class="field is-grouped">
            <div class="control">
              <button type="submit" class="button is-link">Save</button>
            </div>
            <div class="control">
              <button type="button" class="button is-link is-light" @click="cancelEdit">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </template>

    <hr />

    <!-- Коментарі -->
    <div class="block" data-cy="PostComments">
      <p class="title is-5">Comments:</p>

      <Loader v-if="isLoading" />

      <template v-else>
        <div
          v-if="commentsError"
          class="notification is-danger"
          data-cy="CommentsError"
        >
          {{ commentsError }}
        </div>

        <p
          v-else-if="comments.length === 0 && !isFormVisible"
          class="title is-4"
          data-cy="NoCommentsMessage"
        >
          No comments yet
        </p>

        <CommentItem
          v-for="comment in comments"
          :key="comment.id"
          v-bind="comment"
          @delete="handleCommentDelete"
        />

        <div class="mt-4">
          <button
            v-if="!isFormVisible"
            class="button is-link"
            type="button"
            data-cy="WriteCommentButton"
            @click="isFormVisible = true"
          >
            Write a comment
          </button>

          <NewCommentForm
            v-else
            :postId="post.id"
            @added="handleCommentAdded"
          />
        </div>
      </template>
    </div>

  </div>
</template>