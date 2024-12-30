import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'

import { useRequest, COMMON_API_PATH, NOTICE_SOCKET } from '../fetch'
import { useMessageStore, useUserInfoStore } from './user'
import { utils_assets_src, utils_assign_object, utils_favicon } from '../utils'
import { useTitle } from '@vueuse/core'
import { assetsDomains } from '../config'

export const useSiteConfigStore = defineStore('siteConfig', () => {
    // 站点配置
    const siteConfig = ref({
        keyword: null,
        siteLogo: null,
        siteLogo2: null,
        // 站点名
        siteName: '',
        // 页面 ico 图标
        titleAddress: '',
        // 备案号 - Copyright展示
        recordNumber: '',
        siteSwitch: false,
        registerSwitch: false,
        type: '',
        benchmarkPeople: 0,
        benchmarkAmount: 0,
        applyContractSwitch: false,
        // 商标地址 - Copyright展示
        copyrightInformation: '',
        imgCodeSwitch: false,
        // 客服链接 - Footer展示
        customerServiceLink: '',
        // 客服联系方式 - Footer展示
        customerServicePhone: '',
        customerServiceUrl: '',
        longConnectionSwitch: '',
        // 办公地址 - Footer展示
        officeLocation: '',
        // 办公时间 - Footer展示
        onlineTime: '',
        siteStat: '',
        webSiteStat: '',
        rebateSwitch: false,
        autoAgent: false,
        // 底部二维码地址 - Footer展示
        qrCodeAddress: '',
        withdrawUseFree: false,
        followBuyUseFree: false,
        needCheckOldPwd: false,
        bindCardCheckTxPwd: false,
        registerSMS: 1,
        isCloseSMS: 1,
        changeSMS: 1,
        showCapitalRecord: 1,
        showRechargeRecord: 1,
        withdrawPriority: 1,
        // 余额宝审核开关
        yueBaoReviewSwitch: false,

        // 资源域名
        imgDomains: '',
        regIpLimit: '',
        dailySmsLimit: 0,
        enableInviteCode: false,
        canModifyPhone: false,
        turntableLottery: '',
        tenant: '',
        showWithdrawRecord: 0,
        ipToken: null,
        yueBaoLimitEnable: false,
        yueBaoLimitStart: '',
        yueBaoLimitEnd: '',
    })

    // 检查域名是否可用的方法
    const checkDomainAvailability = (domain) => {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.src = `https://${domain}/media/image/check_image_0101.png`
            img.onload = () => resolve(domain)
            img.onerror = () => reject(domain)
        })
    }

    // 验证 localStorage 中的域名是否可用
    const validateSavedDomain = async () => {
        const savedDomain = localStorage.getItem('validDomain')
        if (savedDomain) {
            try {
                await checkDomainAvailability(savedDomain)
                assetsDomains.push(savedDomain)
            } catch (error) {
                localStorage.removeItem('validDomain')
            }
        } else {
            // console.warn('No domain found in localStorage to validate.')
        }
    }

    const { onRefresh: onRefreshSiteConfig } = useRequest({
        url: COMMON_API_PATH.SITE_CONFIG,
        onSuccess: async(res) => {
            const savedDomain = localStorage.getItem('validDomain')
            if (savedDomain) {
                const img = new Image()
                img.src = `https://${savedDomain}/media/image/check_image_0101.png`
                img.onload = () => {
                    assetsDomains.push(savedDomain)
                }
                img.onerror = () => {
                    // console.warn(`Saved domain is invalid: ${savedDomain}`)
                    localStorage.removeItem('validDomain')
                    detectNewDomains(res)
                }
            } else {
                detectNewDomains(res)
            }

            siteConfig.value = utils_assign_object(siteConfig.value, res, true)
            useTitle(res.siteName)
            await run({
                configKey: 'customerServiceManagement',
            })
            utils_favicon(utils_assets_src(res.titleAddress))
        }
    })

    // 检测新的域名
    const detectNewDomains = (res) => {
        if (!res.imgDomains || res.imgDomains.trim() === '') {
            console.warn('No image domains provided')
            return
        }

        const domains = res.imgDomains.split(',')
        if (domains.length) {
            let savedToLocalStorage = false

            domains.forEach((e) => {
                const img = new Image()
                img.src = `https://${e}/media/image/check_image_0101.png`
                img.onload = () => {
                    if (!savedToLocalStorage) {
                        assetsDomains.push(e)
                        localStorage.setItem('validDomain', e)
                        savedToLocalStorage = true
                    }
                }
            })
        }
    }

    // 请求客服配置 ps:后端可优化的接口
    const { onRefresh: onRefreshService, run } = useRequest({
        url: COMMON_API_PATH.SITE_CONFIG_BASE,
        // params: {
        //     configKey: 'customerServiceManagement'
        // },
        manual: true,
        onSuccess: res => {
            siteConfig.value = utils_assign_object(siteConfig.value, { ...res, qrCodeAddress: utils_assign_object(res.qrCodeAddress) }, true)
        }
    })

    // 获取logo
    const { response: logoRes } = useRequest({
        url: COMMON_API_PATH.PC_CONFIG,
        initialValues: {
            logoAddress: '',
            hideHelpCenter: null
        },
        formatResult: res => ({ ...res, logoAddress: utils_assets_src(res.logoAddress) })
    })

    return {
        siteConfig,
        logoRes,
        onRefreshService,
        onRefreshSiteConfig,
        validateSavedDomain
    }
})

export const useNoticeStore = defineStore('notice', () => {
    const userInfoStore = useUserInfoStore(),
        { onRefreshUserInfo } = userInfoStore,
        { userInfo } = storeToRefs(userInfoStore),
        { onRefreshReadStatus } = useMessageStore()

    if (userInfo.value.token && !NOTICE_SOCKET.active) {
        NOTICE_SOCKET.emit(undefined,
            {
                memberId: userInfo.value.memberId,
                token: userInfo.value.token,
            }
        )
    }

    const notice = ref([])

    NOTICE_SOCKET.on(res => {
        notice.value = [
            ...notice.value.slice(-4),
            res[0]
        ]
        onRefreshReadStatus()

        if (res[0].type === 'Stand_Inside_Letter') {
            onRefreshUserInfo()
        }
    })

    return {
        notice,
    }
})
