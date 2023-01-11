<template>
  <div class="card">
    <div class="dropzone">
      <Dropzone :enabled="!uploading" @filesAdded="onFilesAdded" />
    </div>
    <div class="left-side">
      <div class="file-list">
        <h3 style="margin-top: 0">Files</h3>
        <ListItem v-for="file in files" :key="file.name" :filename="file.name" :uploadState="
          uploadProgress[file.name] ? uploadProgress[file.name].state : 'idle'
        " :percentage="
  uploadProgress[file.name] ? uploadProgress[file.name].percentage : 0
" />
      </div>
      <button v-if="!successfullUploaded" @click="uploadFiles" :disabled="uploading">
        Upload
      </button>
      <button v-if="successfullUploaded" v-on:click="clearFileList">
        Clear
      </button>
    </div>
  </div>
</template>

<script>
import Dropzone from "./components/Dropzone.vue";
import ListItem from "./components/ListItem.vue";
export default {
  name: "App",
  data() {
    return {
      uploading: false,
      files: [],
      uploadProgress: {},
      successfullUploaded: false,
    };
  },
  components: {
    Dropzone,
    ListItem
  },
  created() {
    console.log(JSON.parse(JSON.stringify(this.files)));
  },
  methods: {
    onFilesAdded(files) {
      console.log(files);
      this.files = [...files, ...this.files];
    },
    async uploadFiles() {
      this.uploading = true;
      this.uploadProgress = {};
      const promises = [];
      this.files.forEach(file => {
        promises.push(this.sendRequest(file));
      });
      try {
        await Promise.all(promises);
        this.uploading = false;
        this.successfullUploaded = true;
      } catch (e) {
        console.log(e);
        this.uploading = false;
        // Just do this for now...
        this.successfullUploaded = true;
      }
    },
    sendRequest(file) {
      return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            this.uploadProgress[file.name] = { state: 'pending', percentage: event.loaded / event.total * 100 };
            this.uploadProgress = { ...this.uploadProgress };
          }
        });
        req.upload.addEventListener('load', () => {
          this.uploadProgress[file.name] = { state: 'done', percentage: 100 };
          resolve(req.response);
        });
        req.upload.addEventListener('error', () => {
          this.uploadProgress[file.name] = { state: 'error', percentage: 0 };
          this.uploadProgress = { ...this.uploadProgress };
          reject(req.response);
        });
        const formData = new FormData();
        formData.append('file', file, file.name);
        req.open('POST', '/dropzone');
        req.send(formData);
      });
    },
  clearFileList() {
      this.files = [];
      this.successfullUploaded = false;
    }
  },
};
</script>

<style scoped>
body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

#app {
  font-family: "Roboto", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 20%;
  box-sizing: border-box;
  display: flex;
  flex: 1;
  flex-direction: column;
}

.card {
  background: #fff;
  border-radius: 2px;
  display: flex;
  height: 50%;
  width: 50%;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  padding: 8px;
  box-sizing: border-box;
  align-self: center;
}

button {
  font-family: "Roboto medium", sans-serif;
  font-size: 14px;
  height: 36px;
  min-width: 88px;
  padding: 6px 16px;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  width: auto;
  user-select: none;
  border: 0;
  border-radius: 2px;
  background: #42b983;
  color: #fff;
  outline: 0;
  align-self: flex-end;
}

button:disabled {
  background: grey;
}

.dropzone {
  width: 25%;
  float: left;
}

.file-list {
  float: left;
  padding-left: 16px;
  box-sizing: border-box;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  margin-bottom: 16px;
}

.left-side {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}
</style>
