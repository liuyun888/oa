<template>
  <section class="page-container border padding">
    <el-row>
      <el-col :span="12">
        <el-input size="small" v-model="filters.categoryNames" @focus="categoryTreeVisible=true" style="width: 45%;"
                  placeholder="资产分类"/>
        <el-input v-model="filters.assetNameLike" size="small" style="width: 45%;"
                  placeholder="资产编码或者名称"/>
      </el-col>

      <el-col :span="12">
        <el-input size="small" v-model="filters.cbCenterNames" @focus="cbCenterSelectVisible = true" style="width: 45%;"
                  placeholder="请选择成本中心"/>
        <el-input size="small" v-model="filters.useDeptNames" @focus="deptSelectVisible = true" style="width: 45%;"
                  placeholder="请选择使用部门"/>
      </el-col>

    </el-row>
    <el-row>
      <el-col :span="12">
        <el-input size="small" style="width: 45%;" v-model="personLiableUserName" clearable placeholder="责任人">
          <i @click="openUserSelect" slot="suffix" class="el-icon-s-custom"></i>
        </el-input>
        <el-input size="small" style="width: 45%;" v-model="warehouseName" clearable placeholder="存放地点">
          <i @click="openWarehouseSelect" slot="suffix" class="el-icon-menu"></i>
        </el-input>
      </el-col>
      <el-col :span="12">
        <el-input size="small" v-model="filters.key" style="width: 45%;" placeholder="序列号｜编码｜名称, 模糊查询"
                  clearable @clear="handleClear" @keyup.enter.native="searchOnEnter"></el-input>
        <el-button size="small" v-loading="load.list" :disabled="load.list==true" @click="searchAssetDetails"
                   icon="el-icon-search">查询
        </el-button>
        <el-button size="small" type="primary" @click="showAdd" icon="el-icon-plus"></el-button>
        <el-button size="small" type="danger" v-loading="load.del" @click="batchDel"
                   :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete"></el-button>
      </el-col>

    </el-row>
    <el-row class="padding-top">
      <!--列表 AssetDetail ass_asset_detail-->
      <el-table ref="assetDetailTable" :data="assetDetails" :height="maxTableHeight" @sort-change="sortChange"
                highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick"
                style="width: 100%;">
        <el-table-column type="selection" width="55" show-overflow-tooltip></el-table-column>
        <el-table-column prop="assetImageUrl" min-width="100">
          <template slot-scope="scope">
            <img
                v-if="!!scope.row.assetImageUrl"
                :src="scope.row.assetImageUrl"
                style="max-width: 100px; max-height: 100px"
            />
            <img
                v-else
                src="../assetCard/defaulthead.jpg"
                style="max-width: 100px; max-height: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="assetSn" label="资产编码" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="assetName" label="资产名称" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="assetNo" label="序列号" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="categoryName" label="类别" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brandName" label="品牌名称" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="spec" label="规格型号" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="measUnit" label="计量单位" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orignUnitAmount" label="资产原值" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="servLife" label="使用期限" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="startUseDate" label="开始使用日期" min-width="80"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="deptName" label="使用部门" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="personLiableUserid" label="责任人" min-width="80"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="warehouseName" label="仓库名称" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="storeAddress" label="存放地点" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="defectsLiabilityPeriod" label="保修期（月）" min-width="80"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="confDesc" label="配置说明" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="备注" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="supplierName" label="供应商" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="stockNum" label="数量" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot="header">
            <el-button @click="showAdd" icon="el-icon-plus" circle></el-button>
          </template>
          <template scope="scope">
            <el-button type="text" @click="createCardClick( scope.row,scope.$index)">创建卡片</el-button>
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

      <!--编辑 AssetDetail ass_asset_detail界面-->
      <el-dialog :title="editForm.assetName" :visible.sync="detailShowVisible" fullscreen append-to-body
                 :close-on-click-modal="false">
        <asset-detail-show :asset-detail="editForm" :visible="detailShowVisible" @cancel="detailShowVisible=false"
                           @submit="afterEditSubmit"></asset-detail-show>
      </el-dialog>

      <!--新增 AssetDetail ass_asset_detail界面-->
      <el-drawer title="新增资产" :visible.sync="addFormVisible" size="60%" append-to-body
                 :close-on-click-modal="false">
        <asset-detail-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false"
                           @submit="afterAddSubmit"></asset-detail-edit>
      </el-drawer>

      <el-dialog append-to-body title="人员选择" width="70%" top="5vh" :visible.sync="visibleUserSelect">
        <users-select @confirm="getUserData" :isSingleUser="true"></users-select>
      </el-dialog>

      <el-dialog append-to-body title="仓库选择" width="70%" top="5vh" :visible.sync="visibleWarehouseSelect">
        <warehouse-components @row-click="getWarehouseData"></warehouse-components>
      </el-dialog>

      <el-dialog append-to-body title="资产类别选择" width="70%" top="5vh" :visible.sync="categoryTreeVisible">
        <asset-category-tree show-checkbox @confirm="onCategoryTreeCheckChange" :show-confirm="true"
                             ref="categoryTreeRef"></asset-category-tree>
      </el-dialog>

      <el-dialog append-to-body title="选择使用部门" :visible.sync="deptSelectVisible" width="60%">
        <dept-tree :show-confirm="true" show-root default-expand-all show-checkbox multiple
                   :expand-on-click-node="false"
                   @confirm="onDeptsSelected"/>
      </el-dialog>


      <el-dialog append-to-body title="选择成本中心" :visible.sync="cbCenterSelectVisible" width="60%">
        <dept-tree :show-confirm="true" show-root default-expand-all show-checkbox multiple
                   :expand-on-click-node="false" @confirm="onCbCenterSelected"></dept-tree>
      </el-dialog>
      <el-dialog title="新增卡片" center :fullscreen="true" :visible.sync="assetCardAddVisible"
                 :close-on-click-modal="false" append-to-body>
        <asset-card-add :asset-type="{}" :asset-card="editForm" :asset-detail="editForm"
                        :visible="assetCardAddVisible" @cancel="assetCardAddVisible = false"
                        @submit="assetCardAddVisible = false"></asset-card-add>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
import util from '@/common/js/util';//全局公共库
import config from '@/common/config';//全局公共库
import {getDicts, initSimpleDicts, initComplexDicts} from '@/api/mdp/meta/item';//字典表
import {listAssetDetail, delAssetDetail, batchDelAssetDetail} from '@/api/oa/erp/ass/assetDetail';
import AssetDetailEdit from './AssetDetailEdit';//新增修改界面
import {mapGetters} from 'vuex'
import UsersSelect from '@/views/mdp/sys/user/UsersSelect';
import WarehouseComponents from '../../stk/components/WarehouseComponents';
import AssetCategoryTree from '../components/AssetCategoryTree';
import AssetDetailShow from './AssetDetailShow.vue';
import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue";
import AssetCardAdd from "../assetCard/AssetCardAdd";

export default {
  name: 'assetDetailMng',
  components: {
    AssetDetailEdit, UsersSelect, WarehouseComponents, AssetCategoryTree, AssetCardAdd,
    AssetDetailShow, DeptTree,
  },
  props: ['visible'],
  computed: {
    ...mapGetters(['userInfo']),

  },
  watch: {
    visible(val) {
      if (val == true) {
        this.initData();
        this.searchAssetDetails()
      }
    },
    'warehouseName': function () {
      if (this.warehouseName === '' || this.warehouseName === null) {
        this.filters.warehouseId = '';
      }
    },

    'personLiableUserName': function () {
      if (this.personLiableUserName === '' || this.personLiableUserName === null) {
        this.filters.personLiableUserid = '';
      }
    },
  },
  data() {
    return {
      filters: {
        key: '',
        categoryIds: '',
        categoryNames: '',
        assetNameLike: '',
        personLiableUserid: '',
        warehouseId: '',
        useDeptNames: '',
        useDeptids: '',
        cbCenterIds: '',
        cbCenterNames: ''
      },
      assetDetails: [],//查询结果
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
      addFormVisible: false,//新增assetDetail界面是否显示
      addForm: {
        id: '',
        assetSn: '',
        categoryId: '',
        categoryName: '',
        assetNo: '',
        spec: '',
        measUnit: '',
        orignUnitAmount: '',
        servLife: '',
        branchId: '',
        deptid: '',
        deptName: '',
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
        createUsername: '',
        lastEditUserid: '',
        lastEditTime: '',
        lastEditUsername: '',
        receiptNo: '',
        supplierName: '',
        assetName: '',
        stockNum: '',
        warehouseId: '',
        warehouseName: '',
        productId: '',
        productSn: '',
        brandId: '',
        brandName: ''
      },

      editFormVisible: false,//编辑界面是否显示
      editForm: {
        id: '',
        assetSn: '',
        categoryId: '',
        categoryName: '',
        assetNo: '',
        spec: '',
        measUnit: '',
        orignUnitAmount: '',
        servLife: '',
        branchId: '',
        deptid: '',
        deptName: '',
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
        createUsername: '',
        lastEditUserid: '',
        lastEditTime: '',
        lastEditUsername: '',
        receiptNo: '',
        supplierName: '',
        assetName: '',
        stockNum: '',
        warehouseId: '',
        warehouseName: '',
        productId: '',
        productSn: '',
        brandId: '',
        brandName: ''
      },
      maxTableHeight: 300,
      categoryTreeVisible: false,
      warehouseName: '',
      personLiableUserName: '',
      visibleWarehouseSelect: false,
      visibleUserSelect: false,
      detailShowVisible: false,
      cbCenterSelectVisible: false,
      deptSelectVisible: false,
      assetCardAddVisible: false,
    }
  },//end data
  methods: {
    test(option) {
      console.log("test:", option)
    },
    handleClear() {
      this.searchAssetDetails()
    },
    searchOnEnter() {
      this.searchAssetDetails()
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getAssetDetails();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getAssetDetails();
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
      this.getAssetDetails();
    },
    searchAssetDetails() {
      this.pageInfo.count = true;
      this.getAssetDetails();
    },
    //获取列表 AssetDetail ass_asset_detail
    getAssetDetails() {
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
      if (this.filters.categoryIds) {
        params.categoryIds = this.filters.categoryIds;
      }

      if (this.filters.cbCenterIds) {
        params.cbCenterIds = this.filters.cbCenterIds;
      }
      if (this.filters.useDeptids) {
        params.useDeptids = this.filters.useDeptids;
      }
      if (this.filters.assetNameLike) {
        params.assetNameLike = this.filters.assetNameLike
      }
      this.load.list = true;
      listAssetDetail(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.pageInfo.total = res.data.total;
          this.pageInfo.count = false;
          this.assetDetails = res.data.data;
        } else {
          this.$message({showClose: true, message: tips.msg, type: 'error'});
        }
        this.load.list = false;
      }).catch(err => this.load.list = false);
    },

    //显示编辑界面 AssetDetail ass_asset_detail
    showEdit: function (row, index) {
      this.detailShowVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 AssetDetail ass_asset_detail
    showAdd: function () {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getAssetDetails();
    },
    afterEditSubmit() {
      this.detailShowVisible = false;
    },
    //选择行assetDetail
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除assetDetail
    handleDel: function (row, index) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        let params = {id: row.id};
        delAssetDetail(params).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getAssetDetails();
          }
          this.$message({showClose: true, message: tips.msg, type: tips.isOk ? 'success' : 'error'});
        }).catch(err => this.load.del = false);
      });
    },
    //批量删除assetDetail
    batchDel: function () {

      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        batchDelAssetDetail(this.sels).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getAssetDetails();
          }
          this.$message({showClose: true, message: tips.msg, type: tips.isOk ? 'success' : 'error'});
        }).catch(err => this.load.del = false);
      });
    },
    rowClick: function (row, event, column) {
      this.editForm = row;
      if (event.label != '操作' && event.type != 'selection') {
        this.detailShowVisible = true;
      }
      this.$emit('row-click', row, event, column);//  @row-click="rowClick"
    },
    initData: function () {

    },
    onCategoryTreeCheckChange(nodes) {
      console.log("node:", nodes);
      if (!nodes || nodes.length == 0) {
        this.filters.categoryIds = ""
        this.filters.categoryNames = ""
      } else {
        this.filters.categoryNames = nodes.map(i => i.categoryName).join(",")
        this.filters.categoryIds = nodes.map(i => i.categoryId).join(",")
      }
      this.categoryTreeVisible = false;
      this.searchAssetDetails();
    },

    openUserSelect() {
      this.visibleUserSelect = true;
    },

    //获取用户数据
    getUserData(data) {
      this.filters.personLiableUserid = data[0].userid;
      this.personLiableUserName = data[0].username;
      this.visibleUserSelect = false;
    },

    openWarehouseSelect() {
      this.visibleWarehouseSelect = true;
    },

    //打开仓库选择
    getWarehouseData(data) {
      this.filters.warehouseId = data.id;
      this.warehouseName = data.name
      this.visibleWarehouseSelect = false;
    },
    onDeptsSelected(nodes) {
      if (nodes == null || nodes.length == 0) {
        this.filters.useDeptids = [];
        this.filters.useDeptNames = "";
      } else {
        this.filters.useDeptids = nodes.map((i) => i.deptid);
        this.filters.useDeptNames = nodes.map((i) => i.deptName).join(",");
      }
      this.deptSelectVisible = false;
      this.searchAssetDetails();
    },
    onCbCenterSelected(nodes) {
      if (nodes == null || nodes.length == 0) {
        this.filters.cbCenterIds = [];
        this.filters.cbCenterNames = "";
      } else {
        this.filters.cbCenterIds = nodes.map((i) => i.deptid);
        this.filters.cbCenterNames = nodes.map((i) => i.deptName).join(",");
      }
      this.cbCenterSelectVisible = false
      this.searchAssetDetails();
    },
    createCardClick(row) {
      this.editForm = row
      this.assetCardAddVisible = true;
    }

  },//end methods
  mounted() {
    this.$nextTick(() => {
      //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
      this.initData()
      this.searchAssetDetails();
      var table = document.querySelector('.el-table');
      var top = util.getPositionTop(table)
      this.maxTableHeight = window.innerHeight - top - 60;

    });
  }
}

</script>

<style scoped>
</style>
