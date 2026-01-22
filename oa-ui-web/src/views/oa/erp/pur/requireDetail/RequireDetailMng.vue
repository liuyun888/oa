<template>
  <section class="page-container border padding">
    <el-row v-if="!isSelect">
      <el-row v-if="orderDetailId">
        <el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
        <el-button v-loading="load.list" :disabled="load.list==true" @click="searchRequireDetails"
                   icon="el-icon-search">查询
        </el-button>
      </el-row>
      <el-row v-if="!orderDetailId">
        <el-select v-model="filters.hasOrderId" placeholder="是否已加入采购单" clearable>
          <el-option value="0" label="未加入采购单"></el-option>
          <el-option value="1" label="已加入采购单"></el-option>
        </el-select>
        <el-input v-model="filters.key" style="width: 20%;" placeholder="物资名称 模糊查询" clearable
                  @clear="handleClear" @keyup.enter.native="searchOnEnter"></el-input>
        <el-button v-loading="load.list" :disabled="load.list==true" @click="searchRequireDetails"
                   icon="el-icon-search">查询
        </el-button>
        <el-button type="primary" @click="showAdd" icon="el-icon-plus"></el-button>
        <el-button type="danger" v-loading="load.del" @click="batchDel"
                   :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete"></el-button>
      </el-row>
    </el-row>
    <el-row v-else>
      <el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
      <el-button v-loading="load.list" :disabled="load.list==true" @click="searchRequireDetails" icon="el-icon-search">
        查询
      </el-button>
      <el-button type="primary" @click="confirm"> 确认选择</el-button>

    </el-row>
    <el-row class="padding-top">
      <!--列表 RequireDetail pur_require_detail-->
      <el-table ref="requireDetailTable" current-row-key="id" row-key="id" :data="requireDetails"
                :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border
                @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
        <el-table-column type="selection" width="55" show-overflow-tooltip></el-table-column>
        <el-table-column label="申购信息">

          <el-table-column prop="assetImageUrl" label="图片" min-width="100">
            <template slot-scope="scope">
              <img
                v-if="!!scope.row.assetImageUrl"
                :src="scope.row.assetImageUrl"
                style="max-width: 100px; max-height: 100px"
              />
              <img
                v-else
                src="../../ass/assetCard/defaulthead.jpg"
                style="max-width: 100px; max-height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="assetName" label="物资名称" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="bizFlowState" label="审核状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-link @click="showFlowTaskDetail(scope.row)">
                <el-tag v-if="scope.row.bizFlowState == '0'||!scope.row.bizFlowState">未发审</el-tag>
                <el-tag v-if="scope.row.bizFlowState == '1'">审核中</el-tag>
                <el-tag v-if="scope.row.bizFlowState == '2'">已通过</el-tag>
                <el-tag v-if="scope.row.bizFlowState == '5'">待领取</el-tag>
                <el-tag v-if="scope.row.bizFlowState == '4'">已取消</el-tag>
                <el-tag v-if="scope.row.bizFlowState == '3'">未通过</el-tag>
                {{ scope.row.assigneeName }}&nbsp;&nbsp;{{ scope.row.commentMsg }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="reqTitle" label="申购单" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="reqUsername" label="申购人" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="reqDeptName" label="申购部门" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="stockNum" label="申购数量" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="estimatePrice" label="预估价格" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="assetSn" label="资产编码" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="categoryId" label="资产类别" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="spec" label="规格型号" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="measUnit" label="计量单位" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="productId" label="产品编号" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="brandName" label="品牌名称" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="confDesc" label="配置说明" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="suggestArrivalDate" label="建议到货时间" min-width="80"
                           show-overflow-tooltip></el-table-column>


        </el-table-column>
        <el-table-column label="采购信息">
          <el-table-column prop="orderId" label="采购订单" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="supplierName" label="供应商" min-width="80" show-overflow-tooltip></el-table-column>

        </el-table-column>
        <el-table-column label="入库信息">
          <el-table-column prop="warehouseDate" label="入库日期" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="receiptNo" label="入库单号" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="warehouseId" label="仓库编号" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="remark" label="备注" min-width="80" show-overflow-tooltip></el-table-column>

        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right" v-if="!isSelect">
          <template scope="scope">
            <el-button type="text" v-if="!scope.row.orderId" @click="joinToOrderClick( scope.row,scope.$index)"
                       :disabled="scope.row.bizFlowState!='2'" icon="el-icon-edit">加入采购清单
            </el-button>
            <el-button type="text" v-if="scope.row.orderId" @click="unJoinToOrderClick( scope.row,scope.$index)"
                       icon="el-icon-edit">移出采购清单
            </el-button>

            <el-button type="text" @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
            <el-button type="text" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]"
                     :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :total="pageInfo.total"
                     style="float:right;"></el-pagination>
    </el-row>
    <el-row>
      <!--编辑 RequireDetail pur_require_detail界面-->
      <el-dialog title="申购单明细" center :visible.sync="editFormVisible" fullscreen append-to-body
                 :close-on-click-modal="false">
        <require-detail-edit op-type="edit" :pur-require="purRequire" :visible="editFormVisible"
                             @cancel="editFormVisible=false" @submit="afterEditSubmit"></require-detail-edit>
      </el-dialog>

      <!--新增 RequireDetail pur_require_detail界面-->
      <el-drawer title="新增pur_require_detail" :visible.sync="addFormVisible" size="60%" append-to-body
                 :close-on-click-modal="false">
        <require-detail-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false"
                             @submit="afterAddSubmit"></require-detail-edit>
      </el-drawer>

      <el-drawer title="采购单选择" :visible.sync="orderSelectVisible" size="100%" append-to-body
                 :close-on-click-modal="false">
        <order-select :visible="orderSelectVisible" @cancel="orderSelectVisible=false"
                      @row-click="onOrderMngRowClick"></order-select>
      </el-drawer>
      <el-drawer fullscreen size="100%" title="任务详情" :visible.sync="flowTaskDetailVisible" :withHeader="false"
                 :close-on-click-modal="false">
        <procinst-parames-execution-set v-if="tasks.length>0" :taskInfo="tasks[0]" :procDefId="tasks[0].procDefId"
                                        :procInstId="tasks[0].procInstId"
                                        :visible="flowTaskDetailVisible" @cancel="flowTaskDetailVisible=false"
                                        @submit="afterFlowSubmit">
        </procinst-parames-execution-set>
      </el-drawer>
    </el-row>
  </section>
</template>

<script>
import util from '@/common/js/util';//全局公共库
import config from '@/common/config';//全局公共库
import {getDicts, initSimpleDicts, initComplexDicts} from '@/api/mdp/meta/item';//字典表
import {listRequireDetail, delRequireDetail, batchDelRequireDetail} from '@/api/oa/erp/pur/requireDetail';
import {joinToOrder, unJoinToOrder} from '@/api/oa/erp/pur/orderDetail';

import RequireDetailEdit from '../require/RequireAdd';//新增修改界面

import OrderSelect from '../order/OrderSelect';//新增修改界面
import {mapGetters} from 'vuex'
import {showFlowTaskDetail} from '@/api/oa/erp/ass/assUtil';

import ProcinstParamesExecutionSet from "@/views/mdp/workflow/ru/procinstParames/ProcinstParamesExecutionSet"; // 流程参数加载

export default {
  name: 'requireDetailMng',
  components: {
    RequireDetailEdit, OrderSelect,
    ProcinstParamesExecutionSet,
  },
  props: ['visible', 'orderDetailId', 'isSelect'],
  computed: {
    ...mapGetters(['userInfo']),

  },
  watch: {
    visible(val) {
      if (val == true) {
        this.initData();
        this.searchRequireDetails()
      }
    }
  },
  data() {
    return {
      filters: {
        key: '',
        hasOrderId: '0',//是否已加入采购单
      },
      requireDetails: [],//查询结果
      pageInfo: {//分页数据
        total: 0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10,//每页数据
        count: false,//是否需要重新计算总记录数
        pageNum: 1,//当前页码、从1开始计算
        orderFields: [],//排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: []//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: {list: false, edit: false, del: false, add: false},//查询中...
      sels: [],//列表选中数据
      dicts: {
        //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
      },//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
      addFormVisible: false,//新增requireDetail界面是否显示
      addForm: {
        assetSn: '',
        categoryId: '',
        assetNo: '',
        spec: '',
        measUnit: '',
        estimatePrice: '',
        orignUnitAmount: '',
        servLife: '',
        branchId: '',
        deptid: '',
        storeAddress: '',
        liableUserid: '',
        purchaseUserid: '',
        supplierId: '',
        passetSn: '',
        passetName: '',
        defectsLiabilityPeriod: '',
        warehouseDate: '',
        assetStatus: '',
        startUseDate: '',
        inventoryTask: '',
        confDesc: '',
        remark: '',
        assetImageUrl: '',
        createUserid: '',
        createTime: '',
        lastEditUserid: '',
        lastEditTime: '',
        receiptNo: '',
        supplierName: '',
        assetName: '',
        stockNum: '',
        warehouseId: '',
        productId: '',
        productSn: '',
        brandId: '',
        brandName: '',
        requireId: '',
        suggestArrivalDate: '',
        orderDetailId: '',
        orderId: '',
        id: '',
        assetDetailId: ''
      },

      editFormVisible: false,//编辑界面是否显示
      editForm: {
        assetSn: '',
        categoryId: '',
        assetNo: '',
        spec: '',
        measUnit: '',
        estimatePrice: '',
        orignUnitAmount: '',
        servLife: '',
        branchId: '',
        deptid: '',
        storeAddress: '',
        liableUserid: '',
        purchaseUserid: '',
        supplierId: '',
        passetSn: '',
        passetName: '',
        defectsLiabilityPeriod: '',
        warehouseDate: '',
        assetStatus: '',
        startUseDate: '',
        inventoryTask: '',
        confDesc: '',
        remark: '',
        assetImageUrl: '',
        createUserid: '',
        createTime: '',
        lastEditUserid: '',
        lastEditTime: '',
        receiptNo: '',
        supplierName: '',
        assetName: '',
        stockNum: '',
        warehouseId: '',
        productId: '',
        productSn: '',
        brandId: '',
        brandName: '',
        requireId: '',
        suggestArrivalDate: '',
        orderDetailId: '',
        orderId: '',
        id: '',
        assetDetailId: ''
      },
      maxTableHeight: 300,
      purRequire: null,
      orderSelectVisible: false,


      flowTaskDetailVisible: false,
      tasks: [],
    }
  },//end data
  methods: {
    handleClear() {
      this.searchRequireDetails()
    },
    searchOnEnter() {
      this.searchRequireDetails()
    },
    afterFlowSubmit() {
      this.getStockInDetails();
    },
    showFlowTaskDetail(row) {
      showFlowTaskDetail(this, row);
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getRequireDetails();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getRequireDetails();
    },
    // 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
    sortChange(obj) {
      if (obj.order == null) {
        this.pageInfo.orderFields = [];
        this.pageInfo.orderDirs = [];
      } else {
        var dir = 'asc';
        if (obj.order == 'ascending') {
          dir = 'asc'
        } else {
          dir = 'desc';
        }

        this.pageInfo.orderFields = [util.toLine(obj.prop)];
        this.pageInfo.orderDirs = [dir];
      }
      this.getRequireDetails();
    },
    searchRequireDetails() {
      this.pageInfo.count = true;
      this.getRequireDetails();
    },
    //获取列表 RequireDetail pur_require_detail
    getRequireDetails() {
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
      if (this.filters.key) {
        params.key = this.filters.key
      }

      if (this.filters.hasOrderId) {
        params.hasOrderId = this.filters.hasOrderId
      }
      if (this.orderDetailId) {
        params.hasOrderId = "";
        params.orderDetailId = this.orderDetailId
      }
      this.load.list = true;
      listRequireDetail(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.pageInfo.total = res.data.total;
          this.pageInfo.count = false;
          this.requireDetails = res.data.data;
        } else {
          this.$message({showClose: true, message: tips.msg, type: 'error'});
        }
        this.load.list = false;
      }).catch(err => this.load.list = false);
    },

    //显示编辑界面 RequireDetail pur_require_detail
    showEdit: function (row, index) {
      this.editForm = Object.assign({}, row);
      var purRequire = Object.assign({}, row)
      purRequire.id = row.requireId
      this.purRequire = purRequire
      this.editFormVisible = true;
    },
    joinToOrderClick(row) {
      this.editForm = Object.assign({}, row);
      this.$refs.requireDetailTable.toggleRowSelection(row, true);
      this.orderSelectVisible = true;
    },
    unJoinToOrderClick(row) {

      this.editForm = Object.assign({}, row);
      this.$refs.requireDetailTable.toggleRowSelection(row, true);
      var params = this.sels
      unJoinToOrder(params).then(res => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.searchRequireDetails()
        }
        this.$message({showClose: true, message: tips.msg, type: tips.isOk ? 'success' : 'error'});

      })
    },
    //显示新增界面 RequireDetail pur_require_detail
    showAdd: function () {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getRequireDetails();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
    },
    //选择行requireDetail
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除requireDetail
    handleDel: function (row, index) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        let params = {id: row.id};
        delRequireDetail(params).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getRequireDetails();
          }
          this.$message({showClose: true, message: tips.msg, type: tips.isOk ? 'success' : 'error'});
        }).catch(err => this.load.del = false);
      });
    },
    //批量删除requireDetail
    batchDel: function () {

      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        batchDelRequireDetail(this.sels).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getRequireDetails();
          }
          this.$message({showClose: true, message: tips.msg, type: tips.isOk ? 'success' : 'error'});
        }).catch(err => this.load.del = false);
      });
    },
    rowClick: function (row, event, column) {
      if (event.label != '操作' && event.type != 'selection' && event.label != '审核状态') {
        this.showEdit(row)
      }
      this.$emit('row-click', row, event, column);//  @row-click="rowClick"
    },
    initData: function () {

    },
    onOrderMngRowClick(row) {
      if (row.bizFlowState == '1' && row.assignee != this.userInfo.userid) {
        this.$message({showClose: true, message: "该采购单已发审，您无权再添加采购明细", type: 'error'});
        return;
      } else if (row.bizFlowState == '2') {
        this.$message({showClose: true, message: "该采购单已审核通过，您无权再添加采购明细", type: 'error'});
        return;
      }

      var params = {
        purOrderId: row.id,
        requireDetails: this.sels,
      }
      joinToOrder(params).then(res => {

        var tips = res.data.tips;
        if (tips.isOk) {
          this.searchRequireDetails();
          this.orderSelectVisible = false;
        }
        this.$message({showClose: true, message: tips.msg, type: tips.isOk ? 'success' : 'error'});
      })
    },
    confirm() {
      this.$emit("confirm", this.sels)
    }
  },//end methods
  mounted() {
    this.$nextTick(() => {
      //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
      this.initData()
      this.searchRequireDetails();
      var table = document.querySelector('.el-table');
      var top = util.getPositionTop(table)
      this.maxTableHeight = window.innerHeight - top - 60;

    });
  }
}

</script>

<style scoped>
</style>
