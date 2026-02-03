<script setup lang="ts">
import  {ref, onMounted} from 'vue';
import { User } from '../types/User';
import client from '../utils/http.js';


const user = ref<User | null>(null);
  const userName = ref('');

onMounted(async () => {
  try {
    const response = await client.get('/api/user');
    user.value = response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
  }
});
</script>
<template>


<div class="field">
  <label class="label" 
  for="user-name"> Your Name </label>

  <div class="control has-icons-left"
  v-if="user">
    <input 
    v-model.trim="userName"
      type="text"
      id="user-name"
      name="name"
      class="input"
      placeholder="Enter your name"
      required
      minlength="4"
    />

    <span class="icon is-small is-left">
      <i class="fas fa-user"></i>
    </span>
  </div>

  <p v-else
  class="help is-danger">
  Error: user not found</p>
</div>
</template>