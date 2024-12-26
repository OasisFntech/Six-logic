import { reactive, ref } from 'vue'
import _ from 'lodash'

import { api_fetch, COMMON_API_PATH, FETCH_METHOD } from '../fetch'
import { COMMON_FORM_CONFIG } from '../config'
import { usePublicKeyStore } from '../store'

export const useRegister = ({
    submitCallback,
    initialValues,
    errMsg
}) => {
    const { onEncode } = usePublicKeyStore()

    /**
     * @const formState form表单数据
     * @const checkLoading 检查账号 loading
     * @const submitLoading 提交 loading
     * */
    const formState = reactive({
            account: '',
            password: '',
            repeat: '',
            mobile: '',
            code: '',
            referrer: '',
            transactionPassword: '',
            ...initialValues
        }),
        checkLoading = ref(false),
        submitLoading = ref(false)

    // 检查账号是否重复
    const onCheckAccount = async (username) => {
        if (!checkLoading.value) {
            checkLoading.value = true
            try {
                const isRepeat = await api_fetch({
                    url: COMMON_API_PATH.CHECK_ACCOUNT_REGISTER,
                    params: {
                        username
                    }
                })

                if (isRepeat) {
                    return Promise.reject()
                } else {
                    return Promise.resolve()
                }
            } finally {
                checkLoading.value = false
            }
        }
    }

    // 注册提交
    const onSubmit = async (values) => {
        if (!submitLoading.value) {
            submitLoading.value = true

            try {
                const { account, password, mobile, code, referrer, transactionPassword } = values

                const isRegister = await api_fetch({
                    url: COMMON_API_PATH.CHECK_MOBILE_V2_REGISTER,
                    method: FETCH_METHOD.GET,
                    params: {
                        phone: mobile,
                        code,
                        bizType: 'register'
                    }
                })

                if (isRegister) {
                    errMsg('该手机号已注册')
                    return Promise.reject()
                } else {
                    // // 校验短信验证码
                    // await api_fetch({
                    //     url: COMMON_API_PATH.SMS_CHECK,
                    //     params: {
                    //         phone: mobile,
                    //         code
                    //     }
                    // })

                    await api_fetch({
                        url: COMMON_API_PATH.REGISTER,
                        params: {
                            username: account,
                            // nickName: mobile,
                            phone: mobile,
                            // code,
                            inviterPhone: referrer,
                            userType: 1,
                            transactionPassword: await onEncode(transactionPassword),
                            loginPassword: await onEncode(password),
                            exclusiveDomain: window.location.origin
                        }
                    })

                    submitCallback?.()
                }
            } finally {
                submitLoading.value = false
            }
        }
    }

    return {
        formState,
        REGISTER_FORM_CONFIG: _.values(COMMON_FORM_CONFIG),
        checkLoading,
        onCheckAccount,
        submitLoading,
        onSubmit
    }
}
