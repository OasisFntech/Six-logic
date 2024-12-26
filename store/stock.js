import { defineStore } from 'pinia'

import {
    useRequest,
    doParams,
    TOTAL_MARKET_SOCKET,
    COMMON_API_PATH,
    SOCKET_URL
} from '../fetch'
import { utils_base64 } from '../utils'

// 股票大盘
export const useStockMarketStore = defineStore('stockMarket', () => {
    TOTAL_MARKET_SOCKET.on(res => {
        totalMarket.value = res
    })

    // 大盘指数数据
    const { response: totalMarket } = useRequest({
        url: `${COMMON_API_PATH.DO}?event=${SOCKET_URL.TOTAL_MARKETS}`,
        params: doParams([], { url: SOCKET_URL.TOTAL_MARKETS }),
        initialValues: {
            fellNum: 0,
            flatNum: 0,
            // 概念板块
            hotConcept: [],
            // 行业板块
            hotIndustry: [],
            // 市场涨跌分析数据
            increaseArea: {
                count0: 0,
                countFall: 0,
                countd03: 0,
                countd7: 0,
                countd35: 0,
                countd57: 0,
                countdRise: 0,
                countu7: 0,
                countu30: 0,
                countu53: 0,
                countu75: 0,
                down: 0,
                stop: 0,
                unchanged: 0,
                up: 0,
            },
            // 大盘指数
            indexPlate: [],
            roseNum: 0,
            // 开盘状态
            stockStatus: '',
        },
        formatResult: res => utils_base64(res),
    })

    return {
        totalMarket,
    }
})
