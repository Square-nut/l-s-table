<template>
    <hos-row>
        <hos-col v-if="type===2||type===3">
            <hos-tag v-for="(item,index) in roleData" :key="index"  :data-id="item.roleId+'^'+item.orgId" @click="handleClick(item.roleId+'^'+item.orgId)">
                {{item.orgName}}{{item.roleName}}
            </hos-tag>
        </hos-col>
        <hos-col v-else>
            <hos-tag v-for="(item,index) in roleData" :key="index"  :data-id="item.roleId" @click="handleClick(item.code)">
                {{item.roleName}}
            </hos-tag>
        </hos-col>
    </hos-row>
</template>

<script>
export default {
    data(){
        return{
            roleData:{},
            type:{}
        }
    },
    created() {
        this.roleData=this.$store.getters.info.roleData;
        this.type=this.$store.getters.baseUserOrgRole;
    },
    methods:{
        handleClick(roleId){
            ///
            let orgId="";
            if(type===2||type===3){
                roleId=roleId.split("^")[0];
                orgId=roleId.split("^")[1];
            }
            //获取是否科室关联
            let redirect=$.router.query.redirect;
            ////保存roleId
            if(orgId!=""){
                this.$store.dispatch("saveOrgId",orgId);
            }
            this.$store.dispatch("saveRoleId",roleId);

            if(redirect){
                $.router.push({path:redirect});
            }else{
                $.router.push({path:"/welcome"});
            }

        }
    }
}
</script>


