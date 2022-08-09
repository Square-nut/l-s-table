<template>
    <div>
        <hos-form>
            <hos-row>
            <hos-col :span="8">
                <hos-form-item label-width="80px" :label="$t('common.name')">
                    <hos-input :placeholder="$t('common.placeholder.name')"
                    clearable v-model="page.name"></hos-input>
                </hos-form-item>
            </hos-col>
            <hos-col :span="8">
                <hos-form-item label-width="80px" :label="$t('common.code')"> 
                    <hos-input :placeholder="$t('common.placeholder.code')"
                    clearable v-model="page.code"></hos-input>
                </hos-form-item>
            </hos-col> 
            <hos-col :span="6">
                <hos-form-item label-width="20px">
                    <hos-button type="primary" @click="searchTable">{{$t('operation.query')}}</hos-button>
                    <hos-button  @click="reset()">{{$t('operation.reset')}}</hos-button>
                </hos-form-item>
            </hos-col>
            <hos-col :span="8" :offset="16">
                <hos-pagination
                style="float: right; padding-bottom: 5px"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="page.current"
                :page-sizes="[5, 10, 15]"
                :page-size="page.size"
                layout="sizes, prev, pager, next"
                :total="total">
                </hos-pagination>
            </hos-col>
        </hos-row>
        </hos-form>
        
        <hos-table
        ref="userPageLinkTable"
        :data="relatedData"
        border
        fit
        style="height: 100%;overflow: scroll"
        row-key="name"
        @selection-change="handleSelectionChange"
        >
            <hos-table-column
                type="selection"
                width="55px"
                align="center">
            </hos-table-column>
            <hos-table-column
                prop="code"
                :label="$t('common.code')"
                width="240px">
            </hos-table-column>
            <hos-table-column
                prop="name"
                :label="$t('common.name')">
            </hos-table-column>
            <hos-table-column
                prop="status"
                :label="$t('expand.status')"
                width="200px">
                <template slot-scope="scope">
                    {{statusMap[scope.row.status]}}
                </template>
            </hos-table-column>
        </hos-table>
        <div slot="footer" class="dialog-footer">
            <hos-button @click="closeDialog()">{{$t('operation.close')}}</hos-button>
            <hos-button type="primary" @click="relatedPage()">{{$t('operation.save')}}</hos-button>
        </div>
    </div>
</template>

<script>
export default {
    props: ["tableId", "pageId"],
    data() {
        return {
            relatedData: [],
            page: {
                size: 10,
                current: 1,
                name: '',
                code: '',
                actived: '',
                status: ''
            },
            total: 0,
            currentRow: {},
            currentPage2: '',
            name: '',
            statusMap: {"edit": "编辑", "add": "新增", "delete": "删除"}
        }
    },
    created() {
         this.$api('sys_page_pre.list', this.page).then(res => {
             if(res && res.code == 200){
                 this.relatedData = res.data.records;
                 this.total = res.data.total
             }
         })
    },
    updated() {
        if(this.relatedData){
            for(var i=0;i<this.relatedData.length;i++){
            if(this.pageId == this.relatedData[i].id){
                this.$refs.userPageLinkTable.toggleRowSelection(this.relatedData[i]);
                return;
            }
        }
        }
        
    },
    methods: {
        relatedPage() {
            this.$confirm(this.$t('expand.message.linkPage')).then(() => {
                var obj = {
                    tableId: this.tableId,
                    pageId: this.currentRow.id
                }
                this.$api('sys_expand.relatedPage', obj).then(res => {
                    if(res && res.code == 200){
                        this.$message.success(this.$t('operation.success'))
                        this.$store.commit("UPDATE_TABLE", {_uid: "expandTable"})
                        this.closeDialog();
                    }else{
                        this.$message.error(this.$t("operation.error"));
                    }
                })
            })
        },
        closeDialog() {
            this.$store.commit("CLOSE_DIALOG", {_uid: 'pageUserLinkDialog'});
        },
        handleSelectionChange(val) {
            if (val.length >= 2) {
                this.currentRow = val[1]
                let arrays = val.splice(0, val.length - 1);
                arrays.forEach((row) => {
                this.$refs.userPageLinkTable.toggleRowSelection(row);
                });
            }else if(val.length == 1){
                this.currentRow = val[0]
            }else{
                this.currentRow = {}
            }
        },
        handleSizeChange(val) {
            this.page.size = val;
            this.$api('sys_page_pre.list', this.page).then(res => {
                if(res && res.code == 200){
                    this.relatedData = res.data.records;
                }
            })
        },
        handleCurrentChange(val) {
            this.page.current = val
        this.$api('sys_page_pre.list', this.page).then(res => {
             if(res && res.code == 200){
                 this.relatedData = res.data.records;
             }
         })
        },
        // 查询表格
        searchTable() {
            this.$api('sys_page_pre.list', this.page).then(res => {
                if(res &&res.code == 200){
                    console.log(res.data)
                    this.relatedData = res.data.records
                }
            })
        },
        reset() {
            this.page = {
                size: 10,
                current: 1,
                name: '',
                code: '',
                actived: '',
                status: ''
            }
        }
    }
}
</script>