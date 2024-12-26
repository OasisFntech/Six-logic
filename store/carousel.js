import { ref } from 'vue'
import { defineStore } from 'pinia'

import { COMMON_API_PATH, FETCH_METHOD, api_fetch } from '../fetch'
import { utils_assets_src } from '../utils'

export const useCarouselStore = defineStore('carousel', () => {
    const carousel = ref([]),
        loading = ref(false)

    const onGetCarousel = async(device) => {
        if (!carousel.value.length && !loading.value) {
            loading.value = true

            try {
                const res = await api_fetch({
                    url: `${COMMON_API_PATH.CAROUSEL}/${device}`,
                    method: FETCH_METHOD.GET
                })
                if (res) carousel.value = res.map(e => ({ ...e, urlAddress: utils_assets_src(e.urlAddress) }))
            } finally {
                loading.value = false
            }
        }
    }

    return {
        loading,
        carousel,
        onGetCarousel
    }
})
