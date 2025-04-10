import type { MusicItemType } from '@/types/music'
import { ElMessage } from 'element-plus';
import { nanoid } from 'nanoid';
import { defineStore } from 'pinia'
import { ref } from 'vue';

import * as mm from 'music-metadata'

export const useMusicStore = defineStore('music', () => {
  // 音乐列表
  const musicList = ref<MusicItemType[]>([])

  // 当前播放的音频对象
  const currentAudio = ref<HTMLAudioElement | null>(null)

  // 当前播放音乐Item
  const currentMusicItem = ref<MusicItemType | null>(null)

  // 是否是暂停
  const isPause = ref<boolean>(true)

  // 播放目标id歌曲
  const playMusicById = (id: string) => {
    const item = musicList.value.find(item => item.id === id)

    if (!item) return


    // 如果已经有音频,先销毁之
    initPlay()

    // 播放
    createAudioAndPlay(item)
  }

  // 处理文件变化，就是上传文件了
  const fileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const files = input.files

    if (!files || files.length === 0) return

    // 如果已经有音频,先销毁之
    initPlay()

    const fileArray = Array.from(files)


    // 上传新的列表之前先把原来的列表清除
    musicList.value = []

    fileArray.forEach(async item => {
      const metadata = await mm.parseBlob(item)

      let cover_img = ''
      if (metadata.common.picture && metadata.common.picture.length > 0) {
        const pic = metadata.common.picture[0]
        const blob = new Blob([pic.data], { type: pic.format })
        cover_img = URL.createObjectURL(blob)
      }
      musicList.value.push({
        id: nanoid(),
        title: metadata.common.title || item.name,
        author: metadata.common.artist || '未知作曲家',
        duration: metadata.format.duration || 0,
        url: URL.createObjectURL(item),
        cover_img: cover_img
      })
    })
    ElMessage.success('添加歌曲成功！')

    currentMusicItem.value = null

    input.value = ''
  }

  // 清空列表
  const clearList = () => {
    // 如果已经有音频,先销毁之
    initPlay()


    musicList.value = []
    currentMusicItem.value = null
  }

  // 处理点击开始播放
  const startPlay = () => {
    if (musicList.value.length === 0) return

    // 如果已经有音频,先销毁之
    initPlay()

    createAudioAndPlay(musicList.value[0])
  }

  // 处理播放上一首/下一首
  const playPreOrNextSong = (isNext: boolean) => {
    if (musicList.value.length === 0) return

    // 如果用户在没有播放音乐的情况下点击了上一首/下一首，那就默认播放第一首
    if (!currentMusicItem.value) {
      startPlay()
      return
    }

    const playingIndex = musicList.value.findIndex(item => item.id === currentMusicItem.value?.id)

    let targetIndex = isNext ? playingIndex + 1 : playingIndex - 1

    if (targetIndex < 0) {
      targetIndex = musicList.value.length - 1
    } else if (targetIndex >= musicList.value.length) {
      targetIndex = 0
    }

    playMusicById(musicList.value[targetIndex].id)
  }

  // 清空播放状文件
  const initPlay = () => {
    if (currentAudio.value) {
      currentAudio.value.pause();
      isPause.value = true
      currentAudio.value.currentTime = 0;  // 重置播放位置
      currentAudio.value.src = ''
      currentAudio.value.load()
    }
    currentAudio.value = null
  }

  // 创建文件并播放
  const createAudioAndPlay = (musicItem: MusicItemType) => {
    currentAudio.value = new Audio(musicItem.url)

    // 自动播放下一首
    currentAudio.value.addEventListener('ended', () => {
      playPreOrNextSong(true)
    })

    currentAudio.value.play()
    currentMusicItem.value = musicItem
    isPause.value = false

    ElMessage({
      message: `正在播放：${musicItem.title}`,
      type: 'success'
    })
  }


  // 结束了自动播放下一首
  return {
    musicList,
    currentAudio,
    currentMusicItem,
    isPause,
    playMusicById,
    fileChange,
    clearList,
    startPlay,
    playPreOrNextSong,
  }
})
