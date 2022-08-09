<template>
    <div v-if="baseUserOrgRole == '1'">
        <userRole
            :id="id"
            :activeName="activeName"
            :userOptions="userOptions"
            :treeOptions="treeOptions"
            :rules="rules"
            :userTypeOptions="userTypeOptions"
            :treeEmployeeTree="treeEmployeeTree"
            :status="status"
            @handleClick="handleClick"
            @disabledNode="disabledNode"
            @disabledNode1="disabledNode1"
        ></userRole>
    </div>
    <div v-else-if="baseUserOrgRole == '2'">
        <userRoleTime
            :id="id"
            :activeName="activeName"
            :userOptions="userOptions"
            :treeOptions="treeOptions"
            :rules="rules"
            :userTypeOptions="userTypeOptions"
            :treeEmployeeTree="treeEmployeeTree"
            :status="status"
            @handleClick="handleClick"
            @disabledNode="disabledNode"
            @disabledNode1="disabledNode1"
        ></userRoleTime>
    </div>
    <div v-else-if="baseUserOrgRole == '3'">
        <userRoleNo
            :id="id"
            :activeName="activeName"
            :userOptions="userOptions"
            :treeOptions="treeOptions"
            :rules="rules"
            :userTypeOptions="userTypeOptions"
            :treeEmployeeTree="treeEmployeeTree"
            :status="status"
            @handleClick="handleClick"
            @disabledNode="disabledNode"
            @disabledNode1="disabledNode1"
        ></userRoleNo>
    </div>
</template>
<script>
import userRoleNo from "./user-role-no.vue";
import userRole from "./user-role.vue";
import userRoleTime from "./user-role-time.vue";
export default {
    props: [
        "id",
        "activeName",
        "userOptions",
        "treeOptions",
        "userTypeOptions",
        "baseUserOrgRole",
        "rules",
        "treeEmployeeTree",
        "status",
    ],
    components: {
        userRoleNo,
        userRole,
        userRoleTime,
    },
    data() {
        return {};
    },
    created() {
        this.disabledNode(this.userOptions, "ins"),
        this.disabledNode1(this.treeEmployeeTree, "employee"),
        this.disabledNode2(this.treeOptions, false);
    },
    methods: {
        // 指定类型节点禁用
        disabledNode(treeData, type) {
            treeData.forEach((item) => {
                if (item.type === type) {
                    item["isDisabled"] = true;
                }
                if (item.children && item.children.length > 0) {
                    this.disabledNode(item.children, type);
                }
            });
        },
        // 指定类型节点禁用
        disabledNode2(treeData, actived) {
            treeData.forEach((item) => {
                if (item.actived === actived) {
                    item["isDisabled"] = true;
                } else {
                    item["isDisabled"] = false;
                }
                if (item.children && item.children.length > 0) {
                    this.disabledNode2(item.children, actived);
                }
            });
        },
        //关联人员禁选组织和机构的节点
        disabledNode1(treeEmployeeTree, type) {
            treeEmployeeTree.forEach((item) => {
                if (item.type === type) {
                    item["isDisabled"] = false;
                } else {
                    item["isDisabled"] = true;
                }
                if (item.children && item.children.length > 0) {
                    this.disabledNode1(item.children, type);
                }
            });
        },
        handleClick() {
            if (this.activeName == "first") {
                this.$store.commit("UPDATE_TABLE", {
                    _uid: "table1",
                });
            } else if (this.activeName == "second") {
                this.$store.commit("UPDATE_TABLE", {
                    _uid: "table2",
                });
            } else if (this.activeName == "third") {
                this.$store.commit("UPDATE_TABLE", {
                    _uid: "table3",
                });
            } else {
                this.$store.commit("UPDATE_TABLE", {
                    _uid: "table4",
                });
            }
        },
    },
};
</script>
