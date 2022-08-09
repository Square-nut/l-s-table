<template>
    <div style="height: 100%">
        <hos-biz-table
            @selection-change="handleSelectionChange"
            :page="true"
            :selection="selection"
            uid="customFieldTable"
            :cols="cols"
            :data="customFieldData"
            :form="form"
            pagePos="top"
        >
            <template #form>
                <hos-row>
                    <hos-col :span="6">
                        <hos-form-item :label="$t('common.code')">
                            <hos-input clearable v-model="form.model.code"
                            :placeholder="$t('common.placeholder.code')"></hos-input>
                        </hos-form-item>
                    </hos-col>
                    <hos-col :span="6">
                        <hos-form-item :label="$t('common.name')">
                            <hos-input clearable v-model="form.model.name"
                            :placeholder="$t('common.placeholder.name')"></hos-input>
                        </hos-form-item>
                    </hos-col>
                    <hos-col :span="6">
                        <hos-form-item label-width="20px">
                            <hos-biz-button run="form.search" type="primary">{{$t('operation.query')}}</hos-biz-button>
                            <hos-biz-button @click="reset()">{{$t('operation.reset')}}</hos-biz-button>
                            <hos-biz-button @click="closeTab()">{{$t('expand.reback')}}</hos-biz-button>
                        </hos-form-item>
                    </hos-col>
                </hos-row>
            </template>
            <template #toolbar>
                <hos-button-group>
                    <hos-button  v-has-permi="{key:'base:sys:expand:insert'}"
                     @click="addOrEdit()" icon="hos-icon-circle-plus-outline"></hos-button>
                    <hos-button v-has-permi="{key:'base:sys:expand:del'}"
                     @click="deleteCustomField()" icon="hos-icon-circle-close"></hos-button>
                </hos-button-group>
            </template>
        </hos-biz-table>
        <hos-biz-dialog
            :title='$t("operation.edit") + $t("expand.title")'
            width="900px"
            uid="customFieldEditDialog"
            :close-on-click-modal="false"
        >
        </hos-biz-dialog>
        <hos-biz-dialog
            :title='$t("operation.add") + $t("expand.title")'
            width="900px"
            uid="customFieldAddDialog"
            :close-on-click-modal="false"
        >
        </hos-biz-dialog>
    </div>
</template>
<script>
export default {
    inject: ["closeCurrent"],
    data() {
        return {
            // 传给后台用的对应实体的主键Id
            tableId: '',
            typeArr: {
                "input": "输入框",
                "inputNumber": '计数器',
                'textarea': '文本域',
                'DatePicker':'日期选择器',
                'select': '下拉单选',
                'switch': '开关'
            },
            form: {
                labelWidth: "80px",
                model: {
                    name: "",
                    code: "",
                }
            },
            selection: [],
            cols: [{
                type: 'selection',
                width: '55px',
            },{
                prop: 'code',
                label: this.$t('common.code')
            },{
                prop: 'name',
                label: this.$t('common.name')
            },{
                prop: 'permCode',
                label: this.$t('page.permCode'),
                width: "340px"
            },{
                prop: ({row}) => {
                        return this.typeArr[row.type]
                    },
                label: this.$t('expand.type')
            },{
                prop: 'defaultData',
                label: this.$t('expand.defaultData')
            },{
                label: this.$t('common.operation'),
                width: '80px',
                prop: ({row}) => {
                    return (
                        <div>
                             <hos-tooltip class="pl5 pr5"
                                content="编辑"
                            >
                                <i
                                    class="hos-icon-edit"
                                    on-click={() => {
                                    this.addOrEdit(row);
                                    }}
                                ></i>
                            </hos-tooltip>
                                 <hos-tooltip class="pl5 pr5"
                                content="删除"
                            >
                                <i
                                    class="hos-icon-circle-close"
                                    on-click={() => {
                                    this.deleteCustomField(row);
                                    }}
                                ></i>
                            </hos-tooltip>
                        </div>
                    )
                }
            }]
        }
    },
    mounted() {
        this.tableId = this.$route.query.tableId;
        this.page.tableId = this.$route.query.tableId;
    },
    methods: {
        customFieldData(params) {
            return this.$api('sys_expand.getCustomFieldPage', params)
        },
        handleSelectionChange(selection) {
            this.selectedTableIds = selection.map((item) => item.id)
        },
        addOrEdit(row){
            if(row){
                this.$store.commit('OPEN_DIALOG', {
                    component: require('./field-edit.vue').default,
                    _uid: 'customFieldEditDialog',
                    props: {
                        id: row.id,
                        status: "edit:",
                        tableId: this.tableId
                    }
                })
            }else{
                this.$store.commit('OPEN_DIALOG', {
                    component: require('./field-edit.vue').default,
                    _uid: 'customFieldAddDialog',
                    props: {
                        status: "add:",
                        tableId: this.tableId
                    }
                })
            }
        },
        // 删除自定义字段
        deleteCustomField(row) {
            this.$confirm(this.$t("common.confirm.delete")).then(() => {
                if(row){
                    this.$api('sys_expand.deletion', {ids: row.id}).then(res => {
                        if(res && res.code == 200){
                            this.$message.success(this.$t('operation.success'));
                            this.$store.commit("UPDATE_TABLE",{_uid: 'customFieldTable'});
                        }else{
                            this.$message.error(this.$t('operation.error'));
                        }
                    })
                }else {
                    let selectIds = this.selectedTableIds.join(',');
                    this.$api('sys_expand.deletion', {ids: selectIds}).then(res => {
                        if(res && res.code == 200){
                            this.$message.success(this.$t('operation.success'))
                            this.$store.commit("UPDATE_TABLE",{_uid: 'customFieldTable'});
                        }
                    }).catch(error => {
                        this.$message.error(this.$t("operation.error"));
                    })
                }
            })
        },
        // 重置表单
        reset() {
            this.form.model = {
                code: "",
                name: ""
            };
            this.$store.commit("UPDATE_TABLE", { _uid: "customFieldTable" });
        },
        closeTab() {
            this.$router.push({path: '/base-sys-expand'});
            this.closeCurrent();
        }
    }
}
</script>
