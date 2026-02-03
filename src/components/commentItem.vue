<script setup lang="ts">
import { Comment } from '../types/Comment';

// Тут ми очікуємо id, name, email, body окремо
defineProps<Comment>();
</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${email}`">{{ name }}</a>
    </div>
    <div class="message-body">
      {{ body }}
    </div>
  </article>
</template>