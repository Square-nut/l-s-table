<template>
    <hos-row>
        <hos-form
                ref="otpLoginForm"
                :model="otpLoginForm"
                :rules="otpLoginRules"
                class="login-form"
                auto-complete="on"
                label-position="left"
        >
            <hos-col :span="24">
                <hos-form-item prop="tenantId" v-if="openTenant" >
                    <hos-select  disabled class="tenantSelect" popper-class="tenantPop" :placeholder="$t('login.label.placeholder.tenantId')" v-model="otpLoginForm.tenantId"
                                >
                        <hos-option
                                v-for="(item,index) in tenantData"
                                :key="index"
                                :label="item.name"
                                :value="item.tenantId"
                        >
                        </hos-option>
                    </hos-select>
                    <i class="hos-icon-s-home"></i>
                </hos-form-item>
            </hos-col>

            <hos-col :span="24">
                <hos-form-item prop="loginName">
                    <hos-input
                            prefix-icon="hos-icon-user"
                            ref="loginName"
                            v-model="otpLoginForm.loginName"
                            :placeholder="$t('login.label.placeholder.otpName')"
                            name="loginName"
                            type="text"
                            @keyup.enter.native="keyEnterLogin('captchaCode')"
                    />
                </hos-form-item>
            </hos-col>
            <!--图形验证码的区域-->
            <hos-col :span="24">
                <hos-form-item  prop="captchaCode">
                    <hos-col :span="14">
                        <hos-input
                                v-model="otpLoginForm.captchaCode" ref="captchaCode"
                                :placeholder="$t('login.label.placeholder.otpCode')"
                                prefix-icon="hos-icom-select-grant"
                                type="text" @keyup.enter.native="keyEnterLogin"
                        >
                        </hos-input>
                    </hos-col>
                    <hos-col :span="10" class="VCode" v-show="!btnShow">
                        <span>{{count}}{{$t('login.label.button.sendOTPInfo')}}</span>
                    </hos-col>
                    <hos-col :span="10" v-show="btnShow">
                        <hos-button v-show="btnShow"
                                :loading="loading"
                                type="info"
                                style="width: 100%; margin-left:15px"
                                @click="getCode()"
                        >{{$t('login.label.button.sendOTPBtn')}}
                        </hos-button>
                    </hos-col>
                </hos-form-item>
            </hos-col>
            <hos-col :span="24">
                <hos-form-item>
                    <hos-button
                            :loading="loading"
                            type="primary"
                            style="width: 100%; margin-bottom: 10px"
                            @click="otpHandleLogin(true)"
                    >{{$t('login.label.button.loginBtn')}}
                    </hos-button>
                </hos-form-item>
            </hos-col>
        </hos-form>
    </hos-row>
</template>

<script>
    import {mapActions} from 'vuex'
    import AuthConstant from "@sys/constant/auth-constant";
    import {validPhone, validEmail} from "@sys/utils/validateUtil";
    import {getLoginErrorDesc} from "./js/login"
    export default {
        name: "otplogin",

        data() {
            const validatePhoneAndMail = (rule, value, callback) => {
                let type="";
                if(validPhone(value)){
                    type="phone"
                }
                if(validEmail(value)){
                    type="mail"
                }
                 if(type==""){
                     callback(new Error(this.$t("login.label.rule.otpName")));
                 }else{
                     this.loginType=type;
                     callback();
                 }


            };
            return {
                openTenant: false,   //是否开启租户
                otpLoginForm: {
                    grantType: "otp",
                    loginName: "",
                    tenantId: "",
                    captchaCode: "",
                    captchaUUID: "",
                    selectRoleId: ""
                },
                loginType:"phone",
                otpLoginRules: {
                    loginName: [{ validator: validatePhoneAndMail, trigger: "blur"}],
                    ///租户id 不能为空
                    tenantId: [
                        {required: false, trigger: "blur", message: this.$t("login.label.rule.tenantId")},
                    ],
                    ///口令不能为空
                    captchaCode: [
                        {required: true, trigger: "blur", message: this.$t("login.label.rule.otpCode")},
                    ]
                },
                loading: false,
                tenantData: [],
                isRoleOrg:false,
                oAuthId: "",
                source: "",
                roleId: [],
                roleName: [],
                inputValueChanged: false,
                roleData:[],
                btnShow: true,
                count: '',
                timer: null,
            };
        },
        mounted() {
            //window.addEventListener("click", this.clickOther);
        },
        beforeDestroy() {  // 实例销毁之前对点击事件进行解绑
            //window.removeEventListener('click', this.clickOther);
        },
       /* watch: {
            "otpLoginForm.loginName": function (newVal, oldval) {
                this.inputValueChanged = newVal !== oldval;
            },
            "otpLoginForm.password": function (newVal, oldval) {
                this.inputValueChanged = newVal !== oldval;
            }
        },*/
        props:{
            getOTPLoginData:Function,
            twoAuthUUID:String,
            loginSucessHandler:Function
        },
        created() {
            ///从父页面中获取初始化数据
            this.initData(this.getOTPLoginData());
        },
        computed: {},
        methods: {
            ...mapActions(['Login']),
            initData(val){
                let that = this;
                let preData = val;
                this.openTenant = preData.isTenantEnable ;

                if (this.openTenant) {
                    this.tenantData = preData.tenantData;
                    this.otpLoginForm.tenantId=that.$store.getters.tenantId;
                  /*  if (this.tenantData.length > 0) {
                        let filterData = this.tenantData.filter(function (item) {    // 3、value 代表数组中的每一项
                            return item.tenantId == that.$store.getters.tenantId;
                        })
                        if (filterData & filterData.length > 0) {
                            this.otpLoginForm.tenantId = that.$store.getters.tenantId;
                        } else {
                            this.otpLoginForm.tenantId = this.tenantData[0].tenantId;
                        }
                    }*/
                }
            },
            keyEnterLogin(name) {///键盘enter事件
                if (this.$refs[name]) {
                    this.$refs[name].focus();
                } else {
                    this.userHandleLogin(true);
                }
            },
            ///登录操作
            otpHandleLogin(isLogin) {
                this.$refs.otpLoginForm.validate((valid) => {
                    if (valid) {
                        ///用于处理二次认证的第一次认证的id
                        this.otpLoginForm.twoAuthUUID=this.twoAuthUUID;
                        ///赋值 手机号或者邮箱的类型 phone或者mail
                        this.otpLoginForm.loginType=this.loginType;

                        let paramData = JSON.parse(JSON.stringify(this.otpLoginForm));
                        this.loading = true;
                        this.Login(paramData).then((res) => {
                            this.loading = false;
                            this.loginSucessHandler();
                        }).catch((err) => {
                            this.loading = false;
                            let code = err.code;
                            ///需要双因子认证的错误，
                            if(code === AuthConstant.twoAuthErrorCode){
                                ///这个需要从respnmse中获取数据,已经从过滤器中处理了
                                let uuid=err.uuid;
                                let authType=err.authType;
                                ///弹出层
                                this.$emit('openTwoAuthDialog',uuid,authType);
                            }else{
                                ///根据返回的编码，从国家化中获取相应的描述
                                ////公共的错误码的校验
                                let errorDesc =  getLoginErrorDesc(code,err.msg);
                                if(!errorDesc||errorDesc==""){
                                    errorDesc= this.$t("login.otp.authFailed");
                                }
                                this.$message.error(errorDesc);
                            }
                        });
                        this.loading = false;
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            getCode(){
                this.otpLoginRules.captchaCode = {required: false, trigger: "blur", message: ""};
                this.$refs.otpLoginForm.validate((valid) => {
                    if (valid) {
                        this.getOTPCode();
                    }
                })
                this.otpLoginRules.captchaCode = {required: true, trigger: "blur", message: this.$t("login.label.rule.otpCode") };
            },
            countDown(timeLength){
                let TIME_COUNT = timeLength;
                if (!this.timer) {
                    this.count = TIME_COUNT;
                    this.btnShow = false;
                    this.timer = setInterval(() => {
                        if (this.count > 0 && this.count <= TIME_COUNT) {
                            this.count--;
                        } else {
                            this.btnShow = true;
                            clearInterval(this.timer);
                            this.timer = null;
                        }
                    }, 1000)
                }
            },
            getOTPCode() {
                return new Promise(resolve => {
                    let phoneForm={"phone":this.otpLoginForm.loginName};
                    this.$api('getOTPCode',phoneForm).then(response => {
                        if (response && response.code == 200) {
                            this.otpLoginForm.captchaUUID = response.data.uuid;
                            this.countDown(60);
                        } else {
                            ///提示错误信息
                            this.$message.error(this.$t("login.otp.codeSendError"));
                        }
                    }).catch(error => {
                        console.log(error);
                    })
                });

            }

        },
    };
</script>

