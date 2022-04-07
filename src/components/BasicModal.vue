<template>
  <div
    v-show="open"
    class="w-screen h-screen absolute top-0 left-0 bg-black/10 flex items-center justify-center py-12"
  >
    <div
      class="bg-white min-h-[50%] flex flex-col items-center justify-center gap-8 rounded-lg py-10 px-6 w-full max-w-xl relative"
      id="basic-modal"
    ></div>
  </div>
</template>

<script>
export default {
  name: "BasicModal",
  props: {
    open: Boolean,
  },
};
</script>

<style scoped></style>
