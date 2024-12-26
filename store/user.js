import { ref, computed, onMounted } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import _ from 'lodash'

import { COMMON_API_PATH, useRequest } from '../fetch'
import { utils_assign_object } from '../utils'

const fixedKeys = [
    'totalAssets',
    'amount',
    'withdrawFreeze',
    'contractPrincipal',
    'totalTradersMoney',
    'surplusAmount',
    'usedAmount',
    'backMoneyFreeze',
    'netAssets',
    'withdrawAmount',
]

const initialValues = {
    // 账号
    account: '',
    // id
    memberId: - 1,
    // 手机号
    phone: '',
    // token
    token: '',
    // token 过期时间
    tokenExpiration: 0,

    // 昵称
    nickname: '',
    // 头像
    avatarUrl: '',
    // vip 等级
    level: '',
    commissionPercent: null,
    // 总资产
    totalAssets: '--',
    // 钱包余额
    amount: '--',
    // 提现冻结
    withdrawFreeze: '--',
    // 合约净资产
    contractPrincipal: '--',
    // 总操盘资金
    totalTradersMoney: '--',
    // 未使用
    surplusAmount: '--',
    // 已使用
    usedAmount: '--',
    expiryAmount: null,
    count: null,
    subCount: null,
    commission: null,
    recharge: null,
    rechargeSum: null,
    status: null,
    inviteLink: null,
    backMoneyFreeze: '--',
    realBalance: null,
    isAgent: true,
    // 合约净资产
    netAssets: '--',

    email: null,
    // 邀请码
    inviteCode: '',
    // 真实姓名
    realName: null,
    customerService: null,
    pid: '',
    customerServiceId: null,
    memberLevelId: '--',
    handlingFeePercent: '--',
    interestFeePercent: '--',
    withdrawAmount: '--'
}

export const useUserInfoStore = defineStore('userInfo', () => {
    const userInfo = ref({
        ...initialValues
    })

    const balance_visible = ref(false),
        balance = computed(() => balance_visible.value ? userInfo.value.totalAssets : '******')

    const onBalanceToggle = () => {
        balance_visible.value = !balance_visible.value
    }

    const onSetUserInfo = newUserInfo => {
        fixedKeys.forEach(e => {
            const val = newUserInfo[e]
            if (_.isNumber(val)) newUserInfo[e] = val.toFixed(2)
        })
        userInfo.value = utils_assign_object(userInfo.value, newUserInfo)
    }

    const onResetUserInfo = () => {
        userInfo.value = { ...initialValues }
    }

    const { loading: userInfoLoading, run: userInfoRun } = useRequest({
        url: COMMON_API_PATH.USERINFO,
        manual: true,
        onSuccess: res => {
            onSetUserInfo(res)
        }
    })

    // const { loading: userBaseInfoLoading, run: userBaseInfoRun } = useRequest({
    //     url: COMMON_API_PATH.USERINFO_BASE,
    //     manual: true,
    //     onSuccess: res => {
    //         delete res.amount
    //         onSetUserInfo(res)
    //     }
    // })

    const onRefreshUserInfo = () => {
        Promise.all([
            userInfoRun(),
            // userBaseInfoRun()
        ])
    }

    const onNewRefreshUserInfo = () => {
        Promise.all([
            userInfoRun()
        ])
    }

    return {
        userInfo,
        balance_visible,
        balance,
        loading: computed(() => userInfoLoading.value),
        onBalanceToggle,
        onSetUserInfo,
        onResetUserInfo,
        onRefreshUserInfo,
        onNewRefreshUserInfo
    }
}, {
    persist: {
        storage: localStorage,
    },
})

export const useMessageStore = defineStore('message', () => {
    const { userInfo } = storeToRefs(useUserInfoStore())

    const hasUnread = ref(false)

    const { response, onRefresh } = useRequest({
        url: COMMON_API_PATH.MESSAGE_STATUS,
        initialValues: {
            isSystemMessages: null,
            isStandInsideLetters: false,
            isAnnouncementMessages: null,
            isStockWarning: false
        },
        manual: !userInfo.value.token,
        onSuccess: res => {
            hasUnread.value = _.values(res).some(Boolean)
        }
    })

    return {
        hasUnread,
        readStatus: response,
        onRefreshReadStatus: onRefresh
    }
})
