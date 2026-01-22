<template>
  <section class="page-container border padding">
    <el-row>
      <el-input v-model="filters.purOrderId" style="width: 20%;" placeholder="采购单编号" clearable>
        <template slot="append">
          <el-button @click="orderSelectVisible=true">选择</el-button>
        </template>
      </el-input>
      <el-input v-model="filters.key" style="width: 20%;" placeholder="资产名称 模糊查询" clearable @clear="handleClear"
                @keyup.enter.native="searchOnEnter"></el-input>
      <el-button v-loading="load.list" :disabled="load.list==true" @click="searchOrderDetails" icon="el-icon-search">
        查询
      </el-button>
      <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true"
                 icon="el-icon-delete"></el-button>
    </el-row>
    <el-row class="padding-top">
      <!--列表 OrderDetail pur_order_detail-->
      <el-table ref="orderDetailTable" :data="orderDetails" :height="maxTableHeight" @sort-change="sortChange"
                highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick"
                style="width: 100%;">
        <el-table-column type="selection" width="55" show-overflow-tooltip></el-table-column>
        <el-table-column sortable type="index" width="55" show-overflow-tooltip></el-table-column>
        <el-table-column label="采购信息">
          <el-table-column prop="purOrderId" label="采购单编号" min-width="80" show-overflow-tooltip></el-table-column>
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
          <el-table-column prop="assetName" label="资产名称" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="assetSn" label="资产编码" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="categoryId" label="资产类别" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="brandName" label="品牌名称" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="supplierName" label="供应商" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="assetNo" label="资产序列号" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="spec" label="规格型号" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="measUnit" label="计量单位" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="stockNum" label="采购数量" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="servLife" label="使用期限" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="purchaseUserid" label="采购人" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="purchaseUsername" label="采购人名称" min-width="80"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="purchaseDate" label="采购时间" min-width="80" show-overflow-tooltip></el-table-column>

        </el-table-column>
        <el-table-column label="入库信息">
          <el-table-column prop="reachNum" label="到达数量" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="storeAddress" label="存放地点" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="warehouseDate" label="入库日期" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="confDesc" label="配置说明" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="remark" label="备注" min-width="80" show-overflow-tooltip></el-table-column>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template scope="scope">
            <el-button type="text" @click="showRequireDetail( scope.row,scope.$index)" icon="el-icon-edit">申购清单
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
      <!--编辑 OrderDetail pur_order_detail界面-->
      <el-dialog title="编辑采购单" :visible.sync="editFormVisible" fullscreen append-to-body
                 :close-on-click-modal="false">
        <order-edit :order="order" op-type="edit" :visible="editFormVisible" @cancel="editFormVisible=false"
                    @submit="afterEditSubmit"></order-edit>
      </el-dialog>

      <!--新增 OrderDetail pur_order_detail界面-->
      <el-drawer title="新增pur_order_detail" :visible.sync="addFormVisible" size="60%" append-to-body
                 :close-on-click-modal="false">
        <order-detail-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false"
                           @submit="afterAddSubmit"></order-detail-edit>
      </el-drawer>

      <el-dialog title="申购清单" :visible.sync="requireDetailVisible" fullscreen append-to-body
                 :close-on-click-modal="false">
        <require-detail-mng :order-detail-id="editForm.id" :visible="requireDetailVisible"
                            @cancel="requireDetailVisible=false" @submit="afterAddSubmit"></require-detail-mng>
      </el-dialog>

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
import {listOrderDetail, delOrderDetail, batchDelOrderDetail} from '@/api/oa/erp/pur/orderDetail';
import OrderEdit from '../order/OrderAdd';//新增修改界面
import OrderSelect from '../order/OrderSelect';//新增修改界面
import RequireDetailMng from '../requireDetail/RequireDetailMng';//新增修改界面
import {mapGetters} from 'vuex'
import {showFlowTaskDetail} from '@/api/oa/erp/ass/assUtil';

import ProcinstParamesExecutionSet from "@/views/mdp/workflow/ru/procinstParames/ProcinstParamesExecutionSet"; // 流程参数加载

export default {
  name: 'orderDetailMng',
  components: {
    OrderEdit, RequireDetailMng, OrderSelect,
    ProcinstParamesExecutionSet,
  },
  props: ['visible'],
  computed: {
    ...mapGetters(['userInfo']),

  },
  watch: {
    visible(val) {
      if (val == true) {
        this.initData();
        this.searchOrderDetails()
      }
    }
  },
  data() {
    return {
      filters: {
        key: '',
        purOrderId: '',
      },
      orderDetails: [],//查询结果
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
      addFormVisible: false,//新增orderDetail界面是否显示
      addForm: {
        assetSn: '',
        categoryId: '',
        assetNo: '',
        spec: '',
        measUnit: '',
        orignUnitAmount: '',
        servLife: '',
        branchId: '',
        deptid: '',
        storeAddress: '',
        personLiableUserid: '',
        purchaseUserid: '',
        purchaseUsername: '',
        purchaseDate: '',
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
        reachNum: '',
        warehouseId: '',
        productId: '',
        productSn: '',
        brandId: '',
        brandName: '',
        requireId: '',
        purOrderId: '',
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
        orignUnitAmount: '',
        servLife: '',
        branchId: '',
        deptid: '',
        storeAddress: '',
        personLiableUserid: '',
        purchaseUserid: '',
        purchaseUsername: '',
        purchaseDate: '',
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
        reachNum: '',
        warehouseId: '',
        productId: '',
        productSn: '',
        brandId: '',
        brandName: '',
        requireId: '',
        purOrderId: '',
        id: '',
        assetDetailId: ''
      },
      maxTableHeight: 300,
      requireDetailVisible: false,
      order: null,
      orderSelectVisible: false,


      flowTaskDetailVisible: false,
      tasks: [],
    }
  },//end data
  methods: {
    handleClear() {
      this.searchOrderDetails();
    },
    searchOnEnter() {
      this.searchOrderDetails();
    },
    afterFlowSubmit() {
      this.getStockInDetails();
    },
    showFlowTaskDetail(row) {
      showFlowTaskDetail(this, row);
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getOrderDetails();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getOrderDetails();
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
      this.getOrderDetails();
    },
    searchOrderDetails() {
      this.pageInfo.count = true;
      this.getOrderDetails();
    },
    //获取列表 OrderDetail pur_order_detail
    getOrderDetails() {
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
      if (this.filters.purOrderId) {
        params.purOrderId = this.filters.purOrderId
      }

      this.load.list = true;
      listOrderDetail(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.pageInfo.total = res.data.total;
          this.pageInfo.count = false;
          this.orderDetails = res.data.data;
        } else {
          this.$message({showClose: true, message: tips.msg, type: 'error'});
        }
        this.load.list = false;
      }).catch(err => this.load.list = false);
    },

    //显示编辑界面 OrderDetail pur_order_detail
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
      var order = {...row}
      order.id = row.purOrderId
      this.order = order
    },
    showRequireDetail(row) {
      this.requireDetailVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 OrderDetail pur_order_detail
    showAdd: function () {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getOrderDetails();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
    },
    //选择行orderDetail
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除orderDetail
    handleDel: function (row, index) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        let params = {id: row.id};
        delOrderDetail(params).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getOrderDetails();
          }
          this.$message({showClose: true, message: tips.msg, type: tips.isOk ? 'success' : 'error'});
        }).catch(err => this.load.del = false);
      });
    },
    //批量删除orderDetail
    batchDel: function () {

      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        batchDelOrderDetail(this.sels).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getOrderDetails();
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
      this.orderSelectVisible = false;
      this.filters.purOrderId = row.id
      this.searchOrderDetails();
    }

  },//end methods
  mounted() {
    this.$nextTick(() => {
      //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
      this.initData()
      this.searchOrderDetails();
      var table = document.querySelector('.el-table');
      var top = util.getPositionTop(table)
      this.maxTableHeight = window.innerHeight - top - 60;

    });
  }
}

</script>

<style scoped>
</style>
