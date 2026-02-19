<script setup lang="ts">
import PostPreview from './postPreview.vue';
import AddPost from './addPost.vue';
import { Post } from '../types/Post';

defineProps<{
  selectedPost: Post | null;
  isAdding: boolean;
  userId: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'post-added'): void
  (e: 'delete', postId: number): void
  (e: 'edit', post: Post): void
}>();
</script>

<template>
  <div
    class="tile is-parent is-8-desktop Sidebar"
    :class="{ 'Sidebar--open': selectedPost || isAdding }"
  >
    <div class="tile is-child box is-success">
      <div class="content">
        <AddPost
          v-if="isAdding"
          :userId="userId"
          @post-added="emit('post-added')"
          @cancel="emit('close')"
        />
        <PostPreview
          v-else-if="selectedPost"
          :post="selectedPost"
          @close="emit('close')"
          @delete="(id) => emit('delete', id)"
          @edit="(post) => emit('edit', post)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;

  @media (min-width: 769px) {
    max-width: 0;
  }

  &--open {
    opacity: 1;

    @media (min-width: 769px) {
      max-width: 50%;
    }
  }
}

.message-body {
  white-space: pre-line;
}
</style>