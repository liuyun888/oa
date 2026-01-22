<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="text"><i class="el-icon-document"></i>  默认分类 ({{ dubanCategorys.length }})</span>
      </div>
      <div v-for="(item,index) in dubanCategorys" :key="index" class="text item">
        <!--        <a @click="showAdd(item)" v-if="item.status === '1'">{{ item.name }}</a>-->
        <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary"
                   @click="openForm({parentOpType:currOpType,subOpType:'add',formData:{},title:'新增'})"
                   title="" v-if="item.status === '1'">{{ item.name }}
        </el-button>
      </div>

    </el-card>

    <!--新增修改明细 DubanItem 督办表界面-->
    <mdp-dialog :ref="refId+'FormDialog'">
      <template v-slot="{visible,data,dialog}">
        <duban-item-form :ref="refId+'Form'" :visible="visible" :parent-op-type="currOpType"
                         :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose"
                         @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
      </template>
    </mdp-dialog>

  </div>
</template>

<script>
import {MdpTableMixin} from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import * as DubanItemApi from '@/api/oa/duban/dubanItem';
import {listDubanCategory} from '@/api/oa/duban/dubanCategory';
import {mapGetters} from 'vuex'
import DubanItemForm from './Form';//新增修改明细界面

export default {
  name: 'dubanItemMng',
  mixins: [MdpTableMixin],
  components: {
    DubanItemForm,
  },
  computed: {},
  watch: {},
  data() {
    return {
      dubanCategorys: [],
      addFormVisible: false,
      dubanCategory: null,
      menuDefId: '',//menu_def.id 菜单表菜单编号，用于按钮权限判断
      menuDefName: '督办表',//menu_def.name 功能名称，用于导出excel等文件名
      pkNames: ["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
      refId: 'dubanItem',
      currOpType: 'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
      filters: {//查询参数

      },
      defaultFilters: {//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

      },

      defaultCheckColumnNum: 8,//默认展示的表格列数，前8列

      editable: false,//是否可编辑模式

      //增删改查(含批量)接口
      apis: {
        list: DubanItemApi.listDubanItem,
        add: DubanItemApi.addDubanItem,
        del: DubanItemApi.delDubanItem,
        edit: DubanItemApi.editDubanItem,
        editSomeFields: DubanItemApi.editSomeFieldsDubanItem,
        batchAdd: DubanItemApi.batchAddDubanItem,
        batchDel: DubanItemApi.batchDelDubanItem,
        batchEdit: DubanItemApi.batchEditDubanItem,
      }
    }
  },
  methods: {
    //获取列表 DubanCategory duban_category
    getDubanCategorys() {
      let params = {
        branchId: this.userInfo.branchId
      };
      listDubanCategory(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.dubanCategorys = res.data.data;
        } else {
          this.$message({message: tips.msg, type: 'error'});
        }
      }).catch();
    },
    test(option) {
      console.log("option", option)
    },

    //页面初始化需要配置的特殊逻辑写这里
    initCurrData() {
      // this.searchTableDatas();
      this.getDubanCategorys()
    },

    /**
     * 检查参数是否满足调用后台接口的条件
     *
     * @param params 提交给后台的参数池,map类型
     * @returns true / false
     */
    preQueryParamCheck(params) {
      return true;
    },

    //页面数据加载完后需要对数据进行加工处理的
    afterList(tableDatas, isOk, apiName) {

    },

    /**
     * 对修改的字段进行判断，返回false ,将取消更新数据库
     * @param {*} row 当前选中的行
     * @param {*} fieldName 修改的字段名
     * @param {*} $event 修改后的值
     * @param {*} params 将要提交服务器的参数
     * @returns true/false 返回false ,将取消更新数据库
     */
    editSomeFieldsCheck(row, fieldName, $event, params) {
      if (this.currOpType == 'add' || this.currOpType == 'detail') {
        return false;
      }
      params[fieldName] = $event
      return true;
    },
  },
  mounted() {

  }
}
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
  margin-left: 18px;
}

.clearfix {
  text-align: center;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";

}

.clearfix:after {
  clear: both
}

.box-card {
  width: 400px;
  margin-left: 50px;
  margin-top: 50px;
}
</style>
