<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { User } from '../types/User';
import client from '../utils/http.js';
import Loader from './loader.vue';

const emit = defineEmits<{
  (e: 'login', user: User): void
}>();

const userEmail = ref('');
const users = ref<User[]>([]);
const isLoading = ref(false);
const isDropdownLoading = ref(false);
const isOpened = ref(false);
const errorMessage = ref('');

onMounted(async () => {
  isDropdownLoading.value = true;
  try {
    const response = await client.get<User[]>('/users');
    users.value = response.data;
  } catch {
    console.error('Failed to load users');
  } finally {
    isDropdownLoading.value = false;
  }
});

const loginUser = (user: User) => {
  emit('login', user);
};

const handleSubmit = async () => {
  if (!userEmail.value) return;
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const response = await client.get<User[]>(`/users?email=${userEmail.value}`);
    if (response.data.length === 0) {
      errorMessage.value = 'User not found. You need to register first!';
    } else {
      loginUser(response.data[0]);
    }
  } catch {
    errorMessage.value = 'Server error. Try again later.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <section class="container is-flex is-flex-direction-column is-align-items-center mt-6">
    <div class="dropdown" :class="{ 'is-active': isOpened }" @blur="isOpened = false" tabindex="0">
      <div class="dropdown-trigger">
        <button class="button is-info is-light" @click="isOpened = !isOpened">
          <span>Choose from existing users</span>
          <span class="icon is-small"><i class="fas fa-angle-down"></i></span>
        </button>
      </div>
      <div class="dropdown-menu">
        <div class="dropdown-content">
          <div v-if="isDropdownLoading" class="dropdown-item"><Loader /></div>
          <a v-for="u in users" :key="u.id" class="dropdown-item" @mousedown.prevent="loginUser(u)">
            {{ u.name }}
          </a>
        </div>
      </div>
    </div>

    <div class="my-4">or</div>

    <form @submit.prevent="handleSubmit" class="box" style="width: 320px;">
      <h1 class="title is-4">Login</h1>
      <div class="field">
        <label class="label">Email</label>
        <div class="control has-icons-left">
          <input v-model="userEmail" type="email" class="input" placeholder="e.g. bob@mail.com" required />
          <span class="icon is-small is-left"><i class="fas fa-envelope"></i></span>
        </div>
        <p v-if="errorMessage" class="help is-danger">{{ errorMessage }}</p>
      </div>
      <button type="submit" class="button is-primary is-fullwidth" :class="{'is-loading': isLoading}">
        Login
      </button>
    </form>
  </section>
</template>