import { ref } from 'vue'
import dayjs from 'dayjs'

import { useRequest, usePagination, COMMON_API_PATH } from '../fetch'

export const useNews = () => {
    return usePagination({
        fetchOptions: {
            url: COMMON_API_PATH.NEWS,
            params: {
                type: 1
            }
        }
    })
}

export const useNewsFlash = () => {
    return usePagination({
        fetchOptions: {
            url: COMMON_API_PATH.NEWS_FLASH,
            params: {
                type: 2
            },
            formatResult: res => res.map(e => {
                return {
                    ...e,
                    publishDate: dayjs(e.publishDate).format('HH:mm')
                }
            })
        }
    })
}

export const useNewsStock = () => {
    const pagination = {
        start: 0,
        end: 20
    }

    const list = ref([]),
        finished = ref(false)

    const { response, loading, run, onRefresh } = useRequest({
        url: COMMON_API_PATH.NEWS_STOCK,
        params: {
            stocks: [],
            ...pagination
        },
        onSuccess: (res, params) => {
            const { total, data } = res

            finished.value = pagination.end >= total

            if (params.start === 0) {
                list.value = data
            } else {
                list.value = [
                    ...list.value,
                    ...data
                ]
            }
        }
    })

    const onLoadMore = async() => {
        pagination.start += 20
        pagination.end += 20

        await run({
            stocks: [],
            ...pagination
        })
    }

    const _onRefresh = async() => {
        pagination.start = 0
        pagination.end = 20
        finished.value = false
        await onRefresh
    }

    return {
        list,
        response,
        loading,
        run,
        finished,
        onRefresh: _onRefresh,
        onLoadMore
    }
}
