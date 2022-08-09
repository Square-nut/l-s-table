import AuthConstant from "@sys/constant/auth-constant";
import i18n from "@sys/i18n/index";
/**
 * 获取url参数
 * @param name 参数名
 */
export const getLoginErrorDesc = (code,msg) => {
    
    let errorDesc="";
    switch(code){
        ///授权模式 不支持
        case AuthConstant.grantTypeNotFondErrorCode:{
            errorDesc=i18n.t("login.common.grantTypeNotFond");
            break;
        }
        ///授权模式 为空
        case AuthConstant.grantTypeNotNullErrorCode:{
            errorDesc=i18n.t("login.common.grantTypeNotNull");
            break;
        }

        ///用户被禁用
        case AuthConstant.userDisableErrorCode:{
            errorDesc=i18n.t("login.common.userDisable");
            break;
        }
        ///用户被锁定
        case AuthConstant.userLockErrorCode:{
            errorDesc=i18n.t("login.common.userLockError");
            errorDesc=errorDesc.replace("${0}",msg);
            break;
        }
       ///用户被锁定
        case AuthConstant.userLockRemindErrorCode:{
            errorDesc=i18n.t("login.common.userLockRemind");
            errorDesc=errorDesc.replace("${0}",msg);
            break;
        }
        ///用户失效
        case AuthConstant.userOutDateErrorCode:{
            errorDesc=i18n.t("login.common.userOutDate");
            break;
        }
        case AuthConstant.userNotCorrectErrorCode:{
            errorDesc=i18n.t("login.common.passwordError");
            break;
        }
        case AuthConstant.tenantOutDateErrorCode:{
            errorDesc=i18n.t("login.common.tenantError");
            break;
        }
        /*y验证码无效*/
        case AuthConstant.captcheInvalidErrorCode:{
            errorDesc=i18n.t("login.common.captchaInValid");
            break;
        }
        case AuthConstant.captcheNotCorrectErrorCode:{
            errorDesc=i18n.t("login.common.captchaNotCorrect");
            break;
        }
        case AuthConstant.userNotMacthErrorCode:{
            errorDesc=i18n.t("login.common.userNotMacth");
            break;
        }
        ///口令不正确
        case AuthConstant.otpCodeInvalidErrorCode:{
            errorDesc=i18n.t("login.otp.codeInvalid");
            break;
        }
        ///手机号或者邮箱 未在系统中注册
        case AuthConstant.otpUserNotFondErrorCode:{
            errorDesc=i18n.t("login.otp.userNotFond");
            break;
        }
    }
    return  errorDesc;
}
