import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTitle } from '@vueuse/core'
import VConsole from 'vconsole'
import _ from 'lodash'

import { api_fetch, COMMON_API_PATH } from '../fetch'
import { useSiteConfigStore } from '../store'
import { utils_assign_object, utils_favicon } from '../utils'

export * from './market'
export * from './register'
export * from './countdown'
export * from './sms'
export * from './login'
export * from './news'

export const useFormDisabled = (formState, omits) => computed(() => !_.every(_.omit(formState, omits), Boolean))

export const useSiteConfig = async(callback) => {
    try {
        const res = await api_fetch({
            url: COMMON_API_PATH.SITE_CONFIG
        })
        useTitle(res.siteName)
        utils_favicon(res.titleAddress)

        await callback(res.siteSwitch)

        const { siteConfig } = storeToRefs(useSiteConfigStore())

        siteConfig.value = utils_assign_object(siteConfig.value, res)
    } catch (e) {
        new VConsole()
        console.error(e)
        throw new Error(e)
    }
}

export const useRaiseFallColor = () => {
    // 获取涨跌颜色值
    const rootStyle = getComputedStyle(document.documentElement),
        raiseColor = rootStyle.getPropertyValue('--raise'),
        fallColor = rootStyle.getPropertyValue('--fall')

    return {
        raiseColor,
        fallColor
    }
}
