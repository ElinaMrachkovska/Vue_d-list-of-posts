<script setup lang="ts">
import { ref, watch } from 'vue';
import { Post } from '../types/Post';
import { Comment } from '../types/Comment';
import client from '../utils/http.js';
import Loader from './loader.vue';
import CommentItem from './commentItem.vue';
import NewCommentForm from './newCommentForm.vue'; // Новий компонент

const props = defineProps<{ post: Post }>();

const comments = ref<Comment[]>([]);
const isLoading = ref(false);
const isFormVisible = ref(false); // Керує показом форми

const fetchComments = async (postId: number) => {
  isLoading.value = true;
  try {
    const response = await client.get<Comment[]>(`/comments?postId=${postId}`);
    comments.value = response.data;
  } catch (error) {
    console.error('Failed to load comments');
  } finally {
    isLoading.value = false;
  }
};

// Оновлюємо коментарі при зміні поста
watch(() => props.post, (newPost) => {
  if (newPost) {
    fetchComments(newPost.id);
    isFormVisible.value = false; // Закриваємо форму при переході на інший пост
  }
}, { immediate: true });

const handleCommentAdded = (newComment: Comment) => {
  comments.value.push(newComment);
  isFormVisible.value = false;
};
</script>

<template>
  <div class="content">
    <div class="block">
      <h2 class="title is-4">#{{ post.id }}: {{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>

    <hr />

    <div class="block">
      <h3 class="title is-5">Comments:</h3>
      <Loader v-if="isLoading" />
      
      <template v-else>
        <div v-if="comments.length === 0" class="notification is-info">
          No comments yet.
        </div>
        
        <CommentItem 
          v-for="comment in comments" 
          :key="comment.id" 
          v-bind="comment" 
          @delete="(id) => comments = comments.filter(c => c.id !== id)"
        />

        <div class="mt-5">
          <NewCommentForm 
            v-if="isFormVisible" 
            :postId="post.id"
            @added="handleCommentAdded"
            @cancel="isFormVisible = false"
          />
          <button 
            v-else 
            class="button is-link" 
            @click="isFormVisible = true"
          >
            Write a comment
          </button>
        </div>
      </template>
    </div>
  </div>
</template>