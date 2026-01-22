<template>
  <section class="page-container border padding">
    <el-row class="page-header">
      <el-input v-model="filters.key" style="width: 270px;" placeholder="风险名称 模糊查询" clearable
                @clear="handleClear" @keyup.enter.native="searchOnEnter"></el-input>
      <el-button type="primary" icon="el-icon-search" style="margin-right: 13px;" v-loading="load.list"
                 :disabled="load.list==true" v-on:click="searchContractRiskRules">查询
      </el-button>
      <el-button icon="el-icon-plus" @click="showAdd" style="margin-left: 0;margin-right: 13px;">添加</el-button>
      <el-button type="danger" icon="el-icon-delete" style="margin-left: 0;" v-loading="load.del" @click="batchDel"
                 :disabled="this.sels.length===0 || load.del==true">批量删除
      </el-button>
    </el-row>
    <el-row class="page-main padding-top">
      <!--列表 ContractRiskRule ht_contract_risk_rule-->
      <el-table :height="tableHeight" ref="procdefsTable" :data="contractRiskRules" @sort-change="sortChange"
                highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick"
                style="width: 100%;">
        <el-table-column sortable type="selection" width="40"></el-table-column>
        <el-table-column prop="ruleName" show-overflow-tooltip label="风险名称" min-width="80">
          <template slot-scope="scope">
            <span class="detail" @click="gotoDetail(scope.row)">{{ scope.row.ruleName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ruleDesc" show-overflow-tooltip label="风险说明" min-width="80"></el-table-column>
      </el-table>
      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]"
                     :current-page="pageInfo.pageNum"
                     :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>

      <!--编辑 ContractRiskRule ht_contract_risk_rule界面-->
      <el-dialog title="编辑" :visible.sync="editFormVisible" width="50%" :close-on-click-modal="false">
        <contract-risk-rule-edit :contract-risk-rule="editForm" :visible="editFormVisible"
                                 @cancel="editFormVisible=false" @submit="afterEditSubmit"></contract-risk-rule-edit>
      </el-dialog>

      <!--新增 ContractRiskRule ht_contract_risk_rule界面-->
      <el-dialog title="新建" :visible.sync="addFormVisible" width="50%" :close-on-click-modal="false">
        <contract-risk-rule-add :contract-risk-rule="addForm" :visible="addFormVisible" @cancel="addFormVisible=false"
                                @submit="afterAddSubmit"></contract-risk-rule-add>
      </el-dialog>

    </el-row>
  </section>
</template>

<script>
import util from '@/common/js/util'; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import {
  listContractRiskRule,
  delContractRiskRule,
  batchDelContractRiskRule
} from '@/api/oa/ht/contractRiskRule';
import ContractRiskRuleAdd from './ContractRiskRuleAdd'; //新增界面
import ContractRiskRuleEdit from './ContractRiskRuleEdit'; //修改界面
import {
  mapGetters
} from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data() {
    return {
      filters: {
        key: ''
      },
      contractRiskRules: [], //查询结果
      pageInfo: { //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        count: false, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: [] //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: {
        list: false,
        edit: false,
        del: false,
        add: false
      }, //查询中...
      sels: [], //列表选中数据
      options: {}, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

      addFormVisible: false, //新增contractRiskRule界面是否显示
      //新增contractRiskRule界面初始化数据
      addForm: {
        ruleId: '',
        ruleName: '',
        ruleDesc: '',
        branchId: ''
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑contractRiskRule界面初始化数据
      editForm: {
        ruleId: '',
        ruleName: '',
        ruleDesc: '',
        branchId: ''
      },
      tableHeight: 300
      /**begin 自定义属性请在下面加 请加备注**/

      /**end 自定义属性请在上面加 请加备注**/
    }
  }, //end data
  methods: {
    handleClear() {
      this.searchContractRiskRules();
    },
    searchOnEnter() {
      this.searchContractRiskRules();
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getContractRiskRules();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getContractRiskRules();
    },
    // 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
    sortChange(obj) {
      var dir = 'asc';
      if (obj.order == 'ascending') {
        dir = 'asc'
      } else {
        dir = 'desc';
      }
      if (obj.prop == 'xxx') {
        this.pageInfo.orderFields = ['xxx'];
        this.pageInfo.orderDirs = [dir];
      }
      this.getContractRiskRules();
    },
    searchContractRiskRules() {
      this.pageInfo.count = true;
      this.getContractRiskRules();
    },
    //获取列表 ContractRiskRule ht_contract_risk_rule
    getContractRiskRules() {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count
      };
      if (this.pageInfo.orderFields != null && this.pageInfo.orderFields.length > 0) {
        let orderBys = [];
        for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
          orderBys.push(this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i])
        }
        params.orderBy = orderBys.join(",")
      }
      if (this.filters.key !== "") {
        //params.xxx=this.filters.key
        params.key = this.filters.key
      } else {
        //params.xxx=xxxxx
      }
      this.load.list = true;
      listContractRiskRule(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.pageInfo.total = res.data.total;
          this.pageInfo.count = false;
          this.contractRiskRules = res.data.data;
        } else {
          this.$message({
            message: tips.msg,
            type: 'error'
          });
        }
        this.load.list = false;
      }).catch(err => this.load.list = false);
    },

    //显示编辑界面 ContractRiskRule ht_contract_risk_rule
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 ContractRiskRule ht_contract_risk_rule
    showAdd: function () {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getContractRiskRules();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
    },
    //选择行contractRiskRule
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除contractRiskRule
    handleDel: function (row, index) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        let params = {
          ruleId: row.ruleId
        };
        delContractRiskRule(params).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getContractRiskRules();
          }
          this.$message({
            message: tips.msg,
            type: tips.isOk ? 'success' : 'error'
          });
        }).catch(err => this.load.del = false);
      });
    },
    //批量删除contractRiskRule
    batchDel: function () {

      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        batchDelContractRiskRule(this.sels).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getContractRiskRules();
          }
          this.$message({
            message: tips.msg,
            type: tips.isOk ? 'success' : 'error'
          });
        }).catch(err => this.load.del = false);
      });
    },
    rowClick: function (row, event, column) {
      this.$emit('row-click', row, event, column); //  @row-click="rowClick"
    },
    /**begin 自定义函数请在下面加**/
    gotoDetail(data) {
      this.showEdit(data);
    },

    /**end 自定义函数请在上面加**/

  }, //end methods
  components: {
    'contract-risk-rule-add': ContractRiskRuleAdd,
    'contract-risk-rule-edit': ContractRiskRuleEdit,

    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
      this.getContractRiskRules();
      var clientRect = this.$refs.procdefsTable.$el.getBoundingClientRect();
      var subHeight = 60 / 1000 * window.innerHeight;
      this.tableHeight = window.innerHeight - clientRect.y - this.$refs.procdefsTable.$el.offsetTop - subHeight;
    });
  }
}
</script>

<style scoped>
.detail:hover {
  text-decoration: underline;
  color: royalblue;
  cursor: pointer !important;
}
</style>

<style>
.app-container {
  padding: 20px;
  padding-bottom: 0;
}
</style>
