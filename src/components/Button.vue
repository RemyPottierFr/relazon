<template>
  <button
    class="bg-blue-primary px-6 py-2 text-gray-light rounded mt-6"
    :type="type"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    type: String,
  },
  name: "basic-button",
};
</script>
