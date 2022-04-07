<template>
  <div
    v-show="open"
    class="w-screen h-screen absolute top-0 left-0 bg-black/10 flex items-center justify-center py-12"
  >
    <div
      ref="content"
      tabindex="0"
      @keyup.esc="handleClose"
      class="bg-gray-light min-h-[50%] flex flex-col items-center overflow-hidden justify-center gap-8 rounded-lg py-10 px-6 w-full max-w-xl relative"
    >
      <button @click="handleClose" class="absolute z-10 top-4 right-4">
        <XIcon class="w-8 h-8 text-white" />
      </button>
      <h1
        class="absolute top-0 left-0 bg-blue-primary text-white text-[22px] w-full px-6 py-4"
      >
        Add your comment and send your review
      </h1>
      <img
        v-if="capture"
        class="shadow border border-gray-50"
        :src="capture"
        alt="display"
      />
      <form
        @submit.prevent="handleComment"
        class="w-full flex flex-col items-center"
      >
        <textarea
          v-model="comment"
          class="w-full text-blue-light border-blue-primary focus:outline-none p-4 rounded-md max-w-xl shadow border border-gray-50"
        />
        <div class="flex items-center justify-between w-full">
          <BasicButton type="button" @click="handleClose"
            >Take another one
          </BasicButton>
          <BasicButton type="submit">send</BasicButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { XIcon } from "@heroicons/vue/outline";
import BasicButton from "@/components/Button.vue";

export default {
  components: { BasicButton, XIcon },
  props: {
    open: Boolean,
    handleClose: Function,
    capture: [String],
    onSubmit: Function,
  },
  name: "display-modal",
  data() {
    return {
      comment: "",
    };
  },
  mounted() {
    this.$refs.content.focus();
  },
  methods: {
    handleComment() {
      console.log({ comment: this.comment });
      this.onSubmit(this.comment);
    },
  },
};
</script>
