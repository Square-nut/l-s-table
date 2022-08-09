<template>
    <div class="h-fit user-tab tabs-table">
        <hos-tabs
            class="h-fit"
            v-model="activeName"
            @tab-click="handleClick"
        >
            <hos-tab-pane
                class="h-fit"
                name="first"
                @handleClick="handleClick"
                v-has-permi="{ key: 'base:sys:user:userList' }"
            >
                <span slot="label">{{ $t("user.userList") }}</span>
                <!-- <span slot="label">
            <hos-tooltip class="item" effect="dark" :content="$t('user.userList')" placement="top-start">
            <i class="hos-icom-format-line-dott"></i>
            </hos-tooltip>
        </span> -->
                <hos-biz-table
                    class="all-table"
                    :selection="selection"
                    uid="table1"
                    v-if="activeName === 'first'"
                    :cols="cols"
                    :data="selectPage"
                    :form="form"
                    pagePos="top"
                    @selection-change="changeSelection"
                >
                    <template #form>
                        <hos-row :gutter="20">
                            <hos-col :span="6">
                                <hos-form-item :label="$t('role.loginName')">
                                    <hos-input
                                        v-model="form.model.loginName"
                                        clearable
                                        :placeholder="
                                            $t(
                                                'role.placeholder.placeLoginName'
                                            )
                                        "
                                    ></hos-input>
                                </hos-form-item>
                            </hos-col>
                            <hos-col :span="6">
                                <hos-form-item :label="$t('user.name')">
                                    <hos-input
                                        v-model="form.model.name"
                                        clearable
                                        :placeholder="
                                            $t('user.placeholder.placeUserName')
                                        "
                                    ></hos-input>
                                </hos-form-item>
                            </hos-col>
                            <hos-col :span="6">
                                <hos-form-item :label="$t('role.orgId')">
                                    <hos-tree-select
                                        v-model="form.model.orgId"
                                        :appendToBody="true"
                                        zIndex="10000"
                                        clearable
                                        :options="userOptions"
                                        :placeholder="
                                            $t('user.placeholder.placeUserOrg')
                                        "
                                    ></hos-tree-select>
                                </hos-form-item>
                            </hos-col>
                            <hos-col :span="6">
                                <hos-form-item label-width="20px">
                                    <hos-biz-button
                                        run="form.search"
                                        type="primary"
                                        >{{
                                            $t("operation.query")
                                        }}</hos-biz-button
                                    >
                                    <hos-biz-button
                                        run="form.reset"
                                        type="primary"
                                        >{{
                                            $t("operation.reset")
                                        }}</hos-biz-button
                                    >
                                </hos-form-item>
                            </hos-col>
                        </hos-row>
                        <hos-row :gutter="20">
                            <hos-col :span="6">
                                <hos-form-item :label="$t('role.title')">
                                    <hos-tree-select
                                        v-model="form.model.roleId"
                                        :appendToBody="true"
                                        zIndex="10000"
                                        clearable
                                        :options="treeOptions"
                                        :placeholder="
                                            $t('role.placeholder.placeRole')
                                        "
                                    ></hos-tree-select>
                                </hos-form-item>
                            </hos-col>
                            <hos-col :span="6">
                                <hos-form-item>
                                    <hos-radio
                                        v-model="form.model.islinkEmployee"
                                        label="true"
                                        >{{
                                            $t("operation.relationPerson")
                                        }}</hos-radio
                                    >
                                    <hos-radio
                                        v-model="form.model.islinkEmployee"
                                        label="false"
                                        >{{
                                            $t("operation.notRelationPerson")
                                        }}</hos-radio
                                    >
                                </hos-form-item>
                            </hos-col>
                            <hos-col :span="6">
                                <hos-form-item>
                                    <hos-radio
                                        v-model="form.model.actived"
                                        label="true"
                                        >{{
                                            $t("common.actived.true")
                                        }}</hos-radio
                                    >
                                    <hos-radio
                                        v-model="form.model.actived"
                                        label="false"
                                        >{{
                                            $t("common.actived.false")
                                        }}</hos-radio
                                    >
                                </hos-form-item>
                            </hos-col>
                        </hos-row>
                    </template>
                    <template #toolbar>
                        <hos-button-group class="hos">
                            <hos-button
                                icon="hos-icom-add"
                                @click="addDialog()"
                                v-has-permi="{ key: 'base:sys:user:add' }"
                                >{{ $t("operation.add") }}</hos-button
                            >
                            <hos-button
                                icon="hos-icom-cancel"
                                @click="deletion()"
                                v-has-permi="{ key: 'base:sys:user:delete' }"
                                >{{ $t("operation.delete") }}</hos-button
                            >
                            <hos-button
                                icon="hos-icom-batch-add"
                                @click="addition"
                                v-has-permi="{ key: 'base:sys:user:addition' }"
                                >{{ $t("operation.fastSave") }}</hos-button
                            >
                            <i
                                type="cut"
                                v-has-permi="{
                                    key: [
                                        'base:sys:user:add',
                                        'base:sys:user:delete',
                                        'base:sys:user:addition',
                                    ],
                                }"
                            ></i>
                            <hos-button
                                icon="hos-icom-import"
                                @click="uploadUser()"
                                v-has-permi="{
                                    key: 'base:sys:user:uploadUser',
                                }"
                                >{{ $t("operation.import") }}</hos-button
                            >
                            <hos-button
                                icon="hos-icom-export"
                                @click="exportUser()"
                                v-has-permi="{
                                    key: 'base:sys:user:exportUser',
                                }"
                                >{{ $t("operation.export") }}</hos-button
                            >
                            <i
                                type="cut"
                                v-has-permi="{
                                    key: [
                                        'base:sys:user:uploadUser',
                                        'base:sys:user:exportUser',
                                    ],
                                }"
                            ></i>
                            <!-- <hos-button icon="hos-icom-unlock" type="cut" @click="unlocked()">{{ $t("operation.unlock") }}</hos-button> -->
                            <hos-button
                                icon="hos-icom-sample-stat"
                                @click="timeLine()"
                                v-has-permi="{ key: 'base:sys:user:timeLine' }"
                                >{{ $t("operation.timeline") }}</hos-button
                            >
                        </hos-button-group>
                    </template>
                    <!-- 操作列按钮 -->
                    <template #operation="{ row }">
                        <hos-tooltip
                            class="pl5 pr5"
                            :content="$t('operation.edit')"
                            v-has-permi="{ key: 'base:sys:user:edit' }"
                        >
                            <i
                                class="hos-icom-edit"
                                @click="editDialog(row)"
                            ></i
                        ></hos-tooltip>
                        <hos-tooltip
                            class="pl5 pr5"
                            :content="$t('operation.resetPassword')"
                            v-has-permi="{ key: 'base:sys:user:resetPassword' }"
                        >
                            <i
                                class="hos-icom-reload"
                                @click="resetPassWord(row)"
                            ></i
                        ></hos-tooltip>
                        <hos-tooltip
                            class="pl5 pr5"
                            :content="$t('operation.relationPerson')"
                            v-has-permi="{ key: 'base:sys:user:onion' }"
                        >
                            <i
                                class="hos-icom-pat-write"
                                @click="relationPerson(row)"
                            ></i
                        ></hos-tooltip>
                    </template>
                    <template #optSlot="{ row }">
                        <!--过滤不为"的" 小方块显示-->
                        <div
                            v-if="
                                row.hasOwnProperty('linkEmployee') &&
                                row.linkEmployee != null &&
                                row.linkEmployee != ''
                            "
                        >
                            <i class="hos-icom-person"></i>
                            <!-- <span v-for="(item, index) in (row.optionDesc||'').split(',')" v-bind:key="index">
                <hos-tag type="primary" disable-transitions style="margin-right:5px">{{item}}</hos-tag>
              </span> -->
                        </div>
                        <div else-if></div>
                    </template>
                </hos-biz-table>
            </hos-tab-pane>
            <hos-tab-pane
                class="h-fit"
                name="second"
                v-has-permi="{ key: 'base:sys:user:userTreeList' }"
            >
                <span slot="label">{{ $t("user.userTreeList") }}</span>
                <!-- <span slot="label">
            <hos-tooltip class="item" effect="dark" :content="$t('user.userTreeList')" placement="top-start">
            <i class="hos-icom-have-son-node"></i>
            </hos-tooltip>
        </span> -->
                <hos-container class="h-fit">
                    <hos-aside class="user-aside">
                        <hos-input
                            :placeholder="$t('common.placeholder.key')"
                            suffix-icon="hos-icom-find"
                            clearable
                            v-model="filterText"
                        >
                        </hos-input>
                        <hos-tree
                            ref="treeRef"
                            :data="treeData"
                            @node-click="clickNode"
                            :filter-node-method="filterNode"
                        ></hos-tree>
                    </hos-aside>
                    <hos-main class="h-fit">
                        <hos-biz-table
                            class="right-table"
                            :selection="selection"
                            uid="table2"
                            v-if="activeName === 'second'"
                            :cols="cols2"
                            :data="selectPage2"
                            @selection-change="changeSelection"
                            :form="form2"
                            pagePos="top"
                        >
                            <template #form>
                                <hos-row :gutter="10">
                                    <hos-col :span="6">
                                        <hos-form-item
                                            :label="$t('role.loginName')"
                                        >
                                            <hos-input
                                                v-model="form2.model.loginName"
                                                clearable
                                                :placeholder="
                                                    $t(
                                                        'role.placeholder.placeLoginName'
                                                    )
                                                "
                                            ></hos-input>
                                        </hos-form-item>
                                    </hos-col>
                                    <hos-col :span="6">
                                        <hos-form-item :label="$t('user.name')">
                                            <hos-input
                                                v-model="form2.model.name"
                                                clearable
                                                :placeholder="
                                                    $t(
                                                        'user.placeholder.placeUserName'
                                                    )
                                                "
                                            ></hos-input>
                                        </hos-form-item>
                                    </hos-col>
                                    <hos-col :span="6">
                                        <hos-form-item>
                                            <hos-radio
                                                v-model="form2.model.actived"
                                                label="true"
                                                >{{
                                                    $t("common.actived.true")
                                                }}</hos-radio
                                            >
                                            <hos-radio
                                                v-model="form2.model.actived"
                                                label="false"
                                                >{{
                                                    $t("common.actived.false")
                                                }}</hos-radio
                                            >
                                        </hos-form-item>
                                    </hos-col>
                                    <hos-col :span="6">
                                        <!--                    <hos-form-item>-->
                                        <hos-biz-button
                                            run="form.search"
                                            type="primary"
                                            >{{
                                                $t("operation.query")
                                            }}</hos-biz-button
                                        >
                                        <hos-biz-button
                                            run="form.reset"
                                            type="primary"
                                            >{{
                                                $t("operation.reset")
                                            }}</hos-biz-button
                                        >
                                        <!--                    </hos-form-item>-->
                                    </hos-col>
                                </hos-row>
                            </template>
                            <template #toolbar>
                                <hos-button-group class="hos">
                                    <hos-button
                                        icon="hos-icom-add"
                                        @click="addDialog()"
                                        v-has-permi="{
                                            key: 'base:sys:user:add',
                                        }"
                                        >{{ $t("operation.add") }}</hos-button
                                    >
                                    <hos-button
                                        icon="hos-icom-cancel"
                                        @click="deletion()"
                                        v-has-permi="{
                                            key: 'base:sys:user:delete',
                                        }"
                                        >{{
                                            $t("operation.delete")
                                        }}</hos-button
                                    >
                                    <hos-button
                                        icon="hos-icom-batch-add"
                                        @click="addition"
                                        v-has-permi="{
                                            key: 'base:sys:user:addition',
                                        }"
                                        >{{
                                            $t("operation.fastSave")
                                        }}</hos-button
                                    >
                                    <i
                                        type="cut"
                                        v-has-permi="{
                                            key: [
                                                'base:sys:user:add',
                                                'base:sys:user:delete',
                                                'base:sys:user:addition',
                                            ],
                                        }"
                                    ></i>
                                    <hos-button
                                        icon="hos-icom-import"
                                        @click="uploadUser()"
                                        v-has-permi="{
                                            key: 'base:sys:user:uploadUser',
                                        }"
                                        >{{
                                            $t("operation.import")
                                        }}</hos-button
                                    >
                                    <hos-button
                                        icon="hos-icom-export"
                                        @click="exportUser()"
                                        v-has-permi="{
                                            key: 'base:sys:user:exportUser',
                                        }"
                                        >{{
                                            $t("operation.export")
                                        }}</hos-button
                                    >
                                    <!-- <hos-button icon="hos-icom-unlock" type="cut" @click="unlocked()">{{ $t("operation.unlock") }}</hos-button> -->
                                    <i
                                        type="cut"
                                        v-has-permi="{
                                            key: [
                                                'base:sys:user:uploadUser',
                                                'base:sys:user:exportUser',
                                            ],
                                        }"
                                    ></i>
                                    <hos-button
                                        icon="hos-icom-sample-stat"
                                        @click="timeLine()"
                                        v-has-permi="{
                                            key: 'base:sys:user:timeLine',
                                        }"
                                        >{{
                                            $t("operation.timeline")
                                        }}</hos-button
                                    >
                                </hos-button-group>
                            </template>
                            <!-- 操作列按钮 -->
                            <template #operation="{ row }">
                                <hos-tooltip
                                    class="pl5 pr5"
                                    :content="$t('operation.edit')"
                                    v-has-permi="{ key: 'base:sys:user:edit' }"
                                >
                                    <i
                                        class="hos-icom-edit"
                                        @click="editDialog(row)"
                                    ></i
                                ></hos-tooltip>
                                <hos-tooltip
                                    class="pl5 pr5"
                                    :content="$t('operation.resetPassword')"
                                    v-has-permi="{
                                        key: 'base:sys:user:resetPassword',
                                    }"
                                >
                                    <i
                                        class="hos-icom-reload"
                                        @click="resetPassWord(row)"
                                    ></i
                                ></hos-tooltip>
                                <hos-tooltip
                                    class="pl5 pr5"
                                    :content="$t('operation.relationPerson')"
                                    v-has-permi="{ key: 'base:sys:user:onion' }"
                                >
                                    <i
                                        class="hos-icom-pat-write"
                                        @click="relationPerson(row)"
                                    ></i
                                ></hos-tooltip>
                            </template>
                            <template #optSlot="{ row }">
                                <!--过滤不为"的" 小方块显示-->
                                <div
                                    v-if="
                                        row.hasOwnProperty('linkEmployee') &&
                                        row.linkEmployee != null &&
                                        row.linkEmployee != ''
                                    "
                                >
                                    <i class="hos-icom-person"></i>
                                    <!-- <span v-for="(item, index) in (row.optionDesc||'').split(',')" v-bind:key="index">
                    <hos-tag type="primary" disable-transitions style="margin-right:5px">{{item}}</hos-tag>
                  </span> -->
                                </div>
                                <div else-if></div>
                            </template>
                        </hos-biz-table>
                    </hos-main>
                </hos-container>
            </hos-tab-pane>
            <hos-tab-pane
                class="h-fit"
                name="third"
                v-has-permi="{ key: 'base:sys:user:lockedUser' }"
            >
                <span slot="label">{{ $t("user.lockedUser") }}</span>
                <!-- <span slot="label">
            <hos-tooltip class="item" effect="dark" :content="$t('user.lockedUser')" placement="top-start">
            <i class="hos-icom-lock"></i>
            </hos-tooltip>
        </span> -->
                <hos-biz-table
                    :selection="selection"
                    class="all-table"
                    uid="table3"
                    clearable
                    v-if="activeName === 'third'"
                    :cols="cols3"
                    :data="selectPage3"
                    :form="form3"
                    pagePos="top"
                    @selection-change="changeSelection"
                >
                    <template #form>
                        <hos-row :gutter="20">
                            <hos-col :span="8">
                                <hos-form-item :label="$t('role.loginName')">
                                    <hos-input
                                        v-model="form3.model.loginName"
                                        clearable
                                        :placeholder="
                                            $t(
                                                'role.placeholder.placeLoginName'
                                            )
                                        "
                                    ></hos-input>
                                </hos-form-item>
                            </hos-col>
                            <hos-col :span="8">
                                <hos-form-item :label="$t('user.name')">
                                    <hos-input
                                        v-model="form3.model.name"
                                        clearable
                                        :placeholder="
                                            $t('user.placeholder.placeUserName')
                                        "
                                    ></hos-input>
                                </hos-form-item>
                            </hos-col>
                            <hos-col :span="8">
                                <hos-form-item label-width="20px">
                                    <hos-biz-button
                                        run="form.search"
                                        type="primary"
                                        >{{
                                            $t("operation.query")
                                        }}</hos-biz-button
                                    >
                                    <hos-biz-button
                                        run="form.reset"
                                        type="primary"
                                        >{{
                                            $t("operation.reset")
                                        }}</hos-biz-button
                                    >
                                </hos-form-item>
                            </hos-col>
                        </hos-row>
                    </template>
                    <template #toolbar>
                        <hos-button-group
                            class="hos"
                            v-has-permi="{ key: 'base:sys:user:unlock' }"
                        >
                            <hos-button
                                icon="hos-icom-unlock"
                                @click="unlocked()"
                                >{{ $t("operation.unlock") }}</hos-button
                            >
                        </hos-button-group>
                    </template>
                    <!-- 操作列按钮 -->
                    <template #operation="{ row }">
                        <hos-tooltip
                            class="pl5 pr5"
                            :content="$t('operation.unlock')"
                            v-has-permi="{ key: 'base:sys:user:edit' }"
                        >
                            <i class="hos-icom-unlock" @click="unlock(row)"></i
                        ></hos-tooltip>
                    </template>
                </hos-biz-table>
            </hos-tab-pane>
            <hos-tab-pane
                class="h-fit"
                name="four"
                v-has-permi="{ key: 'base:sys:user:deleteUser' }"
            >
                <span slot="label">{{ $t("user.deleteUser") }}</span>
                <!-- <span slot="label">
            <hos-tooltip class="item" effect="dark" :content="$t('user.deleteUser')" placement="top-start">
            <i class="hos-icom-remove"></i>
            </hos-tooltip>
        </span> -->
                <hos-biz-table
                    class="all-table"
                    :selection="selection"
                    uid="table4"
                    v-if="activeName === 'four'"
                    clearable
                    :cols="cols4"
                    :data="selectPage4"
                    :form="form4"
                    pagePos="top"
                    @selection-change="changeSelection"
                >
                    <template #form>
                        <hos-row :gutter="20">
                            <hos-col :span="8">
                                <hos-form-item :label="$t('role.loginName')">
                                    <hos-input
                                        v-model="form4.model.loginName"
                                        clearable
                                        :placeholder="
                                            $t(
                                                'role.placeholder.placeLoginName'
                                            )
                                        "
                                    ></hos-input>
                                </hos-form-item>
                            </hos-col>
                            <hos-col :span="8">
                                <hos-form-item :label="$t('user.name')">
                                    <hos-input
                                        v-model="form4.model.name"
                                        clearable
                                        :placeholder="
                                            $t('user.placeholder.placeUserName')
                                        "
                                    ></hos-input>
                                </hos-form-item>
                            </hos-col>
                            <hos-col :span="8">
                                <hos-form-item label-width="20px">
                                    <hos-biz-button
                                        run="form.search"
                                        type="primary"
                                        >{{
                                            $t("operation.query")
                                        }}</hos-biz-button
                                    >
                                    <hos-biz-button
                                        run="form.reset"
                                        type="primary"
                                        >{{
                                            $t("operation.reset")
                                        }}</hos-biz-button
                                    >
                                </hos-form-item>
                            </hos-col>
                        </hos-row>
                    </template>
                    <template #operation="{ row }">
                        <hos-tooltip
                            :content="$t('user.recover')"
                            v-has-permi="{ key: 'base:sys:user:recoverUser' }"
                        >
                            <i
                                class="hos-icom-stamp-cancel"
                                @click="recoverUser(row)"
                            ></i
                        ></hos-tooltip>
                    </template>
                </hos-biz-table>
            </hos-tab-pane>
            <hos-tab-pane  name="five">
                <span slot="label">
                    <hos-button
                        @click="bizLog()"
                        type="success"
                        size="small"
                        v-has-permi="{ key: 'base:sys:user:log' }"
                        >{{ $t("operation.bizLog") }}</hos-button
                    >
                </span>
            </hos-tab-pane>
        </hos-tabs>
        <hos-biz-dialog
            :title="editDialogTitle"
            width="1300px"
            uid="addUserDialog"
            :close-on-click-modal="false"
        ></hos-biz-dialog>
        <hos-biz-dialog
            :title="additionDialogTitle"
            width="400px"
            uid="additionDialog"
            :close-on-click-modal="false"
        ></hos-biz-dialog>
        <hos-biz-dialog
            :title="$t('user.import')"
            uid="uploadDialog"
            :close-on-click-modal="false"
        ></hos-biz-dialog>
        <hos-biz-dialog
            :title="$t('user.export')"
            uid="exportDialog"
            width="40%"
            :close-on-click-modal="false"
        ></hos-biz-dialog>
        <hos-biz-dialog
            :title="$t('operation.relationPerson')"
            width="400px"
            uid="addOrgPersonDialog"
            :close-on-click-modal="false"
        ></hos-biz-dialog>
        <hos-biz-dialog
            :title="timeLineDialogTitle"
            width="40%"
            uid="timeLineDialog"
            :close-on-click-modal="false"
        ></hos-biz-dialog>
    </div>
</template>
<script>
export default {
    props: [],
    components: {},
    data() {
        const that = this;
        //验证登录名
        const validated = (rule, value, callback) => {
            if (value && value !== "") {
                this.$api("sys_user.validatedLoginName", {
                    loginName: value,
                    id: that.rowId,
                }).then((res) => {
                    if (res) {
                        if (res.data == false && res && res.code == "200") {
                            callback(
                                new Error(
                                    this.$t("user.rule.loginName.validate")
                                )
                            );
                        } else {
                            callback();
                        }
                    }
                });
            } else {
                callback(new Error(this.$t("user.rule.loginName.required")));
            }
        };
        //不能输入中文的验证
        var validCode = (rule, value, callback) => {
            if (value) {
                if (/[\u4E00-\u9FA5]/g.test(value)) {
                    callback(
                        new Error(this.$t("user.rule.loginName.noChinese"))
                    );
                } else {
                    // 验证通过
                    callback();
                }
                callback();
            }
        };
        // 特殊字符验证
        let validateInput = (rule, value, callback) => {
            if (!this.checkSpecialKey(value)) {
                callback(
                    new Error(
                        this.$t("user.rule.loginName.specialCharacterl", [
                            this.$t("role.loginName"),
                        ])
                    )
                );
            } else {
                callback();
            }
        };
        return {
            loading: false,
            selection: [],
            editDialogTitle: "",
            additionDialogTitle: "",
            timeLineDialogTitle: "", //生命周期弹窗名
            names: "", //选中数据名称
            userOptions: [],
            treeOptions: [],
            rowId: "",
            userTypeOptions: [],
            activeName: "first",
            fromR: {
                date: "",
                examine1: false,
                examine2: false,
            },
            form: {
                //inline: true,
                labelWidth: "auto",
                model: {
                    loginName: "",
                    name: "",
                    roleId: null,
                    islinkEmployee: null,
                    /*   islinkEmployee1: false,
          islinkEmployee2: false, */
                    actived: null,
                    /*  actived1: false,
          actived2: false, */
                    minTake: "",
                    maxTake: "",
                },
            },
            form2: {
                //inline: true,
                labelWidth: "auto",
                model: {
                    loginName: "",
                    name: "",
                    actived: null,
                    /*  actived1: false,
          actived2: false, */
                    parentOrgId: "",
                },
            },
            form3: {
                //inline: true,
                labelWidth: "auto",
                model: {
                    loginName: "",
                    name: "",
                    locked: "",
                },
            },
            form4: {
                //inline: true,
                labelWidth: "auto",
                model: {
                    loginName: "",
                    name: "",
                    locked: "",
                },
            },
            cols: [
                {
                    prop: "id",
                    align: "center",
                    type: "selection",
                    width: "50",
                },
                {
                    prop: "loginName",
                    label: this.$t("role.loginName"),
                },
                {
                    prop: "linkEmployee",
                    label: this.$t("operation.relation"),
                    width: "50",
                    slotName: "optSlot",
                },
                {
                    prop: "name",
                    label: this.$t("user.name"),
                },
                {
                    prop: "defaultOrg",
                    label: this.$t("role.mainOrgId"),
                    showOverflowTooltip: true,
                },
                {
                    prop: "roleDescs",
                    label: this.$t("role.title"),
                    showOverflowTooltip: true,
                },
                /* 	{
            prop: "linkEmployee",
            label: "关联人员",
          }, */
                {
                    prop: "invalidTime",
                    label: this.$t("common.inexpireTime"),
                },
                {
                    prop: "inexpireTime",
                    label: this.$t("common.invalidTime"),
                },
                /* 	{
            prop: "weight",
            label:this.$t('common.weight')
          }, */
                {
                    prop: "userTypeDesc",
                    label: this.$t("common.type"),
                    formatter: (row, column, value) => {
                        return [value];
                    },
                },
                {
                    label: this.$t("common.isActived"),
                    width: "120px",
                    prop: ({ row }, h) => {
                        return h("hos-switch", {
                            props: {
                                type: "switch",
                                value: row.actived,
                                size: "small",
                                activeText: this.$t("common.is"),
                                inactiveText: this.$t("common.deny"),
                                innerLabel: true,
                            },
                            on: {
                                change: (value) => {
                                    row.actived = value;
                                    this.updateActived(row);
                                },
                            },
                        });
                    },
                },
                {
                    label: this.$t("common.operation"),
                    width: "120px",
                    prop: "operation",
                    slotName: "operation",
                },
            ],
            cols2: [
                {
                    prop: "id",
                    type: "selection",
                    align: "center",
                    width: "50",
                },
                {
                    prop: "loginName",
                    label: this.$t("role.loginName"),
                    showOverflowTooltip: true,
                },
                {
                    prop: "linkEmployee",
                    label: this.$t("operation.relation"),
                    width: "50",
                    slotName: "optSlot",
                },
                {
                    prop: "name",
                    label: this.$t("user.name"),
                    showOverflowTooltip: true,
                },
                /* 	{
            prop: "name",
            label: "默认部门",
          }, */
                {
                    prop: "roleDescs",
                    label: this.$t("role.title"),
                    showOverflowTooltip: true,
                },
                /* 	{
            prop: "linkEmployee",
            label: "关联人员",
          }, */
                {
                    prop: "invalidTime",
                    label: this.$t("common.inexpireTime"),
                    showOverflowTooltip: true,
                },
                {
                    prop: "inexpireTime",
                    label: this.$t("common.invalidTime"),
                    showOverflowTooltip: true,
                },
                /* {
          prop: "weight",
          label:this.$t('common.weight')
        }, */
                {
                    prop: "userTypeDesc",
                    label: this.$t("common.type"),
                    showOverflowTooltip: true,
                    formatter: (row, column, value) => {
                        return [value];
                    },
                },
                {
                    label: this.$t("common.isActived"),
                    width: "120px",
                    prop: ({ row }, h) => {
                        return h("hos-switch", {
                            props: {
                                type: "switch",
                                value: row.actived,
                                size: "small",
                                activeText: this.$t("common.is"),
                                inactiveText: this.$t("common.deny"),
                                innerLabel: true,
                            },
                            on: {
                                change: (value) => {
                                    row.actived = value;
                                    this.updateActived(row);
                                },
                            },
                        });
                    },
                },
                {
                    label: this.$t("common.operation"),
                    width: "120px",
                    prop: "operation",
                    slotName: "operation",
                },
            ],
            cols3: [
                {
                    prop: "id",
                    align: "center",
                    type: "selection",
                    width: "50",
                },
                {
                    prop: "loginName",
                    label: this.$t("role.loginName"),
                },
                {
                    prop: "name",
                    label: this.$t("user.name"),
                },
                {
                    prop: "defaultOrg",
                    label: this.$t("role.orgId"),
                },
                /* {
          prop: "name",
          label: "默认部门",
        }, */
                {
                    prop: "userTypeDesc",
                    label: this.$t("common.type"),
                    formatter: (row, column, value) => {
                        return [value];
                    },
                },
                {
                    prop: "unlockDate",
                    label: this.$t("user.unlockDate"),
                },
                {
                    label: this.$t("common.operation"),
                    width: "50px",
                    prop: "operation",
                    slotName: "operation",
                },
            ],
            cols4: [
                /* {
						prop: "id",
						align: "center",
						type: "selection",
						width: "50",
					}, */
                {
                    prop: "loginName",
                    label: this.$t("role.loginName"),
                },
                {
                    prop: "name",
                    label: this.$t("user.name"),
                },
                /* {
          prop: "name",
          label: "默认部门",
        }, */
                {
                    prop: "userTypeDesc",
                    label: this.$t("common.type"),
                    formatter: (row, column, value) => {
                        return [value];
                    },
                },
                {
                    label: this.$t("common.operation"),
                    width: "50px",
                    prop: "operation",
                    slotName: "operation",
                },
            ],
            showAddDialog: false,
            dialogForm: {},
            treeData: [],
            treeEmployeeTree: [],
            selection: [],
            rules: {
                loginName: [
                    {
                        required: true,
                        validator: validated,
                        trigger: "blur",
                    },
                    {
                        required: true,
                        validator: validCode,
                        trigger: "blur",
                    },
                    {
                        required: true,
                        validator: validateInput,
                        trigger: "blur",
                    },
                    {
                        max: 12,
                        required: true,
                        message: this.$t(
                            "user.rule.loginName.loginNameLength",
                            [this.$t("role.loginName")]
                        ),
                        trigger: "blur",
                    },
                ],
                name: [
                    {
                        required: true,
                        message: this.$t("user.rule.name.required"),
                        trigger: "blur",
                    },
                    {
                        required: true,
                        validator: validateInput,
                        trigger: "blur",
                    },
                    {
                        max: 12,
                        required: true,
                        message: this.$t(
                            "user.rule.loginName.loginNameLength",
                            [this.$t("user.name")]
                        ),
                        trigger: "blur",
                    },
                ],
                userType: [
                    {
                        required: true,
                        message: this.$t("user.rule.userType.required"),
                    },
                ],
                /* 	remark: [{
            min:0,
            max: 1000,
            required: true,
            message: this.$t("common.rule.remark.noLength",[this.$t("common.remark")]),
            trigger: 'blur'
          }], */
                remark: [
                    {
                        required: false,
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (value && value != "") {
                                if (value.length <= 1000) {
                                    callback();
                                } else {
                                    callback(
                                        new Error(
                                            this.$t("common.rule.remark.length")
                                        )
                                    );
                                }
                            } else {
                                callback();
                            }
                        },
                    },
                ],
            },
            page: {
                current: 1,
                size: 10,
                total: 0,
            },
            isEdit: false,
            // 树检索框默认显示
            filterText: "",
            baseUserOrgRole: "1",
        };
    },
    created() {},
    watch: {
        // 监听树结构的过滤条件
        filterText(val) {
            this.$refs.treeRef.filter(val);
        },
    },
    mounted() {
        this.initTree();
        this.baseUserOrgRole = this.$store.getters.baseUserOrgRole;
        //this.baseUserOrgRole = sessionStorage.getItem(BASE_USER_ORG_ROLE);
    },
    methods: {
        handleClick() {
            /* if(tab.name == 'first') {
        this.$store.commit("UPDATE_TABLE", {
          _uid: "table1",
      });
      } else if(tab.name == 'second') {
        this.$store.commit("UPDATE_TABLE", {
          _uid: "table2",
      });
      } else if(tab.name == 'third') {
        this.$store.commit("UPDATE_TABLE", {
          _uid: "table3",
      });
      }else {
        this.$store.commit("UPDATE_TABLE", {
          _uid: "table4",
        });
        } */
        },
        // 校验输入框不能有特殊字符
        checkSpecialKey(str) {
            let specialKey =
                "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
            for (let i = 0; i < str.length; i++) {
                if (specialKey.indexOf(str.substr(i, 1)) != -1) {
                    return false;
                }
            }
            return true;
        },
        //初始化机构数据
        initTree() {
            this.$api("sys_org_ins.orgtree", "").then((res) => {
                if (res && res.code == "200") {
                    this.userOptions = res.data;
                    this.treeData = res.data;
                }
            });
            //获取用户分类
            this.$api("sys_dict.selectByCode", {
                code: "base-user-type",
            })
                .then((res) => {
                    if (res && res.code == 200) {
                        this.userTypeOptions = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((error) => {
                    this.$message.error(this.$t("operation.error"));
                });
            //获取角色
            this.$api("perm_role.getAllTreeNodes", "").then((res) => {
                if (res && res.code == "200") {
                    this.treeOptions = res.data;
                }
            });
            this.$api("sys_user.getEmployeeTree", { code: "" }).then((res) => {
                if (res && res.code == "200") {
                    this.treeEmployeeTree = res.data;
                }
            });
        },
        // 数据日志页面
        bizLog() {
            this.$router.push({
                path: "/base-monitor-business-log",
                query: {
                    tableName: "t_sys_user",
                    title: this.$t("user.user"),
                    path: "/base-sys-user",
                },
            });
        },
        // 生命周期
        timeLine() {
            this.timeLineDialogTitle = this.$t("timeline.title") + this.names;
            if (this.ids !== undefined && this.ids.length > 0) {
                if (this.ids.length > 1) {
                    this.$message.warning(this.$t("timeline.warning"));
                    return;
                }
            } else {
                this.$message.warning(this.$t("timeline.please"));
                return;
            }
            this.$store.commit("OPEN_DIALOG", {
                component: require("@sys/components/time-line/index.vue")
                    .default,
                _uid: "timeLineDialog",
                props: {
                    id: this.ids[0],
                    tableName: "t_sys_user",
                },
            });
        },
        //导入弹框
        uploadUser() {
            // 导入组件
            this.$store.commit("OPEN_DIALOG", {
                component: require("@sys/components/upload/index.vue").default,
                _uid: "uploadDialog",
                props: {
                    uploadUrl: "/sys/user/upload",
                    templateUrl: "/sys/user/template",
                    afterSubmit: this.refresh,
                },
            });
        },
        // 导出弹框
        exportUser() {
            // 导出组件
            this.$store.commit("OPEN_DIALOG", {
                component: require("@sys/components/export/index.vue").default,
                _uid: "exportDialog",
                props: {
                    // 可支持的所有导出列，可以考虑后端提供一个接口？
                    option: [
                        /* {
							"label": "主键id",
							"value": "id",
						}, */ {
                            label: "登录名",
                            value: "loginName",
                        },
                        {
                            label: "名称",
                            value: "name",
                        },
                        {
                            label: "状态",
                            value: "actived",
                        },
                        {
                            label: "用户类型",
                            value: "userType",
                        },
                        {
                            label: "人员工号",
                            value: "employeeCode",
                        },
                        {
                            label: "用户角色描述",
                            value: "roleDesc",
                        },
                        {
                            label: "部门描述",
                            value: "organizationDesc",
                        },
                        {
                            label: "用户备注",
                            value: "remark",
                        } /* {
							"label": "角色属性",
							"value": "properties",
						}, {
							"label": "角色规则",
							"value": "rules",
						}, {
							"label": "备注",
							"value": "remark",
						} */,
                    ],
                    // 默认勾选中需要导出的列
                    default: [
                        "loginName",
                        "name",
                        "actived",
                        "userType",
                        "employeeCode",
                        "roleDesc",
                        "organizationDesc",
                        "remark",
                    ],
                    // 导出角色接口地址
                    exportUrl: "/sys/user/export",
                    data: [
                        {
                            key: "ids",
                            value: this.form2.model.parentOrgId,
                        },
                    ],
                },
            });
            this.form2.model.parentOrgId = "";
        },
        //新增页面
        addDialog() {
            this.editDialogTitle =
                this.$t("operation.add") + this.$t("user.title");
            this.$store.commit("OPEN_DIALOG", {
                component: require("./edit.vue").default,
                _uid: "addUserDialog",
                props: {
                    id: "",
                    userOptions: this.userOptions,
                    treeOptions: this.treeOptions,
                    userTypeOptions: this.userTypeOptions,
                    rules: this.rules,
                    activeName: this.activeName,
                    treeEmployeeTree: this.treeEmployeeTree,
                    baseUserOrgRole: this.baseUserOrgRole,
                    status: "add:",
                },
            });
        },
        //修改页面
        editDialog(row) {
            this.rowId = row.id;
            this.editDialogTitle =
                this.$t("operation.edit") + this.$t("user.title");
            this.$store.commit("OPEN_DIALOG", {
                component: require("./edit.vue").default,
                _uid: "addUserDialog",
                props: {
                    id: row.id,
                    userOptions: this.userOptions,
                    treeOptions: this.treeOptions,
                    rules: this.rules,
                    userTypeOptions: this.userTypeOptions,
                    activeName: this.activeName,
                    treeEmployeeTree: this.treeEmployeeTree,
                    baseUserOrgRole: this.baseUserOrgRole,
                    status: "edit:",
                },
            });
        },
        //关联人员
        relationPerson(row) {
            if (
                row.linkEmployee != undefined &&
                row.linkEmployee != null &&
                row.linkEmployee != ""
            ) {
                this.$confirm(
                    this.$t("user.confirm.relationPerson"),
                    this.$t("login.label.info"),
                    { type: "warning" }
                ).then(() => {
                    this.$store.commit("OPEN_DIALOG", {
                        component: require("./relation-person.vue").default,
                        _uid: "addOrgPersonDialog",
                        props: {
                            id: row.linkEmployee,
                            userId: row.id,
                            activeName: this.activeName,
                        },
                    });
                });
            } else {
                this.$store.commit("OPEN_DIALOG", {
                    component: require("./relation-person.vue").default,
                    _uid: "addOrgPersonDialog",
                    props: {
                        id: row.linkEmployee,
                        userId: row.id,
                        activeName: this.activeName,
                    },
                });
            }
        },
        //加载列表数据
        selectPage(params) {
            //日期检索
            if (this.fromR.date != null && this.fromR.date != "") {
                var date1 = new Date(this.fromR.date[0]);
                var date2 = new Date(this.fromR.date[1]);
                params.startDate =
                    date1.getFullYear() +
                    "-" +
                    (date1.getMonth() + 1) +
                    "-" +
                    date1.getDate();
                params.endDate =
                    date2.getFullYear() +
                    "-" +
                    (date2.getMonth() + 1) +
                    "-" +
                    date2.getDate();
            }
            //关联人员检索
            /*  params.islinkEmployee = null;
      if(this.form.model.islinkEmployee ===true) {
        params.islinkEmployee = true;
      } else if(this.form.model.islinkEmployee===false) {
        params.islinkEmployee = false;
      }  */
            //停用启用的检索
            /*  params.actived = null;
      if(this.form.model.actived1 && !this.form.model.actived2) {
        params.actived = true;
      } else if(!this.form.model.actived1 && this.form.model.actived2) {
        params.actived = false;
      }
 */
            return this.$api("sys_user.list", params);
        },
        //快速新增
        addition() {
            this.additionDialogTitle = this.$t("user.selectPerson");
            this.$store.commit("OPEN_DIALOG", {
                component: require("./addition.vue").default,
                _uid: "additionDialog",
                props: {
                    activeName: this.activeName,
                },
            });
        },
        // 多选框选中数据
        changeSelection(selection) {
            this.ids = selection.map((item) => item.id);
            this.names = selection.map((item) => item.name);
            this.loginName = selection.map((item) => item.loginName);
        },
        //用户列表的删除
        deletion() {
            if (this.ids != undefined) {
                if (this.ids.length > 0) {
                    this.$confirm(
                        this.$t("common.confirm.deleteAll"),
                        this.$t("operation.delete"),
                        { type: "delete" }
                    )
                        .then(() => {
                            this.$api("sys_user.deletion", {
                                ids: this.ids.join(","),
                            }).then((res) => {
                                if (res && res.code == "200") {
                                    this.$store.commit("UPDATE_TABLE", {
                                        uid: "table1",
                                    });
                                    this.$store.commit("UPDATE_TABLE", {
                                        uid: "table2",
                                    });
                                    this.$message.success(
                                        this.$t("operation.success")
                                    );
                                } else {
                                    this.$message.error(
                                        this.$t("operation.error")
                                    );
                                }
                            });
                        })
                        .catch(() => {
                            //this.$message.error(this.$t("operation.error"));
                        });
                } else {
                    this.$message.warning(this.$t("common.confirm.dataNull"));
                }
            } else {
                this.$message.warning(this.$t("common.confirm.dataNull"));
            }
        },
        unlock(row) {
            this.$confirm(
                this.$t("common.confirm.unLock", [row.loginName]),
                this.$t("login.label.info"),
                { type: "warning" }
            )
                .then(() => {
                    this.$api("sys_user.unLock", {
                        ids: row.id,
                    }).then((res) => {
                        if (res && res.code == "200") {
                            this.$store.commit("UPDATE_TABLE", {
                                uid: "table3",
                            });
                            this.$message.success(this.$t("operation.success"));
                        } else {
                            this.$message.error(this.$t("operation.error"));
                        }
                    });
                })
                .catch(() => {
                    //this.$message.error(this.$t("operation.error"));
                });
        },
        //解锁
        unlocked() {
            if (this.ids.length > 0) {
                this.$confirm(
                    this.$t("common.confirm.unLock", [this.loginName]),
                    this.$t("login.label.info"),
                    { type: "warning" }
                )
                    .then(() => {
                        this.$api("sys_user.unLock", {
                            ids: this.ids.join(","),
                        }).then((res) => {
                            if (res && res.code == "200") {
                                this.$store.commit("UPDATE_TABLE", {
                                    uid: "table3",
                                });
                                this.$message.success(
                                    this.$t("operation.success")
                                );
                            } else {
                                this.$message.error(this.$t("operation.error"));
                            }
                        });
                    })
                    .catch(() => {
                        //this.$message.error(this.$t("operation.error"));
                    });
            } else {
                this.$message.success(this.$t("common.confirm.data"));
            }
        },

        //加载第二页签的列表数据
        selectPage2(params2) {
            //停用启用的检索
            /*  params2.actived = null;
      if(this.form2.model.actived1 && !this.form2.model.actived2) {
        params2.actived = true;
      } else if(!this.form2.model.actived1 && this.form2.model.actived2) {
        params2.actived = false;
      } */
            return this.$api("sys_user.list", params2);
        },

        // 树检索过滤
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 树点击节点加载左侧表格
        clickNode(data) {
            this.form2.model.parentOrgId = data.id;
            this.$store.commit("UPDATE_TABLE", {
                uid: "table2",
            });
        },
        //已删除用户的查询
        selectPage4(params4) {
            return this.$api("sys_user.deleteList", params4);
        },
        //是否解锁的用户
        selectPage3(params3) {
            this.form3.model.locked = true;
            params3.locked = this.form3.model.locked;
            return this.$api("sys_user.list", params3);
        },
        //修改用户启用的状态
        updateActived(row) {
            this.$confirm(
                this.$t("common.confirm.actived")
                    .replace(
                        "{0}",
                        row.actived
                            ? this.$t("common.actived.true")
                            : this.$t("common.actived.false")
                    )
                    .replace("{1}", row.name),
                this.$t("login.label.info"),
                {
                    type: "warning",
                }
            )
                .then(() => {
                    this.$api("sys_user.updateActived", {
                        id: row.id,
                        actived: row.actived,
                    }).then((res) => {
                        if (res && res.code == "200") {
                            this.$message.success(this.$t("operation.success"));
                        } else {
                            row.actived = !row.actived;
                            //this.$message.error(this.$t("operation.error"));
                        }
                    });
                })
                .catch(() => {
                    row.actived = !row.actived;
                    //this.$message.error(this.$t("operation.error"));
                });
        },
        //重置密码
        resetPassWord(row) {
            this.$confirm(
                this.$t("common.confirm.reset", [row.name]),
                this.$t("login.label.info"),
                { type: "warning" }
            ).then(() => {
                this.$api("sys_user.resetPwd", row.id).then((res) => {
                    if (res && res.code == "200") {
                        this.$message.success(this.$t("operation.success"));
                    } else {
                        this.$message.error(this.$t("operation.error"));
                    }
                });
            });
        },
        //恢复用户
        recoverUser(row) {
            this.editDialogTitle = this.$t("user.recover");
            this.$store.commit("OPEN_DIALOG", {
                component: require("./edit.vue").default,
                _uid: "addUserDialog",
                props: {
                    id: row.id,
                    userOptions: this.userOptions,
                    treeOptions: this.treeOptions,
                    userTypeOptions: this.userTypeOptions,
                    activeName: this.activeName,
                    treeEmployeeTree: this.treeEmployeeTree,
                    baseUserOrgRole: this.baseUserOrgRole,
                    status: "edit:",
                },
            });
        },
        reset() {
            this.loading = false;
            this.dialogForm = {};
        },
        /* 	handleSizeChange(value) {
        // 修改当前条数
        this.page.size = value;
        this.query();
      },
      handleCurrentChange(value) {
        // 修改当前页
        this.page.current = value;
        this.query();
      },
      cancel() {
        this.showAddDialog = false;
        this.loading = false;
      },*/
    },
};
</script>

