<template>
  <button class="bg-blue-200 px-6 py-2 text-blue-900 rounded mt-6" :type="type">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    type: String,
    props: {},
  },
  name: "basic-button",
};
</script>

<style scoped></style>
