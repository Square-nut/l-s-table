import table from "@components/hos-biz/store/table";
import dialog from "@components/hos-biz/store/dialog";
import user from "./user";
import sys from "./sys";
import permission from "./permission";

// biz vuex
import biz from '@/store'
// sys 原vuex定义
let models = {sys, permission, user, table, dialog, biz }
// biz + sys
for(let item in biz){
  models[item] = biz[item]
}

export default models;
