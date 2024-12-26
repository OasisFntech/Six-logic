import { ref } from 'vue'
import _ from 'lodash'

let countdown_interval = null

const onClear = () => {
    clearInterval(countdown_interval)
    countdown_interval = null
}

export const useCountdown = (name = 'noname') => {
    const key = `${name}-countdown`,
        countdown = ref(0)

    // 倒计时函数
    const onStart = () => {
        if (countdown_interval) {
            onClear()
        }

        countdown_interval = setInterval(() => {
            if (countdown.value > 0) {
                countdown.value --
                localStorage.setItem(key, countdown.value)
            } else {
                localStorage.removeItem(key)
                onClear()
            }
        }, 1000)
    }

    // 开始倒计时
    const onCountdown = (time = 60) => {
        countdown.value = time
        onStart()
    }

    return {
        countdown,
        onCountdown,
    }
}

_.keys(localStorage).filter(e => e.includes('countdown')).forEach(e => {
    const rest = localStorage.getItem(e)

    if (+rest > 0) {
        const { onCountdown } = useCountdown(e.replace('-countdown', ''))
        onCountdown(rest)
    }
})
