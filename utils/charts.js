import _ from 'lodash'
import dayjs from 'dayjs'

// echart 图表通用配置 K 线图
export const ECHART_CONFIG = {
    TOOLTIP: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        },
        textStyle: {
            fontSize: 12
        },
        position: function (pos, params, el, elRect, size) {
            const obj = {
                top: 10
            }
            obj[[ 'left', 'right' ][+(pos[0] < size.viewSize[0] / 2)]] = 30
            return obj
        },
    },
    AXIS_POINTER: {
        link: { xAxisIndex: 'all' },
    },
    GRID: [
        {
            left: '12%',
            top: '8%',
            right: '10%',
            height: '60%'
        },
        {
            left: '12%',
            right: '10%',
            top: '70%',
            height: '16%'
        }
    ]
}



const today = dayjs().format('YYYY-MM-DD')
const generateMinuteRange = (startTime, endTime) => {
    const start = dayjs(`${today} ${startTime}`),
        end = dayjs(`${today} ${endTime}`),
        minutes = end.diff(start, 'minute') + 1

    return _.range(minutes).map((index) => start.add(index, 'minute').format('HH:mm'))
}

const morningRange = generateMinuteRange('09:30', '11:29'),
    afternoonRange = generateMinuteRange('13:01', '15:00')

// 分时时间段数据
export const MINUTES_RANGE = _.concat(morningRange, '11:30/13:00', afternoonRange)

/**
 * @function timeParser
 * @param time 时间内容
 * @param timeType 时间类型 3 | 8
 * @description 3是分时的时间 930 类型；8是k线图 20230530 类型
 * */
export const utils_timeParser = (time, timeType) => {
    switch (timeType) {
        case 3:
            const hours = time.length === 3 ? `0${time[0]}` : time.slice(0, 2)

            return `${hours}:${time.slice(-2)}`
        case 8:
            return dayjs(time).format('YYYY/MM/DD')
        default:
            return time
    }
}

// 渲染 echart 的 tooltip
export const utils_renderTooltip = ({ title, content, color }) => {
    return `
        <div>
            ${title}：
            <span style="color: ${color || 'inherit'}">
                ${content}
            </span>
        </div>
    `
}

/**
 * @function utils_kLineCalculateMA
 * @param dayCount 日均数
 * @param data 数据源
 * @return array<number>
 * @description 计算K线图日均线
 * */
export const utils_kLineCalculateMA = (dayCount, data) => {
    const result = []

    for (let i = 0; i < data.length; i++) {
        if (i < dayCount) {
            result.push('-')
            continue
        }

        const sum = _.sumBy(_.slice(data, i - dayCount, i), value => +value[1])
        result.push((sum / dayCount).toFixed(2))
    }

    return result
}

// 分时图图表配置
export const utils_renderRealTimeChart = (dataSource, { raiseColor, fallColor }) => {
    /**
     * @const chartData 图表数据
     * @const priceData 价格数据
     * @const volData 底部体积图数据
     * */
    const chartData = dataSource.minuteKDataVOList.slice(1),
        priceData = [],
        volData = [],
        increaseData = []

    if (!chartData.length) return

    let { increase: minIncrease } = _.minBy(chartData, 'increase'),
        { increase: maxIncrease } = _.maxBy(chartData, 'increase')

    if (maxIncrease < Math.abs(minIncrease)) {
        maxIncrease = Math.abs(minIncrease)
    } else {
        minIncrease = Number('-' + maxIncrease)
    }

    const minPrice = (minIncrease / 100 * dataSource.yClose) + dataSource.yClose,
        maxPrice = (maxIncrease / 100 * dataSource.yClose) + dataSource.yClose

    chartData.forEach(e => {
        priceData.push(e.price)
        volData.push(e.vol)
        increaseData.push(e.increase)
    })

    return {
        tooltip: {
            ...ECHART_CONFIG.TOOLTIP,
            // hover 展示内容
            formatter: (series) => {
                const currentIndex = series[0].dataIndex,
                    currentData = chartData[currentIndex],
                    trendColor = currentData.price > dataSource.yClose ? raiseColor : fallColor

                const renderConfig = [
                    {
                        title: '时间',
                        content: utils_timeParser(currentData.time, 3)
                    },
                    {
                        title: '价格',
                        content: currentData.price.toFixed(2),
                        color: trendColor
                    },
                    {
                        title: '均价',
                        content: currentData.avPrice,
                        color: trendColor
                    },
                    {
                        title: '涨跌幅',
                        content: currentData.increase + '%',
                        color: trendColor
                    },
                    {
                        title: '成交量',
                        content: utils_amount_chinesization(currentData.vol)
                    },
                    {
                        title: '成交额',
                        content: utils_amount_chinesization(currentData.amount)
                    }
                ]

                return `
                        <div>
                            ${renderConfig.map(utils_renderTooltip).join('')}
                        </div>
                    `
            },
        },
        axisPointer: ECHART_CONFIG.AXIS_POINTER,
        grid: ECHART_CONFIG.GRID,
        xAxis: [
            {
                type: 'category',
                data: MINUTES_RANGE,
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#303b4b',
                    },
                },
                axisLabel: {
                    show: false
                },
                axisTick: {
                    show: false,
                    lineStyle: {
                        color: '#303b4b',
                    },
                },
                splitLine: {
                    show: false
                },
                axisPointer: {
                    show: true,
                    label: {
                        show: false
                    },
                }
            },
            {
                type: 'category',
                boundaryGap: false,
                data: MINUTES_RANGE,
                gridIndex: 1,
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#303b4b',
                    },
                },
                axisLabel: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }
        ],
        yAxis: [
            {
                scale: false,
                min: minPrice,
                max: maxPrice,
                splitNumber: 8,
                interval: (maxPrice - minPrice) / 8,
                axisPointer: {
                    show: true,
                    label: {
                        precision: 2,
                    },
                },
                splitLine: {
                    show: false
                },
                // 左侧文本
                axisLabel: {
                    color: (params, index) => {
                        if (index === 4) return '#fafafa'
                        const value = Number(params).toFixed(2)
                        if (value > dataSource.yClose) {
                            return raiseColor
                        } else if (value < dataSource.yClose) {
                            return fallColor
                        }
                    },
                    formatter: val => val.toFixed(2)
                }
            },
            // 底部 Volume Y 轴配置
            {
                scale: true,
                gridIndex: 1,
                show: false,
                axisPointer: {
                    label: {
                        formatter: ({ value }) => utils_amount_chinesization(value)
                    }
                }
            },
            {
                scale: false,
                min: minIncrease,
                max: maxIncrease,
                splitNumber: 8,
                interval: (maxIncrease - minIncrease) / 8,
                splitLine: { show: false },
                axisPointer: {
                    //指示器参数
                    show: true,
                    label: {
                        precision: 2,
                        formatter: ({ value }) => Number(value).toFixed(2) + '%'
                    },
                },
                axisLabel: {
                    color: (params, index) => {
                        if (index === 4) return '#fafafa'
                        if (params > 0) {
                            return raiseColor
                        } else if (params < 0) {
                            return fallColor
                        }
                    },
                    formatter: val => Number(val).toFixed(2) + '%'
                }
            }
        ],
        series: [
            {
                name: 'Price',
                data: priceData,
                type: 'line',
                smooth: true,
                itemStyle: {
                    color: '#0ab8fa',
                    borderWidth: 1
                },
                // 渐变背景色
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: 'rgba(80, 141, 255, .39)'
                            },
                            {
                                offset: .34,
                                color: 'rgba(56, 155, 255, .25)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(38, 197, 254, 0)'
                            }
                        ]
                    }
                }
            },
            {
                name: 'Volume',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: volData,
                itemStyle: {
                    color: ({ dataIndex }) => {
                        if (
                            chartData[dataIndex].open <=
                            chartData[dataIndex].price
                        ) {
                            return raiseColor
                        } else {
                            return fallColor
                        }
                    }
                }
            },
            {
                name: 'Raise_Fall',
                type: 'none',
                data: increaseData
            }
        ]
    }
}
