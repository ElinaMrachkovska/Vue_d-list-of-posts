<script setup lang="ts">
import { ref } from 'vue';
import client from '../utils/http.js';
import { Comment } from '../types/Comment';
import InputField from '../blocks/inputField.vue'; 
import textAreaField from '../blocks/textAreaField.vue';

const props = defineProps<{ postId: number }>();
const emit = defineEmits<{
  (e: 'added', comment: Comment): void
  (e: 'cancel'): void
}>();


const name = ref('');
const email = ref('');
const body = ref('');
const isSubmitting = ref(false);


const nameError = ref('');
const emailError = ref('');
const bodyError = ref('');

// Очищення форми (кнопка Clear)
const clearForm = () => {
  name.value = '';
  email.value = '';
  body.value = '';
  nameError.value = '';
  emailError.value = '';
  bodyError.value = '';
};

const validate = (): boolean => {
  let isValid = true;

  if (!name.value.trim()) {
    nameError.value = 'Name is required';
    isValid = false;
  } else {
    nameError.value = '';
  }

  if (!email.value.trim()) {
    emailError.value = 'Email is required';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Email is not valid';
    isValid = false;
  } else {
    emailError.value = '';
  }

  if (!body.value.trim()) {
    bodyError.value = 'Comment text is required';
    isValid = false;
  } else {
    bodyError.value = '';
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validate()) return;

  isSubmitting.value = true;
  try {
    const response = await client.post<Comment>('/comments', {
      postId: props.postId,
      name: name.value.trim(),
      email: email.value.trim(),
      body: body.value.trim(),
    });
    emit('added', response.data);
    // Очищаємо лише body — ім'я та email залишаємо для зручності
    body.value = '';
    bodyError.value = '';
  } catch {
    bodyError.value = 'Failed to send comment. Please try again.';
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
      :errorMessage="nameError"
    />

    <InputField
      v-model="email"
      title="Author Email"
      name="email"
      placeholder="email@test.com"
      :errorMessage="emailError"
    />

    <TextAreaField
      v-model="body"
      title="Comment Text"
      name="body"
      placeholder="Type comment here"
      :errorMessage="bodyError"
    />

    <div class="field is-grouped">
      <div class="control">
        <button 
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': isSubmitting }"
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