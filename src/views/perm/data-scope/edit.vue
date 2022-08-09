<template>
    <div
        :loading="loading"
        class="base-sys-dict-edit"
    >
        <hos-form
            ref="dataScopeForm"
            label-position="right"
            :rules="rules"
            :model="dialogForm"
        >
            <hos-row>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:perm:data-scope:code',
                        formRule: rules,
                        elModel: 'code',
                    }"
                >
                    <hos-form-item
                        :label="$t('common.code')"
                        prop="code"
                        label-width="55px"
                    >
                        <hos-input
                            :placeholder="$t('common.placeholder.code')"
                            :disabled="$m.isDisabled(status + 'base:perm:data-scope:code')"
                            v-model="dialogForm.code"
                        >
                        </hos-input>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:perm:data-scope:router',
                        formRule: rules,
                        elModel: 'router',
                    }"
                >
                    <hos-form-item
                        :label="$t('datascope.router')"
                        prop="router"
                        label-width="100px"
                    >
                        <hos-input
                            :placeholder="$t('datascope.placeholder.router')"
                            :disabled="$m.isDisabled(status + 'base:perm:data-scope:router')"
                            v-model="dialogForm.router"
                        >
                        </hos-input>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="12"
                    v-has-permi="{
                        key: status + 'base:perm:data-scope:name',
                        formRule: rules,
                        elModel: 'name',
                    }"
                >
                    <hos-form-item
                        :label="$t('common.name')"
                        prop="name"
                        label-width="55px"
                    >
                        <hos-input
                            :placeholder="$t('common.placeholder.name')"
                            :disabled="$m.isDisabled(status + 'base:perm:data-scope:name')"
                            v-model="dialogForm.name"
                        >
                        </hos-input>
                    </hos-form-item>
                </hos-col>

                <!-- <hos-col :span="12" v-has-permi="{key: status+'base:perm:data-scope:visibleField'}">
					<hos-form-item :label="$t('datascope.visibleField')" prop="visibleField">
						<hos-input :placeholder="$t('datascope.placeholder.visibleField')" :disabled="$m.isDisabled(status+'base:perm:data-scope:visibleField')" v-model="dialogForm.visibleField">
						</hos-input>
					</hos-form-item>
				</hos-col> -->
                <hos-col
                    :span="24"
                    v-has-permi="{ key: status + 'base:perm:data-scope:remark' }"
                >
                    <hos-form-item
                        :label="$t('datascope.remark')"
                        prop="remark"
                        label-width="55px"
                    >
                        <hos-input
                            :placeholder="$t('common.placeholder.remark')"
                            type="textarea"
                            :disabled="$m.isDisabled(status + 'base:perm:data-scope:remark')"
                            v-model="dialogForm.remark"
                            rows="3"
                        >
                        </hos-input>
                    </hos-form-item>
                </hos-col>
                <hos-col
                    :span="24"
                    v-has-permi="{ key: status + 'base:perm:data-scope:value' }"
                >
                    <hos-table
                        :data="dialogForm.value"
                        ref="table"
                        tooltip-effect="dark"
                        stripe
                        class="w-fit"
                        height="162"
                    >
                        <hos-table-column
                            :label="$t('datascope.kuohao')"
                            v-has-permi="{ key: 'base:perm:data-scope:value' }"
                        >
                            <template slot-scope="scope">
                                <hos-form-item
                                    label-width="0"
                                    :prop="'value[' + scope.$index + '].leftBrackets'"
                                    :rules="[{ validator: myValidateLeft, trigger: 'change' }]"
                                >
                                    <hos-select
                                        clearable
                                        v-model="scope.row.leftBrackets"
                                        :disabled="$m.isDisabled(status + 'base:sys:data-scope:value')"
                                    >
                                        <hos-option
                                            v-for="(item, ky) in brackets"
                                            :key="ky"
                                            :value="ky"
                                            :label="item"
                                        ></hos-option>
                                    </hos-select>
                                </hos-form-item>
                            </template>
                        </hos-table-column>
                        <hos-table-column
                            :label="$t('datascope.column')"
                            width="150px"
                            v-has-permi="{ key: 'base:perm:data-scope:leftBrackets' }"
                        >
                            <template slot-scope="scope">
                                <hos-form-item
                                    label-width="0"
                                    :prop="'value[' + scope.$index + '].value'"
                                    :rules="[{ validator: myValidateValue, trigger: 'blur' }]"
                                >
                                    <hos-input
                                        :placeholder="$t('datascope.placeholder.column')"
                                        v-model="scope.row.value"
                                        :disabled="$m.isDisabled(status + 'base:sys:data-scope:value')"
                                    ></hos-input>
                                </hos-form-item>
                            </template>
                        </hos-table-column>
                        <hos-table-column
                            :label="$t('datascope.type')"
                            v-has-permi="{ key: 'base:perm:data-scope:type' }"
                        >
                            <template slot-scope="scope">
                                <hos-form-item
                                    label-width="0"
                                    :prop="'value[' + scope.$index + '].type'"
                                    :rules="[{ validator: myValidateType, trigger: 'change' }]"
                                >
                                    <hos-select
                                        clearable
                                        :placeholder="$t('datascope.placeholder.type')"
                                        v-model="scope.row.type"
                                        :disabled="$m.isDisabled(status + 'base:sys:data-scope:type')"
                                        @change="changeType(scope.row)"
                                    >
                                        <hos-option
                                            v-for="(item, ky) in dataScope"
                                            :key="ky"
                                            :value="ky"
                                            :label="item"
                                        ></hos-option>
                                    </hos-select>
                                </hos-form-item>
                            </template>
                        </hos-table-column>
                        <hos-table-column
                            :label="$t('datascope.scope')"
                            width="200"
                            v-has-permi="{ key: 'base:perm:data-scope:scope' }"
                        >
                            <template slot-scope="scope">
                                <hos-input
                                    type="textarea"
                                    :value="showscope(scope.row)"
                                    v-show="scope.row.type == '007'"
                                    @focus="customDiag(scope.row)"
                                    :disabled="$m.isDisabled(status + 'base:sys:data-scope:scope')"
                                    autosize
                                >
                                </hos-input>
                            </template>
                        </hos-table-column>
                        <hos-table-column
                            :label="$t('datascope.kuohao')"
                            v-has-permi="{ key: 'base:perm:data-scope:rightBrackets' }"
                        >
                            <template slot-scope="scope">
                                <hos-form-item
                                    label-width="0"
                                    :prop="'value[' + scope.$index + '].rightBrackets'"
                                    :rules="[{ validator: myValidateRight, trigger: 'change' }]"
                                >
                                    <hos-select
                                        clearable
                                        v-model="scope.row.rightBrackets"
                                        :disabled="$m.isDisabled(status + 'base:sys:data-scope:rightBrackets')"
                                    >
                                        <hos-option
                                            v-for="(item, ky) in brackets"
                                            :key="ky"
                                            :value="ky"
                                            :label="item"
                                        ></hos-option>
                                    </hos-select>
                                </hos-form-item>
                            </template>
                        </hos-table-column>
                        <hos-table-column
                            :label="$t('datascope.operate')"
                            v-has-permi="{ key: 'base:perm:data-scope:operate' }"
                        >
                            <template slot-scope="scope">
                                <hos-form-item
                                    label-width="0"
                                    :prop="'value[' + scope.$index + '].operate'"
                                    :rules="[{ validator: myValidateOperate, trigger: 'change' }]"
                                >
                                    <hos-select
                                        clearable
                                        v-model="scope.row.operate"
                                        :disabled="$m.isDisabled(status + 'base:sys:data-scope:operate')"
                                    >
                                        <hos-option
                                            v-for="(item, ky) in condition"
                                            :key="ky"
                                            :value="ky"
                                            :label="item"
                                        ></hos-option>
                                    </hos-select>
                                </hos-form-item>
                            </template>
                        </hos-table-column>
                        <hos-table-column
                            align="center"
                            width="100"
                        >
                            <template
                                slot="header"
                                slot-scope="scope"
                            >
                                <i
                                    @click="addRow(scope)"
                                    v-has-permi="{ key: 'base:perm:data-scope:addValue' }"
                                    class="hos-icom-add"
                                ></i>
                            </template>
                            <template slot-scope="scope">
                                <i
                                    v-has-permi="{ key: 'base:perm:data-scope:deleteValue' }"
                                    @click="delRow(scope.$index)"
                                    class="hos-icom-cancel"
                                ></i>
                            </template>
                        </hos-table-column>
                    </hos-table>
                </hos-col>
            </hos-row>
        </hos-form>
        <hos-biz-dialog
            :title="editDialogTitle"
            width="25%"
            uid="customDialog"
            append-to-body
            :close-on-click-modal="false"
        />
        <div
            slot="footer"
            class="dialog-footer"
        >
            <hos-button
                type="primary"
                @click="cancel"
                v-has-permi="{ key: status + 'base:perm:data-scope:cancel' }"
            >
                {{ $t("operation.cancel") }}</hos-button>
            <hos-button
                type="success"
                @click="save(dialogForm)"
                v-has-permi="{ key: status + 'base::perm:data-scope:save' }"
            >{{ $t("operation.save") }}</hos-button>
        </div>
    </div>
</template>
<script>
import { stringify } from "qs";
import { dataScope } from "../../../enum/dataScopeEnum";
export default {
    props: ["id", "resourceId", "status"],
    mixins: [dataScope],
    data() {
        return {
            // 三个保存ins org user数据的数组
            orgData: {},
            insData: {},
            userData: {},
            activeNameactiveName: "",
            hasCheckedData: [],
            scopeDisplay: "",
            editDialogTitle: "",
            loading: false,
            showDisplay: "",
            brackets: { "(": "(", ")": ")" },
            condition: { and: "and", or: "or" },
            rules: {
                name: [
                    {
                        required: true,
                        message: this.$t("common.rule.name.required"),
                    },
                ],
                router: [
                    {
                        required: true,
                        message: this.$t("datascope.rule.router.required"),
                    },
                ],
                code: [
                    {
                        required: true,
                        message: this.$t("common.rule.code.required"),
                    },
                    {
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (value && value !== "") {
                                const param = {
                                    code: value,
                                    id: this.id == "" ? "" : this.id,
                                };
                                this.$api(
                                    "perm_data_scope.validated",
                                    param
                                ).then((res) => {
                                    if (res && res.code == 200 && res.data) {
                                        callback();
                                    } else {
                                        callback(
                                            new Error(
                                                this.$t(
                                                    "common.rule.code.validate"
                                                )
                                            )
                                        );
                                    }
                                });
                            } else {
                                callback(
                                    new Error(
                                        this.$t("common.rule.code.required")
                                    )
                                );
                            }
                        },
                    },
                ],
            },
            dialogForm: {
                id: "",
                code: "",
                name: "",
                router: "",
                visibleField: "",
                remark: "",
                resourceId: this.resourceId,
                value: [],
            },
            rowData: {
                leftBrackets: "",
                type: "",
                operate: "",
                value: "",
                ruleType: "",
                compareSign: "",
                dictType: "",
                customValue: "",
                rightBrackets: "",
                text: "",
            },
        };
    },
    watch: {
        //监听数据是否发生变化
        "dialogForm.value": {
            handler(oldValue, newValue) {
                if (newValue && newValue.length > 0) {
                    for (var i = 0; i < newValue.length; i++) {
                        this.showscope(newValue[i]);
                    }
                }
            },
            deep: true,
        },
    },
    computed: {
        // 验证左括号
        myValidateLeft: function () {
            let that = this;
            return function (rule, value, callback) {
                var index = rule.field.replace(/[^0-9]/gi, "");
                if (that.dialogForm.value.length > 1) {
                    // 多组括号必须成对出现
                    if (index > 0) {
                        // 数组前面的括号
                        var leftNum = 0;
                        var rightNum = 0;
                        for (var i = 0; i < that.dialogForm.value.length; i++) {
                            if (that.dialogForm.value[i].leftBrackets == "(") {
                                leftNum++;
                            }
                            if (that.dialogForm.value[i].leftBrackets == ")") {
                                rightNum++;
                            }
                            if (that.dialogForm.value[i].rightBrackets == "(") {
                                leftNum++;
                            }
                            if (that.dialogForm.value[i].rightBrackets == ")") {
                                rightNum++;
                            }
                        }
                        // 左括号和右括号的数量不相等
                        if (leftNum != rightNum) {
                            callback(
                                new Error(
                                    that.$t(
                                        "datasource.rules.leftBrackets.doubleBracket"
                                    )
                                )
                            );
                        } else {
                            // 括号成对出现，相对位置的情况
                            callback();
                        }
                    } else {
                        // 多组数据的第一组数据
                        if (value == ")") {
                            callback(
                                new Error(
                                    that.$t(
                                        "datasource.rules.leftBrackets.leftOnly"
                                    )
                                )
                            );
                        } else {
                            callback();
                        }
                    }
                } else {
                    // 只有一组数据的时候只能是右括号或者空
                    if (value == ")") {
                        callback(
                            new Error(
                                that.$t(
                                    "datasource.rules.leftBrackets.leftOnly"
                                )
                            )
                        );
                    } else {
                        callback();
                    }
                }
            };
        },
        // 验证字段
        myValidateValue: function () {
            let that = this;
            return function (rule, value, callback) {
                if (value == "") {
                    callback(new Error(that.$t("datasource.rules.value")));
                } else {
                    callback();
                }
            };
        },
        // 验证类型
        myValidateType: function () {
            let that = this;
            return function (rule, value, callback) {
                if (value == "") {
                    callback(new Error(that.$t("datasource.rules.type")));
                } else {
                    callback();
                }
            };
        },
        // 验证条件
        myValidateOperate: function () {
            let that = this;
            return function (rule, value, callback) {
                var index = rule.field.replace(/[^0-9]/gi, "");
                if (that.dialogForm.value.length > 1) {
                    // 两条及以上数据规则
                    if (index < that.dialogForm.value.length - 1) {
                        // 下标在数组前面的需要校验
                        if (value == "") {
                            callback(
                                new Error(that.$t("datasource.rules.operate"))
                            );
                        } else {
                            callback();
                        }
                    } else {
                        // 最后一组数据不需要校验
                        callback();
                    }
                } else {
                    // 只有一条的可以不填
                    callback();
                }
            };
        },
        // 验证右括号
        myValidateRight: function () {
            let that = this;
            return function (rule, value, callback) {
                var index = rule.field.replace(/[^0-9]/gi, "");
                if (that.dialogForm.value.length > 1) {
                    // 多组括号必须成对出现
                    if (index < that.dialogForm.value.length - 1) {
                        // 数组前面的括号
                        var leftNum = 0;
                        var rightNum = 0;
                        for (var i = 0; i < that.dialogForm.value.length; i++) {
                            if (that.dialogForm.value[i].leftBrackets == "(") {
                                leftNum++;
                            }
                            if (that.dialogForm.value[i].leftBrackets == ")") {
                                rightNum++;
                            }
                            if (that.dialogForm.value[i].rightBrackets == "(") {
                                leftNum++;
                            }
                            if (that.dialogForm.value[i].rightBrackets == ")") {
                                rightNum++;
                            }
                        }
                        // 左括号和右括号的数量不相等
                        if (leftNum != rightNum) {
                            callback(
                                new Error(
                                    that.$t(
                                        "datasource.rules.rightBrackets.doubleBracket"
                                    )
                                )
                            );
                        } else {
                            // 括号成对出现，相对位置的情况
                            callback();
                        }
                    } else {
                        // 多组数组的最后一组数据
                        if (value == "(") {
                            callback(
                                new Error(
                                    that.$t(
                                        "datasource.rules.rightBrackets.rightOnly"
                                    )
                                )
                            );
                        } else if (
                            value == "" &&
                            that.dialogForm.value[index].leftBrackets != ""
                        ) {
                            callback(
                                new Error(
                                    that.$t(
                                        "datasource.rules.rightBrackets.doubleBracket"
                                    )
                                )
                            );
                        } else {
                            callback();
                        }
                    }
                } else {
                    // 只有一组数据的时候只能是右括号或者空
                    if (value == "(") {
                        callback(
                            new Error(
                                that.$t(
                                    "datasource.rules.rightBrackets.rightOnly"
                                )
                            )
                        );
                    } else {
                        callback();
                    }
                }
            };
        },
    },
    created() {
        //如果id不为空
        if (this.id != "") {
            this.loadSope();
        }
        // org的数据
        this.$api("sys_org_ins.orgtree").then((res) => {
            if (res && res.code == 200) {
                this.orgData = res.data;
            }
        });
        // ins的数据
        this.$api("sys_org_ins.instree").then((res) => {
            if (res && res.code == 200) {
                this.insData = res.data;
            }
        });
        // user的数据
        this.$api("base_user.usertree").then((res) => {
            if (res && res.code == 200) {
                this.userData = res.data;
            }
        });
    },
    methods: {
        loadSope() {
            this.$api("perm_data_scope.selectById", this.id).then((res) => {
                if (res && res.code == 200) {
                    this.dialogForm = res.data;
                }
            });
        },
        customDiag(data) {
            this.editDialogTitle = this.$t("datascope.scopeEdit");
            this.$store.commit("OPEN_DIALOG", {
                component: require("./scope.vue").default,
                _uid: "customDialog",
                props: {
                    scopeData: data,
                    status: "edit:",
                    scopeDisplayFunc: this.scopeDisplayFunc,
                    hasCheckedData: this.hasCheckedData,
                    currentActiveName: this.currentActiveName,
                },
            });
        },
        scopeDisplayFunc(data, name) {
            // 判断是否是同一个页签下
            if (this.currentActiveName != name) {
                this.currentActiveName = name;
                this.showDisplay = "";
            }
            this.hasCheckedData = data;
            let str = "";
            for (var i = 0; i < data.length; i++) {
                str = str + data[i].label + ",";
            }
            this.showDisplay = str;
        },
        //添加一行
        addRow() {
            this.dialogForm.value =
                this.dialogForm.value == undefined ? [] : this.dialogForm.value;
            this.dialogForm.value.push(
                JSON.parse(JSON.stringify(this.rowData))
            );
        },
        //删除一行
        delRow(index) {
            this.dialogForm.value.splice(index, 1);
        },
        changeType(data) {
            data.compareSign = "";
            data.dictType = "";
            data.ruleType = "";
            data.customValue = "";
        },
        showscope(data) {
            var obj = {};
            var str = "";
            var name =
                data.ruleType == "user"
                    ? this.$t("datascope.user")
                    : data.ruleType == "custom"
                    ? this.$t("datascope.dataValue")
                    : data.ruleType == "ins"
                    ? this.$t("datascope.ins")
                    : data.ruleType == "org"
                    ? this.$t("datascope.org")
                    : this.$t("datascope.dictIetm");
            obj[this.$t("datascope.compare")] = data.compareSign;
            obj[this.$t("datascope.dict")] = data.dictType;
            obj["name"] = obj[name] = data.customValue;
            obj["规则类型"] = data.ruleType;

            // 1 根据ruleType去调用不同的方法来查询id所属于的label
            switch (data.ruleType) {
                case "user":
                    str = "用户有:" + data.text;
                    break;
                case "ins":
                    str = "机构有:" + data.text;
                    break;
                case "org":
                    str = "部门有:" + data.text;
                    break;
                case "custom":
                    str = data.compareSign + data.customValue;
                    break;
                case "dict":
                    str = "字典有:" + data.customValue;
            }
            return str;
            // return JSON.stringify(obj);
        },
        // 查询id对应的label
        // getLabelById(data, list) {
        // 	for(var)
        // },
        //关闭窗口
        cancel() {
            this.$store.commit("CLOSE_DIALOG", {
                _uid: "editDialog",
            });
        },
        save(formData) {
            this.$refs.dataScopeForm.validate((valid) => {
                if (valid) {
                    //校验数据规则
                    if (formData.value.length > 0) {
                        var flag = true;
                        //判断条件将最后一个条件默认去掉
                        formData.value.forEach((element, index) => {
                            if (element.value == "") {
                                flag = false;
                                return this.$message.error(
                                    this.$t("datascope.columnNotNull")
                                );
                            }
                            if (element.type == "") {
                                flag = false;
                                return this.$message.error(
                                    this.$t("datascope.typeNotNull")
                                );
                            }
                            if (
                                index < formData.value.length - 1 &&
                                element.operate == ""
                            ) {
                                flag = false;
                                return this.$message.error(
                                    this.$t("datascope.ruleNot")
                                );
                            }
                            if (
                                index == formData.value.length - 1 &&
                                element.operate != ""
                            ) {
                                flag = false;
                                return this.$message.error(
                                    this.$t("datascope.operateNot")
                                );
                            }
                        });
                        if (!this.ruleResolver(formData.value)) {
                            flag = false;
                            return this.$message.error(
                                this.$t("datascope.khaoNot")
                            );
                        }
                        if (flag) {
                            if (this.id == "") {
                                this.$api(
                                    "perm_data_scope.insertDataScope",
                                    formData
                                ).then((res) => {
                                    if (res && res.code == 200) {
                                        this.cancel();
                                        this.$store.commit("UPDATE_TABLE", {
                                            _uid: "scopeTable",
                                        });
                                    } else if (res.code == "99001008") {
                                        this.$message.error(res.msg);
                                    } else {
                                        this.$message.error(
                                            this.$t("operation.error")
                                        );
                                    }
                                });
                            } else {
                                this.$api(
                                    "perm_data_scope.updateDataScope",
                                    formData
                                ).then((res) => {
                                    if (res && res.code == 200) {
                                        this.cancel();
                                        this.$store.commit("UPDATE_TABLE", {
                                            _uid: "scopeTable",
                                        });
                                    } else if (res.code == "99001008") {
                                        this.$message.error(res.msg);
                                    } else {
                                        this.$message.error(
                                            this.$t("operation.error")
                                        );
                                    }
                                });
                            }
                        }
                    } else {
                        this.$message.error(this.$t("datascope.scopeNull"));
                    }
                }
            });
        },
        //规则解析判断
        ruleResolver(rule) {
            if (rule[0].leftBrackets == "}") return false;
            if (rule[rule.length - 1].rightBrackets == "{") return false;
            var value = JSON.stringify(rule);
            var countLeft = this.countChar("{", value);
            var countRigt = this.countChar("}", value);
            if (countLeft != countRigt) return false;
            return true;
        },
        //判断字符串出现的次数
        countChar(char, rule) {
            var count = 0;
            while (rule.indexOf(char) != -1) {
                rule = rule.replace(char, "");
                count++;
            }
            return count;
        },
    },
};
</script>