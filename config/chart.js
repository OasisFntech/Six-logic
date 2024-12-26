// 图表类型
export const CHART_TYPE = {
    // 分时
    REAL_TIME: 'realTime',
    // 日K
    DAILY: 'daily',
    // 周K
    WEEKLY: 'weekly',
    // 月K
    MONTHLY: 'monthly',
    // 1分
    ONE_MINUTES: 'minute',
    // 5分
    FIVE_MINUTES: 'five_minutes',
    // 15分
    FIFTEEN_MINUTES: 'fifteen_minutes',
    // 30分
    THIRTY_MINUTES: 'thirty_minutes'
}

// 图表类型渲染配置
export const CHART_TYPES_CONFIG = [
    {
        key: CHART_TYPE.REAL_TIME,
        title: '分时'
    },
    {
        key: CHART_TYPE.DAILY,
        title: '日K'
    },
    {
        key: CHART_TYPE.WEEKLY,
        title: '周K'
    },
    {
        key: CHART_TYPE.MONTHLY,
        title: '月K'
    },
    {
        key: CHART_TYPE.ONE_MINUTES,
        title: '1分'
    },
    {
        key: CHART_TYPE.FIVE_MINUTES,
        title: '5分'
    },
    {
        key: CHART_TYPE.FIFTEEN_MINUTES,
        title: '15分'
    },
    {
        key: CHART_TYPE.THIRTY_MINUTES,
        title: '30分'
    },
]