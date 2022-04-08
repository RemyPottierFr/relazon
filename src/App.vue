<script>
import html2canvas from "html2canvas";
import {
  DesktopComputerIcon,
  ArrowsExpandIcon,
  PencilIcon,
} from "@heroicons/vue/outline";
import { XCircleIcon } from "@heroicons/vue/solid";
import { DisplayModal } from "@/components/index";
import firebase from "firebase/compat";
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";

document.onmousemove = handleChangeBaseArea;

let baseArea;

function handleChangeBaseArea(event) {
  const x1 = event.pageX;
  const y1 = event.pageY;
  baseArea = {
    x1,
    y1,
    x2: x1,
    y2: y1,
  };
}

export default {
  components: {
    DisplayModal,
    DesktopComputerIcon,
    ArrowsExpandIcon,
    XCircleIcon,
    PencilIcon,
  },
  data() {
    const firebaseStorage = firebase.storage();
    const firebaseDb = firebase.database().ref("captures");
    return {
      menuOpen: false,
      area: baseArea,
      areaSelection: false,
      selectionStarted: false,
      modalOpen: false,
      capture: "",
      canvasBlob: null,
      firebaseStorage,
      firebaseDb,
    };
  },
  methods: {
    handleOpenMenu() {
      this.menuOpen = !this.menuOpen;
      if (!this.menuOpen) {
        this.area = baseArea;
        this.areaSelection = false;
        this.capture = "";
        this.selectionStarted = false;
        this.modalOpen = false;
      }
    },
    createCustomMouse(e) {
      const mouseY = e.clientY;
      const mouseX = e.clientX;
      const mouseExternal = document.querySelector("#mouse-external");
      const mouseInternal = document.querySelector("#mouse-internal");

      mouseExternal.style.transform = `translate3d(calc(${mouseX}px - 1rem), calc(${mouseY}px - 1rem), 0)`;

      mouseInternal.style.transform = `translate3d(calc(${mouseX}px - 2px), calc(${mouseY}px - 2rem), 0)`;
    },
    stopCustomMouse() {
      window.removeEventListener("mousemove", this.createCustomMouse);
    },
    handleSelectArea() {
      this.areaSelection = !this.areaSelection;
      if (this.areaSelection) {
        window.addEventListener("mousemove", this.createCustomMouse);
      }
    },
    handleSelectFullScreen() {
      this.startCapture();
    },
    startCapture(config = {}) {
      html2canvas(document.body, { useCORS: true, ...config }).then(
        (canvas) => {
          canvas.toBlob(
            (b) => {
              this.canvasBlob = b;
            },
            "image/jpeg",
            0.95
          );
          this.capture = canvas.toDataURL();
          this.modalOpen = true;
        }
      );
    },
    startSelection(event) {
      this.area = { ...this.area, x1: event.x, y1: event.y };
      this.selectionStarted = true;
    },
    updateSelection(event) {
      this.area = { ...this.area, x2: event.x, y2: event.y };
    },
    stopSelection() {
      const { left, top, width, height } = this.currentArea;
      this.startCapture({
        x: left,
        y: top,
        width,
        height,
      });
      this.selectionStarted = false;
      this.areaSelection = false;
      this.area = baseArea;
      this.stopCustomMouse();
    },
    handleClose() {
      this.modalOpen = !this.modalOpen;
    },
    handleNewCapture() {
      this.handleClose();
      this.handleSelectArea();
    },
    async createNewTicket(comment) {
      this.firebaseStorage
        .ref(`${new Date().getTime() - (window?.relazon?.userId || "")}`)
        .put(this.canvasBlob)
        .then(async (snapshot) => {
          const url = await snapshot.ref.getDownloadURL();
          await this.firebaseDb.push({
            userId: window?.relazon?.userId || "no-user",
            captureUrl: url,
            resolved: false,
            comment,
          });
        });
      this.handleClose();
      this.handleOpenMenu();
      this.handleToast({
        title: "success",
        description: "your ticket has been created",
        type: "success",
      });
    },
    handleToast({ title = "", description = "", type = "info" }) {
      createToast({ title, description }, { type });
    },
  },
  computed: {
    currentArea() {
      return {
        left: this.area.x1 < this.area.x2 ? this.area.x1 : this.area.x2,
        top: this.area.y1 < this.area.y2 ? this.area.y1 : this.area.y2,
        width: Math.abs(this.area.x2 - this.area.x1),
        height: Math.abs(this.area.y2 - this.area.y1),
      };
    },
    selectionArea() {
      const { left, top, width, height } = this.currentArea;
      return `position: absolute;left: ${left}px;top: ${top}px;width: ${width}px;height: ${height}px;`;
    },
  },
};
</script>

<template>
  <div
    v-if="areaSelection"
    @mousedown="startSelection"
    @mousemove="updateSelection"
    @mouseup="stopSelection"
    class="fixed top-0 select-none left-0 w-screen h-screen bg-black/10 cursor-none"
    data-html2canvas-ignore="true"
  >
    <div
      v-if="selectionStarted"
      :style="selectionArea"
      id="capture"
      class="border-2 border-blue-primary"
    ></div>
  </div>
  <DisplayModal
    :open="modalOpen"
    :handleClose="handleClose"
    :capture="capture"
    :onSubmit="createNewTicket"
    :handleNewCapture="handleNewCapture"
  ></DisplayModal>
  <div
    v-if="areaSelection"
    data-html2canvas-ignore="true"
    class="pointer-events-none"
  >
    <div
      id="mouse-external"
      class="w-8 h-8 rounded-full border-2 border-blue-primary"
    />
    <div
      id="mouse-internal"
      class="w-1 h-1 rounded-full bg-blue-light transition-all duration-[25ms]"
    />
  </div>
  <div
    data-html2canvas-ignore="true"
    class="z-[999] fixed bottom-1/2 translate-y-1/2 flex items-start h-40 text-black right-0 transition-all ease-in duration-300"
  >
    <button
      @click="handleOpenMenu"
      style="transform: rotate(-90deg)"
      :class="{ 'right-[5.5rem]': menuOpen, 'right-[2.5rem]': !menuOpen }"
      class="rounded-t-md text-gray-light flex text-sm items-center h-10 justify-center gap-2 whitespace-nowrap focus:outline-none origin-top-right absolute z-10 transition-all ease-in duration-300 top-0 w-40 px-4 py-2 mb-full bg-blue-primary border-none"
    >
      Add feedback
      <PencilIcon class="w-4 h-4" />
    </button>
    <div
      :class="{
        'translate-x-0': menuOpen,
        'translate-x-full': !menuOpen,
      }"
      class="bg-gray-light h-full flex flex-col items-center justify-center gap-6 rounded-mg transform w-12 py-6 px-4 transition-all ease-in duration-300"
    >
      <button @click="handleOpenMenu">
        <XCircleIcon class="w-6 h-6 text-blue-primary" />
      </button>
      <button
        :disabled="modalOpen"
        @click="handleSelectArea"
        class="disabled:text-gray-500 text-blue-primary"
      >
        <ArrowsExpandIcon class="w-6 h-6" />
      </button>
      <button
        :disabled="modalOpen || areaSelection"
        @click="handleSelectFullScreen"
        title="fullscreen"
        class="disabled:text-gray-500 text-blue-primary"
      >
        <DesktopComputerIcon class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>
