<script setup lang="ts">
import { ref } from 'vue';
import client from '../utils/http.js';
import { Post } from '../types/Post';
import InputField from '../blocks/inputField.vue';
import TextAreaField from '../blocks/textAreaField.vue';

const props = defineProps<{ userId: number }>();
const emit = defineEmits<{
  (e: 'added', post: Post): void
  (e: 'cancel'): void
}>();

const title = ref('');
const body = ref('');
const isSubmitting = ref(false);
const titleError = ref('');
const bodyError = ref('');

const onTitleChange = (val: string) => {
  title.value = val;
  if (titleError.value) titleError.value = '';
};

const onBodyChange = (val: string) => {
  body.value = val;
  if (bodyError.value) bodyError.value = '';
};

const validate = (): boolean => {
  let valid = true;
  if (!title.value.trim()) { titleError.value = 'Title is required'; valid = false; }
  if (!body.value.trim()) { bodyError.value = 'Body is required'; valid = false; }
  return valid;
};

const handleSubmit = async () => {
  if (!validate()) return;
  isSubmitting.value = true;
  try {
    const response = await client.post<Post>('/posts', {
      userId: props.userId,
      title: title.value.trim(),
      body: body.value.trim(),
    });
    emit('added', response.data);
  } catch {
    bodyError.value = 'Failed to create post. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="content">
    <h2>Create new post</h2>
    <form @submit.prevent="handleSubmit" data-cy="NewPostForm">

      <InputField
        :modelValue="title"
        @update:modelValue="onTitleChange"
        title="Title"
        name="title"
        placeholder="Post title"
        :errorMessage="titleError"
      />

      <TextAreaField
        :modelValue="body"
        @update:modelValue="onBodyChange"
        title="Write Post Body"
        name="body"
        placeholder="Post body"
        :errorMessage="bodyError"
      />

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link"
            :class="{ 'is-loading': isSubmitting }"
            data-cy="NewPostSubmit"
          >
            Create
          </button>
        </div>
        <div class="control">
          <button
            type="button"
            class="button is-link is-light"
            @click="emit('cancel')"
          >
            Cancel
          </button>
        </div>
      </div>

    </form>
  </div>
</template>