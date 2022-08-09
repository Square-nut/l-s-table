import validateJS from './valid'
export default {
    transRule(validFields = []) {
        let rules = {};
        for(var i=0;i<validFields.length;i++){
            let ruleId = validFields[i].id;
            rules[ruleId] = [];
            if(validFields[i].validateType!=""&&validFields[i].validateType!=null){
                // 如果后台来的字段带上了校验规则，循环遍历。拼接校验规则
                for(var j=0;j<validFields[i].validateType.length;j++){
                    let fieldValidItem = validFields[i].validateType[j];
                    let validateRule = {};
                    validateRule['trigger'] = 'change';
                    // 先判断最大最小和长度还有数值返回三中情况
                    if(fieldValidItem.prop == 'min'){
                        validateRule['message'] = '最小值为' +fieldValidItem.min;
                        validateRule[min] = fieldValidItem.min;
                    }else if(fieldValidItem.prop == 'max'){
                        validateRule['message'] = '最大值为' +fieldValidItem.max;
                        validateRule[max] = fieldValidItem.max;
                    }else if(fieldValidItem.prop == 'len'){
                        validateRule['message'] = '长度为' +fieldValidItem.len;
                        validateRule[len] = fieldValidItem.len;
                    }else if(fieldValidItem.prop == 'numRange'){
                        validateRule['message'] = '数值范围在' +fieldValidItem.min + '到' + 
                        fieldValidItem.max + '之间';
                        validateRule[min] = fieldValidItem.min;
                        validateRule[max] = fieldValidItem.max;
                    }else{
                        validateRule['pattern'] = validateJS[fieldValidItem.prop];
                        validateRule['message'] = validateJS[fieldValidItem.prop + 'MSG'];
                        if(fieldValidItem.prop == 'required'){
                            validateRule['required'] = true;
                            validateRule['trigger'] = "blur";
                        }
                    }
                    // 一个字段的所有校验规则
                    rules[ruleId].push(validateRule)
                }
            }else{
                // 字段没有带上校验规则
                let rule = {required: false};
                rules[ruleId].push(rule);
            }
        }
        return rules;
    }
}