<template>
    <m-layout>
        <template>
            <m-table ref="tableRef" :columns="columns" api="tenantPackage.selectPage" @selection-change="changeSelection">
                <template #query>
                    <m-query>
                        <m-input label="检索" name="name" placeholder="请输入编码或名称"></m-input>
                    </m-query>
                </template>
                <template #tool>
                    <i class="el-icon-circle-plus-outline" style="padding: 4px" @click="showDialog('insert')"></i>
                    <i class="el-icon-delete" style="padding: 4px" @click="deleteData()"></i>
                </template>
                <template slot="activedSlot" slot-scope="{ scope }">
                    <m-switch v-model="scope.row.actived" @change="updateActived(scope.row)"></m-switch>
                </template>
                <template slot="optSlot" slot-scope="{ scope }">
                    <div class="table-operation">
                        <i class="el-icon-edit" title="编辑" @click="showDialog('update', scope.row)"></i>
                        <i class="el-icon-s-fold" title="菜单授权" @click="authDialog()"></i>
                        <i class="el-icon-delete" title="删除" @click="deleteData(scope.row)"></i>
                    </div>
                </template>
            </m-table>
        </template>
    </m-layout>
</template>

<script>
import tenantPackageEdit from './edit'
import authorization from './authorization.vue'
export default {
    name: 'tenantPackage',
    components: {
        tenantPackageEdit,
        authorization
    },
    data() {
        return {
            columns: [
                {type: 'selection', align: 'center', width: '50'},
                {prop: 'code', align: 'center', label: '编码'},
                {prop: 'name', align: 'center', label: '名称'},
                {prop: 'createTime', align: 'center', label: '创建时间'},
                {prop: 'remark', align: 'center', label: '备注'},
                {prop: 'actived', align: 'center', label: '是否启用', slotName: 'activedSlot'},
                {align: 'center', label: '操作', slotName: 'optSlot', width: '120'}
            ],
            selectedTableIds: [],

        }
    },
    methods: {
        changeSelection(selection) {
            this.selectedTableIds = selection.map((item) => item.id)
            this.batchDeleteButtonDisabled = !selection.length
        },
        showDialog(flag, row = {}) {
            if(flag === 'insert'){
                this.$m.dialog.open(tenantPackageEdit, {title: '新增租户包'}, {
                    tenantPackageId: row.id, 
                })
            }else {
                this.$m.dialog.open(tenantPackageEdit, {title: '修改租户包'}, {
                    tenantPackageId: row.id, 
                })
            }
        },
        updateActived(row) {
            this.$m.msg.confirm(`确认要'${row.actived ? '启用' : '禁用'}'该资源吗?`, () => {
                this.$api('tenantPackage.updateStats', {id: row.id, actived: row.actived}).then(res => {
                    this.$m.msg.success(res.data.msg)
                }).catch(() => {
                    row.actived = !row.actived
                })
            }, () => {
                row.actived = !row.actived
            })
        },
        deleteData(row) {
            if(this.selectedTableIds.length === 0){
                this.$alert("未选中需要删除的数据", "提示", {
                    confirmButtonText: '确定',
                    callback: () => {
                    }
                })
                return false;
            }
            this.$m.msg.confirm('是否确认删除？', () => {
                
                if(row){
                    this.$api('tenantPackage.deleteById', {id: row.id}).then(res => {
                        this.$m.msg.success(res.data.msg)
                        console.log(res)
                    }).catch(err => {
                        console.log(err)
                    })
                }else {
                    this.$api('tenantPackage.deleteById', {ids: this.selectedTableIds}).then(res => {
                        this.$m.msg.success(res.data.msg)
                        console.log(res)
                    })
                }
            })
        },
        authDialog() {
            this.$m.dialog.open(authorization, {title: '资源授权'} , {})
        },

    }
}
</script>