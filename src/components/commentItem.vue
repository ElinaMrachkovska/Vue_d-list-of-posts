<script setup lang="ts">
import { Comment } from '../types/Comment';

// Тут ми очікуємо id, name, email, body окремо
defineProps<Comment>();
const emit = defineEmits<{
(e: 'delete', id: number): void;
}>();

</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${email}`">{{ name }}</a>
      <button 
      class="delete is-small"
      type="button"
      @click="$emit('delete', id)"
    ></button>
    </div>
    <div class="message-body">
      {{ body }}
    </div>
  </article>
</template>