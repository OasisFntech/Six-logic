import SocketIO from 'socket.io-client'
import { v4 } from 'uuid'

import { utils_base64 } from '../utils'

const deviceID = 'webclip_' + v4()

export const SOCKET_EVENTS = {
    SUBSCRIBE: 'subscribe',
    UNSUBSCRIBE: 'unsubscribe'
}

export let socket = null

export const createSocket = (socketUri) => {
    if (!socket) {
        socket = SocketIO(
            `${socketUri}?deviceID=${deviceID}`,
            {
                transports: [ 'websocket' ],
                deviceID,
            }
        )

        socket.on('connect', (con) => {
            console.log('socket connected successfully')
        })
    }
}

// K线图请求地址
export const SOCKET_URL = {
    // 消息通知
    NOTICE: '/notice'
}

// do 接口参数整合
export const doParams = (params, payload) => ({
    event: SOCKET_EVENTS.SUBSCRIBE,
    params,
    uuid: v4(),
    ...payload
})

/**
 * @class CreateSocket Socket 对象
 * @constructor url 创建socket的event事件
 * @emit 发送事件
 * @on 监听事件 传送回调参数
 * @close 关闭socket连接
 * */
class CreateSocket {
    constructor(event, isBase64 = true) {
        this.event = event
        this.active = false
        this.isBase64 = isBase64
    }
    emit(params, payload) {
        if (socket) {
            if (this.active) this.close()

            socket.emit(
                this.event,
                doParams(params, payload)
            )
            this.active = true
        }
    }
    on(callback) {
        if (socket) {
            socket.on(this.event, ({ code, data }) => {
                if (code === 1) {
                    if (this.isBase64) {
                        callback(
                            utils_base64(data)
                        )
                    } else {
                        callback(data)
                    }
                }
            })
        }
    }
    close() {
        if (this.active && socket) {
            socket.emit(
                this.event,
                {
                    event: SOCKET_EVENTS.UNSUBSCRIBE
                }
            )
            this.active = false
        }
    }
}

// 消息通知
export const NOTICE_SOCKET = new CreateSocket(SOCKET_URL.NOTICE, false)
