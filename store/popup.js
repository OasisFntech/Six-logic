import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useSessionStorage } from '@vueuse/core'

import { useRequest, COMMON_API_PATH } from '../fetch'

export const usePopupStore = defineStore('popup', () => {
    const alreadyRead = useSessionStorage('alreadyRead', false),
        visible = ref(false)

    const { response: popup, loading, run } = useRequest({
        url: COMMON_API_PATH.POPUP,
        manual: alreadyRead.value,
        initialValues: {
            title: '',
            content: ''
        },
        onSuccess: res => {
            if (res.id) visible.value = true
        }
    })

    const onClose = () => {
        visible.value = false
        alreadyRead.value = true
    }

    return {
        visible,
        popup,
        loading,
        run,
        onClose
    }
})
