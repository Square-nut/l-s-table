<template>
    <div class="data-pri-scope">
        <hos-tabs
            v-model="activeName"
            @tab-click="handleClick"
            :before-leave="leave"
        >
            <hos-tab-pane
                v-for="(item, ky) in tabType"
                :label="item"
                :name="ky"
                :value="ky"
                :key="ky"
            >
                <hos-form
                    :ref="ky + 'scopeForm'"
                    :rules="rules"
                    label-position="right"
                    label-width="auto"
                    :model="scopeData"
                >
                    <hos-row :gutter="20">
                        <!-- 只有字典和自定义的时候显示操作符 -->
                        <hos-col
                            :span="24"
                            v-has-permi="{ key: status + 'base:perm:data-scope:compareSign' }"
                            v-show="ky == 'dict' || ky == 'custom'"
                        >
                            <hos-form-item
                                :label="$t('datascope.compare')"
                                prop="compareSign"
                            >
                                <hos-select
                                    v-if="ky == 'dict'"
                                    :disabled="$m.isDisabled(status + 'base:perm:data-scope:compareSign')"
                                    v-model="scopeData.compareSign"
                                >
                                    <hos-option
                                        label="in"
                                        value="in"
                                    />
                                </hos-select>
                                <hos-select
                                    v-if="ky == 'custom'"
                                    :disabled="$m.isDisabled(status + 'base:perm:data-scope:compareSign')"
                                    v-model="scopeData.compareSign"
                                >
                                    <hos-option
                                        v-for="(value, k) in compareSign"
                                        :label="value"
                                        :value="k"
                                        :key="k"
                                    />
                                </hos-select>
                            </hos-form-item>
                        </hos-col>
                        <!-- 当tab页为字典的时候，显示这一行 -->
                        <hos-col
                            :span="24"
                            v-has-permi="{ key: status + 'base:perm:data-scope:dictType' }"
                            v-if="ky == 'dict'"
                        >
                            <hos-form-item
                                :label="$t('datascope.dict')"
                                prop="dictShowType"
                            >
                                <hos-tree-select
                                    :normalizer="normalizer"
                                    @select="changeType"
                                    v-model="dictShowType"
                                    :placeholder="$t('datascope.title')"
                                    :options="treeData"
                                    :appendToBody="true"
                                    zIndex="10000"
                                    :flat="true"
                                    :disabled="$m.isDisabled(status + 'base:perm:data-scope:dictType')"
                                ></hos-tree-select>
                            </hos-form-item>
                        </hos-col>
                        <!-- 选中的值 -->
                        <hos-col
                            :span="24"
                            v-has-permi="{ key: status + 'base:perm:data-scope:customValue' }"
                        >
                            <hos-form-item
                                :label="showName"
                                prop="customValue"
                            >
                                <hos-select
                                    v-model="customValue"
                                    multiple
                                    :disabled="$m.isDisabled(status + 'base:sys:data-scope:customValue')"
                                    v-show="ky == 'dict'"
                                >
                                    <hos-option
                                        v-for="itm in itemData"
                                        :key="itm.value"
                                        :value="itm.label"
                                        :label="itm.label"
                                        :disabled="!itm.usable"
                                    ></hos-option>
                                </hos-select>
                                <hos-input
                                    v-model="scopeData.customValue"
                                    :disabled="$m.isDisabled(status + 'base:sys:data-scope:customValue')"
                                    v-show="ky == 'custom'"
                                ></hos-input>
                                <hos-tree-select
                                    :ref="'treeSelect' + item"
                                    :multiple="true"
                                    :appendToBody="true"
                                    zIndex="10000"
                                    v-model="customValue"
                                    :placeholder="$t('datascope.title')"
                                    v-if="ky != 'custom' && ky != 'dict'"
                                    :options="customTreeData"
                                    @deselect="labelDeChange"
                                    @select="labelChange"
                                    :normalizer="normalizerIou"
                                    :value-consists-of="valueConsistsOf"
                                    :flat="true"
                                    :disabled=" $m.isDisabled(status + 'base:perm:data-scope:customValue')"
                                ></hos-tree-select>
                            </hos-form-item>
                        </hos-col>
                        <!-- <hos-col :span="24" style="height:200px">
            </hos-col> -->
                    </hos-row>
                </hos-form>
            </hos-tab-pane>
        </hos-tabs>
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
                @click="saveScope"
                v-has-permi="{ key: status + 'base::perm:data-scope:save' }"
            >{{ $t("operation.save") }}</hos-button>
        </div>
    </div>
</template>
<script>
import { compareSign } from "../../../enum/dataScopeEnum";
export default {
    // props: ["scopeData","status","scopeDisplay"],
    props: {
        scopeData: Object,
        status: String,
        scopeDisplayFunc: Function,
        hasCheckedData: Array,
        currentActiveName: String,
    },
    mixins: [compareSign],
    data() {
        var that = this;
        return {
            // 保存需要展示的节点
            showDisplay: [],
            treeData: [],
            isDict: false,
            scopeDataClone: JSON.parse(JSON.stringify(this.scopeData)),
            itemData: [],
            valueConsistsOf: "ALL",
            activeName:
                this.scopeData.ruleType == ""
                    ? "dict"
                    : this.scopeData.ruleType,
            customValue:
                this.scopeData.customValue == ""
                    ? []
                    : this.scopeData.customValue.split(","),
            customTreeData: [],
            customType: "",
            dictShowType:
                this.scopeData.dictType == ""
                    ? undefined
                    : this.scopeData.dictType,
            normalizerIou(node) {
                return {
                    id: node.id,
                    label: node.label,
                    children: node.children,
                    type: node.type,
                    isDisabled:
                        that.activeName == "org" && node.type != "org"
                            ? true
                            : that.activeName == "user" && node.type != "user"
                            ? true
                            : false,
                };
            },
            normalizer(node) {
                return {
                    id: node.key,
                    label: node.label,
                    children: node.children,
                    ordDictType: undefined,
                    type: node.type,
                    isDisabled: node.type != "dict",
                };
            },
            rules: {
                dictShowType: [
                    {
                        trigger: "input",
                        validator: (rule, value, callback) => {
                            if (!this.isDict) {
                                callback(
                                    new Error(this.$t("datascope.notDict"))
                                );
                            }
                        },
                    },
                ],
                customValue: [
                    {
                        trigger: "input",
                        validator: (rule, value, callback) => {
                            if (this.activeName != this.customType) {
                                callback(
                                    new Error(this.$t("datascope.dateTypeNot"))
                                );
                            }
                        },
                    },
                ],
            },
            tabType: {
                dict: "字典",
                custom: "自定义",
                ins: "机构",
                org: "部门",
                user: "用户",
            },
        };
    },
    computed: {
        //计算label
        showName() {
            return this.activeName == "dict"
                ? this.$t("datascope.dictIetm")
                : this.activeName == "custom"
                ? this.$t("datascope.dataValue")
                : this.activeName == "ins"
                ? this.$t("datascope.ins")
                : this.activeName == "org"
                ? this.$t("datascope.org")
                : this.$t("datascope.user");
        },
    },
    watch: {
        //监听数据是否发生变化
        customValue(value) {
            this.scopeData.customValue = value.join(",");
            var labelArray = [];
            var s = this.$refs;
            if (value && value.length > 0) {
                for (var i = 0; i < value.length; i++) {
                    labelArray.push(
                        this.$refs[
                            "treeSelect" + this.tabType[this.activeName]
                        ][0].getNode(value[i]).label
                    );
                }
            }
            this.scopeData["text"] = labelArray.join(",");
        },
        //监听类型

        dictShowType(newValue, ordValue) {
            this.customValue = [];
            this.scopeData.customValue = "";
            if (ordValue != newValue && this.dictShowType != undefined) {
                if (this.isDict) {
                    this.scopeData.dictType = newValue;
                    this.loadDictItem();
                }
            }
        },
        activeName: {
            handler(val) {
                if (val != this.currentActiveName) {
                    this.showDisplay = [];
                }
            },
        },
    },
    created() {
        this.scopeData.dictType =
            this.scopeData.dictType == "" ? undefined : this.scopeData.dictType;
        this.scopeData.ruleType = this.activeName;
        //获取选中的tab
        if (this.activeName == "dict") {
            //加载树
            this.loadDictree();
        }
        //加载机构组织用户树
        if (this.activeName != "dict" && this.activeName != "custom") {
            this.loadCustomTree();
        }
    },
    mounted() {
        this.showDisplay = this.hasCheckedData;
        console.log(this.showDisplay);
    },
    methods: {
        leave() {
            //清除本页签的提示
            this.$refs[this.activeName + "scopeForm"][0].clearValidate();
        },
        handleClick() {
            //切换头信息的时候将数据清空
            this.scopeData.compareSign = "";
            this.scopeData.dictType = undefined;
            this.dictShowType = undefined;
            this.scopeData.ruleType = this.activeName;
            this.scopeData.customValue = "";
            this.customValue = [];
            this.itemData = [];
            if ("ins,org,user".indexOf(this.activeName) != -1) {
                this.scopeData.compareSign = "in";
            }
            if (this.activeName == "dict") {
                this.loadDictree();
            }
            //加载机构组织用户树
            if (this.activeName != "dict" && this.activeName != "custom") {
                this.loadCustomTree();
            }
        },
        loadDictree() {
            this.$api("sys_dict.dictCategoryDictTree").then((res) => {
                if (res && res.code == 200) {
                    this.treeData = res.data;
                    if (
                        this.scopeData.dictType != "" &&
                        this.scopeData.dictType != undefined
                    ) {
                        this.loadDictItem();
                    }
                }
            });
        },
        loadCustomTree() {
            var url = "";
            if (this.activeName == "org") {
                url = "sys_org_ins.orgtree";
            }
            if (this.activeName == "ins") {
                url = "sys_org_ins.instree";
            }
            if (this.activeName == "user") {
                url = "base_user.usertree";
            }
            this.$api(url).then((res) => {
                if (res && res.code == 200) {
                    this.customTreeData = res.data;
                }
            });
        },
        changeType(data) {
            this.isDict = data.type == "dict";
            if (this.isDict == true) {
                this.loadDictItem();
            }
            //直接校验不起作用，需要通过这种方式来校验
            //this.$nextTick(()=>{
            this.$refs[this.activeName + "scopeForm"][0].validateField(
                "dictShowType"
            );
            //});
        },
        changeInsOrOrgUser(data) {
            this.customType = data.type;
            this.$refs[this.activeName + "scopeForm"][0].validateField(
                "customValue"
            );
        },
        loadDictItem() {
            this.$api("sys_dict.findDictItemByCode", {
                code: this.scopeData.dictType,
            }).then((res) => {
                if (res && res.code == 200) {
                    this.itemData = res.data;
                    if (this.itemData) {
                        var data = this.itemData.filter(
                            (item) => item.defaulted
                        );
                        if (data.length > 0 && this.customValue.length == 0) {
                            this.customValue.push(data[0].value);
                        }
                    }
                }
            });
        },
        labelChange(data) {
            this.showDisplay.push(data);
        },
        labelDeChange(data) {
            for (var i = 0; i < this.showDisplay.length; i++) {
                if (this.showDisplay[i].id == data.id) {
                    this.showDisplay.splice(i, 1);
                    break;
                }
            }
        },
        //关闭窗口
        cancel() {
            this.scopeData.compareSign = this.scopeDataClone.compareSign;
            this.scopeData.ruleType = this.scopeDataClone.ruleType;
            this.scopeData.customValue = this.scopeDataClone.customValue;
            this.scopeData.dictType = this.scopeDataClone.dictType;

            this.$store.commit("CLOSE_DIALOG", {
                _uid: "customDialog",
            });
        },
        //关闭窗口
        saveScope() {
            // this.scopeDisplayFunc(this.showDisplay,this.activeName);
            this.$store.commit("CLOSE_DIALOG", {
                _uid: "customDialog",
            });
        },
    },
};
</script>
