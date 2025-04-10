<script lang="ts" setup>
import { useMusicStore } from '@/stores/music';
import { storeToRefs } from 'pinia';

defineOptions({
  name: 'NowPlay'
})
const musicStore = useMusicStore()

const { currentMusicItem } = storeToRefs(musicStore)
</script>

<template>
  <div class="now-play">
    <div class="title">{{ currentMusicItem ? `《${currentMusicItem.title}》` : '无正在播放' }}</div>
    <div class="cover">
      <img v-if="currentMusicItem?.cover_img" :src="currentMusicItem?.cover_img">
      <img v-else src="../assets/Tuning.png">
    </div>
  </div>
</template>

<style scoped lang="less">
.now-play {
  width: 500px;
  background-color: #ffffff33;
  border-radius: 10px;

  .title {
    margin: 100px auto 30px;
    color: #ffffff;
    font-size: 20px;
    font-weight: 800;

    text-align: center;
  }

  .cover {
    margin: 30px auto;
    width: 300px;
    height: 300px;
    background-color: pink;

    border-radius: 10px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>