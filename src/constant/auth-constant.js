import i18n from "@sys/i18n/index";
import  Constant from "@sys/constant/common-constant"
/**
 * 以下是登录相关的常量
 */
const AuthConstant = {
    passwordError:{
        "001":i18n.t("login.passwordRule.firstLoginMidify"),//"第一次登录需要修改密码"
        "002":i18n.t("login.passwordRule.forceModify"),//"强制修改密码",
        "003":i18n.t("login.passwordRule.outDate"),//密码过期，请修改密码",
        "JYP001":i18n.t("login.passwordRule.lengthNotEnough"),//"密码长度不够",
        "JYP002":i18n.t("login.passwordRule.complexityNotEnough"),//"密码复杂度不够",
        "JYP003":i18n.t("login.passwordRule.LCNotEnough"),//"密码长度和复杂度不够",
    },
    socialErrorCode:"4005",
    socialErrorCodeSec:"4006",
    tokenErrorCode:"4001",///token失效
    tokenNotFondCode:"4000",///token为空
    captchaNeedOpenCode:"4003",
    passwordErrorCode:"4002",//密码策略有误
    twoAuthErrorCode:"4100",
    otpCodeInvalidErrorCode:Constant.httpCode.NOT_PERMISSION+"_2",
    otpUserNotFondErrorCode:Constant.httpCode.NOT_PERMISSION+"_3",
    ///账号登录的一些特殊的提示，这个比较多
    grantTypeNotFondErrorCode:Constant.httpCode.BAD_REQUEST+"_C1",///授权码模式不支持
    grantTypeNotNullErrorCode:Constant.httpCode.BAD_REQUEST+"_C2",///授权模式参数不能为空

    ///用户的校验的错误编码
    userDisableErrorCode:Constant.httpCode.NOT_PERMISSION+"_C3",
    userLockErrorCode:Constant.httpCode.NOT_PERMISSION+"_C4",
    userLockRemindErrorCode:Constant.httpCode.NOT_PERMISSION+"_C17",
    userOutDateErrorCode:Constant.httpCode.NOT_PERMISSION+"_C5",

    ///用户名和密码错误
    userNotCorrectErrorCode:Constant.httpCode.NOT_PERMISSION+"_C7",

    ///租户无效
    tenantOutDateErrorCode:Constant.httpCode.NOT_PERMISSION+"_C10",

    captcheInvalidErrorCode:Constant.httpCode.NOT_PERMISSION+"_C12",

    captcheNotCorrectErrorCode:Constant.httpCode.NOT_PERMISSION+"_C13",

    userNotMacthErrorCode:Constant.httpCode.NOT_PERMISSION+"_C15",

};

export default AuthConstant;
