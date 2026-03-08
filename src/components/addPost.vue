<script setup lang="ts">
import { ref } from 'vue';
import client from '../utils/http.js';
import { Post } from '../types/Post';

const props = defineProps<{ userId: number }>();
const emit = defineEmits(['added', 'cancel']);

const title = ref('');
const body = ref('');
const isSubmitting = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    const response = await client.post<Post>('/posts', {
      title: title.value,
      body: body.value,
      userId: props.userId
    });
    emit('added', response.data); // Повертаємо новий пост в App.vue
  } catch (error) {
    alert('Failed to add post');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="box has-background-light">
    <h3 class="title is-5">New Post</h3>
    <div class="field">
      <label class="label">Title</label>
      <div class="control">
        <input v-model="title" class="input" type="text" placeholder="Post title" required />
      </div>
    </div>
    <div class="field">
      <label class="label">Body</label>
      <div class="control">
        <textarea v-model="body" class="textarea" placeholder="Post content" required></textarea>
      </div>
    </div>
    <div class="buttons">
      <button type="submit" class="button is-success" :class="{'is-loading': isSubmitting}">Save</button>
      <button type="button" class="button is-text" @click="emit('cancel')">Cancel</button>
    </div>
  </form>
</template>