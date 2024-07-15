<template>
  <section class="py-12 px-4 mx-auto max-w-screen-xl body-font">
    <div class="flex flex-col text-center w-full mb-14">
      <h1 class="text-3xl font-medium mb-4">
        News and Announcements
      </h1>
      <p class="lg:w-2/3 mx-auto leading-relaxed text-gray-700 dark:text-gray-400">
        Articles about development and organization of the Manjaro project
      </p>
    </div>

    <div class="mx-auto max-w-[400px] md:max-w-[820px] xl:max-w-max font-[sans-serif] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <NuxtLink
        v-for="item in paginatedData"
        :key="item.id"
        :href="item._path!"
        class="flex flex-col rounded overflow-hidden border dark:border-gray-700 transform hover:scale-[1.02] transition-transform duration-300"
      >
        <div>
          <NuxtImg
            :src="getImagePath(item._path!, item.image!)"
            alt="News article header picture"
            class="w-full h-52 object-cover"
            width="500px"
          />
        </div>
        <div class="flex flex-col justify-start p-4 lg:p-5 h-full">
          <span class="text-sm block text-gray-400 dark:text-gray-500 mb-2 capitalize">
            {{ useTimeAgo(item.date).value }} | {{ getAuthors(item.authors)[0].name }}
          </span>
          <h3 class="text-lg font-bold pb-3">
            {{ item.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 ">
            {{ item.description }}
          </p>
        </div>
      </NuxtLink>
    </div>
    <div class="flex justify-between mt-8">
      <button
        :disabled="currentPage === 1"
        class="btn"
        @click="goToPreviousPage"
      >
        <
      </button>
      <div>
        <NuxtLink
          v-for="page in totalPages"
          :key="page"
          :href="getPageLink(page)"
          :class="['btn', { active: page === currentPage }]"
          @click="goToPage(page, $event)"
        >
          {{ page }}
        </NuxtLink>
      </div>
      <button
        :disabled="currentPage === totalPages"
        class="btn"
        @click="goToNextPage"
      >
        >
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'

useHead({
  title: 'News',
})
useServerSeoMeta({
  ogTitle: 'Manjaro News',
  description: 'Articles about development and organization of the Manjaro project.',
})

const getImagePath = (path: string, file: string) => {
  return path + '/' + file
}

const { data } = await useAsyncData('news-items-list', () =>
  queryContent('/news')
    .sort({ date: -1 })
    .find(),
)
const itemsPerPage = 9
const route = useRoute()
const router = useRouter()
const currentPage = ref(parseInt(route.query.page || '1'))

const totalPages = computed(() => Math.ceil(data.value.length / itemsPerPage))

const paginatedData = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return data.value.slice(startIndex, endIndex)
})

function goToPreviousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    updateURL()
    scrollToTop()
  }
}

function goToNextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    updateURL()
    scrollToTop()
  }
}

function goToPage(page: number, event: Event) {
  event.preventDefault()
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    updateURL()
    scrollToTop()
  }
}

function updateURL() {
  const path = currentPage.value === 1 ? '/news' : `/news?page=${currentPage.value}`
  router.push(path)
}

function getPageLink(page: number) {
  return page === 1 ? '/news' : `/news?page=${page}`
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>
