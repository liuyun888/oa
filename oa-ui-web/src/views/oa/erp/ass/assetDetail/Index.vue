<template>
  <section class="page-container border padding">
    <el-row>
      <el-col :span="12">
        <el-input size="small" v-model="filters.categoryNames" @focus="categoryTreeVisible=true" style="width: 45%;"
                  placeholder="资产分类"></el-input>

        <el-input v-model="filters.assetName" size="small" style="width: 45%;"
                  placeholder="资产名称查询 输入 *字符* >10 <9 等" clearable
                  title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
      </el-col>
      <el-col :span="12">
        <!--       v-model= cbCenterIds-->
        <mdp-select-dept :width="45+'%'" multiple @change2="onCbCenterSelected" v-model="filters.cbCenterIds"
                         placeholder="请选择成本中心"/>
        <!--       v-model= useDeptids-->
        <mdp-select-dept :width="45+'%'" multiple @change2="onDeptsSelected" v-model="filters.useDeptids"
                         placeholder="请选择使用部门"/>
      </el-col>

      <!--      <el-input v-model="filters.id" style="width: 20%;" placeholder="id查询 输入 *字符* >10 <9 等" clearable-->
      <!--                title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>-->
    </el-row>
    <el-row>
      <el-col :span="12">
        <mdp-select-user size="small" :width="45+'%'" v-model="filters.personLiableUserid" clearable placeholder="责任人">
        </mdp-select-user>
        <el-input size="small" style="width: 45%;" v-model="warehouseName" clearable placeholder="存放地点">
          <i @click="openWarehouseSelect" slot="suffix" class="el-icon-menu"></i>
        </el-input>
      </el-col>
      <el-col :span="12">
        <el-input v-model="filters.assetSn" size="small" style="width: 45%;"
                  placeholder="资产编码查询 输入 *字符* >10 <9 等" clearable
                  title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

        <el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search"
                   type="primary">查询
        </el-button>

        <span v-if="currOpType=='mng'">
                <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary"
                           @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm,title:'新增'})"
                           icon="el-icon-plus"/>
                <el-button
                    :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) || this.sels.length===0 || load.del==true"
                    type="danger" v-loading="load.del" @click="batchDel" icon="el-icon-delete"/>
            </span>
        <span style="float:right;" v-else-if="currOpType=='select' &&  this.multiple==true">
                <el-button :disabled="disabledJudge('selectBtn') || this.sels.length===0" type="primary"
                           @click="selectListConfirm" icon="el-icon-check"/>
            </span>
      </el-col>
    </el-row>

    <el-row>
      <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
      <el-button type="text" icon="el-icon-zoom-out" @click="searchReset()">重置查询</el-button>&nbsp;&nbsp;&nbsp;
    </el-row>

    <el-row>
      <!--列表 AssetDetail ass_asset_detail-->
      <el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas"
                @sort-change="sortChange" highlight-current-row v-loading="load.list" border
                @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
        <el-table-column type="selection" width="55" show-overflow-tooltip fixed="left"
                         v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
        <el-table-column prop="assetImageUrl" min-width="100">
          <template slot-scope="scope">
            <img v-if="!!scope.row.assetImageUrl" :src="scope.row.assetImageUrl"
                 style="max-width: 100px; max-height: 100px"/>
            <img v-else src="../assetCard/defaulthead.jpg" style="max-width: 100px; max-height: 100px"/>
          </template>
        </el-table-column>
        <!--        <el-table-column prop="assetImageUrl" label="资产图片" min-width="120" show-overflow-tooltip col-type="String"-->
        <!--                         v-if="showCol('assetImageUrl')">-->
        <!--          <template slot-scope="scope">-->
        <!--            <mdp-input show-style="tag" v-model="scope.row.assetImageUrl" :maxlength="255"-->
        <!--                       @change="editSomeFields(scope.row,'assetImageUrl',$event)"-->
        <!--                       :disabled="!editable || disabledJudge('assetImageUrl')"/>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column prop="assetSn" label="资产编码" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('assetSn')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.assetSn" :maxlength="50"
                       @change="editSomeFields(scope.row,'assetSn',$event)"
                       :disabled="!editable || disabledJudge('assetSn')"/>
          </template>
        </el-table-column>
        <el-table-column prop="assetName" label="资产名称" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('assetName')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.assetName" :maxlength="50"
                       @change="editSomeFields(scope.row,'assetName',$event)"
                       :disabled="!editable || disabledJudge('assetName')"/>
          </template>
        </el-table-column>
        <el-table-column prop="assetNo" label="资产序列号" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('assetNo')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.assetNo" :maxlength="50"
                       @change="editSomeFields(scope.row,'assetNo',$event)"
                       :disabled="!editable || disabledJudge('assetNo')"/>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="资产类别名称" min-width="120" show-overflow-tooltip
                         col-type="String" v-if="showCol('categoryName')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.categoryName" :maxlength="50"
                       @change="editSomeFields(scope.row,'categoryName',$event)"
                       :disabled="!editable || disabledJudge('categoryName')"/>
          </template>
        </el-table-column>
        <el-table-column prop="brandName" label="品牌名称" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('brandName')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.brandName" :maxlength="50"
                       @change="editSomeFields(scope.row,'brandName',$event)"
                       :disabled="!editable || disabledJudge('brandName')"/>
          </template>
        </el-table-column>
        <el-table-column prop="spec" label="规格型号" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('spec')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.spec" :maxlength="50"
                       @change="editSomeFields(scope.row,'spec',$event)"
                       :disabled="!editable || disabledJudge('spec')"/>
          </template>
        </el-table-column>
        <el-table-column prop="measUnit" label="计量单位" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('measUnit')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.measUnit" :maxlength="50"
                       @change="editSomeFields(scope.row,'measUnit',$event)"
                       :disabled="!editable || disabledJudge('measUnit')"/>
          </template>
        </el-table-column>
        <el-table-column prop="orignUnitAmount" label="资产原值" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('orignUnitAmount')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.orignUnitAmount" :maxlength="50"
                       @change="editSomeFields(scope.row,'orignUnitAmount',$event)"
                       :disabled="!editable || disabledJudge('orignUnitAmount')"/>
          </template>
        </el-table-column>
        <el-table-column prop="servLife" label="使用期限" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('servLife')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.servLife" :maxlength="50"
                       @change="editSomeFields(scope.row,'servLife',$event)"
                       :disabled="!editable || disabledJudge('servLife')"/>
          </template>
        </el-table-column>
        <el-table-column prop="startUseDate" label="开始使用日期" min-width="120" show-overflow-tooltip col-type="Date"
                         v-if="showCol('startUseDate')">
          <template slot-scope="scope">
            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.startUseDate"
                      @change="editSomeFields(scope.row,'startUseDate',$event)" value-format="yyyy-MM-dd HH:mm:ss"
                      format="yyyy-MM-dd" :disabled="!editable || disabledJudge('startUseDate')"/>
          </template>
        </el-table-column>
        <el-table-column prop="deptName" label="使用部门名称" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('deptName')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.deptName" :maxlength="50"
                       @change="editSomeFields(scope.row,'deptName',$event)"
                       :disabled="!editable || disabledJudge('deptName')"/>
          </template>
        </el-table-column>
        <el-table-column prop="personLiableUserid" label="责任人" min-width="120" show-overflow-tooltip
                         col-type="String" v-if="showCol('personLiableUserid')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.personLiableUserid" :maxlength="50"
                       @change="editSomeFields(scope.row,'personLiableUserid',$event)"
                       :disabled="!editable || disabledJudge('personLiableUserid')"/>
          </template>
        </el-table-column>
        <el-table-column prop="warehouseName" label="仓库名称" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('warehouseName')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.warehouseName" :maxlength="50"
                       @change="editSomeFields(scope.row,'warehouseName',$event)"
                       :disabled="!editable || disabledJudge('warehouseName')"/>
          </template>
        </el-table-column>
        <el-table-column prop="storeAddress" label="存放地点" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('storeAddress')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.storeAddress" :maxlength="50"
                       @change="editSomeFields(scope.row,'storeAddress',$event)"
                       :disabled="!editable || disabledJudge('storeAddress')"/>
          </template>
        </el-table-column>
        <el-table-column prop="defectsLiabilityPeriod" label="保修期（月）" min-width="120" show-overflow-tooltip
                         col-type="String" v-if="showCol('defectsLiabilityPeriod')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.defectsLiabilityPeriod" :maxlength="50"
                       @change="editSomeFields(scope.row,'defectsLiabilityPeriod',$event)"
                       :disabled="!editable || disabledJudge('defectsLiabilityPeriod')"/>
          </template>
        </el-table-column>
        <el-table-column prop="confDesc" label="配置说明" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('confDesc')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.confDesc" :maxlength="255"
                       @change="editSomeFields(scope.row,'confDesc',$event)"
                       :disabled="!editable || disabledJudge('confDesc')"/>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('remark')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.remark" :maxlength="255"
                       @change="editSomeFields(scope.row,'remark',$event)"
                       :disabled="!editable || disabledJudge('remark')"/>
          </template>
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('supplierName')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.supplierName" :maxlength="255"
                       @change="editSomeFields(scope.row,'supplierName',$event)"
                       :disabled="!editable || disabledJudge('supplierName')"/>
          </template>
        </el-table-column>
        <el-table-column prop="stockNum" label="总数量(如果有卡片，则=card_stock_num)" min-width="120"
                         show-overflow-tooltip col-type="BigDecimal" v-if="showCol('stockNum')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.stockNum"
                       @change="editSomeFields(scope.row,'stockNum',$event)" :maxlength="10"
                       :disabled="!editable || disabledJudge('stockNum')"/>
          </template>
        </el-table-column>

        <el-table-column label="操作" :width="currOpType=='mng'?180:100" fixed="right">
          <!--          原版侧边出-->
          <!--          <template slot="header" slot-scope="scope">-->
          <!--            <el-button @click="showAdd" icon="el-icon-plus" circle></el-button>-->
          <!--          </template>-->
          <template scope="scope" v-if="currOpType=='mng'">
            <el-button type="text" @click="createCardClick( scope.row,scope.$index)">创建卡片</el-button>

            <!--            <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="text"-->
            <!--                       @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row,title:'修改'})"-->
            <!--                       icon="el-icon-edit" title="修改一条数据"/>-->

            <el-button type="text" @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>

            <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) " type="text"
                       @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete" title="删除一条数据"/>
          </template>

          <template scope="scope" v-else-if="currOpType=='list'">
            <el-button type="primary" @click="openForm({parentOpType:currOpType,subOpType:'detail',formData:scope.row})"
                       icon="el-icon-view"/>
          </template>

          <template scope="scope" v-else-if="currOpType=='select' && this.multiple!=true">
            <el-button type="primary" @click="selectConfirm(scope.row)" icon="el-icon-check"/>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination
          layout="slot,total, sizes, prev, next,pager,jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :page-sizes="[10,20, 50, 100, 500]"
          :current-page="pageInfo.pageNum"
          :page-size="pageInfo.pageSize"
          :total="pageInfo.total"
          style="float:right;"
      >
      </el-pagination>
    </el-row>
    <el-row>
      <!--新增修改明细 AssetDetail ass_asset_detail界面-->
      <mdp-dialog :ref="refId+'FormDialog'">
        <template v-slot="{visible,data,dialog}">
          <asset-detail-form :ref="refId+'Form'" :visible="visible" :parent-op-type="currOpType"
                             :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose"
                             @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
        </template>
      </mdp-dialog>
    </el-row>

    <!--    other-->
    <!--    资产类别选择-->
    <el-dialog append-to-body title="资产类别选择" width="70%" top="5vh" :visible.sync="categoryTreeVisible">
      <asset-category-tree show-checkbox @confirm="onCategoryTreeCheckChange" :show-confirm="true"
                           ref="categoryTreeRef"/>
    </el-dialog>

    <!--    仓库选择-->
    <el-dialog append-to-body title="仓库选择" width="70%" top="5vh" :visible.sync="visibleWarehouseSelect">
      <warehouse-components @row-click="getWarehouseData"></warehouse-components>
    </el-dialog>


    <!--新增 AssetDetail ass_asset_detail界面-->
    <el-drawer title="新增资产" :visible.sync="addFormVisible" size="60%" append-to-body
               :close-on-click-modal="false">
      <asset-detail-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false"
                         @submit="afterAddSubmit"></asset-detail-edit>
    </el-drawer>

    <!--    新增卡片-->
    <el-dialog title="新增卡片" center :fullscreen="true" :visible.sync="assetCardAddVisible"
               :close-on-click-modal="false" append-to-body>
      <asset-card-add :asset-type="{}" :asset-card="editForm" :asset-detail="editForm"
                      :visible="assetCardAddVisible" @cancel="assetCardAddVisible = false"
                      @submit="assetCardAddVisible = false"></asset-card-add>
    </el-dialog>

    <!--编辑 AssetDetail ass_asset_detail界面-->
    <el-dialog :title="editForm.assetName" :visible.sync="detailShowVisible" fullscreen append-to-body
               :close-on-click-modal="false">
      <asset-detail-show :asset-detail="editForm" :visible="detailShowVisible" @cancel="detailShowVisible=false"
                         @submit="afterEditSubmit"></asset-detail-show>
    </el-dialog>
  </section>
</template>

<script>

import {MdpTableMixin} from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import * as AssetDetailApi from '@/api/oa/erp/ass/assetDetail';
import AssetDetailForm from './Form';//新增修改明细界面
import {mapGetters} from 'vuex'
import AssetCategoryTree from "../components/AssetCategoryTree.vue";
import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue";
import UsersSelect from '@/views/mdp/sys/user/UsersSelect';
import WarehouseComponents from "../../stk/components/WarehouseComponents.vue";
import AssetCardAdd from "../assetCard/AssetCardAdd.vue";
import AssetDetailEdit from "./AssetDetailEdit.vue";
import AssetDetailShow from "./AssetDetailShow.vue";

export default {
  name: 'assetDetailMng',
  mixins: [MdpTableMixin],
  components: {
    AssetDetailShow,
    AssetDetailEdit,
    AssetCardAdd,
    WarehouseComponents,
    AssetCategoryTree, DeptTree, AssetDetailForm, UsersSelect
  },
  computed: {},
  watch: {},
  data() {
    return {
      detailShowVisible: false,
      addFormVisible: false,//新增assetDetail界面
      assetCardAddVisible: false,
      visibleWarehouseSelect: false,
      warehouseName: '',
      personLiableUserName: '',
      deptSelectVisible: false,  // 使用部门dialog
      cbCenterSelectVisible: false, // 成本中心dialog
      categoryTreeVisible: false, // 资产分类dialog
      menuDefId: '',//menu_def.id 菜单表菜单编号，用于按钮权限判断
      menuDefName: 'ass_asset_detail',//menu_def.name 功能名称，用于导出excel等文件名
      refId: 'assetDetail',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
      pkNames: ["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
      currOpType: 'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
      filters: {//查询参数
      },
      defaultFilters: {//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

      },

      defaultCheckColumnNum: 25,//默认展示的表格列数，前8列

      editable: false,//是否可编辑模式

      //增删改查(含批量)接口
      apis: {
        list: AssetDetailApi.listAssetDetail,
        add: AssetDetailApi.addAssetDetail,
        del: AssetDetailApi.delAssetDetail,
        edit: AssetDetailApi.editAssetDetail,
        editSomeFields: AssetDetailApi.editSomeFieldsAssetDetail,
        batchAdd: AssetDetailApi.batchAddAssetDetail,
        batchDel: AssetDetailApi.batchDelAssetDetail,
        batchEdit: AssetDetailApi.batchEditAssetDetail,
      }
    }
  },
  methods: {
    test(option) {
      console.log("test", option)
    },
    rowClick: function (row, event, column) {
      this.editForm = row;
      if (event.label != '操作' && event.type != 'selection') {
        this.detailShowVisible = true;
      }
      this.$emit('row-click', row, event, column);//  @row-click="rowClick"
    },
    afterEditSubmit() {
      this.detailShowVisible = false;
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      // this.getAssetDetails();
      this.searchTableDatas();
    },
    //显示新增界面 AssetDetail ass_asset_detail
    showAdd: function () {
      this.addFormVisible = true;
    },
    createCardClick(row) {
      this.editForm = row
      this.assetCardAddVisible = true;
    },
    //显示编辑界面 AssetDetail ass_asset_detail
    showEdit: function (row, index) {
      this.detailShowVisible = true;
      this.editForm = Object.assign({}, row);
    },

    //打开仓库选择
    getWarehouseData(data) {
      this.filters.warehouseId = data.id;
      this.warehouseName = data.name
      this.visibleWarehouseSelect = false;
    },
    openWarehouseSelect() {
      this.visibleWarehouseSelect = true;
    },
    onDeptsSelected(nodes) {
      // 后端没有处理 useDeptNames
      if (nodes == null || nodes.length === 0) {
        this.filters.useDeptids = "";
        this.filters.useDeptNames = "";
      } else {
        this.filters.useDeptids = nodes.map((i) => i.deptid).join(",");
        this.filters.useDeptNames = nodes.map((i) => i.deptName).join(",");
      }
    },
    onCbCenterSelected(nodes) {
      // 后端没有处理 cbCenterNames
      if (nodes == null || nodes.length === 0) {
        this.filters.cbCenterIds = '';
        this.filters.cbCenterNames = "";
      } else {
        this.filters.cbCenterIds = nodes.map((i) => i.deptid).join(",");
        this.filters.cbCenterNames = nodes.map((i) => i.deptName).join(",");
      }
    },
    onCategoryTreeCheckChange(nodes) {
      if (!nodes || nodes.length === 0) {
        this.filters.categoryIds = ""
        this.filters.categoryNames = ""
      } else {
        this.filters.categoryNames = nodes.map(i => i.categoryName).join(",")
        this.filters.categoryIds = nodes.map(i => i.categoryId).join(",")
      }
      this.categoryTreeVisible = false;
      // this.searchAssetDetails();
      this.searchTableDatas();
    },
    //页面初始化需要配置的特殊逻辑写这里
    initCurrData() {
      this.searchTableDatas();
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
</style>
