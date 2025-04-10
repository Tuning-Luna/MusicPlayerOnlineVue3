<script setup lang="ts">
import MusicList from './components/MusicList.vue';
import NowPlay from './components/NowPlay.vue';
import FootControl from './components/FootControl.vue';
</script>

<template>
  <div class="main">
    <header class="header">
      Music Player Online Made By
      <el-link class="author"
        href="https://github.com/Tuning-Luna"
        target="_blank">
        Tuning Luna
      </el-link>
    </header>

    <!-- 主内容分为两部分，左边的列表和右边的正在播放 -->
    <main class="main-content">
      <MusicList></MusicList>
      <NowPlay></NowPlay>
    </main>

    <FootControl></FootControl>
  </div>
</template>

<style scoped lang="less">
.main {
  background: url('./assets/background.jpg');
  width: 100%;
  height: 100vh;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: auto;

  transition: all ease 0.3s;

  // 对于字体的公共样式设置
  color: #ffffffcc;
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  user-select: none;


  .header {
    padding: 20px;

    .author {
      font-size: 16px;
      color: #ffffffcc;
      font-family: 'Nunito', 'Segoe UI', sans-serif;
      user-select: none;
      display: inline;
      vertical-align: baseline;
      padding: 4px;
    }
  }

  .main-content {
    display: flex;
    height: 600px;
    margin: 20px 100px;
    justify-content: space-between;
  }

}
</style>
