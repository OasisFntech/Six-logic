export const FORM_CONTROLLER_TYPE = {
    INPUT: 'input',
    PASSWORD: 'password',
    SELECT: 'select',
    SEARCH: 'search',
    NUMBER: 'number'
}

export const COMMON_RULES = {
    account: [
        { required: true, message: '请输入会员账号' },
        { pattern: /^(?=.*[a-z])(?=.*\d)[a-z\d]{4,18}$/i, message: '账号格式为4-18位小写字母和数字组合' }
    ],
    password: [
        { required: true, message: '请输入登录密码' },
        { pattern: /^(?=.*[a-z])(?=.*\d)[a-z\d]{6,18}$/i, message: '密码格式为6-18位小写字母和数字组合' },
    ],
    mobile: [
        { required: true, message: '请输入手机号' },
        { pattern: /^1[3456789]\d{9}$/, length: 13, message: '请输入正确的手机号格式' }
    ],
    code: [
        { required: true, message: '请输入短信验证码' },
        { pattern: /^\d{6}$/, message: '请输入正确的短信验证码' }
    ],
    referrer: []
}

export const COMMON_FORM_CONFIG = {
    account: {
        itemProps: {
            label: '账号',
            name: 'account',
            rules: COMMON_RULES.account
        },
        controllerType: FORM_CONTROLLER_TYPE.INPUT,
        controllerProps: {
            maxlength: 18
        }
    },
    password: {
        itemProps: {
            label: '密码',
            name: 'password',
            rules: COMMON_RULES.password
        },
        controllerType: FORM_CONTROLLER_TYPE.PASSWORD,
        controllerProps: {
            maxlength: 18
        }
    },
    mobile: {
        itemProps: {
            label: '手机号',
            name: 'mobile',
            rules: COMMON_RULES.mobile
        },
        controllerType: FORM_CONTROLLER_TYPE.INPUT,
        controllerProps: {
            type: 'tel',
            maxlength: 11,
            controls: false
        }
    },
    code: {
        itemProps: {
            label: '验证码',
            name: 'code',
            rules: COMMON_RULES.code
        },
        controllerType: FORM_CONTROLLER_TYPE.INPUT,
        controllerProps: {
            type: 'tel',
            maxlength: 6,
            controls: false
        }
    },
    referrer: {
        itemProps: {
            label: '邀请码',
            name: 'referrer'
        },
        controllerType: FORM_CONTROLLER_TYPE.INPUT,
        controllerProps: {}
    }
}
