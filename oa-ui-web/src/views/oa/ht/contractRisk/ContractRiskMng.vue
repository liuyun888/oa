<template>
  <section class="page-container border padding">
    <el-row v-if="contractCard === undefined " class="page-header">
      <el-input v-model="filters.key" style="width: 270px;" placeholder="风险类型 模糊查询" clearable
                @clear="handleClear" @keyup.enter.native="searchOnEnter"></el-input>
      <el-button type="primary" icon="el-icon-search" style="margin-right: 13px;" v-loading="load.list"
                 :disabled="load.list==true" v-on:click="searchContractRisks">查询
      </el-button>
      <el-button icon="el-icon-plus" style="margin-left: 0;margin-right: 13px;" @click="showAdd">添加</el-button>
      <el-button type="danger" icon="el-icon-delete" style="margin-left: 0;" v-loading="load.del" @click="batchDel"
                 :disabled="this.sels.length===0 || load.del==true">批量删除
      </el-button>
    </el-row>
    <el-row class="page-main padding-top">

      <!--列表 ContractRisk ht_contract_risk-->
      <el-table :height="tableHeight" ref="procdefsTable" :data="contractRisks" @sort-change="sortChange"
                highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick"
                style="width: 100%;">
        <el-table-column sortable type="selection" width="40"></el-table-column>
        <el-table-column prop="riskName" show-overflow-tooltip label="风险类型" min-width="80">
          <template slot-scope="scope">
            <span @click="gotoDetail(scope.row)" class="detail">{{ scope.row.riskName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="riskNav" show-overflow-tooltip label="风险内容" min-width="80"></el-table-column>
        <el-table-column prop="riskMethod" show-overflow-tooltip label="处理策略" min-width="80"></el-table-column>
        <el-table-column prop="yujiTime" show-overflow-tooltip label="预计时间" min-width="80"></el-table-column>
      </el-table>

      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]"
                     :current-page="pageInfo.pageNum"
                     :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>

      <!--编辑 ContractRisk ht_contract_risk界面-->
      <el-dialog custom-class="tempDialog" append-to-body :visible.sync="editFormVisible" :fullscreen="true"
                 :close-on-click-modal="false">
        <contract-risk-edit :contract-risk="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
                            @submit="afterEditSubmit"></contract-risk-edit>
      </el-dialog>

      <!--新增 ContractRisk ht_contract_risk界面-->
      <el-dialog custom-class="tempDialog" append-to-body :visible.sync="addFormVisible" :fullscreen="true"
                 :close-on-click-modal="false">
        <contract-risk-add :contract-card="contractCard" :contract-risk="addForm" :visible="addFormVisible"
                           @cancel="addFormVisible=false" @submit="afterAddSubmit"></contract-risk-add>
      </el-dialog>

    </el-row>
  </section>
</template>

<script>
import util from '@/common/js/util'; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import {
  listContractRisk,
  delContractRisk,
  batchDelContractRisk
} from '@/api/oa/ht/contractRisk';
import ContractRiskAdd from './ContractRiskAdd'; //新增界面
import ContractRiskEdit from './ContractRiskEdit'; //修改界面
import {
  mapGetters
} from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  props: ['contractCard'],
  data() {
    return {

      filters: {
        key: ''
      },

      contractRisks: [], //查询结果
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

      addFormVisible: false, //新增contractRisk界面是否显示
      //新增contractRisk界面初始化数据
      addForm: {
        riskId: '',
        htId: '',
        htName: '',
        cpId: '',
        cpName: '',
        ruleId: '',
        riskName: '',
        riskNav: '',
        riskMethod: '',
        yujiTime: '',
        createTime: '',
        createUserId: '',
        createUserName: '',
        branchId: ''
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑contractRisk界面初始化数据
      editForm: {
        riskId: '',
        htId: '',
        htName: '',
        cpId: '',
        cpName: '',
        ruleId: '',
        riskName: '',
        riskNav: '',
        riskMethod: '',
        yujiTime: '',
        createTime: '',
        createUserId: '',
        createUserName: '',
        branchId: ''
      },
      tableHeight: 300
      /**begin 自定义属性请在下面加 请加备注**/

      /**end 自定义属性请在上面加 请加备注**/
    }
  }, //end data

  methods: {
    handleClear() {
      this.searchContractRisks();
    },
    searchOnEnter() {
      this.searchContractRisks();
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getContractRisks();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getContractRisks();
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
      this.getContractRisks();
    },
    searchContractRisks() {
      this.pageInfo.count = true;
      this.getContractRisks();
    },
    //获取列表 ContractRisk ht_contract_risk
    getContractRisks() {
      let htId = util.isNull(this.contractCard) ? null : this.contractCard.htId;
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count,
        htId: htId
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
      listContractRisk(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.pageInfo.total = res.data.total;
          this.pageInfo.count = false;
          this.contractRisks = res.data.data;
        } else {
          this.$message({
            message: tips.msg,
            type: 'error'
          });
        }
        this.load.list = false;
      }).catch(err => this.load.list = false);
    },

    //显示编辑界面 ContractRisk ht_contract_risk
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 ContractRisk ht_contract_risk
    showAdd: function () {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getContractRisks();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
      this.getContractRisks();
    },
    //选择行contractRisk
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除contractRisk
    handleDel: function (row, index) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        let params = {
          riskId: row.riskId
        };
        delContractRisk(params).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getContractRisks();
          }
          this.$message({
            message: tips.msg,
            type: tips.isOk ? 'success' : 'error'
          });
        }).catch(err => this.load.del = false);
      });
    },
    //批量删除contractRisk
    batchDel: function () {
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        batchDelContractRisk(this.sels).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getContractRisks();
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
    'contract-risk-add': ContractRiskAdd,
    'contract-risk-edit': ContractRiskEdit,

    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
      this.getContractRisks();
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
.tempDialog .el-dialog {
  width: 100%;
  height: 100%;
  -webkit-box-shadow: none !important;
  margin-top: 0 !important;
  position: relative;
  margin: 0 auto 0px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.tempDialog .el-dialog__header {
  padding: 0;
  margin: 0;
  height: 0px;
}

.tempDialog .el-dialog__body {
  padding: 0;
  margin: 0;
  height: 100%;
}
</style>

<style>
.app-container {
  padding: 20px;
  padding-bottom: 0;
}
</style>
