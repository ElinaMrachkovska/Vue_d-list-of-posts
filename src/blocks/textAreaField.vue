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
  const target = e.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
}

</script>
<template>

<div class="field" data-cy="BodyField">
  <label class="label" 
  :for="`comment-${name}`">
   {{ title }}
  </label>
  <div class="control">
    <textarea
      :id="`comment-${name}`"
      :name="name"
      :placeholder="placeholder"
      class="textarea is-danger"
      :value="modelValue"
      @input="handleInput"
      :class="{'is-danger': errorMessage}"
    ></textarea>
  </div>

  <p v-if="errorMessage" 
  class="help is-danger" 
  data-cy="ErrorMessage">
  {{ errorMessage }}
</p>
</div>
</template>