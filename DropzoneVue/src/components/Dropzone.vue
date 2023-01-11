<template>
  <form class="form-container" enctype="multipart/form-data">
    <div
      class="dropzone"
      @click="openFileSelection"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
      :class="{ highlight: highlight, disabled: !enabled }"
    >
      <IconUploads />
      <div>Browser Files</div>
      <input
        ref="fileInput"
        class="file-input"
        type="file"
        multiple
        @change="onFileChanged"
      />
    </div>
  </form>
</template>

<script>
import IconUploads from "@/Icons/IconUploads.vue";
export default {
  name: "DropzoneComponent",
  components: {
    IconUploads,
  },
  props: {
    enabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      highlight: false,
    };
  },

  mounted() {},

  methods: {
    openFileSelection() {
      if (!this.enabled) return;
      this.$refs.fileInput.click();
    },
    onDragOver(e) {
      if (!this.enabled) return;
      e.preventDefault();
      this.highlight = true;
    },
    onDragLeave() {
      this.highlight = false;
    },
    onDrop(e) {
      if (!this.enabled) return;
      e.preventDefault();
      const files = event.dataTransfer.files;
      let result = [];
      for (var i = 0; i < files.length; i++) {
        result.push(files.item(i));
      }
      this.$emit("filesAdded", result);
      this.highlight = false;
    },
    onFileChanged(e) {
      const files = e.target.files;
      const result = [];
      for (let i = 0; i < files.length; i++) {
        result.push(files.item(i));
      }
      this.$emit("filesAdded", result);
    },
  },
};
</script>

<style scoped>
.dropzone {
  position: relative;
  border: 3px dashed #42b983;
  color: #42b983;
  font: bold 24px/200px arial;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
}
.highlight {
  background-color: #b3dbc9;
}
.disabled {
  border: 3px dashed grey;
  color: grey;
}
.file-input {
  display: none;
}
</style>