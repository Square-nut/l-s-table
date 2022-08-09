<template>
  <div>
    <hos-biz-table
      ref="multipleTable"
      uid="multipleTable" 
      :data="tableData"
      :page="true"
      :form="form" 
      tooltip-effect="dark"
      style="width: 100%;height: 500px;overflow: scroll"
      :cols="cols"
      @selection-change="handleSelectionChange">
      <template #form>
        <hos-row>
          <hos-col :span="6">
            <hos-form-item :label="$t('common.name')">
              <hos-input v-model="form.model.name" clearable :placeholder="$t('common.placeholder.name')">
              </hos-input>
            </hos-form-item>
          </hos-col>
          <hos-col :span="6">
            <hos-form-item label-width="20px">
              <hos-biz-button @click="searchField()" type="primary">{{$t('operation.query')}}</hos-biz-button>
              <hos-biz-button @click="reset()">{{$t('operation.reset')}}</hos-biz-button>
            </hos-form-item>
          </hos-col>
        </hos-row>
      </template>
    </hos-biz-table>
    <div slot="footer" class="dialog-footer">
      <hos-button type="primary" @click="cancel">{{$t('operation.cancel')}}</hos-button>
      <hos-button type="success" @click="save">{{$t('operation.save')}}</hos-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      callback: Function,
      tabLength: Number,
      tableId: String,
      hasField: Array,
      allFieldList: Array
    },
    data() {
      return {
        tableDataClone: [],
        form: {
          labelWidth: "80px",
          model: {
              name: "",
              code: "",
          }
        },
        getField: [],
        typeArr: {
          "input": "输入框",
          "inputNumber": '计数器',
          'textarea': '文本域',
          'DatePicker':'日期选择器',
          'select': '下拉单选',
          'switch': '开关'
      },
        page:{
          current: 1,
          size: 10
        },
        tableData: [],
        cols: [{
          type:"selection",
          width: '55px',
          align: "center"
        },{
          prop: 'name',
          label: this.$t('expand.name')
        },{
          prop: 'code',
          label: this.$t('common.code')
        },{
          prop: 'permCode',
          label: this.$t('page.permCode')
        },{
          prop: ({row}) =>{
            return this.typeArr[row.type]
          },
          label: this.$t('expand.pageShowType')
        }],
        multipleSelection: [],
      }
    },
    created() {
      [...this.getField] = this.allFieldList;
      for(var i=0;i<this.hasField.length;i++){
        for(var j=0;j<this.getField.length;j++){
          if(this.hasField[i] == this.getField[j].name){
            this.getField.splice(j, 1);
          }
        }
      }
      this.tableData = this.getField
      console.log(this.tableData)
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      save() {
        if(this.tabLength == 0) {
          this.$message.error(this.$t('expand.message.tab'));
          this.cancel();
        }else {
          for(let i=0;i<this.multipleSelection.length;i++){
          this.$set(this.multipleSelection[i], 'col', 12);
          this.$set(this.multipleSelection[i], 'id', this.multipleSelection[i].id)
          this.$set(this.multipleSelection[i], 'fieldName', this.multipleSelection[i].name)
          }
          this.callback(this.multipleSelection);
          this.cancel();
        }
        
      },
      cancel() {
        this.$store.commit("CLOSE_DIALOG", {_uid: 'fieldAddDialog'});
      },
      searchField() {
        if(this.form.model.name != ''){
          let newArr = [];
          this.tableDataClone = JSON.parse(JSON.stringify(this.tableData));
          let searchData = JSON.parse(JSON.stringify(this.tableData));
          searchData.filter(item => {
            if(item.name.indexOf(this.form.model.name) !== -1){
              newArr.push(item);
            }
          });
          this.tableData = newArr;
          this.$store.commit("UPDATE_TABLE", { _uid: "multipleTable" });
          console.log(this.tableData)
        }

      },
      reset() {
        this.form.model = {
          code: '',
          name: ''
        };
        this.tableData = this.tableDataClone;
        this.$store.commit("UPDATE_TABLE", { _uid: "multipleTable" });
      }
    }
  }
</script>