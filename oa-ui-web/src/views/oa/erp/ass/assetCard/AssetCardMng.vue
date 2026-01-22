<template>
  <section class="page-container border padding">
    <el-row class="page-header">
      <el-row>
        <el-col :span="12">
          <el-input
            size="small"
            v-model="filters.categoryNames"
            @focus="categoryTreeVisible = true"
            style="width: 45%"
            placeholder="资产分类"
          ></el-input>
          <el-input
            v-model="filters.assetNameLike"
            size="small"
            style="width: 45%"
            placeholder="资产编码或者名称"
          ></el-input>
        </el-col>

        <el-col :span="12">
          <el-input
            size="small"
            v-model="filters.cbCenterNames"
            @focus="cbCenterSelectVisible = true"
            style="width: 35%"
            placeholder="请选择成本中心"
          ></el-input>

          <el-input
            size="small"
            v-model="filters.useDeptNames"
            @focus="deptSelectVisible = true"
            style="width: 35%"
            placeholder="请选择使用部门"
          ></el-input>

          <el-select size="small" style="width:20%" v-model="filters.cardStatus" placeholder="资产状态">
            <el-option value="0" label="闲置"></el-option>
            <el-option value="1" label="在用"></el-option>
            <el-option value="2" label="借用"></el-option>
            <el-option value="3" label="未知"></el-option>
            <el-option value="4" label="报废"></el-option>
            <el-option value="5" label="待领取"></el-option>
            <el-option value="6" label="待归还"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="padding-top">
        <el-col :span="12">
          <el-input
            size="small"
            style="width: 45%"
            v-model="personLiableUserName"
            clearable
            placeholder="责任人"
          >
            <i
              @click="openUserSelect"
              slot="suffix"
              class="el-icon-s-custom"
            ></i>
          </el-input>
          <el-input
            size="small"
            style="width: 45%"
            v-model="warehouseName"
            clearable
            placeholder="存放地点"
          >
            <i
              @click="openWarehouseSelect"
              slot="suffix"
              class="el-icon-menu"
            ></i>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input
            size="small"
            v-model="filters.key"
            style="width: 30%"
            placeholder="序列号｜编码｜名称 "
            clearable @clear="handleClear"
            @keyup.enter.native="searchOnEnter"
          ></el-input>
          <el-button
            size="small"
            v-loading="load.list"
            :disabled="load.list == true"
            @click="searchAssetDetails"
            icon="el-icon-search"
          >查询
          </el-button
          >
          <el-button
            size="small"
            type="primary"
            @click="showAdd"
            icon="el-icon-plus"
          >
          </el-button>

          <el-button style="margin-left: 5px" @click="switchObj" size="mini">
            <i v-show="!showImage" class="el-icon-picture-outline"></i>
            <span v-show="!showImage">图文</span>

            <i v-show="showImage" class="el-icon-s-unfold"></i>
            <span v-show="showImage">列表</span>
          </el-button>
          <el-dropdown @command="handleCommand" style="margin-left: 5px">
            <el-button size="mini">
              更多操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="batchUpdate"
              >批量修改
              </el-dropdown-item
              >
              <el-dropdown-item command="export">导出</el-dropdown-item>
              <el-dropdown-item command="import">导入</el-dropdown-item>
              <el-dropdown-item command="list">查询</el-dropdown-item>
              <el-dropdown-item command="add">新建</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-row>
    <el-row class="page-main padding-top">
      <el-row v-if="showImage">
        <el-col
          class="singerCard"
          :span="4"
          v-for="item in assetDetails"
          :key="item.cardId"
        >
          <div class="box">
            <div class="imgBox" @click="gotoDetail(item)">
              <div
                v-if="item.assetImageUrl === null || item.assetImageUrl === ''"
              >
                <img
                  width="176px"
                  height="146px"
                  src="./defaulthead.jpg"
                  alt=""
                />
              </div>

              <div
                v-if="item.assetImageUrl !== null && item.assetImageUrl !== ''"
              >
                <img
                  width="176px"
                  height="146px"
                  :src="imgShowUrl + item.assetImageUrl"
                  alt=""
                />
              </div>
            </div>

            <div class="desc">
              <span>{{ item.assetName }}</span>
              <p class="qrcode">
                资产类别：<a>{{ item.categoryName }}</a>
                <img
                  src="../../../../../assets/image/qrcode.png"
                  width="16px"
                  style="margin-left: 10px"
                  @click="getQrCodeDialog(item)"
                />
              </p>
              <p>
                资产编码：<a>{{ item.assetSn }}</a>
              </p>
              <p>
                资产状态：<a>{{ assetStatusArr[item.cardStatus] }}</a>
              </p>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row v-if="!showImage">
        <el-table
          class="asset-card"
          :height="maxTableHeight"
          ref="procdefsTable"
          @cell-click="cellClick"
          :data="assetDetails"
          @sort-change="sortChange"
          highlight-current-row
          v-loading="load.list"
          border
          @selection-change="selsChange"
          @row-click="rowClick"
          style="width: 100%"
        >
          <el-table-column prop="assetImageUrl" min-width="100">
            <template slot-scope="scope">
              <img
                v-if="!!scope.row.assetImageUrl"
                :src="scope.row.assetImageUrl"
                style="max-width: 100px; max-height: 100px"
              />
              <img
                v-else
                src="./defaulthead.jpg"
                style="max-width: 100px; max-height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="assetSn"
            label="资产编码"
            min-width="80"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="assetName"
            label="资产名称"
            min-width="80"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="spec"
            label="规格型号"
            min-width="80"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="deptName"
            label="使用部门"
            min-width="80"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="personLiableUserid"
            label="责任人"
            min-width="80"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="warehouseName"
            label="存放地点"
            min-width="80"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="categoryName"
            label="资产类别"
            min-width="80"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="cardStatus"
            label="资产状态"
            min-width="80"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ assetStatusArr[scope.row.cardStatus] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="250"
          >
            <template slot-scope="scope">
              <el-button type="text" :disabled="scope.row.cardStatus!='0'" @click="useClick(scope.row)">领用</el-button>
              <el-button type="text" :disabled="scope.row.cardStatus!='1' && scope.row.cardStatus!='2'"
                         @click="returnClick(scope.row)">归还
              </el-button>
              <el-button type="text" :disabled="scope.row.cardStatus!='0'" @click="leaseClick(scope.row)">租用
              </el-button>
              <el-button type="text" :disabled="scope.row.cardStatus!='0'" @click="reallocationClick(scope.row)">调拨
              </el-button>
              <el-button type="text" @click="maintClick(scope.row)">维修</el-button>
              <el-button type="text" @click="changeClick(scope.row)">变更</el-button>
              <el-button type="text" @click="disposeClick(scope.row)">处置</el-button>
              <el-button type="text" @click="inventoryClick(scope.row)">盘点</el-button>
              <el-button type="text" @click="handleDel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-pagination
        layout="total, sizes, prev, pager, next"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[10, 20, 50, 100, 500]"
        :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize"
        :total="pageInfo.total"
        style="float: right"
      ></el-pagination>

      <!--编辑 AssetDetail ass_asset_detail界面-->
      <!-- <el-dialog title="编辑ass_asset_detail" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false">
				  <asset-detail-edit :asset-detail="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></asset-detail-edit>
			</el-dialog> -->

      <!--新增 AssetDetail ass_asset_detail界面-->
      <el-dialog
        title="新增卡片"
        center
        :fullscreen="true"
        :visible.sync="addFormVisible"
        :close-on-click-modal="false"
        append-to-body
      >
        <asset-card-add
          :assetType="assetType"
          :asset-card="addForm"
          :visible="addFormVisible"
          @cancel="addFormVisible = false"
          @submit="afterAddSubmit"
        ></asset-card-add>
      </el-dialog>

      <el-dialog title="资产卡片" center :fullscreen="true" :visible.sync="detailFormVisible" :close-on-click-modal="false" append-to-body >
        <asset-card-show :asset-card="detailForm" :visible="detailFormVisible" @cancel="detailFormVisible = false"  @submit="afterDetailSubmit" ></asset-card-show>
      </el-dialog>

      <el-dialog
        title="资产卡片批量修改"
        :visible.sync="batchEditVisible"
        width="50%"
        :close-on-click-modal="false"
        append-to-body
      >
        <asset-card-batch-edit
          :cardIds="selData"
          :asset-detail="editForm"
          :visible="batchEditVisible"
          @cancel="batchEditVisible = false"
          @submit="afterBatchEditSubmit"
        ></asset-card-batch-edit>
      </el-dialog>

      <excel-load
        @update:show="closeImport"
        :show="importVisibled"
        :header="header"
        :validator="validator"
        :upload-api="uploadApi"
        result-type="html"
        @onSucess="importVisibled = false"
        :download-function="downloadTemplate"
      >
      </excel-load>
    </el-row>
    <!-- 二维码弹框 -->
    <el-dialog title="二维码" :visible.sync="qrcodeVisible" width="30%">
      <el-button-group>
        <el-button type="primary" @click="getQrCode(400, 400)"
        >400*400
        </el-button
        >
        <el-button type="primary" @click="getQrCode(200, 200)"
        >200*200
        </el-button
        >
        <el-button type="primary" @click="getQrCode(100, 100)"
        >100*100
        </el-button
        >
        <el-button type="primary" @click="getQrCode(50, 50)">50*50</el-button>
      </el-button-group>
      <div ref="qrCodeUrl" id="qrcode"></div>
    </el-dialog>

    <el-dialog
      append-to-body
      title="人员选择"
      width="70%"
      top="5vh"
      :visible.sync="visibleUserSelect"
    >
      <users-select @confirm="getUserData" :isSingleUser="true"></users-select>
    </el-dialog>

    <el-dialog
      append-to-body
      title="仓库选择"
      width="70%"
      top="5vh"
      :visible.sync="visibleWarehouseSelect"
    >
      <warehouse-components
        @row-click="getWarehouseData"
      ></warehouse-components>
    </el-dialog>
    <el-dialog
      append-to-body
      title="资产类别选择"
      width="70%"
      top="5vh"
      :visible.sync="categoryTreeVisible"
    >
      <asset-category-tree
        show-checkbox
        @confirm="onCategoryTreeCheckChange"
        :show-confirm="true"
        ref="categoryTreeRef"
      ></asset-category-tree>
    </el-dialog>

    <el-dialog
      append-to-body
      title="选择使用部门"
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

    <el-dialog
      append-to-body
      title="选择成本中心"
      :visible.sync="cbCenterSelectVisible"
      width="60%"
    >
      <dept-tree
        :show-confirm="true"
        show-root
        default-expand-all
        show-checkbox
        multiple
        :expand-on-click-node="false"
        @confirm="onCbCenterSelected"
      ></dept-tree>
    </el-dialog>


    <el-dialog append-to-body title="资产领用明细" center :fullscreen="true" :visible.sync="receiveAddFormVisible"
               :close-on-click-modal="false">
      <asset-receive-add ref="assetReceive" :visible="receiveAddFormVisible"
                         @cancel="receiveAddFormVisible=false"></asset-receive-add>
    </el-dialog>

    <el-dialog append-to-body title="资产归还明细" center :fullscreen="true" :visible.sync="returnAddFormVisible"
               :close-on-click-modal="false">
      <asset-return-add ref="assetReturn" :visible="returnAddFormVisible"
                        @cancel="returnAddFormVisible=false"></asset-return-add>
    </el-dialog>

    <el-dialog append-to-body title="资产调拨明细" center :fullscreen="true" :visible.sync="reallocationAddFormVisible"
               :close-on-click-modal="false">
      <asset-reallocation-add ref="assetReallocation" :visible="reallocationAddFormVisible"
                              @cancel="reallocationAddFormVisible=false"></asset-reallocation-add>
    </el-dialog>

    <el-dialog append-to-body title="资产维修/保养单明细" center :fullscreen="true" :visible.sync="maintAddFormVisible"
               :close-on-click-modal="false">
      <asset-maint-add ref="assetMaint" :visible="maintAddFormVisible"
                       @cancel="maintAddFormVisible=false"></asset-maint-add>
    </el-dialog>

    <el-dialog append-to-body title="资产出租明细" center :fullscreen="true" :visible.sync="leaseAddFormVisible"
               :close-on-click-modal="false">
      <asset-lease-add ref="assetLease" :visible="leaseAddFormVisible"
                       @cancel="leaseAddFormVisible=false"></asset-lease-add>
    </el-dialog>

    <el-dialog append-to-body title="资产处置明细" center :fullscreen="true" :visible.sync="disposeAddFormVisible"
               :close-on-click-modal="false">
      <asset-dispose-add ref="assetDispose" :visible="disposeAddFormVisible"
                         @cancel="disposeAddFormVisible=false"></asset-dispose-add>
    </el-dialog>

    <el-dialog append-to-body title="资产变更明细" center :fullscreen="true" :visible.sync="changeAddFormVisible"
               :close-on-click-modal="false">
      <asset-change-add ref="assetChange" :visible="changeAddFormVisible"
                        @cancel="changeAddFormVisible=false"></asset-change-add>
    </el-dialog>

    <el-dialog append-to-body title="入库单明细" center :fullscreen="true" :visible.sync="stockInAddFormVisible"
               :close-on-click-modal="false">
      <stock-in-edit ref="stockInAdd" :visible="stockInAddFormVisible"
                     @cancel="stockInAddFormVisible=false"></stock-in-edit>
    </el-dialog>

    <el-dialog append-to-body title="盘点明细" center :fullscreen="true" :visible.sync="inventoryAddFormVisible"
               :close-on-click-modal="false">
      <asset-inventory-add ref="assetInventory" :visible="inventoryAddFormVisible"
                           @cancel="inventoryAddFormVisible=false"></asset-inventory-add>
    </el-dialog>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import {listAssetCard, delAssetCard} from "@/api/oa/erp/ass/assetCard";
import AssetCardShow from "./AssetCardShow";
import AssetCardAdd from "./AssetCardAdd";
import {mapGetters} from "vuex";
import config from "@/common/config"; //全局公共库import
import AssetCardBatchEdit from "./AssetCardBatchEdit";
import ExcelLoad from "../../../hr/user/excelLoad";
import {listArchiveAttachment} from "@/api/mdp/arc/archiveAttachment";
import QRCode from "qrcodejs2";

import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
import WarehouseComponents from "../../stk/components/WarehouseComponents";
import AssetCategoryTree from "../components/AssetCategoryTree";
import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue";


import assetReceiveAdd from '../assetReceive/assetReceiveAdd';
import assetReturnAdd from '../assetReturn/assetReturnAdd';
import assetReallocationAdd from '../assetReallocation/assetReallocationAdd';
import assetMaintAdd from '../assetMaint/assetMaintAdd';
import assetLeaseAdd from '../assetLease/assetLeaseAdd';
import assetDisposeAdd from '../assetDispose/assetDisposeAdd';
import assetChangeAdd from '../assetChange/assetChangeAdd';
import StockInEdit from '../../pur/stockIn/StockInEdit';
import AssetInventoryAdd from '../assetInventory/AssetInventoryAdd';

const REGULAR = {
  DATA: /^(\d{4})(-)(\d{2})(-)(\d{2})$/,
  NUM: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
};

export default {
  props: ["assetDetail"],
  computed: {
    ...mapGetters(["userInfo"]),
  },

  watch: {
    isAllSelect(val, oldVal) {
      if (val) {
        this.selData = [];
        this.assetDetails.forEach((a) => {
          a.isChecked = true;
          this.selData.push(a);
        });
      } else {
        this.selData = [];
        this.assetDetails.forEach((a) => {
          a.isChecked = false;
        });
      }
    },
  },

  data() {
    return {
      filters: {
        key: "",
        personLiableUsernameLike: "",
        deptNameLike: "",
        categoryIds: "",
        categoryNames: "",
        assetNameLike: "",
        personLiableUserid: "",
        warehouseId: "",
        useDeptNames: "",
        useDeptids: "",
        cbCenterIds: "",
        cbCenterNames: "",
        cardStatus: '',
      },
      maxTableHeight: 500,
      assetDetails: [], //查询结果
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        count: false, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: [], //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: {list: false, edit: false, del: false, add: false}, //查询中...
      sels: [], //列表选中数据
      options: {}, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

      addFormVisible: false, //新增assetDetail界面是否显示
      //新增assetDetail界面初始化数据
      addForm: {
        cardId: "",
        detailId: "",
        cardStatus: "",
        assetSn: "",
        assetNo: "",
        spec: "",
        measUnit: "",
        orignUnitAmount: "",
        servLife: "",
        branchId: "",
        deptid: "",
        deptName: "",
        personLiableUserid: "",
        personLiableUsername: "",
        purchaseUserid: "",
        purchaseUsername: "",
        purchaseDate: "",
        supplierId: "",
        supplierName: "",
        passetSn: "",
        passetName: "",
        defectsLiabilityPeriod: "",
        warehouseDate: "",
        startUseDate: "",
        inventoryTask: "",
        confDesc: "",
        remark: "",
        assetImageUrl: "",
        createUserid: "",
        createTime: "",
        createUsername: "",
        lastEditUserid: "",
        lastEditTime: "",
        lastEditUsername: "",
        receiptNo: "",
        assetName: "",
        warehouseId: "",
        warehouseName: "",
        storeAddress: "",
        productId: "",
        productSn: "",
        brandId: "",
        brandName: "",
        cardType: "",
        categoryId: "",
        categoryName: "",
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑assetDetail界面初始化数据
      editForm: {
        cardId: "",
        detailId: "",
        cardStatus: "",
        assetSn: "",
        assetNo: "",
        spec: "",
        measUnit: "",
        orignUnitAmount: "",
        servLife: "",
        branchId: "",
        deptid: "",
        deptName: "",
        personLiableUserid: "",
        personLiableUsername: "",
        purchaseUserid: "",
        purchaseUsername: "",
        purchaseDate: "",
        supplierId: "",
        supplierName: "",
        passetSn: "",
        passetName: "",
        defectsLiabilityPeriod: "",
        warehouseDate: "",
        startUseDate: "",
        inventoryTask: "",
        confDesc: "",
        remark: "",
        assetImageUrl: "",
        createUserid: "",
        createTime: "",
        createUsername: "",
        lastEditUserid: "",
        lastEditTime: "",
        lastEditUsername: "",
        receiptNo: "",
        assetName: "",
        warehouseId: "",
        warehouseName: "",
        storeAddress: "",
        productId: "",
        productSn: "",
        brandId: "",
        brandName: "",
        cardType: "",
        categoryId: "",
        categoryName: "",
      },

      detailFormVisible: false, //编辑界面是否显示
      //编辑assetDetail界面初始化数据
      detailForm: {
        cardId: "",
        detailId: "",
        cardStatus: "",
        assetSn: "",
        assetNo: "",
        spec: "",
        measUnit: "",
        orignUnitAmount: "",
        servLife: "",
        branchId: "",
        deptid: "",
        deptName: "",
        personLiableUserid: "",
        personLiableUsername: "",
        purchaseUserid: "",
        purchaseUsername: "",
        purchaseDate: "",
        supplierId: "",
        supplierName: "",
        passetSn: "",
        passetName: "",
        defectsLiabilityPeriod: "",
        warehouseDate: "",
        startUseDate: "",
        inventoryTask: "",
        confDesc: "",
        remark: "",
        assetImageUrl: "",
        createUserid: "",
        createTime: "",
        createUsername: "",
        lastEditUserid: "",
        lastEditTime: "",
        lastEditUsername: "",
        receiptNo: "",
        assetName: "",
        warehouseId: "",
        warehouseName: "",
        storeAddress: "",
        productId: "",
        productSn: "",
        brandId: "",
        brandName: "",
        cardType: "",
        categoryId: "",
        categoryName: "",
      },

      /**begin 自定义属性请在下面加 请加备注**/
      assetStatusArr: ["闲置", "在用", "借用", "维修", "报废", "调拨", "处置"],

      selectAssetTypeVisible: false,
      //资产类型对象
      assetType: "",

      imgShowUrl: config.getArcImagePath() + "/",
      defaultImg: "./defaulthead.jpg",

      //图文还是列表的方式展示资产卡片
      showImage: false,

      //是否全选
      isAllSelect: false,

      //选中的数据
      selData: [],

      batchEditVisible: false,

      //导入显示
      importVisibled: false,

      //导入表格头
      header: [
        "资产名称",
        "资产编码",
        "资产类别",
        "资产序列号",
        "规格型号",
        "计量单位",
        "资产原值",
        "资产原值币种",
        "供应商",
        "使用年限(月)",
        "组织机构代码",
        "使用部门",
        "存放地点",
        "责任人",
        "采购人",
        "采购日期",
        "入库单号",
        "入库日期",
        "保修期(月)",
        "资产状态",
        "开始使用日期",
        "配置说明",
        "备注",
      ],

      uploadApi:
        config.getExcelUploadBasePath() +
        "/oa/erp/ass/assetCard/importAssetCard",
      qrcodeVisible: false,
      warehouseName: "",
      personLiableUserName: "",
      visibleWarehouseSelect: false,
      visibleUserSelect: false,
      detailShowVisible: false,
      cbCenterSelectVisible: false,
      deptSelectVisible: false,
      categoryTreeVisible: false,


      receiveAddFormVisible: false,
      returnAddFormVisible: false,
      reallocationAddFormVisible: false,
      maintAddFormVisible: false,
      leaseAddFormVisible: false,
      disposeAddFormVisible: false,
      changeAddFormVisible: false,
      stockInAddFormVisible: false,
      inventoryAddFormVisible: false,
      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
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
      var dir = "asc";
      if (obj.order == "ascending") {
        dir = "asc";
      } else {
        dir = "desc";
      }
      if (obj.prop == "xxx") {
        this.pageInfo.orderFields = ["xxx"];
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
        count: this.pageInfo.count,
      };
      if (
        this.pageInfo.orderFields != null &&
        this.pageInfo.orderFields.length > 0
      ) {
        let orderBys = [];
        for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
          orderBys.push(
            this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i]
          );
        }
        params.orderBy = orderBys.join(",");
      }
      if (this.filters.key !== "") {
        params.key = "%" + this.filters.key + "%";
      }

      if (this.filters.assetNameLike) {
        params.assetNameLike = "%" + this.filters.assetNameLike + "%"
      }

      if (this.filters.personLiableUsernameLike !== "") {
        params.personLiableUsernameLike =
          "%" + this.filters.personLiableUsernameLike + "%";
      }

      if (this.filters.deptNameLike !== "") {
        params.deptNameLike = "%" + this.filters.deptNameLike + "%";
      }

      if (this.assetDetail && this.assetDetail.id) {
        params.detailId = this.assetDetail.id;
      }
      if (this.filters.cardStatus) {
        params.cardStatus = this.filters.cardStatus
      }

      this.load.list = true;
      listAssetCard(params)
        .then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.assetDetails = res.data.data;
            this.assetDetails.forEach((a) => {
              this.$set(a, "isChecked", false);
            });
          } else {
            this.$message({message: tips.msg, type: "error"});
          }

          this.load.list = false;
        })
        .catch((err) => (this.load.list = false));
    },

    //显示编辑界面 AssetDetail ass_asset_detail
    showEdit: function (row, index) {
      this.editFormVisible = true;
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
      this.editFormVisible = false;
    },

    afterBatchEditSubmit() {
      this.batchEditVisible = false;
      this.getAssetDetails();
    },

    afterDetailSubmit(assetCard, close) {
      if (close !== false) {
        this.detailFormVisible = false;
      }

      this.getAssetDetails();
    },

    //选择行assetDetail
    selsChange: function (sels) {
      this.sels = sels;
    },

    rowClick: function (row, event, column) {
      this.editForm = row
      if (event.label != '操作' && event.type != 'selection') {
        this.showEdit(row)
      }
      this.$emit("row-click", row, event, column); //  @row-click="rowClick"
    },
    /**begin 自定义函数请在下面加**/
    gotoDetail(item) {
      this.detailFormVisible = true;
      this.detailForm = Object.assign({}, item);
    },

    //获得选择资产分类数据
    getSelectAssetTypeData(data) {
      //1.打开添加资产卡片页面
      this.assetType = {
        categoryId: data.categoryId,
        categoryName: data.categoryName,
      };
      this.selectAssetTypeVisible = false;
      this.addFormVisible = true;
    },

    //切换图文或列表
    switchObj() {
      this.showImage = !this.showImage;
    },

    cellClick: function (row, column, cell, event) {
      if (column.label == "操作") return;
      this.gotoDetail(row);
    },

    //单选数据
    checkData(data) {
      if (this.isAllSelect) {
        this.selData.forEach((s, index) => {
          if (s.cardId === data.cardId) {
            this.selData.splice(s, 1);
          }
        });
      } else {
        if (data.isChecked === false) {
          this.selData.forEach((s, index) => {
            if (s.cardId === data.cardId) {
              this.selData.splice(s, 1);
            }
          });
        } else {
          this.selData.push(data);
        }
      }
    },

    //批量修改
    handleCommand(command) {
      if (command === "batchUpdate") {
        if (this.selData.length === 0) {
          this.$message({message: "必须先选中一条记录", type: "error"});
        } else {
          this.batchEditVisible = true;
        }
      }

      if (command === "export") {
        //查询数据
        let params = {};
        if (this.filters.key !== "") {
          params.key = "%" + this.filters.key + "%";
        }
        if (this.filters.assetNameLike) {
          params.assetNameLike = "%" + this.filters.assetNameLike + "%"
        }
        if (this.filters.personLiableUsernameLike !== "") {
          params.personLiableUsernameLike =
            "%" + this.filters.personLiableUsernameLike + "%";
        }
        if (this.filters.deptNameLike !== "") {
          params.deptNameLike = "%" + this.filters.deptNameLike + "%";
        }
        if (this.filters.cbCenterIds) {
          params.cbCenterIds = this.filters.cbCenterIds
        }

        if (this.filters.useDeptids) {
          params.useDeptids = this.filters.useDeptids
        }
        listAssetCard(params)
          .then((res) => {
            var tips = res.data.tips;
            if (tips.isOk) {
              this.deriveExcel(res.data.data);
            } else {
              this.$message({message: tips.msg, type: "error"});
            }
          })
          .catch((err) => (this.load.list = false));
      }

      //如果是导入
      if (command === "import") {
        this.importVisibled = true;
      }
      if (command === "list") {
        this.searchAssetDetails();
      }
      if (command === "add") {
        this.showAdd();
      }
    },

    //关闭导入
    closeImport() {
      this.importVisibled = false;
    },

    isNull(data) {
      if (data === null || data === "" || data === undefined) {
        return true;
      }
      return false;
    },

    validator(row, arr, i) {
      //指定字段空校验
      if (this.isNull(row.资产名称)) {
        return `<span class="c-red pdl10" >第${
          i + 1
        }行资产名称 不能为空 </span></br>`;
      }

      if (this.isNull(row.资产编码)) {
        return `<span class="c-red pdl10" >第${
          i + 1
        }行资产编码 不能为空 </span></br>`;
      }

      if (this.isNull(row.资产类别)) {
        return `<span class="c-red pdl10" >第${
          i + 1
        }行资产类别 不能为空 </span></br>`;
      }

      if (this.isNull(row.资产状态)) {
        return `<span class="c-red pdl10" >第${
          i + 1
        }行资产状态 不能为空 </span></br>`;
      }

      if (!this.assetStatusArr.includes(row.资产状态)) {
        return `<span class="c-red pdl10" >第${
          i + 1
        }行资产状态必须是'闲置', '在用', '借用', '维修', '报废', '调拨', '处置' 其中一个</span></br>`;
      }

      //日期判断
      if (!this.isNull(row.采购日期) && !REGULAR.DATA.test(row.采购日期)) {
        return `<span class="c-red pdl10" >第${
          i + 1
        }行，【采购日期】 时间格式不正确，时间格式应该为 【yyyy-MM-dd】</span></br>`;
      }

      if (!this.isNull(row.入库日期) && !REGULAR.DATA.test(row.入库日期)) {
        return `<span class="c-red pdl10" >第${
          i + 1
        }行，【入库日期】 时间格式不正确，时间格式应该为 【yyyy-MM-dd】</span></br>`;
      }

      if (
        !this.isNull(row.开始使用日期) &&
        !REGULAR.DATA.test(row.开始使用日期)
      ) {
        return `<span class="c-red pdl10" >第${
          i + 1
        }行，【开始使用日期】 时间格式不正确，时间格式应该为 【yyyy-MM-dd】</span></br>`;
      }

      //资产原值验证
      if (!this.isNull(row.资产原值) && !REGULAR.NUM.test(row.资产原值)) {
        return `<span class="c-red pdl10" >第${
          i + 1
        }行，资产原值使用的格式不正确 </span></br>`;
      }

      return true;
    },

    //资产卡片导出
    deriveExcel(resData) {
      resData.forEach((r) => {
        r.cardStatusName = this.assetStatusArr[r.cardStatus];
      });
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "资产名称",
          "资产编码",
          "资产类别",
          "资产序列号",
          "规格型号",
          "计量单位",
          "资产原值",
          "资产原值币种",
          "使用年限（月）",
          "组织结构代码",
          "使用部门",
          "存放地点",
          "责任人",
          "采购人",
          "采购日期",
          "入库单号",
          "入库日期",
          "供应商",
          "保修期(月)",
          "资产状态",
          "开始使用日期",
          "配置说明",
          "备注",
        ];
        const filterVal = [
          "assetName",
          "assetSn",
          "categoryName",
          "assetNo",
          "spec",
          "measUnit",
          "orignUnitAmount",
          "currency",
          "servLife",
          "branchId",
          "deptName",
          "storeAddress",
          "personLiableUsername",
          "purchaseUsername",
          "purchaseDate",
          "receiptNo",
          "warehouseDate",
          "supplierName",
          "defectsLiabilityPeriod",
          "cardStatusName",
          "startUseDate",
          "confDesc",
          "remark",
        ];
        const list = resData;
        const data = this.formatJson(filterVal, list);
        var filename = "资产卡片搜索结果导出";
        if (this.formDefSelected) {
          filename = this.formDefSelected.formName
            ? this.formDefSelected.formName
            : this.formDefSelected.id + "资产卡片搜索结果导出";
        }
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: filename,
          autoWidth: true,
          bookType: "xlsx",
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },

    //下载模板
    downloadTemplate() {
      listArchiveAttachment({
        archiveId: "asset-card-template",
      }).then((res) => {
        let fileurl =
          config.getArcFileUploadBasePath() + "/" + res.data.data[0].url;
        this.download(fileurl, "资产卡片导入模板");
      });
    },

    /**
     * 获取 blob
     * @param  {String} url 目标文件地址
     * @return {Promise}
     */
    getBlob(url) {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();

        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(xhr.response);
          }
        };

        xhr.send();
      });
    },
    /**
     * 保存
     * @param  {Blob} blob
     * @param  {String} filename 想要保存的文件名称
     */
    saveAs(blob, filename) {
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        const link = document.createElement("a");
        const body = document.querySelector("body");

        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        // fix Firefox
        link.style.display = "none";
        body.appendChild(link);

        link.click();
        body.removeChild(link);

        window.URL.revokeObjectURL(link.href);
      }
    },

    /**
     * 下载
     * @param  {String} url 目标文件地址
     * @param  {String} filename 想要保存的文件名称
     */
    download(url, filename) {
      let that = this;
      that.getBlob(url).then((blob) => {
        that.saveAs(blob, filename);
      });
    },
    //打开二维码弹框
    getQrCodeDialog(item) {
      this.qrcodeVisible = true;
      this.getQrCode(100, 100);
      this.qrcodeInfo =
        "assetcard" +
        "-" +
        "assetSn=" +
        item.assetSn +
        "-" +
        "assetName=" +
        item.assetName +
        "-" +
        "brandId=" +
        item.brandId;
    },
    getQrCode(width, height) {
      this.$nextTick(function () {
        document.getElementById("qrcode").innerHTML = "";

        var qrcode = new QRCode(this.$refs.qrCodeUrl, {
          text: this.qrcodeInfo, // 需要转换为二维码的内容
          width: width,
          height: height,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H,
        });
      });
    },

    onCategoryTreeCheckChange(nodes) {
      if (!nodes || nodes.length == 0) {
        this.filters.categoryIds = "";
        this.filters.categoryNames = "";
      } else {
        this.filters.categoryNames = nodes.map((i) => i.categoryName).join(",");
        this.filters.categoryIds = nodes.map((i) => i.categoryId).join(",");
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
      this.personLiableUserNameLike = data[0].username;
      this.visibleUserSelect = false;
    },

    openWarehouseSelect() {
      this.visibleWarehouseSelect = true;
    },

    //打开仓库选择
    getWarehouseData(data) {
      this.filters.warehouseId = data.id;
      this.warehouseName = data.name;
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
      this.cbCenterSelectVisible = false;
      this.searchAssetDetails();
    },
    batchDel() {
    },
    //删除assetCategory
    handleDel: function (row, index) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        let params = {cardId: row.cardId};
        delAssetCard(params).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.searchAssetDetails();
          }
          this.$message({message: tips.msg, type: tips.isOk ? 'success' : 'error'});
        }).catch(err => this.load.del = false);
      });
    },
    useClick(row) {
      this.receiveAddFormVisible = true;
      this.$nextTick(() => {


        this.$refs.assetReceive.addForm.reqTitle = "领用资产" + (row.assetName ? row.assetName : '');
        this.$refs.assetReceive.getAssetData([row]);
      })

    },
    returnClick(row) {
      this.returnAddFormVisible = true;
      this.$nextTick(() => {

        this.$refs.assetReturn.addForm.reqTitle = "归还资产" + (row.assetName ? row.assetName : '')
        this.$refs.assetReturn.getAssetData([row]);
      })

    },
    disposeClick(row) {
      this.disposeAddFormVisible = true;
      this.$nextTick(() => {

        this.$refs.assetDispose.addForm.reqTitle = "处置资产" + (row.assetName ? row.assetName : '')
        this.$refs.assetDispose.getAssetData([row]);
      })

    },
    inventoryClick(row) {
      this.inventoryAddFormVisible = true;
      this.$nextTick(() => {

        this.$refs.assetInventory.addForm.reqTitle = "盘点资产" + (row.assetName ? row.assetName : '')
        this.$refs.assetInventory.getAssetData([row]);
      })

    },
    leaseClick(row) {
      this.leaseAddFormVisible = true;
      this.$nextTick(() => {

        this.$refs.assetLease.addForm.reqTitle = "租用资产" + (row.assetName ? row.assetName : '')
        this.$refs.assetLease.getAssetData([row]);
      })

    },
    maintClick(row) {
      this.maintAddFormVisible = true;
      this.$nextTick(() => {
        this.$refs.assetMaint.addForm.reqTitle = "维修资产" + (row.assetName ? row.assetName : '')
        this.$refs.assetMaint.getAssetData([row]);
      })

    },
    changeClick(row) {
      this.changeAddFormVisible = true;
      this.$nextTick(() => {


        this.$refs.assetChange.addForm.reqTitle = "变更资产" + (row.assetName ? row.assetName : '')
        this.$refs.assetChange.getAssetData([row]);
      })

    },
    reallocationClick(row) {
      this.reallocationAddFormVisible = true;
      this.$nextTick(() => {
        this.$refs.assetReallocation.addForm.reqTitle = "调拨资产" + (row.assetName ? row.assetName : '')
        this.$refs.assetReallocation.getAssetData([row]);
      })

    }

    /**end 自定义函数请在上面加**/
  }, //end methods
  components: {
    "asset-card-show": AssetCardShow,
    "asset-card-add": AssetCardAdd,
    "asset-card-batch-edit": AssetCardBatchEdit,
    "excel-load": ExcelLoad,
    UsersSelect,
    WarehouseComponents,
    AssetCategoryTree,
    DeptTree,

    'asset-receive-add': assetReceiveAdd,
    'asset-return-add': assetReturnAdd,
    'asset-reallocation-add': assetReallocationAdd,
    'asset-maint-add': assetMaintAdd,
    'asset-lease-add': assetLeaseAdd,
    'asset-dispose-add': assetDisposeAdd,
    'asset-change-add': assetChangeAdd,
    'stock-in-edit': StockInEdit,
    'asset-inventory-add': AssetInventoryAdd,
    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
      debugger;
      this.getAssetDetails();
      var table = document.querySelector(".asset-card");
      if (table) {
        var top = util.getPositionTop(table);
        if (top == 0) {
          top = 300;
        }
        this.maxTableHeight = window.innerHeight - top - 60;
      }
    });
    console.log(config.getArcImagePath(), "-------------->");
  },
};
</script>

<style scoped>
.singerCard {
  height: 250px;
}

.singerCard:hover {
  border: 2px solid cornflowerblue;
}

.box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.imgBox {
  margin-top: 10px;
  cursor: pointer;
}

.desc {
  font-size: 14px;
  font-weight: normal;
  margin-left: -38px;
  color: rgb(159, 159, 159);
}

.desc span {
  margin-top: 5px;
  color: cornflowerblue;
}

.desc a {
  color: black;
}

.qrcode {
  display: flex;
  align-items: center;
}

#qrcode {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}
</style>

<style>
.c-red {
  color: red;
}

.pdl10 {
  padding-left: 10px;
}

.c-green {
  color: green;
}
</style>
