<script>
import html2canvas from "html2canvas";

import { BasicButton, BasicModal } from "@/components/index";
import firebase from "firebase/compat";

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
  components: { BasicModal, BasicButton },
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
      }
    },
    handleSelectArea() {
      this.areaSelection = !this.areaSelection;
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
          const modalContainer = document.querySelector("#basic-modal");
          modalContainer.appendChild(canvas);
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
      this.area = baseArea;
    },
    handleClose() {
      this.modalOpen = !this.modalOpen;
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
    class="fixed top-0 select-none left-0 w-screen h-screen bg-black/30 cursor-crosshair"
    data-html2canvas-ignore="true"
  >
    <div
      v-if="selectionStarted"
      :style="selectionArea"
      id="capture"
      class="border border-red-500"
    ></div>
  </div>
  <!--  <DisplayModal-->
  <!--    :open="modalOpen"-->
  <!--    :handleClose="handleClose"-->
  <!--    :capture="capture"-->
  <!--    :onSubmit="createNewTicket"-->
  <!--  ></DisplayModal>-->
  <BasicModal :open="modalOpen" />
  <div
    data-html2canvas-ignore="true"
    class="z-[999] fixed bottom-1/2 text-black transform -translate-y-1/2 right-4 transition-all ease-in duration-300"
  >
    <button
      @click="handleOpenMenu"
      class="rounded-full w-12 h-12 bg-blue-200 border-none flex flex-col items-center justify-center"
    >
      R
    </button>
    <div
      v-if="menuOpen"
      class="absolute top-14 right-0 bg-blue-300 rounded-mg px-4 py-2"
    >
      <BasicButton @click="handleSelectArea">area</BasicButton>
      <button @click="handleSelectFullScreen">fullscreen</button>
    </div>
  </div>
</template>
