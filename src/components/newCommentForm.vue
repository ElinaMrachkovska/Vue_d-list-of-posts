<script setup lang="ts">
import { ref } from 'vue';
import client from '../utils/http.js';
import { Comment } from '../types/Comment';
import InputField from '../blocks/inputField.vue'; // Імпортуємо ваш компонент

const props = defineProps<{ postId: number }>();
const emit = defineEmits(['added', 'cancel']);

const name = ref('');
const email = ref('');
const body = ref('');
const isSubmitting = ref(false);

// Очищення форми (кнопка Clear)
const clearForm = () => {
  name.value = '';
  email.value = '';
  body.value = '';
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    const response = await client.post<Comment>('/comments', {
      postId: props.postId,
      name: name.value,
      email: email.value,
      body: body.value,
    });
    
    emit('added', response.data);
    clearForm();
  } catch (error) {
    alert('Failed to send comment');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="box has-background-light">
    <InputField
      v-model="name"
      title="Author Name"
      name="name"
      placeholder="Name Surname"
    />

    <InputField
      v-model="email"
      title="Author Email"
      name="email"
      placeholder="email@test.com"
    />

    <div class="field">
      <label class="label">Comment Text</label>
      <div class="control">
        <textarea 
          v-model="body" 
          class="textarea" 
          required 
          placeholder="Type comment here"
        ></textarea>
      </div>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button 
          type="submit" 
          class="button is-link" 
          :class="{'is-loading': isSubmitting}"
        >
          Add
        </button>
      </div>
      <div class="control">
        <button 
          type="button" 
          class="button is-link is-light" 
          @click="clearForm"
        >
          Clear
        </button>
      </div>
    </div>
  </form>
</template>