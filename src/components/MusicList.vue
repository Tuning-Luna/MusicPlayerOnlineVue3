<script lang="ts" setup>
defineOptions({
  name: 'MusicList',
})
import { useMusicStore } from '@/stores/music';
import type { MusicItemType } from '@/types/music';
import { Plus, Delete, VideoPlay } from '@element-plus/icons-vue';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const musicStore = useMusicStore()
const { musicList } = storeToRefs(musicStore)

// 引用input元素
const fileInputRef = ref<HTMLInputElement | null>(null)

// 处理文件上传
const handleFileChange = (event: Event) => {
  musicStore.fileChange(event)
}

// 处理清空列表
const handleClearMusicList = () => {
  musicStore.clearList()
}

// 处理开始播放
const handleStartPlay = () => {
  musicStore.startPlay()
}

// 处理双击某个音乐
const handleDbClick = (row: MusicItemType) => {
  musicStore.playMusicById(row.id)
}
</script>


<template>
  <div class="music-list">

    <!-- 顶部工具栏，一个添加歌曲，一个清空歌单 -->
    <div class="top-bar">
      <!-- 添加歌单 -->
      <el-button class="btn" plain @click="fileInputRef?.click()">
        <el-icon>
          <Plus />
        </el-icon>
        添加列表
      </el-button>

      <!-- 隐藏的输入框，为了触发文件上传 -->
      <input
        ref="fileInputRef"
        type="file"
        accept=".mp3,.wav,.flac,.ogg,.aac"
        multiple
        @change="handleFileChange"
        style="display: none" />

      <!-- 清空列表 -->
      <el-button class="btn" plain @click="handleClearMusicList">
        <el-icon>
          <Delete />
        </el-icon>
        清空列表
      </el-button>

      <!-- 开始播放 -->
      <el-button class="btn" plain @click="handleStartPlay">
        <el-icon>
          <VideoPlay />
        </el-icon>
        开始播放
      </el-button>
    </div>

    <div class="list">
      <el-table @row-dblclick="handleDbClick" :data="musicList" class="custom-table"
        header-row-class-name="table_header">
        <el-table-column type="index" width="100"></el-table-column>
        <el-table-column prop="title" label="歌曲">
        </el-table-column>
        <el-table-column prop="author" label="歌手"></el-table-column>

        <!-- 为空的时候显示的内容 -->
        <template #empty>
          <el-empty>
            <template #description>
              <div class="empty">请点击添加列表上传音乐</div>
            </template>
          </el-empty>
        </template>

      </el-table>
    </div>

  </div>
</template>

<style scoped lang="less">
.music-list {
  flex: 1;
  background-color: #ffffff33;
  border-radius: 10px;
  margin-right: 20px;

  .top-bar {
    display: flex;
    justify-content: center;
    gap: 12px; // 两个按钮之间的间距，可选
    margin: 20px;

    .btn {
      background-color: #ffffff33;
      color: #ffffffcc;
      font-family: 'Nunito', 'Segoe UI', sans-serif;
      font-weight: 700;
      border: 0;

      transition: all all 0.15s;

      &:hover {
        background-color: #ffffff55;
      }
    }
  }

  .list {
    overflow: auto;
    height: 500px;
    /* 设置容器的高度，超出部分会触发滚动 */
    margin-left: 30px;

    /* 自定义滚动条样式 */
    &::-webkit-scrollbar {
      width: 10px;
      /* 设置垂直滚动条宽度 */
      height: 10px;
      /* 设置水平滚动条高度 */
    }

    &::-webkit-scrollbar-track {
      background: transparent;
      /* 轨道背景 */
      border-radius: 10px;
      /* 圆角 */
    }

    &::-webkit-scrollbar-thumb {
      background: #ffffff55;
      /* 滑块背景 */
      border-radius: 10px;
      /* 滑块圆角 */
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #ffffff55;
      /* 鼠标悬停时的颜色 */
    }

    .play {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding-left: 50px;
      transition: opacity 0.3s;
    }

    .empty {
      color: #ffffffcc;
    }
  }
}

/* 使用深度选择器覆盖element-plus样式 */
:deep(.custom-table) {
  --el-table-border-color: transparent;
  --el-table-bg-color: transparent;
  --el-table-text-color: #ffffffcc;
  --el-table-header-text-color: #ffffff99;
  /* 修改为更透明的颜色 */
  background: transparent !important;
}

/* 移除所有边框 */
:deep(.el-table),
:deep(.el-table__header-wrapper),
:deep(.el-table__body-wrapper),
:deep(.el-table th),
:deep(.el-table td),
:deep(.el-table__row) {
  border: none;
  background-color: transparent;
}


/* 单元格文字颜色 */
:deep(.el-table td),
:deep(.el-table th)>.cell {
  color: #ffffffcc;
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  font-weight: 500;
}

/* 行悬停效果 */
:deep(.el-table__body tr:hover td) {
  background-color: #ffffff33 !important;
  cursor: pointer;
}

/* 表头单独处理变成透明的 */
:deep(.table_header) {
  background-color: transparent !important;
}
</style>
