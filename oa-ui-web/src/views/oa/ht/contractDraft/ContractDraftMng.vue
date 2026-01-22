<template>
  <section class="page-container border padding">
    <el-row class="page-header">
      <el-input v-model="filters.key" style="width: 270px" placeholder="合同名称 模糊查询" clearable
                @clear="handleClear" @keyup.enter.native="searchOnEnter"></el-input>
      <el-button type="primary" icon="el-icon-search" v-loading="load.list" :disabled="load.list==true"
                 v-on:click="searchContractDrafts">查询
      </el-button>
      <!-- <el-button type="primary" @click="showAdd">+ht_contract_draft</el-button> -->
      <el-button type="danger" icon="el-icon-delete" v-loading="load.del" @click="batchDel"
                 :disabled="this.sels.length===0 || load.del==true">批量删除
      </el-button>
    </el-row>
    <el-row class="page-main padding-top">
      <!--列表 ContractDraft ht_contract_draft-->
      <el-table :height="tableHeight" ref="procdefsTable" :data="contractDrafts" @sort-change="sortChange"
                highlight-current-row v-loading="load.list" border
                @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
        <el-table-column sortable type="selection" width="40"></el-table-column>
        <el-table-column sortable type="index" width="40"></el-table-column>
        <el-table-column prop="title" show-overflow-tooltip label="流程标题" min-width="80">
          <template slot-scope="scope">
            <span class="detail" @click="gotoDetail(scope.row)">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="htName" label="合同名称" min-width="80">
          <template slot-scope="scope">
            <span class="detail" @click="gotoDetail(scope.row)">{{ scope.row.htName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="htTypeName" label="合同类型" min-width="80"></el-table-column>
        <el-table-column prop="cpName" show-overflow-tooltip label="相对方" min-width="80"></el-table-column>
        <el-table-column prop="reqUserName" label="申请人" min-width="80"></el-table-column>
        <el-table-column prop="reqDeptName" show-overflow-tooltip label="申请部门" min-width="80"></el-table-column>
        <el-table-column prop="reqDate" show-overflow-tooltip label="申请日期" min-width="80"></el-table-column>
        <el-table-column prop="status" label="当前状态" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.status === '0' ? '保存' : '提交' }}</span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]"
                     :current-page="pageInfo.pageNum"
                     :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>
      <!--编辑 ContractDraft ht_contract_draft界面-->
      <el-dialog title="编辑ht_contract_draft" :visible.sync="editFormVisible" width="50%"
                 :close-on-click-modal="false">
        <contract-draft-edit :contract-draft="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
                             @submit="afterEditSubmit"></contract-draft-edit>
      </el-dialog>

      <!--新增 ContractDraft ht_contract_draft界面-->
      <el-dialog title="新增ht_contract_draft" :visible.sync="addFormVisible" width="50%" :close-on-click-modal="false">
        <contract-draft-add :contract-draft="addForm" :visible="addFormVisible" @cancel="addFormVisible=false"
                            @submit="afterAddSubmit"></contract-draft-add>
      </el-dialog>

      <div class="tempDialog">
        <el-dialog :visible.sync="txs1Visible" :fullscreen="true" :close-on-click-modal="false">
          <contract-template-xs1-detail :contract-draft="detailForm" :visible="txs1Visible" @cancel="txs1Visible=false"
                                        @submit="txs1Visible=false"></contract-template-xs1-detail>
        </el-dialog>

        <el-dialog :visible.sync="tcg1Visible" :fullscreen="true" :close-on-click-modal="false">
          <contract-template-cg1-detail :contract-draft="detailForm" :visible="tcg1Visible" @cancel="tcg1Visible=false"
                                        @submit="tcg1Visible=false"></contract-template-cg1-detail>
        </el-dialog>

        <el-dialog :visible.sync="project1Visible" :fullscreen="true" :close-on-click-modal="false">
          <contract-template-project1-detail :contract-draft="detailForm" :visible="project1Visible"
                                             @cancel="project1Visible=false"
                                             @submit="project1Visible=false"></contract-template-project1-detail>
        </el-dialog>
      </div>

    </el-row>
  </section>
</template>

<script>
import util from '@/common/js/util'; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import {
  listContractDraft,
  delContractDraft,
  batchDelContractDraft
} from '@/api/oa/ht/contractDraft';
import {
  mapGetters
} from 'vuex';
import ContractTemplateXs1Detail from '../contractDraftTemplate/ContractTemplateXs1Detail';
import ContractTemplateCg1Detail from '../contractDraftTemplate/ContractTemplateCg1Detail';
import ContractTemplateProject1Detail from '../contractDraftTemplate/ContractTemplateProject1Detail';

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
      contractDrafts: [], //查询结果
      pageInfo: { //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        count: false, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: ['req_date'], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: ['desc'] //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: {
        list: false,
        edit: false,
        del: false,
        add: false
      }, //查询中...
      sels: [], //列表选中数据
      options: {}, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

      addFormVisible: false, //新增contractDraft界面是否显示
      //新增contractDraft界面初始化数据
      addForm: {
        id: '',
        title: '',
        reqUserId: '',
        reqUserName: '',
        reqDeptId: '',
        reqDeptName: '',
        reqDate: '',
        htName: '',
        htParty: '',
        htPartyName: '',
        htSn: '',
        htBeginDate: '',
        htAmount: '',
        htImportantClause: '',
        htDemand: '',
        cpId: '',
        cpName: '',
        cpLevel: '',
        cpType: '',
        cpAddress: '',
        cpOpenBank: '',
        cpBankAccount: '',
        linkName: '',
        linkPhone: '',
        htParentType: '',
        htType: '',
        isUseMoban: '',
        fanbenId: '',
        isThirdparty: '',
        isExitChaoqi: '',
        isExitPerson: '',
        isExitFanwei: '',
        isExitHuikuan: ''
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑contractDraft界面初始化数据
      editForm: {
        id: '',
        title: '',
        reqUserId: '',
        reqUserName: '',
        reqDeptId: '',
        reqDeptName: '',
        reqDate: '',
        htName: '',
        htParty: '',
        htPartyName: '',
        htSn: '',
        htBeginDate: '',
        htAmount: '',
        htImportantClause: '',
        htDemand: '',
        cpId: '',
        cpName: '',
        cpLevel: '',
        cpType: '',
        cpAddress: '',
        cpOpenBank: '',
        cpBankAccount: '',
        linkName: '',
        linkPhone: '',
        htParentType: '',
        htType: '',
        isUseMoban: '',
        fanbenId: '',
        isThirdparty: '',
        isExitChaoqi: '',
        isExitPerson: '',
        isExitFanwei: '',
        isExitHuikuan: ''
      },

      detailFormVisible: false, //编辑界面是否显示
      //编辑contractDraft界面初始化数据
      detailForm: {
        id: '',
        title: '',
        reqUserId: '',
        reqUserName: '',
        reqDeptId: '',
        reqDeptName: '',
        reqDate: '',
        htName: '',
        htParty: '',
        htPartyName: '',
        htSn: '',
        htBeginDate: '',
        htAmount: '',
        htImportantClause: '',
        htDemand: '',
        cpId: '',
        cpName: '',
        cpLevel: '',
        cpType: '',
        cpAddress: '',
        cpOpenBank: '',
        cpBankAccount: '',
        linkName: '',
        linkPhone: '',
        htParentType: '',
        htType: '',
        isUseMoban: '',
        fanbenId: '',
        isThirdparty: '',
        isExitChaoqi: '',
        isExitPerson: '',
        isExitFanwei: '',
        isExitHuikuan: ''
      },

      /**begin 自定义属性请在下面加 请加备注**/
      txs1Visible: false,
      tcg1Visible: false,
      project1Visible: false,//施工合同
      tableHeight: 300
      /**end 自定义属性请在上面加 请加备注**/
    }
  }, //end data
  methods: {
    handleClear() {
      this.searchContractDrafts();
    },
    searchOnEnter() {
      this.searchContractDrafts();
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getContractDrafts();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getContractDrafts();
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
      this.getContractDrafts();
    },
    searchContractDrafts() {
      this.pageInfo.count = true;
      this.getContractDrafts();
    },
    //获取列表 ContractDraft ht_contract_draft
    getContractDrafts() {
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
      listContractDraft(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.pageInfo.total = res.data.total;
          this.pageInfo.count = false;
          this.contractDrafts = res.data.data;
        } else {
          this.$message({
            message: tips.msg,
            type: 'error'
          });
        }
        this.load.list = false;
      }).catch(err => this.load.list = false);
    },

    //显示编辑界面 ContractDraft ht_contract_draft
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 ContractDraft ht_contract_draft
    showAdd: function () {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },

    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getContractDrafts();
    },

    afterEditSubmit() {
      this.editFormVisible = false;
    },
    //选择行contractDraft
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除contractDraft
    handleDel: function (row, index) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        let params = {
          id: row.id
        };
        delContractDraft(params).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getContractDrafts();
          }
          this.$message({
            message: tips.msg,
            type: tips.isOk ? 'success' : 'error'
          });
        }).catch(err => this.load.del = false);
      });
    },
    //批量删除contractDraft
    batchDel: function () {

      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        batchDelContractDraft(this.sels).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getContractDrafts();
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
    gotoDetail(row) {
      switch (row.htType) {
        case '8':
          this.detailForm = Object.assign({}, row);
          this.txs1Visible = true;
          break;
        case '13':
          this.detailForm = Object.assign({}, row);
          this.tcg1Visible = true;
          break;

        case '30':
          this.detailForm = Object.assign({}, row);
          this.project1Visible = true;
          break;

        default:
          if (row.htParentType == '1') {
            this.detailForm = Object.assign({}, row);
            this.txs1Visible = true;
          } else {
            this.detailForm = Object.assign({}, row);
            this.tcg1Visible = true;
          }
      }
    },


    /**end 自定义函数请在上面加**/

  }, //end methods
  components: {
    'contract-template-xs1-detail': ContractTemplateXs1Detail,
    'contract-template-cg1-detail': ContractTemplateCg1Detail,
    ContractTemplateProject1Detail,

    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
      this.getContractDrafts();
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
