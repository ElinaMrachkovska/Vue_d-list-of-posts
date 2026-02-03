<script setup lang="ts">
import { Post } from '../types/Post';

defineProps<{
  posts: Post[];
  selectedPostId: number | null;
}>();

const emit = defineEmits(['select']);
</script>

<template>
  <table class="table is-fullwidth is-striped is-hoverable is-narrow">
    <thead>
      <tr class="has-background-link-light">
        <th>#</th>
        <th>Title</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="post in posts" :key="post.id">
        <td>{{ post.id }}</td>
        <td>{{ post.title }}</td>
        <td class="has-text-right">
          <button
            class="button is-link"
            :class="{ 'is-light': selectedPostId !== post.id }"
            @click="emit('select', post)"
          >
            {{ selectedPostId === post.id ? 'Close' : 'Open' }}
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>