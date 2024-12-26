export const COMMON_API_PATH = {
    /** 系统类 */
    // 轮播图接口
    CAROUSEL: '/information/viewpager/select',

    // 弹窗公告
    POPUP: '/information/platformPopups',

    // api 域名列表
    API_DOMAIN: '/check/domains/getApiDmian',
    // api域名检查
    API_CHECK: '/check/systemConfigCheck/getCheck',
    // 用于访问的前端域名站
    WEB_DOMAIN: '/check/domains/getWebDmian',

    // 站点配置项
    PC_CONFIG: '/member/systemConfig/getPCSiteConfig',
    SITE_CONFIG: '/member/systemConfig/getSiteConfigHide',
    // 基础信息 ps:重复接口数据可优化
    SITE_CONFIG_BASE: '/member/systemConfig/getSystemConfigValue',
    // 获取客服信息
    SERVICE: '/member/systemConfig/getCustomerServiceLink',
    /** 系统类 */

    /** 股票行情 */
    // 行情操作；需要拼接event传递
    DO: '/market/v2/data/doAction',
    // K 线图
    K_LINE: '/market/getKLineData',
    /** 股票行情 */

    /** 登录注册 */
    // 检查注册账号、手机号是否注册过
    CHECK_ACCOUNT_REGISTER: '/auth/member/checkAccountRegister',
    CHECK_MOBILE_REGISTER: '/auth/member/checkPhoneRegister',
    CHECK_MOBILE_V2_REGISTER: '/auth/member/v2/checkPhoneRegister',
    // 发送短信验证码
    SMS_SEND: '/member/sms/operlog/86/',
    // 检查短信验证码
    SMS_CHECK: '/member/member/codeCheck',
    // 密码加密公钥
    PUBLIC_KEY: '/auth/system/getPublicKey',
    // 注册
    REGISTER: '/auth/member/register',
    // 账号密码登录
    LOGIN_BY_ACCOUNT: '/auth/member/login',
    // 手机号登录
    LOGIN_BY_MOBILE: '/auth/member/verificationLogin',
    /** 登录注册 */

    /** 新闻类 */
    // A股新闻
    NEWS_STOCK: '/market/getNewsStockList',
    // 要闻
    NEWS: '/information/yaowen',
    // 快讯
    NEWS_FLASH: '/information/preview/save',
    /** 新闻类 */

    /** 用户类 */
    // 用户信息
    USERINFO: '/member/member/getMyPageData',
    USERINFO_BASE: '/member/member/getMemberBaseInfo',

    MESSAGE_STATUS: '/member/statistics/messagestatistics',
    /** 用户类 */
}
