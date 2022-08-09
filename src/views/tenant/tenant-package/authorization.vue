<template>
    <m-layout style="height: 400px">
        <template>
            <el-input placeholder="请输入岗位名称" v-model="filterText"></el-input>
            <el-checkbox-group v-model="checkList" @change="onChange">
                <el-checkbox label="展开/折叠"></el-checkbox>
                <el-checkbox label="全选/全不选"></el-checkbox>
                <el-checkbox label="父子联动"></el-checkbox>
            </el-checkbox-group>
            <el-tree
                :default-expand-all="expandNode"
                show-checkbox
                :data="treeData"
                node-key="id"
                :props="defaultProps"
                @node-click="clickNode"
                ref="tree">
            </el-tree>
            <template slot="footer">
                <m-button type="primary" @click="submitForm()" v-repeatForm>授权</m-button>
                <m-button @click="closeDialog()">关闭</m-button>
            </template>
        </template>
    </m-layout>
</template>

<script>
import api from '../../../axios/index'
export default {
    name: 'authorization',
    data() {
        return {
            filterText: '',
            selectTreeId: null,
            checkList: [],
            treeData: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            expandNode: true,
        }
    },
    created() {
        api.request('tenantPackage.getTree').then(res => {
            this.treeData = res.data.records;
        });
    },
    watch: {
        // 获取到数据的时候设置isCheck为true的节点为勾选状态
        treeData() {
            this.$nextTick(() => {
                for(var i=0;i<this.$refs.tree.store._getAllNodes().length;i++){
                    if(this.$refs.tree.store._getAllNodes()[i].data.isCheck === true){
                        this.$refs.tree.setChecked(this.$refs.tree.store._getAllNodes()[i].data.id,true, false)
                    }
                }
            })
        }
    },
    methods: {
        loadTreeNodes(node, resolve) {
            const parentId = node.data && node.data.id ? node.data.id : 0
            const type = node.data && node.data.type ? node.data.type : 'inst'
            this.$m.api.tree.listInstOrgTree(true, parentId, type).then(res => {
                return resolve(res.data.treeNodes)
            })
        },
        clickNode() {
            // if(this.checkList.includes('全选/全不选')){
            //     this.checkList.splice(this.checkList.indexOf('全选/全不选'), 1);
            // }
        },
        onChange(value) {
            if(value.includes('展开/折叠')) {
                for(var i=0;i<this.$refs.tree.store._getAllNodes().length;i++){
                    this.$refs.tree.store._getAllNodes()[i].expanded=true;
                }
            }else {
                for(var i=0;i<this.$refs.tree.store._getAllNodes().length;i++){
                    this.$refs.tree.store._getAllNodes()[i].expanded=false;
                }
            }
            if(value.includes('全选/全不选')) {
                let nodeArr = [];
                for(var index in this.treeData){
                    nodeArr.push(this.treeData[index].id)
                }
                this.$refs.tree.setCheckedKeys(nodeArr);
            }else {
                this.$refs.tree.setCheckedKeys([]);
            }
            if(value.includes('父子联动')) {
                // 父子联动处理
            }
        },
        closeDialog() {
            this.$m.dialog.close(this.$attrs.dialogKey)
        },
        submitForm() {
            // 获取授权数据
            api.request('tenantPackage.saveAuth', {data: this.treeData}).then(res => {
                this.$m.msg.success();
            }).catch(err => {
                console.log(err)
            })
            this.closeDialog()
        }
    }
    
}
</script>