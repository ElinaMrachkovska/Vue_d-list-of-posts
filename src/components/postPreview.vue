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

// Редагування поста прямо в sidebar
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
    commentsError.value = 'Failed to load comments.';
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

const handleCommentDelete = async (id: number) => {
  try {
    await client.delete(`/comments/${id}`);
    comments.value = comments.value.filter(c => c.id !== id);
  } catch {
    console.error('Failed to delete comment');
  }
};
</script>

<template>
  <div class="content">

    <!-- Заголовок поста: звичайний вигляд -->
    <template v-if="!isEditing">
      <div class="block is-flex is-justify-content-space-between is-align-items-flex-start">
        <div>
          <h2 class="title is-4">#{{ post.id }}: {{ post.title }}</h2>
          <p>{{ post.body }}</p>
        </div>
        <!-- Іконки дій -->
        <div class="is-flex is-align-items-center" style="gap: 8px; flex-shrink: 0;">
          <button
            class="button is-ghost p-1"
            type="button"
            title="Edit post"
            @click="startEdit"
          >
            <span class="icon has-text-grey">
              <i class="fas fa-pen"></i>
            </span>
          </button>
          <button
            class="button is-ghost p-1"
            type="button"
            title="Delete post"
            @click="emit('delete', post.id)"
          >
            <span class="icon has-text-danger">
              <i class="fas fa-trash"></i>
            </span>
          </button>
        </div>
      </div>
    </template>

    <!-- Заголовок поста: режим редагування -->
    <template v-else>
      <div class="block">
        <div class="field">
          <label class="label is-small">Title</label>
          <input v-model="editTitle" class="input" placeholder="Post title" />
        </div>
        <div class="field">
          <label class="label is-small">Body</label>
          <textarea v-model="editBody" class="textarea" rows="3" placeholder="Post body" />
        </div>
        <div class="buttons">
          <button class="button is-success is-small" type="button" @click="saveEdit">Save</button>
          <button class="button is-light is-small" type="button" @click="cancelEdit">Cancel</button>
        </div>
      </div>
    </template>

    <hr />

    <!-- Коментарі -->
    <div class="block">
      <h3 class="title is-5">Comments</h3>

      <Loader v-if="isLoading" />

      <template v-else>
        <div v-if="commentsError" class="notification is-danger is-light">
          {{ commentsError }}
        </div>

        <p v-else-if="comments.length === 0" class="has-text-grey">
          No comments yet.
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
            @click="isFormVisible = true"
          >
            Write a comment
          </button>

          <template v-else>
            <NewCommentForm
              :postId="post.id"
              @added="handleCommentAdded"
              @cancel="isFormVisible = false"
            />
            <button
              class="button is-light is-small mt-2"
              type="button"
              @click="isFormVisible = false"
            >
              Close form
            </button>
          </template>
        </div>
      </template>
    </div>

  </div>
</template>