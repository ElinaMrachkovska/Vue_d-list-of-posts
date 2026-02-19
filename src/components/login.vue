<script setup lang="ts">
import { ref } from 'vue';
import { User } from '../types/User';
import client from '../utils/http.js';

const emit = defineEmits<{
  (e: 'login', user: User): void
}>();

const userEmail = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const handleSubmit = async () => {
  if (!userEmail.value.trim()) {
    errorMessage.value = 'Please enter your email';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await client.get<User[]>(`/users?email=${userEmail.value.trim()}`);

    if (response.data.length === 0) {
      errorMessage.value = 'User not found. Please check your email.';
    } else {
      emit('login', response.data[0]);
    }
  } catch {
    errorMessage.value = 'Server error. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <section class="container is-flex is-flex-direction-column is-align-items-center mt-6">
    <div class="box" style="width: 360px;">
      <h1 class="title is-4">Get your userId</h1>

      <div class="field">
        <label class="label">Email</label>
        <div class="control has-icons-left">
          <input
            v-model="userEmail"
            type="email"
            class="input"
            :class="{ 'is-danger': errorMessage }"
            placeholder="Enter your email"
            @keyup.enter="handleSubmit"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
        <p v-if="errorMessage" class="help is-danger">{{ errorMessage }}</p>
      </div>

      <button
        class="button is-primary is-fullwidth"
        :class="{ 'is-loading': isLoading }"
        @click="handleSubmit"
      >
        Login
      </button>
    </div>
  </section>
</template>