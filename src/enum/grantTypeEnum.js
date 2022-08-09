import Enum from '@sys/enum/Enum.js'

class grantTypeEnum extends Enum {
    
    /**
     * 枚举对象
     */
    static PASSWORD = ['password', '账号密码登录'];
    static CAPTCHA = ['captcha', '用户名密码验证码登录'];
    static CA = ['ca', 'CA登录'];
    static SOCIAL = ['social', '第三方平台登录'];
    static OTP = ['otp', '动态口令登录'];
    static REFRESH_TOKEN = ['refresh-token', '刷新令牌登录'];
    
    /**
     * 状态编码
     */
    static code;
    
    /** 
     * 状态描述
     */
    static desc;

    getNameByCode(code) {
        let desc="";
        for (let key in this)
        {
            if (this[key].code==code)
            {
                desc=this[key].desc;
            }
        }
        return desc
    }

    getCodeByName(name) {
        let code="";
        for (let key in this)
        {
            if (this[key].name==name)
            {
                code=this[key].code;
            }
        }
        return code
    }

    getSelectData() {
        let data=[];
        for (let key in this)
        {
            let obj ={
                value:this[key].code,
                label:this[key].desc,
            }
            data.push(obj);
        }
        return data
    }
    
}

const obj = new grantTypeEnum()


export default obj

