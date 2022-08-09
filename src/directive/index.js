import {hasPermi} from '@sys/utils/permission'


const install = function (Vue) {
    Vue.directive('hasPermi', hasPermi)
}

export default install
