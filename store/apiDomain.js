import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import _ from 'lodash'

import { api_fetch, COMMON_API_PATH, useRequest, createSocket } from '../fetch'
import { utils_guideRedirect } from '../utils'

//  检查域名地址，会额外返回delay延迟时间
const onCheckDomain = async ({ url, params, fetchTime, config }) => {
    let delay = 0
    await api_fetch({
        url,
        params,
        options: {
            ...config,
            onDownloadProgress: () => {
                delay = +new Date() - fetchTime
            }
        }
    })

    return {
        delay,
        ...params
    }
}

export const useApiDomainStore = defineStore('api_domain', () => {
    /**
     * @const api_domain  api请求地址
     * */
    const api_domain = ref([])

    //  获取可用的api地址
    const { loading } = useRequest({
        url: COMMON_API_PATH.API_DOMAIN,
        method: 'get',
        onSuccess: res => {
            if (res.length) {
                // 校验api地址
                res.forEach((e, i, a) => {
                    const fetchTime = +new Date()
                    /* eslint-disable promise/prefer-await-to-then */
                    onCheckDomain({
                        url: COMMON_API_PATH.API_CHECK,
                        params: { domainName: e.domain, time: fetchTime },
                        fetchTime
                    }).then(res => {
                        api_domain.value.push({
                            ...e,
                            ...res
                        })

                        if (api_domain.value.length === a.length) {
                            const bestDomain = _.minBy(api_domain.value, 'delay')

                            if (bestDomain.webSocket) {
                                createSocket(bestDomain.webSocket)
                            } else {
                                const safety = bestDomain.domain.includes('https')
                                createSocket(bestDomain.domain.replace('api', safety ? 'wss' : 'ws'))
                            }
                        }
                    })
                })
            }
        }
    })

    return {
        api_domain,
        loading
    }
})

export const useWebDomainStore = () => {
    const web_domain = ref([])

    // 获取所有域名线路
    const { loading } = useRequest({
        url: COMMON_API_PATH.WEB_DOMAIN,
        method: 'get',
        onSuccess: res => {
            if (res.length) {
                // 检查可用域名
                res.map(e => {
                    const fetchTime = +new Date()

                    /* eslint-disable promise/prefer-await-to-then */
                    onCheckDomain({
                        url: `/web/check/${fetchTime}`,
                        params: { domainName: e.domain },
                        fetchTime,
                        config: {
                            baseURL: e.domain
                        }
                    }).then(res => {
                        web_domain.value.push(res)
                    })
                })
            }
        }
    })

    // 只展示延迟最小的前五条线路
    const showSites = computed(() => {
        const delaySort = _.sortBy(web_domain.value, 'delay')
        return _.take(delaySort, 5)
    })

    const onChooseBest = () => {
        // 获取域名列表中延迟最小的
        const bestDomain = _.minBy(showSites.value, 'delay')
        if (bestDomain) utils_guideRedirect(bestDomain.domainName)
    }

    return {
        showSites,
        loading,
        onChooseBest
    }
}
