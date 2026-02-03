<script setup lang="ts">

const props = defineProps<{
  modelValue: string,
  title: string,
  name: string,
  placeholder?: string,
  errorMessage?: string,
}>();


const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}


</script>
<template>
<div class="field" data-cy="NameField">
  <label class="label" 
  :for="`comment-author-name-${name}`"
  >
    {{ title }}
  </label>
  <div class="control has-icons-left has-icons-right">
    <input
      type="text"
      :name="name"
      :value="modelValue"
      :id="`comment-author-name-${name}`"
      :placeholder="placeholder"
      class="input"
      @input="handleInput"
      :class="{ 'is-danger': errorMessage }"
    />
    <span class="icon is-small is-left">
      <i class="fas fa-user"></i>
    </span>

    <span
    v-if="errorMessage"
      class="icon is-small is-right has-text-danger"
      data-cy="ErrorIcon"
    >
      <i class="fas fa-exclamation-triangle"></i>
    </span>
  </div>

  <p 
  v-if="errorMessage"
  class="help is-danger" 
  data-cy="ErrorMessage">
  {{ errorMessage }}
</p>
</div>
</template>