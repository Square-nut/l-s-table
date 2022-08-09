<template>
    <div class="upload-avatar">
        <div class="allContent">
            <hos-row
                v-if="type === '2' || type === '3'"
                class="rowData"
                :class="roleData.length > 4 ? 'rowDataOver' : ''"
            >
                <div
                    v-for="(item, index) in roleData"
                    :key="index"
                    class="roleCol"
                    @click="handleClick(item.roleId)"
                >
                    <div class="content" :class="currentRole==item.userId?'content-current':''">
                        <img
                            :src="
                item.avatar == null || item.avatar == '' ? avatar : item.avatar
              "
                            class="image"
                        />
                        <div class="spanName">
                            <span class="userName">&nbsp;{{ item.userName }}</span>
                            <span class="roleName">&nbsp;{{ item.roleName }}</span>
                            <span class="OrgName">&nbsp;{{ item.orgName }}</span>
                        </div>
                    </div>
                </div>
            </hos-row>
            <hos-row
                v-else
                class="rowData"
                :class="roleData.length > 4 ? 'rowDataOver' : ''"
            >
                <div
                    v-for="(item, index) in roleData"
                    :key="index"
                    class="roleCol"
                    @click="handleClick(item.roleId)"
                >
                    <div class="content" :class="currentRole==item.userId?'content-current':''">
                        <img
                            :src="
                item.avatar == null || item.avatar == '' ? avatar : item.avatar
              "
                            class="image"
                        />
                        <div class="spanName">
                            <span class="userName">&nbsp;{{ item.userName }}</span>
                            <span class="roleName">&nbsp;{{ item.roleName }}</span>
                        </div>
                    </div>
                </div>
            </hos-row>
        </div>
        <div
            slot="footer"
            class="dialog-footer"
        >
            <hos-button
                @click="cancel"
                type="primary"
            >{{
        $t("operation.close")
      }}</hos-button>
        </div>
    </div>
</template>

<script>
import { getQueryString, getTopUrl } from "@sys/utils/base/base-util";
export default {
    data() {
        return {
            currentRole: "",
            roleData: {},
            type: {},
            avatar: require("../../../../assets/images/defaultRole.png"),
            roleId: "",
            orgId: "",
            noData: false,
            count: "",
            timer: null,
        };
    },
    created() {
        this.roleData = this.$store.getters.userInfo.roleData;
        this.currentRole = this.$store.getters.userInfo.userId;
        this.type = this.$store.getters.baseUserOrgRole;
        this.$store.getters.baseScopeResource;
        ////获取之前选择的
        this.roleId = this.$store.getters.roleId;
        if (this.type === "2" || this.type === "3") {
            this.roleId = this.roleId + "^" + this.$store.getters.orgId;
        }
        if (this.roleData.length == 1) {
            ///科室关联
            /*if(this.type === "2" || this.type === "3") {
					this.handleClick(this.roleData[0].roleId + "^" + this.roleData[0].orgId);
				} else {
					this.handleClick(this.roleData[0].roleId);
				}*/
        } else if (!this.roleData || this.roleData.length == 0) {
            this.noData = true;
            this.countDown(5);
        }
    },
    methods: {
        toLogin() {
            clearInterval(this.timer);
            this.$store.dispatch("Logout").then(() => {
                ///跳转到登录页面
                this.$router.push({
                    path: "/login",
                });
            });
        },
        countDown(timeLength) {
            let TIME_COUNT = timeLength;
            if (!this.timer) {
                this.count = TIME_COUNT;
                this.btnShow = false;
                this.timer = setInterval(() => {
                    if (this.count > 0 && this.count <= TIME_COUNT) {
                        this.count--;
                    } else {
                        this.toLogin();
                        //clearInterval(this.timer);
                        this.timer = null;
                    }
                }, 1000);
            }
        },
        handleClick(roleId) {
            let isiN = false; //是否进入系统内的角色切换
            if (this.$store.getters.roleId) {
                isiN = true;
            }
            ///如果不需要选择角色，则直接列出来查看，不做处理
            if (!this.$store.getters.isSelectRole) {
                return;
            }
            ///

            let orgId = "";
            if (this.type === "2" || this.type === "3") {
                let data = roleId.split("^");
                roleId = data[0];
                orgId = data[1];
            }
            ///角色选择，如果角色改变，则将菜单数据列为空，用于重新获取菜单数据
            if (this.roleId !== roleId) {
                this.$store.dispatch("saveMenuList", []);
                this.$store.dispatch("UpdateAppRouter", { constRoutes: [] });
                this.$store.dispatch("setDropDownMenu", []);
            }
            //获取是否科室关联
            let redirect = getQueryString("redirect");
            ////保存roleId
            if (orgId != "") {
                this.$store.dispatch("saveOrgId", orgId);
            }
            this.$store.dispatch("saveRoleId", roleId);
            if (isiN) {
                location.href = "/";
            } else {
                if (redirect) {
                    this.$router.push({
                        path: redirect,
                    });
                } else {
                    this.$router.push({
                        path: "/",
                    });
                }
            }
        },
        cancel() {
            this.$store.commit("CLOSE_DIALOG", { _uid: "menuDialog" });
        },
    },
};
</script>
<style>
.allContent {
    padding: 0 7px;
}
.selectRole {
    margin: 30px 0 30px 0;
    font-size: 20px;
    font-family: Source Han Sans CN-Bold, Source Han Sans CN;
    font-weight: bold;
    color: #000000;
}
.spanName {
    text-align: center;
    padding: 15px 15px 10px 15px;
    line-height: 20px;
}
.rowData {
    text-align: center;
}
.rowDataOver {
    text-align: left !important;
}

.roleCol {
    display: inline-block;
    width: calc(25% - 22px);
    margin-top: 10px;
    margin: 0 10px;
    padding-top: 10px;
    padding-left: 2px;
    border-radius: 5px;
}
.roleCol .content {
    border: 1px solid #ccc;
}
.roleCol .content-current {
    box-shadow: 0px 0px 4px 1px #4781f3 !important;
}

.rowData .hos-card {
    width: 150px;
    height: 223px;
}

.rowData .roleName {
    display: block;
    line-height: 20px;
    color: #666666;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.rowData .userName {
    display: block;
    color: #000000;
    font-weight: 800;
    font-size: 14px;
    font-family: Source Han Sans CN-Medium;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.rowData .OrgName {
    display: block;
    color: #666666;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.time {
    font-size: 13px;
    color: #999;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
}

.button {
    padding: 0;
    float: right;
}

.image {
    width: 100%;
    height: 150px;
    display: block;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both;
}
</style>
