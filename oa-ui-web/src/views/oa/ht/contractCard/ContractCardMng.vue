<template>
	<section class="page-container border padding"> 
    <el-row class="info" v-if="!cpId">
      <ul>
        <li>
          <h2>总合同数</h2>
          <p>{{amountObj.contractNums}}</p>
        </li>
        <li>
          <h2>总客户数</h2>
          <p>{{amountObj.cpNums}}</p>
        </li>
        <li>
          <h2>未激活</h2>
          <p>￥{{amountObj.inactiveAmount}}</p>
        </li>

        <li>
          <h2>履行中</h2>
          <p>￥{{amountObj.fulfilAmount}}</p>
        </li>

        <li>
          <h2>暂停</h2>
          <p>￥{{amountObj.pauseAmount}}</p>
        </li>

        <li>
          <h2>解除</h2>
          <p>￥{{amountObj.relieveAmount}}</p>
        </li>

        <li>
          <h2>已开票</h2>
          <p>￥{{amountObj.htKaiPiaoAmount+amountObj.htShouPiaoAmount}}</p>
        </li>

        <li>
          <h2>已收款</h2>
          <p>￥{{amountObj.htReceivedAmount}}</p>
        </li> 
        <li>
          <h2>￥已付款</h2>
          <p>{{amountObj.htPayedAmount}}</p>
        </li>
      </ul>
    </el-row>
		<el-row class="page-header">  
          <el-input
            size="small"
            v-model="filters.cbCenterNames"
            @focus="deptSelectVisible = true"
            style="width: 150px"
            placeholder="请选择成本中心"
          ></el-input> 
            
          <el-input v-if="!cpId" size="small" suffix-icon="el-icon-search" style="width: 150px" placeholder="相对方" v-model="filters.cpName" @focus="counterpartyVisible=true" clearable @change="onFiltersCpNameChange"></el-input>
          <el-select clearable size="small" style="width:100px;" v-model="filters.htStatus" placeholder="合同状态">
            <el-option v-for="item in dicts.contractStatus"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
        </el-select>
      <contract-type-select :size="'small'" style="width:100px;" v-model="filters.htType">
      </contract-type-select>
      <el-input v-model="filters.key" size="small" clearable placeholder="名称、编号、负责人、纳税人识别码查询" style="width:20%;"></el-input>
      <el-date-picker size="small"
        v-model="filters.htSignDateScope"
        type="daterange"
        align="right"
        unlink-panels
        clearable
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-button type="primary" size="small" icon="el-icon-search" v-loading="load.list" :disabled="load.list==true"
        v-on:click="searchContractCards">查询</el-button>
       <el-button type="danger" size="small" icon="el-icon-delete" v-loading="load.del" @click="batchDel"
        :disabled="this.sels.length===0 || load.del==true">删除</el-button>
    </el-row>

		<el-row class="page-main padding-top"> 
      <!--列表 ContractCard ht_contract_card-->
      <el-table :height="tableHeight" ref="procdefsTable" :data="contractCards" @sort-change="sortChange"
        highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick"
        style="width: 100%;">
        <el-table-column sortable type="selection" width="40"></el-table-column>
        <el-table-column  label="合同" min-width="200">
          <template slot-scope="scope">
            <span class="detail" @click="gotoDetail(scope.row)">{{scope.row.htSn}}&nbsp;&nbsp;{{scope.row.htTypeName}}&nbsp;&nbsp;{{scope.row.htName}}</span>
          </template>
        </el-table-column> 
        <el-table-column prop="htStatus"  label="合同状态" width="100">
          <template slot-scope="scope">
            <span>{{dicts.contractStatus[scope.row.htStatus]?dicts.contractStatus[scope.row.htStatus].name:scope.row.htStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="htFzUsername"  label="负责人" min-width="80"></el-table-column>
        <el-table-column prop="htSignDate"  label="签订日期" min-width="80"></el-table-column>
        <el-table-column prop="htGrossAmount"  label="合同总金额" min-width="80">
          <template slot-scope="scope">
             ￥{{scope.row.htGrossAmount}} 
          </template>
        </el-table-column>
        <el-table-column prop="htKaiPiaoAmount"  label="已开票" min-width="80">
          <template slot-scope="scope">
             ￥{{scope.row.htKaiPiaoAmount+scope.row.htShouPiaoAmount}} 
          </template>
        </el-table-column>
        <el-table-column prop="htReceivedAmount"  label="已收款" min-width="80">
          <template slot-scope="scope">
             ￥{{scope.row.htReceivedAmount}} 
          </template>
        </el-table-column>
        <el-table-column prop="htPayedAmount"  label="已付款" min-width="80">
          <template slot-scope="scope">
             ￥{{scope.row.htPayedAmount}} 
          </template>
        </el-table-column>
        <el-table-column prop="title" label="审批状态" min-width="80">
          <template slot-scope="scope">
            <!--当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除-->
            <el-link @click="showFlowTaskDetail(scope.row)">
             <el-tag v-if="scope.row.bizFlowState=='0'" type="primary">初始</el-tag>
             <el-tag v-else-if="scope.row.bizFlowState=='1'" type="primary">审批中</el-tag>
             <el-tag v-else-if="scope.row.bizFlowState=='2'" type="success">已通过</el-tag>
             <el-tag v-else-if="scope.row.bizFlowState=='3'" type="danger">已拒绝</el-tag>
             <el-tag v-else-if="scope.row.bizFlowState=='4'" type="danger">已取消</el-tag>
             {{scope.row.assigneeName}}&nbsp;&nbsp;{{scope.row.commentMsg}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="cpName" show-overflow-tooltip label="相对方名称" min-width="80"></el-table-column>
      </el-table>

      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>

      <!--编辑 ContractCard ht_contract_card界面-->
      <el-dialog title="编辑ht_contract_card" :visible.sync="editFormVisible" width="50%" :close-on-click-modal="false" append-to-body>
        <contract-card-edit :contract-card="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
          @submit="afterEditSubmit"></contract-card-edit>
      </el-dialog>

      <!--新增 ContractCard ht_contract_card界面-->
      <el-dialog title="新增ht_contract_card" :visible.sync="addFormVisible" width="50%" :close-on-click-modal="false" append-to-body>
        <contract-card-add :contract-card="addForm" :visible="addFormVisible" @cancel="addFormVisible=false"
          @submit="afterAddSubmit"></contract-card-add>
      </el-dialog>

      <div class="tempDialog">
        <el-dialog :visible.sync="detailFormVisible" :fullscreen="true" :close-on-click-modal="false" append-to-body>
          <contract-card-detail :contract-card="detailForm" :visible="detailFormVisible"
            @cancel="detailFormVisible=false" @submit="afterDetailSubmit"></contract-card-detail>
        </el-dialog>
      </div>
      <el-drawer fullscreen size="100%" title="任务详情" :visible.sync="flowTaskDetailVisible" :withHeader="false"
        :close-on-click-modal="false">
        <procinst-parames-execution-set v-if="tasks.length>0" :taskInfo="tasks[0]" :procDefId="tasks[0].procDefId" :procInstId="tasks[0].procInstId"
          :visible="flowTaskDetailVisible" @cancel="flowTaskDetailVisible=false" @submit="afterFlowSubmit">
        </procinst-parames-execution-set>
      </el-drawer>
      
      <el-dialog append-to-body width="60%" :visible.sync="counterpartyVisible">
        <counterparty-components @row-click="getCounterparty" :visible="counterpartyVisible"></counterparty-components>
      </el-dialog>

    <el-dialog
      append-to-body
      title="选择部门"
      :visible.sync="deptSelectVisible"
      width="60%"
    >
      <dept-tree
        :show-confirm="true"
        show-root
        default-expand-all
        show-checkbox
        multiple
        :expand-on-click-node="false"
        @confirm="onDeptsSelected"
      ></dept-tree>
    </el-dialog>
    </el-row>
  </section>
</template>

<script>
  import util from '@/common/js/util'; //全局公共库
  //import Sticky from '@/components/Sticky' // 粘性header组件
  //import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
  import {
    listContractCard,
    delContractCard,
    batchDelContractCard,
    computeAmount
  } from '@/api/oa/ht/contractCard';
  import ContractCardEdit from './ContractCardEdit'; //修改界面
  import ContractCardDetail from './ContractCardDetail'; //合同卡片明细
  import ContractTypeSelect from '../contractType/ContractTypeSelect'; //合同卡片明细
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
  import ProcinstParamesExecutionSet from "@/views/mdp/workflow/ru/procinstParames/ProcinstParamesExecutionSet"; // 流程参数加载

  import CounterpartyComponents from '../components/CounterpartyComponents';
  import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue";

  import {
    listAssigneeToAnyTasks
  } from "@/api/mdp/workflow/ru/task";

  import {
    listProcinst
  } from "@/api/mdp/workflow/hi/procinst";

  import {
    mapGetters
  } from 'vuex'

  export default {
    props:['cpId'],
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    data() {
      return {
        filters: {
          key: '',
          htType:'',
          htStatus:'',
          cbCenterNames:'',
          cbCenterIds:'',
          cpName:'',
          cpId:'',
          htSignDateScope:[],
        },
        contractCards: [], //查询结果
        pageInfo: { //分页数据
          total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
          pageSize: 10, //每页数据
          count: false, //是否需要重新计算总记录数
          pageNum: 1, //当前页码、从1开始计算
          orderFields: ['create_time'], //排序列 如 ['sex','student_id']，必须为数据库字段
          orderDirs: ['desc'] //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
        },
        load: {
          list: false,
          edit: false,
          del: false,
          add: false
        }, //查询中...
        sels: [], //列表选中数据
        dicts: {contractStatus:[]}, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

        addFormVisible: false, //新增contractCard界面是否显示
        //新增contractCard界面初始化数据
        addForm: {
          htId: '',
          draftId: '',
          cpId: '',
          cpName: '',
          linkName: '',
          linkPhone: '',
          cpAddress: '',
          cpOpenBank: '',
          cpBankAccount: '',
          htName: '',
          htSn: '',
          htGrossAmount: '',
          htKaiPiaoAmount: '',
          htReceivedAmount: '',
          htReceivableAmount: '',
          htPayedAmount: '',
          htPayableAmount: '',
          htFile: '',
          htEffectDate: '',
          htFzUserid: '',
          htFzUsername: '',
          htParentType: '',
          htType: '',
          htSignDate: '',
          htExpireDate: '',
          htStatus: '',
          htDemand: '',
          htParty: '',
          htPartyName: '',
          htImportantClause: '',
          branchId: '',
          createTime: '',
          createUserId: '',
          createUserName: ''
        },

        editFormVisible: false, //编辑界面是否显示
        //编辑contractCard界面初始化数据
        editForm: {
          htId: '',
          draftId: '',
          cpId: '',
          cpName: '',
          linkName: '',
          linkPhone: '',
          cpAddress: '',
          cpOpenBank: '',
          cpBankAccount: '',
          htName: '',
          htSn: '',
          htGrossAmount: '',
          htKaiPiaoAmount: '',
          htReceivedAmount: '',
          htReceivableAmount: '',
          htPayedAmount: '',
          htPayableAmount: '',
          htFile: '',
          htEffectDate: '',
          htFzUserid: '',
          htFzUsername: '',
          htParentType: '',
          htType: '',
          htSignDate: '',
          htExpireDate: '',
          htStatus: '',
          htDemand: '',
          htParty: '',
          htPartyName: '',
          htImportantClause: '',
          branchId: '',
          createTime: '',
          createUserId: '',
          createUserName: ''
        },

        detailFormVisible: false, //编辑界面是否显示

        //编辑contractCard界面初始化数据
        detailForm: {
          htId: '',
          draftId: '',
          cpId: '',
          cpName: '',
          linkName: '',
          linkPhone: '',
          cpAddress: '',
          cpOpenBank: '',
          cpBankAccount: '',
          htName: '',
          htSn: '',
          htGrossAmount: '',
          htKaiPiaoAmount: '',
          htReceivedAmount: '',
          htReceivableAmount: '',
          htPayedAmount: '',
          htPayableAmount: '',
          htFile: '',
          htEffectDate: '',
          htFzUserid: '',
          htFzUsername: '',
          htParentType: '',
          htType: '',
          htSignDate: '',
          htExpireDate: '',
          htStatus: '',
          htDemand: '',
          htParty: '',
          htPartyName: '',
          htImportantClause: '',
          branchId: '',
          createTime: '',
          createUserId: '',
          createUserName: ''
        },

        /**begin 自定义属性请在下面加 请加备注**/ 

        /**end 自定义属性请在上面加 请加备注**/
        amountObj: {
          //未激活金额
          inactiveAmount: 0,
          //履行中的金额
          fulfilAmount: 0,
          //暂停合同的金额
          pauseAmount: 0,
          //解除合同的金额
          relieveAmount: 0,
          //开票金额
          kaiPiaoAmount: 0,
          //收款金额
          receiveAmount: 0
        },
        tableHeight: 300,
        tasks:[],
        flowTaskDetailVisible:false,
        deptSelectVisible:false,
        counterpartyVisible:false,
        pickerOptions:util.pickerOptions('datarange')
      }
    }, //end data
    methods: {
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize;
        this.getContractCards();
      },
      handleCurrentChange(pageNum) {
        this.pageInfo.pageNum = pageNum;
        this.getContractCards();
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
        this.getContractCards();
      },
      searchContractCards() {
        this.pageInfo.count = true;
        this.getContractCards();
      },
      //获取列表 ContractCard ht_contract_card
      getContractCards() {
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
          params.key=this.filters.key
        }  
        
        if (this.filters.htStatus !== "") {
          params.htStatus=this.filters.htStatus
        }  
        
        if (this.filters.htType !== "") {
          params.htType=this.filters.htType
        } 
        if(this.filters.cpId){
          params.cpId=this.filters.cpId
        }
        if(this.cpId){
          params.cpId=this.cpId
        }  
        var cbCenterIds=this.filters.cbCenterIds;
        if(cbCenterIds.length>0){
          params.cbCenterIds=cbCenterIds;
        }
        if(this.filters.htSignDateScope && this.filters.htSignDateScope.length==2){
          params.startHtSignDate=this.filters.htSignDateScope[0]
          params.endHtSignDate=this.filters.htSignDateScope[1]
        }
        this.load.list = true;
        listContractCard(params).then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.contractCards = res.data.data;
          } else {
            this.$message({
              message: tips.msg,
              type: 'error'
            });
          }
          this.load.list = false;
        }).catch(err => this.load.list = false);
      },

      getComputeAmount() {
        let params = {};
        computeAmount(params).then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.amountObj=res.data.data
          } else {
            this.$message({
              message: tips.msg,
              type: 'error'
            });
          }
          this.load.list = false;
        }).catch(err => this.load.list = false);
      },


      //显示编辑界面 ContractCard ht_contract_card
      showEdit: function(row, index) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      //显示新增界面 ContractCard ht_contract_card
      showAdd: function() {
        this.addFormVisible = true;
        //this.addForm=Object.assign({}, this.editForm);
      },

      showDetail: function(row, index) {
        this.detailFormVisible = true;
        this.detailForm = Object.assign({}, row);
      },

      gotoTitle() {


      },

      afterAddSubmit() {
        this.addFormVisible = false;
        this.pageInfo.count = true;
        this.getContractCards();
      },
      afterEditSubmit() {
        this.editFormVisible = false;
      },

      afterDetailSubmit() {
        this.detailFormVisible = false;
      },

      //选择行contractCard
      selsChange: function(sels) {
        this.sels = sels;
      },
      //删除contractCard
      handleDel: function(row, index) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.del = true;
          let params = {
            htId: row.htId
          };
          delContractCard(params).then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getContractCards();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? 'success' : 'error'
            });
          }).catch(err => this.load.del = false);
        });
      },
      //批量删除contractCard
      batchDel: function() {
        if(this.sels.some(i=>i.htStatus!='0' && i.htStatus!='4')){
          this.$message({
              message: "只能删除初始、未激活的合同",
              type: 'error'
            });
            return;
        }
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.del = true;
          batchDelContractCard(this.sels).then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getContractCards();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? 'success' : 'error'
            });
          }).catch(err => this.load.del = false);
        });
      },
      rowClick: function(row, event, column) {
        this.$emit('row-click', row, event, column); //  @row-click="rowClick"
      },
      /**begin 自定义函数请在下面加**/
      //跳转详细页面
      gotoDetail(row) {
        this.showDetail(row);
      },
      showFlowTaskDetail(row){
        if(row.bizProcInstId){
          if(row.bizFlowState=='1'){
            var params={
              procInstId:row.bizProcInstId, 
              assignee:this.userInfo.userId,
              tenantId:this.userInfo.branchId,
            }
            this.load.list=true;
            listAssigneeToAnyTasks(params)
                .then(res => {
                  var tips = res.data.tips;
                  if (tips.isOk) { 
                    var taskList = res.data.data;
                    taskList.forEach(i => {
                      i.taskId = i.id;
                      i.actId = i.taskDefKey;
                      i.taskName = i.name;
                    });
                    this.tasks = taskList; 
                    this.flowTaskDetailVisible=true;
                  } else {
                    this.$message({showClose: true,
                      message: tips.msg,
                      type: "error"
                    });
                  }
                  this.load.list = false;
                })
                .catch(() => {
                  this.load.list = false;
                });
          }else{
            var params={
              procInstId:row.bizProcInstId,  
            }
            this.load.list=true;
            listProcinst(params)
                .then(res => {
                  var tips = res.data.tips;
                  if (tips.isOk) { 
                    var taskList = res.data.data; 
                    this.tasks = taskList; 
                    this.flowTaskDetailVisible=true;
                  } else {
                    this.$message({showClose: true,
                      message: tips.msg,
                      type: "error"
                    });
                  }
                  this.load.list = false;
                })
                .catch(() => {
                  this.load.list = false;
                });

          }
          
        }else{

        }
        
      },
      afterFlowSubmit(){ 
        this.flowTaskDetailVisible=false;
        this.searchContractCards();
      },
      onDeptsSelected(nodes) {
        if (nodes == null || nodes.length == 0) {
          this.filters.cbCenterIds = [];
          this.filters.cbCenterNames = "";
        } else {
          this.filters.cbCenterIds = nodes.map((i) => i.deptid);
          this.filters.cbCenterNames = nodes.map((i) => i.deptName).join(",");
        }
        this.deptSelectVisible = false;
        this.searchContractCards();
      },
      
      getCounterparty(data) {
         this.counterpartyVisible = false;
         this.filters.cpId = data.cpId;
         this.filters.cpName = data.cpName; 
         this.searchContractCards();
      },
      onFiltersCpNameChange(val){
        if(!val){
          this.filters.cpId=''
        }
      }
      /**end 自定义函数请在上面加**/

    }, //end methods
    components: {
      'contract-card-edit': ContractCardEdit,
      'contract-card-detail': ContractCardDetail,
      ContractTypeSelect,
      ProcinstParamesExecutionSet,
      DeptTree,
      CounterpartyComponents,
      //在下面添加其它组件
    },
    mounted() {
      initSimpleDicts('all',['costType','amountType','productType','contractStatus']).then(res=>this.dicts=res.data.data); 
      this.$nextTick(() => {
        this.getContractCards();
        if(!this.cpId){
          this.getComputeAmount();
        } 
        var table=document.querySelector('.el-table');
        var top=util.getPositionTop(table)
        this.tableHeight = window.innerHeight - top -60;
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

<style scoped>
  ul {
    margin: 0;
    padding: 0;
  }

  ul li {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .info {
    width: 100%; 
  }

  .info ul {
    display: flex;
    justify-content: center;
    margin: 20px;
  }

  .info ul li {
    flex: 1;
    margin-right: 10px;
    border-radius: 8px;
    transition: all 0.5s;
    background-color: #DCDFE6;
  }

  .info ul li h2 {
    font-size: 14px;
    text-align: center;
  }

  .info ul li p {
    text-align: center;
    font-size: 12px;
  }

  .tempDialog .el-dialog {
    width: 100%;
    height: 100%;
    -webkit-box-shadow: none !important;
    margin-top: 0 !important;
    position: relative;
    margin: 0 auto 0px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
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
  .info ul {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    margin: 20px;
    margin-bottom: 0;
  }
</style>
