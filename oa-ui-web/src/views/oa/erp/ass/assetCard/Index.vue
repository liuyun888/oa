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
        <mdp-select-dept size="small" @change2="onCbCenterSelected" :width="35+'%'" multiple
                         v-model="filters.cbCenterIds"
                         placeholder="请选择成本中心"/>
        <mdp-select-dept size="small" @change2="onDeptsSelected" :width="35+'%'" multiple v-model="filters.useDeptids"
                         placeholder="请选择使用部门"/>
        <mdp-select item-code="card_status" size="small" :width="20+'%'"
                    v-model="filters.cardStatus"
                    placeholder="资产状态"/>
      </el-col>

      <!--      <el-input v-model="filters.id" style="width: 20%;" placeholder="id查询 输入 *字符* >10 <9 等" clearable-->
      <!--                title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>-->
    </el-row>
    <el-row>
      <el-col :span="12">
        <mdp-select-user size="small" :width="45+'%'" v-model="filters.personLiableUserid" clearable
                         placeholder="责任人"/>
        <el-input size="small" style="width: 45%;" v-model="warehouseName" clearable placeholder="存放地点">
          <i @click="openWarehouseSelect" slot="suffix" class="el-icon-menu"></i>
        </el-input>
      </el-col>
      <el-col :span="12">
        <el-input v-model="filters.assetSn" size="small" style="width: 35%;"
                  placeholder="资产编码查询 输入 *字符* >10 <9 等" clearable
                  title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

        <el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search"
                   type="primary">查询
        </el-button>
        <span v-if="currOpType=='mng'">
                <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary"
                           @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm,title:'新增'})"
                           icon="el-icon-plus"/>
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
                      <el-dropdown-item command="batchUpdate">批量修改 </el-dropdown-item>
                      <el-dropdown-item command="export">导出</el-dropdown-item>
                      <el-dropdown-item command="import">导入</el-dropdown-item>
                      <el-dropdown-item command="list">查询</el-dropdown-item>
                      <el-dropdown-item command="add">
                        <span :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary"
                              @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm,title:'新增'})"
                              icon="el-icon-plus">新增</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
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

    <el-row class="page-main padding-top">
      <el-row v-if="showImage">
        <el-col class="singerCard" :span="4" v-for="item in tableDatas" :key="item.cardId">
          <div class="box">
            <div class="imgBox" @click="gotoDetail(item)">
              <div v-if="item.assetImageUrl === null || item.assetImageUrl === ''">
                <img width="176px" height="146px" src="./defaulthead.jpg" alt=""/>
              </div>

              <div v-if="item.assetImageUrl !== null && item.assetImageUrl !== ''">
                <img width="176px" height="146px" alt=""/>
              </div>

            </div>
            <div class="desc">
              <span>{{ item.assetName }}</span>
              <p class="qrcode"> 资产类别：<a>{{ item.categoryName }}</a>
                <img src="../../../../../assets/image/qrcode.png" width="16px" style="margin-left: 10px"
                     @click="getQrCodeDialog(item)"/>
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
        <!--列表 AssetCard ass_asset_card-->
        <el-table :ref="refId+'Table'" height="100 !important" v-adaptive="{bottomOffset: bottomOffset}"
                  :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border
                  @selection-change="selsChange" style="width: 100%;" @row-click="rowClick">
          <el-table-column prop="assetImageUrl" min-width="100">
            <template slot-scope="scope">
              <img v-if="!!scope.row.assetImageUrl" :src="scope.row.assetImageUrl"
                   style="max-width: 100px; max-height: 100px"/>
              <img v-else src="./defaulthead.jpg" style="max-width: 100px; max-height: 100px"/>
            </template>
          </el-table-column>

          <el-table-column prop="assetSn" label="资产编码" min-width="120" show-overflow-tooltip col-type="String"
                           v-if="showCol('assetSn')">
            <template slot-scope="scope">
              <mdp-input show-style="tag" v-model="scope.row.assetSn" :maxlength="50"
                         @change="editSomeFields(scope.row,'assetSn',$event)"
                         :disabled="!editable || disabledJudge('assetSn')"/>
            </template>
          </el-table-column>
          <el-table-column prop="passetName" label="所属父资产名称" min-width="120" show-overflow-tooltip
                           col-type="String" v-if="showCol('passetName')">
            <template slot-scope="scope">
              <mdp-input show-style="tag" v-model="scope.row.passetName" :maxlength="50"
                         @change="editSomeFields(scope.row,'passetName',$event)"
                         :disabled="!editable || disabledJudge('passetName')"/>
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
          <el-table-column prop="categoryName" label="资产分类名称" min-width="120" show-overflow-tooltip
                           col-type="String" v-if="showCol('categoryName')">
            <template slot-scope="scope">
              <mdp-input show-style="tag" v-model="scope.row.categoryName" :maxlength="50"
                         @change="editSomeFields(scope.row,'categoryName',$event)"
                         :disabled="!editable || disabledJudge('categoryName')"/>
            </template>
          </el-table-column>
          <!--          0闲置1在用2借用3报废4待领取-->
          <el-table-column prop="cardStatus" label="卡片状态" min-width="120"
                           show-overflow-tooltip col-type="String" v-if="showCol('cardStatus')">
            <template slot-scope="scope">
              <mdp-select item-code="card_status" show-style="tag" v-model="scope.row.cardStatus" :maxlength="50"
                          @change="editSomeFields(scope.row,'cardStatus',$event)"
                          :disabled="!editable || disabledJudge('cardStatus')"/>
            </template>
          </el-table-column>
          <!--          -->
          <el-table-column label="操作" :width="currOpType=='mng'?200:80" fixed="right">
            <template slot="header" slot-scope="scope">

            </template>
            <template scope="scope" v-if="currOpType=='mng'">
              <!--              <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary"-->
              <!--                         @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row,title:'修改'})"-->
              <!--                         icon="el-icon-edit" title="修改一条数据"/>-->

              <el-button type="text" :disabled="scope.row.cardStatus!='0'" @click.stop="useClick(scope.row)">领用
              </el-button>
              <el-button type="text" :disabled="scope.row.cardStatus!='1' && scope.row.cardStatus!='2'"
                         @click.stop="returnClick(scope.row)">归还
              </el-button>
              <el-button type="text" :disabled="scope.row.cardStatus!='0'" @click.stop="leaseClick(scope.row)">租用
              </el-button>
              <el-button type="text" :disabled="scope.row.cardStatus!='0'" @click.stop="reallocationClick(scope.row)">调拨
              </el-button>
              <el-button type="text" @click.stop="maintClick(scope.row)">维修</el-button>
              <el-button type="text" @click.stop="changeClick(scope.row)">变更</el-button>
              <el-button type="text" @click.stop="disposeClick(scope.row)">处置</el-button>
              <el-button type="text" @click.stop="inventoryClick(scope.row)">盘点</el-button>
              <el-button type="text" @click.stop="handleDel(scope.row,scope.$index)">删除</el-button>
            </template>

            <template scope="scope" v-else-if="currOpType=='list'">
              <el-button type="primary"
                         @click="openForm({parentOpType:currOpType,subOpType:'detail',formData:scope.row})"
                         icon="el-icon-view"/>
            </template>

            <template scope="scope" v-else-if="currOpType=='select' && this.multiple!=true">
              <el-button type="primary" @click="selectConfirm(scope.row)" icon="el-icon-check"/>
            </template>
          </el-table-column>
        </el-table>
      </el-row>


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
      <!--新增修改明细 AssetCard ass_asset_card界面-->
      <mdp-dialog :ref="refId+'FormDialog'">
        <template v-slot="{visible,data,dialog}">
          <asset-card-form :ref="refId+'Form'" :visible="visible" :parent-op-type="currOpType"
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

    <!--    导入弹窗-->
    <excel-load @update:show="closeImport" :show="importVisibled" :header="header" :validator="validator"
                :upload-api="uploadApi" result-type="html" @onSucess="importVisibled = false"
                :download-function="downloadTemplate"/>

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

    <el-dialog title="资产卡片" center :fullscreen="true" :visible.sync="detailFormVisible"
               :close-on-click-modal="false" append-to-body>
      <asset-card-show :asset-card="editForm" :visible="detailFormVisible" @cancel="detailFormVisible = false"
                       @submit="afterDetailSubmit"></asset-card-show>
    </el-dialog>

  </section>
</template>

<script>
import config from "@/common/config"; //全局公共库import
import ExcelLoad from "../../../hr/user/excelLoad";
import {MdpTableMixin} from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import * as AssetCardApi from '@/api/oa/erp/ass/assetCard';
import AssetCardForm from './Form';//新增修改明细界面
import {mapGetters} from 'vuex'
import AssetCategoryTree from "../components/AssetCategoryTree.vue";
import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue";
import UsersSelect from '@/views/mdp/sys/user/UsersSelect';
import WarehouseComponents from "../../stk/components/WarehouseComponents.vue";
import QRCode from "qrcodejs2";
import {listArchiveAttachment} from "@/api/mdp/arc/archiveAttachment";

import assetReceiveAdd from '../assetReceive/assetReceiveAdd';
import assetReturnAdd from '../assetReturn/assetReturnAdd';
import assetReallocationAdd from '../assetReallocation/assetReallocationAdd';
import assetMaintAdd from '../assetMaint/assetMaintAdd';
import assetLeaseAdd from '../assetLease/assetLeaseAdd';
import assetDisposeAdd from '../assetDispose/assetDisposeAdd';
import assetChangeAdd from '../assetChange/assetChangeAdd';
import StockInEdit from "../../pur/stockIn/StockInEdit.vue";
import AssetInventoryAdd from "../assetInventory/assetInventoryAdd.vue";
import AssetCardShow from "./AssetCardShow";

export default {
  name: 'assetCardMng',
  mixins: [MdpTableMixin],
  components: {
    "asset-card-show": AssetCardShow,
    AssetCardForm, AssetCategoryTree, DeptTree, UsersSelect, WarehouseComponents,
    "excel-load": ExcelLoad, 'asset-receive-add': assetReceiveAdd,
    'asset-return-add': assetReturnAdd,
    'asset-reallocation-add': assetReallocationAdd,
    'asset-maint-add': assetMaintAdd,
    'asset-lease-add': assetLeaseAdd,
    'asset-dispose-add': assetDisposeAdd,
    'asset-change-add': assetChangeAdd,
    'stock-in-edit': StockInEdit,
    'asset-inventory-add': AssetInventoryAdd,
  },
  computed: {},
  watch: {},
  data() {
    return {
      detailFormVisible: false, //编辑界面是否显示
      reallocationAddFormVisible: false,
      maintAddFormVisible: false,
      leaseAddFormVisible: false,
      disposeAddFormVisible: false,
      changeAddFormVisible: false,
      stockInAddFormVisible: false,
      inventoryAddFormVisible: false,
      returnAddFormVisible: false,
      receiveAddFormVisible: false,
      uploadApi:
          config.getExcelUploadBasePath() +
          "/oa/erp/ass/assetCard/importAssetCard",
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
      //导入显示
      importVisibled: false,
      qrcodeVisible: false, //二维码
      assetStatusArr: ["闲置", "在用", "借用", "维修", "报废", "调拨", "处置"],
      //图文还是列表的方式展示资产卡片
      showImage: false,
      warehouseName: '',
      personLiableUserName: '',
      categoryTreeVisible: false, // 资产分类dialog
      visibleWarehouseSelect: false, // 存放地点dialog
      menuDefId: '',//menu_def.id 菜单表菜单编号，用于按钮权限判断
      menuDefName: 'ass_asset_card',//menu_def.name 功能名称，用于导出excel等文件名
      refId: 'assetCard',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
      pkNames: ["cardId"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
      currOpType: 'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
      filters: {//查询参数

      },
      defaultFilters: {//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

      },

      defaultCheckColumnNum: 22,//默认展示的表格列数，前8列

      editable: false,//是否可编辑模式

      //增删改查(含批量)接口
      apis: {
        list: AssetCardApi.listAssetCard,
        add: AssetCardApi.addAssetCard,
        del: AssetCardApi.delAssetCard,
        edit: AssetCardApi.editAssetCard,
        editSomeFields: AssetCardApi.editSomeFieldsAssetCard,
        batchAdd: AssetCardApi.batchAddAssetCard,
        batchDel: AssetCardApi.batchDelAssetCard,
        batchEdit: AssetCardApi.batchEditAssetCard,
      }
    }
  },
  methods: {
    afterDetailSubmit(assetCard, close) {
      if (close !== false) {
        this.detailFormVisible = false;
      }
      this.getAssetData();
    },
    // 资料卡片 列表模式的打开
    //显示编辑界面 AssetDetail ass_asset_detail
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    rowClick: function (row, event, column) {
      this.editForm = row
      if (event.label != '操作' && event.type != 'selection') {
        // this.showEdit(row)
        this.gotoDetail(row);
      }
      this.$emit("row-click", row, event, column); //  @row-click="rowClick"
    },
    // 资料卡片 图文模式的打开
    gotoDetail(item) {
      this.editForm = item;
      this.detailFormVisible = true;
      this.detailForm = Object.assign({}, item);
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
    },
    //下载模板
    downloadTemplate() {
      listArchiveAttachment({
        archiveId: "asset-card-template",
      }).then((res) => {
        let fileurl = config.getArcFileUploadBasePath() + "/" + res.data.data[0].url;
        this.download(fileurl, "资产卡片导入模板");
      });
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
    //关闭导入
    closeImport() {
      this.importVisibled = false;
    },

    handleCommand(command) {
      if (command === "batchUpdate") {
        if (this.selData.length === 0) {
          this.$message({message: "必须先选中一条记录", type: "error"});
        } else {
          this.batchEditVisible = true;
        }
      }
      // 导出
      if (command === "export") {
        this.export2Excel()
      }
      //如果是导入
      if (command === "import") {
        this.importVisibled = true;
      }
      if (command === "list") {
        this.searchTableDatas();
      }
      if (command === "add") {
        this.showAdd();
      }
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
    //切换图文或列表
    switchObj() {
      this.showImage = !this.showImage;
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
    //打开仓库选择
    getWarehouseData(data) {
      this.filters.warehouseId = data.id;
      this.warehouseName = data.name
      this.visibleWarehouseSelect = false;
    },

    openWarehouseSelect() {
      this.visibleWarehouseSelect = true;
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
      params.count = false
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
