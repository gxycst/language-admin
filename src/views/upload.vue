<template>
  <div>
    <div class="upload-box" @drop.prevent="handleDrop" @dragover.prevent>
      <input type="file" ref="fileInput" @change="handleFileChange" accept="video/*" hidden />
      <div @click="triggerFileSelect">点击或拖拽上传视频文件</div>
    </div>

    <div v-if="loading">识别中，请稍候...</div>

    <div v-if="transcript">
      <h3>字幕 JSON</h3>
      <pre>{{ transcript }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      transcript: null,
      loading: false,
    }
  },
  methods: {
    triggerFileSelect() {
      this.$refs.fileInput.click()
    },
    handleFileChange(e) {
      const file = e.target.files[0]
      if (file) this.uploadVideo(file)
    },
    handleDrop(e) {
      const file = e.dataTransfer.files[0]
      if (file) this.uploadVideo(file)
    },
    async uploadVideo(file) {
      this.transcript = null
      this.loading = true

      const formData = new FormData()
      formData.append('video', file)

      try {
        const res = await fetch('http://localhost:5000/transcribe', {
          method: 'POST',
          body: formData
        })
        const json = await res.json()
        this.transcript = JSON.stringify(json, null, 2)
      } catch (err) {
        this.transcript = '上传或识别失败：' + err
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.upload-box {
  border: 2px dashed #aaa;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  border-radius: 12px;
}
</style>
