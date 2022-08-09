/*
 * @Author: liruiqing@mediway.cn
 * @Date: 2022-03-21 18:57:24
 * @Last Modified by: liruiqing@mediway.cn
 * @Last Modified time: 2022-05-25 14:45:08
 */
import STable from "./components/hos-biz-table.vue";
import SButton from "./components/form/button";
import SDialog from "./components/dialog";
const components = {
  STable,
  SButton,
  SDialog
};
const install = Vue => {
  Object.keys(components).forEach(name => {
    const component = components[name];
    Vue.component(component.name, component);
  });
};

export default { install };
