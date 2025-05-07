<template>
  <div class="video-container">
    <video
        ref="video"
        class="video"
        :src="videoSrc"
        controls
        @timeupdate="onTimeUpdate"
    ></video>

    <div class="subtitle" v-if="currentSegment">
      <span
          v-for="(word, index) in currentSegment.words"
          :key="index"
          :class="{ highlight: isCurrentWord(word) }"
      >
        {{ word.word }}
      </span>
    </div>
  </div>
</template>

<script>
import videoSrc from './video.mp4';
import transcript from './data.json';

export default {
  data() {
    return {
      videoSrc,
      currentTime: 0,
      transcript
    };
  },
  computed: {
    // 获取当前播放时间对应的字幕段
    currentSegment() {
      return this.transcript.segments.find(
          (seg) => this.currentTime >= seg.start && this.currentTime <= seg.end
      );
    },
    // 获取当前播放时间对应的单词
    currentWord() {
      if (!this.currentSegment) return null;
      return this.currentSegment.words.find(
          (w) => this.currentTime >= w.start && this.currentTime <= w.end
      );
    },
  },
  methods: {
    // 处理视频时间更新
    onTimeUpdate() {
      this.currentTime = this.$refs.video.currentTime;
    },
    // 判断当前单词是否需要高亮
    isCurrentWord(word) {
      return this.currentWord && word.start <= this.currentTime && word.end > this.currentTime;
    },
  },
};
</script>

<style scoped>


.video {
  width: 100%; /* 固定宽度，适应父容器 */
  height: auto; /* 自适应高度 */
  object-fit: contain; /* 保持视频比例，同时完整显示视频内容 */
}

.video-container {
  max-width: 500px;
  margin: auto;
  text-align: center;
}

.video {
  width: 100%;
  border-radius: 8px;
}

.subtitle {
  margin-top: 12px;
  font-size: 20px;
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
}

.subtitle .highlight {
  color: yellow;
  font-weight: bold;
}
</style>
