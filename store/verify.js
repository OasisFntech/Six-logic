import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useVerifyStore = defineStore('verify', () => {
    const visible = ref(false)
    let config = ref({
        url:'',
        mothod:'post',
        data:'',
        option:null
    })

    const onClose = () => {
        visible.value = false
    }

    const onShow = () => {
        visible.value = true
    }

    const setConfig = (newConfig) =>{
        config.value = {...newConfig}
    }

    return {
        visible,
        config,
        onClose,
        onShow,
        setConfig
    }
})
