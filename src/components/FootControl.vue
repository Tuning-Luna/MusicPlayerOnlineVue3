<script lang="ts" setup>
import { useMusicStore } from '@/stores/music';
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

defineOptions({
  name: 'FootControl'
})
const musicStore = useMusicStore()
const { isPause, currentAudio, currentMusicItem } = storeToRefs(musicStore)

const currentTime = ref(0)       // 当前播放时间（秒）
const volume = ref(0.6)          // 音量0-1
const preVol = ref(volume.value)  // 记录上一次的音量，用于静音后恢复

// 监听音量，并即使更新preVol
watch(volume, (newVol) => {
  if (newVol !== 0) {
    preVol.value = newVol
  }
})

const isMuted = computed({
  get() {
    return volume.value === 0
  },
  set(val) {
    if (val) {
      volume.value = 0
    }
    else {
      volume.value = preVol.value
    }
  }
})

// 点击进度条区域跳转音乐播放进度
function handleMusicProgressClick(e: MouseEvent) {
  if (!currentAudio.value || !currentMusicItem.value) {
    return
  }

  const bar = e.currentTarget as HTMLElement
  const rect = bar.getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width

  currentTime.value = Math.round(percent * (currentMusicItem.value?.duration || 0))

  if (currentAudio.value) {
    currentAudio.value.currentTime = currentTime.value
  }
}

// 点击设置音量
function handleVolumeClick(e: MouseEvent) {
  const bar = e.currentTarget as HTMLElement
  const rect = bar.getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width
  volume.value = Math.min(Math.max(percent, 0), 1)
  // 如果你有 audio 对象：audio.volume = volume.value
}

// 格式化时间（mm:ss）
function formatTime(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const handlePause = () => {
  isPause.value = true
  currentAudio.value?.pause()
}

const handlePlay = () => {
  isPause.value = false
  currentAudio.value?.play()
}

const handleMuted = () => {
  isMuted.value = !isMuted.value
}

// 播放上/下一曲函数
const handlePlayPreOrNextSong = (isNext: boolean) => {
  musicStore.playPreOrNextSong(isNext)
}

watch(currentAudio, (audio) => {
  if (!audio) return

  // 同步更新进度条的时间
  audio.ontimeupdate = () => {
    currentTime.value = Math.floor(audio.currentTime)
  }
})

watch(volume, (val) => {
  if (currentAudio.value) {
    currentAudio.value.volume = val
  }
})


// 监听按下Space键盘事件，处理继续与暂停
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

// 处理键盘space按下事件
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.code === 'Space') {
    e.preventDefault()

    if (currentAudio) {
      if (currentAudio.value?.paused) {
        handlePlay()
      }
      else {
        handlePause()
      }
    }
  }
}

</script>

<template>
  <footer class="control">
    <el-row>
      <el-col :span="18">
        <!-- 上一曲 -->
        <svg xmlns="http://www.w3.org/2000/svg" @click="handlePlayPreOrNextSong(false)" width="32" height="32"
          viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-chevron-first-icon lucide-chevron-first">
          <path d="m17 18-6-6 6-6" />
          <path d="M7 6v12" />
        </svg>

        <!-- 暂停：正在播放音乐的时候显示 -->
        <svg v-if="!isPause" @click="handlePause" xmlns="http://www.w3.org/2000/svg" width="48" height="48"
          viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-pause-icon lucide-pause">
          <rect x="14" y="4" width="4" height="16" rx="1" />
          <rect x="6" y="4" width="4" height="16" rx="1" />
        </svg>

        <!-- 播放：正在暂停的时候显示 -->
        <svg v-else @click="handlePlay" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-play-icon lucide-play">
          <polygon points="6 3 20 12 6 21 6 3" />
        </svg>

        <!-- 下一曲 -->
        <svg xmlns="http://www.w3.org/2000/svg" @click="handlePlayPreOrNextSong(true)" width="32" height="32"
          viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-chevron-last-icon lucide-chevron-last">
          <path d="m7 18 6-6-6-6" />
          <path d="M17 6v12" />
        </svg>

        <span>{{ formatTime(currentTime) }}</span>

        <!-- 音乐进度条 -->
        <div class="music-progress-bar" @click="handleMusicProgressClick">
          <div class="music-progress-inner"
            :style="{ width: `${(currentTime / (currentMusicItem?.duration || 1)) * 100}%` }">
          </div>
        </div>

        <span>{{ currentMusicItem ? formatTime(currentMusicItem.duration) : '00:00' }}</span>

      </el-col>

      <el-col :span="6">
        <!-- 音量 -->
        <svg v-if="!isMuted" @click="handleMuted" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-volume2-icon lucide-volume-2">
          <path
            d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
          <path d="M16 9a5 5 0 0 1 0 6" />
          <path d="M19.364 18.364a9 9 0 0 0 0-12.728" />
        </svg>

        <!-- 音量静音 -->
        <svg v-else @click="handleMuted" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-volume-x-icon lucide-volume-x">
          <path
            d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
          <line x1="22" x2="16" y1="9" y2="15" />
          <line x1="16" x2="22" y1="9" y2="15" />
        </svg>

        <!-- 音量进度条 -->
        <div class="volume-progress-bar" @click="handleVolumeClick">
          <div class="volume-progress-inner" :style="{ width: `${volume * 100}%` }"></div>
        </div>

      </el-col>
    </el-row>
  </footer>
</template>

<style scoped lang="less">
.control {
  box-sizing: border-box;
  background-color: #ffffff33;
  margin: 40px 100px 0 100px;
  height: 100px;
  border-radius: 10px;
  padding: 0 40px;

  .el-row {
    height: 100%;
    align-items: center;
  }

  .el-col:first-child {
    display: flex;
    align-items: center;
    gap: 12px; // 图标间距
  }

  .el-col:last-child {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
  }

  svg {
    display: block;
    cursor: pointer;
  }
}

.music-progress-bar,
.volume-progress-bar {
  width: 200px;
  height: 8px;
  border-radius: 4px;
  background-color: #ffffff33;
  cursor: pointer;
  position: relative;
  overflow: visible;
}

.music-progress-bar {
  width: 700px;
}

.music-progress-inner,
.volume-progress-inner {
  position: relative;
  height: 100%;
  background-color: #ffffffcc;
  border-radius: 4px;
  transition: width 0.2s ease;
}

// 显示当前位置的小圆点
.music-progress-inner::after,
.volume-progress-inner::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}
</style>
