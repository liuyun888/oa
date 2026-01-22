<template>
  <section>
    <el-row id="containers" class="page-container border padding">
      <el-row style="margin-bottom: 20px">
      </el-row>
      <el-row>
        <!--新增/编辑界面 AssetCard ass_asset_card-->
        <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editFormRef">
          <el-row>
            <el-col :span="12">
              <el-form-item label="父资产名称" prop="passetName">
                <el-input v-model="editForm.passetName" placeholder="所属父资产名称" :maxlength="50"
                          @change="editSomeFields(editForm,'passetName',$event)"
                          :disabled="  disabledJudge('passetName')"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="父资产编码" prop="passetSn">
                <el-input v-model="editForm.passetSn" placeholder="所属父资产" :maxlength="50"
                          @change="editSomeFields(editForm,'passetSn',$event)" :disabled="  disabledJudge('passetSn')"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="资产名称" prop="assetName">
                <el-input v-model="editForm.assetName" placeholder="资产名称" :maxlength="255"
                          @change="editSomeFields(editForm,'assetName',$event)"
                          :disabled="  disabledJudge('assetName')"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="资产序列号" prop="assetNo">
                <el-input v-model="editForm.assetNo" placeholder="资产序列号" :maxlength="50"
                          @change="editSomeFields(editForm,'assetNo',$event)" :disabled="  disabledJudge('assetNo')"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="资产类别" prop="categoryName">
                <el-input v-model="editForm.categoryName" placeholder="资产分类名称" :maxlength="50"
                          @change="editSomeFields(editForm,'categoryName',$event)"
                          :disabled="  disabledJudge('categoryName')"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="资产编码" prop="assetSn">
                <el-input v-model="editForm.assetSn" placeholder="资产编码" :maxlength="50"
                          @change="editSomeFields(editForm,'assetSn',$event)" :disabled="  disabledJudge('assetSn')"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="规格型号" prop="spec">
                <el-input v-model="editForm.spec" placeholder="规格型号" :maxlength="50"
                          @change="editSomeFields(editForm,'spec',$event)" :disabled="  disabledJudge('spec')"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计量单位" prop="measUnit">
                <el-input v-model="editForm.measUnit" placeholder="计量单位" :maxlength="50"
                          @change="editSomeFields(editForm,'measUnit',$event)" :disabled="  disabledJudge('measUnit')"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="资产原值" prop="orignUnitAmount">
                <el-select v-model="editForm.currency" size="mini" :disabled="  disabledJudge('orignUnitAmount')">
                  <el-option v-for="item in currencyArr" :key="item.optionValue" :label="item.optionName"
                             :value="item.optionValue">
                  </el-option>
                </el-select>

                <el-input-number size="mini" controls-position="right"
                                 v-model="editForm.orignUnitAmount" :min="0" :step="1"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="使用期限(月)" prop="servLife">
                <el-input v-model="editForm.servLife" placeholder="使用期限" :maxlength="50"
                          @change="editSomeFields(editForm,'servLife',$event)" :disabled="  disabledJudge('servLife')"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="组织机构代码" prop="branchId">
                <el-input v-model="editForm.branchId" placeholder="组织机构代码" :maxlength="50"
                          @change2="test" :disabled="  disabledJudge('branchId')"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="使用部门名称" prop="deptName">
                <mdp-select-dept v-model="editForm.deptName" placeholder="使用部门名称" :maxlength="50"
                                 :width="100+'%'"
                                 @change2="(option)=>{
                                        editSomeFields(editForm,'deptid',option.id);
                                        editSomeFields(editForm,'deptName',option.name);}"
                                 :disabled="  disabledJudge('deptName')"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="存放地点" prop="storeAddress">
                <el-input placeholder="存放地点" :maxlength="255" suffix-icon="el-icon-collection-tag"
                          @focus="openWarehouseSelect"
                          v-model="editForm.warehouseName"
                          @change="editSomeFields(editForm,'storeAddress',$event)"
                          :disabled="  disabledJudge('storeAddress')"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="责任人" prop="personLiableUsername">
                <mdp-select-user v-model="editForm.personLiableUsername" placeholder="责任人名称" :maxlength="50"
                                 :width="100+'%'"
                                 @change2="(option)=>{
                                        editSomeFields(editForm,'personLiableUsername',option.name);
                                        editSomeFields(editForm,'personLiableUserid',option.id); }"
                                 :disabled="disabledJudge('personLiableUsername')"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="采购人名称" prop="purchaseUsername">
                <mdp-select-user v-model="editForm.purchaseUsername" placeholder="采购人名称" :maxlength="50"
                                 :width="100+'%'"
                                 @change2="(option)=>{
                                        editSomeFields(editForm,'purchaseUsername',option.name);
                                        editSomeFields(editForm,'purchaseUserid',option.id); }"
                                 :disabled="  disabledJudge('purchaseUsername')"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采购时间" prop="purchaseDate">
                <el-date-picker type="date" placeholder="选择日期" v-model="editForm.purchaseDate"
                                value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"
                                :disabled="  disabledJudge('purchaseDate')"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="入库单号" prop="receiptNo">
                <el-input v-model="editForm.receiptNo" placeholder="入库单号" :maxlength="255"
                          @change="editSomeFields(editForm,'receiptNo',$event)"
                          :disabled="  disabledJudge('receiptNo')"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="入库日期" prop="warehouseDate">
                <el-date-picker type="date" placeholder="选择日期" v-model="editForm.warehouseDate"
                                value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"
                                :disabled="  disabledJudge('warehouseDate')"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="供应商" prop="supplierName">
                <el-input v-model="editForm.supplierName" placeholder="供应商" :maxlength="255"
                          suffix-icon="el-icon-collection-tag" @focus="openSupplierSelect" readonly
                          :disabled="disabledJudge('supplierName')"/>
                <!--                        @change="editSomeFields(editForm,'supplierName',$event)"-->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="保修期" prop="defectsLiabilityPeriod">
                <el-input v-model="editForm.defectsLiabilityPeriod"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="资产状态0闲置1在用2借用3维修4报废" prop="assetStatus">
                <el-radio-group v-model="editForm.assetStatus" placeholder="资产状态0闲置1在用2借用3维修4报废"
                                :maxlength="50"
                                @change="editSomeFields(editForm,'assetStatus',$event)" style="margin-left: 0;"
                                :disabled="  disabledJudge('assetStatus')">
                  <el-radio label="0">闲置</el-radio>
                  <el-radio label="1">在用</el-radio>
                  <el-radio label="2">借用</el-radio>
                  <el-radio label="3">维修</el-radio>
                  <el-radio label="4">报废</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="开始使用日期" prop="startUseDate">
                <el-date-picker type="date" placeholder="选择日期" v-model="editForm.startUseDate"
                                value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"
                                :disabled="  disabledJudge('startUseDate')"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="24">
              <el-form-item label="盘点任务" prop="inventoryTask">
                <el-input v-model="editForm.inventoryTask" placeholder="盘点任务" :maxlength="255"
                          @change="editSomeFields(editForm,'inventoryTask',$event)"
                          :disabled="  disabledJudge('inventoryTask')"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="配置说明" prop="confDesc">
                <el-input v-model="editForm.confDesc" placeholder="配置说明" :maxlength="255"
                          @change="editSomeFields(editForm,'confDesc',$event)" :disabled="  disabledJudge('confDesc')"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="editForm.remark" placeholder="备注" :maxlength="255"
                          @change="editSomeFields(editForm,'remark',$event)" :disabled="  disabledJudge('remark')"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="资产图片" prop="remark">
                <attachment-upload :limit="uploadLimit" @on-change="getImageUrl" :archiveId="uploadArchiveId"
                                   :categoryId="uploadCategoryId" :branchId="userInfo.branchId"></attachment-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>

      <slot name="footer" :page="this">
        <el-row v-if="showBtn!==false" style="float:right;" class="footer">
          <el-button @click.native="close">关闭</el-button>
          <el-button v-if="currOpType=='add'" v-loading="load.edit" type="primary" @click.native="saveSubmit"
                     :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交
          </el-button>
        </el-row>
      </slot>
    </el-row>

    <!--    dialog-->
    <el-dialog append-to-body title="仓库选择" width="70%" top="5vh" :visible.sync="visibleWarehouseSelect">
      <warehouse-components @row-click="getWarehouseData"></warehouse-components>
    </el-dialog>

    <supplier-components :append-to-body="true" :visible="visibleSupplierSelect" @closePopWin="closePopWin"
                         @row-click="getSupplierData"></supplier-components>
  </section>
</template>

<script>
import * as AssetCardApi from '@/api/oa/erp/ass/assetCard';
import {mapGetters} from 'vuex'
import {MdpFormMixin} from '@/components/mdp-ui/mixin/MdpFormMixin.js';
import {listOption} from "@/api/mdp/meta/itemOption";
import WarehouseComponents from '../../stk/components/WarehouseComponents';
import SupplierComponents from '../../pur/components/SupplierComponents';
import AttachmentUpload from '@/views/mdp/arc/archiveAttachment/AttachmentUpload';

export default {
  name: 'assetCardForm',
  mixins: [MdpFormMixin],
  components: {
    'attachment-upload': AttachmentUpload,
    'supplier-components': SupplierComponents,
    'warehouse-components': WarehouseComponents,
  },
  computed: {},
  props: {},
  watch: {},
  data() {
    return {
      //上传数据
      uploadArchiveId: '',
      uploadCategoryId: '',
      //限制上传个数
      uploadLimit: 1,
      visibleSupplierSelect: false,
      visibleWarehouseSelect: false,
      menuDefId: '',//menu_def.id 菜单表菜单编号，用于按钮权限判断
      pkNames: ["cardId"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
      currOpType: 'add',//表单 add、edit，所有按钮可动、detail-只看不能操作
      editFormRules: {
        cardId: [
          //{ required: true, message: '此项必填', trigger: 'change' },
          //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
        ],
        assetName: [
          {required: true, message: '资产名称不能为空', trigger: 'change'}
        ],

        assetSn: [
          {required: true, message: '资产编码不能为空', trigger: 'change'}
        ],

        cardStatus: [
          {required: true, message: '资产状态不能为空', trigger: 'change'}
        ]
      },
      editForm: {
        cardId: '',
        detailId: '',
        cardStatus: '',
        assetSn: '',
        assetNo: '',
        spec: '',
        measUnit: '',
        orignUnitAmount: '',
        servLife: '',
        branchId: '',
        deptid: '',
        deptName: '',
        personLiableUserid: '',
        personLiableUsername: '',
        purchaseUserid: '',
        purchaseUsername: '',
        purchaseDate: '',
        supplierId: '',
        supplierName: '',
        passetSn: '',
        passetName: '',
        defectsLiabilityPeriod: '',
        warehouseDate: '',
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
        assetName: '',
        warehouseId: '',
        warehouseName: '',
        storeAddress: '',
        productId: '',
        productSn: '',
        brandId: '',
        brandName: '',
        cardType: '',
        categoryId: '',
        categoryName: '',
        isInventory: '',
        currency: '',
        stockNum: '',
        splitNum: '',
        residualValue: '',
        netWorth: '',
        premiumSale: '',
        cbCenterId: '',
        cbCenterName: '',
        bizFlowState: '',
        bizProcInstId: '',
        flowTitle: '',
        isMaint: '',
        maintStartTime: '',
        maintEndTime: ''
      },
      //增删改查(含批量)接口
      apis: {
        queryById: AssetCardApi.queryAssetCardById,
        add: AssetCardApi.addAssetCard,
        edit: AssetCardApi.editAssetCard,
        editSomeFields: AssetCardApi.editSomeFieldsAssetCard
      },
      editable: true,//是否可编辑模式
      //币种数据
      currencyArr: [],
    }
  },
  methods: {
    test(option) {
      console.log(option)
    },
    //获取资产图片
    getImageUrl(file, fileList2) {
      console.log(file, fileList2);
      fileList2.length === 0 ? this.addForm.assetImageUrl = '' : this.addForm.assetImageUrl = file.url;
    },
    closePopWin() {
      this.visibleSupplierSelect = false;
    },
    //获得供应商数据
    getSupplierData(data) {
      this.editForm.supplierId = data.cpId;
      this.editForm.supplierName = data.cpName;
      this.visibleSupplierSelect = false;
    },
    //打开供应商显示
    openSupplierSelect() {
      this.visibleSupplierSelect = true;
    },
    //获取仓库地址数据
    getWarehouseData(data) {
      this.editForm.warehouseId = data.id;
      this.editForm.warehouseName = data.name;
      this.editForm.storeAddress = data.address;
      this.visibleWarehouseSelect = false;
    },
    //开启仓库地址选择
    openWarehouseSelect() {
      this.visibleWarehouseSelect = true;
    },
    getOption() {
      let params = [
        {categoryId: "all", itemCode: "currency"},
      ];
      listOption(params).then(res => {
        this.currencyArr = res.data && res.data.data && res.data.data.currency ? res.data.data.currency : [];
      });
    },

    //由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
    initCurrData() {

    },
    /**
     * 检查参数是否满足调用后台接口的条件
     * @returns true / false
     */
    preParamCheck(params) {
      return true;
    },
    /**
     * 对修改的字段进行判断，返回false ,将取消更新数据库,由组件扩展
     * @param {*} row 当前选中的行
     * @param {*} fieldName 修改的字段名
     * @param {*} $event 修改后的值
     * @param {*} params 将要提交服务器的参数
     * @returns true/false 返回false ,将取消更新数据库
     */
    editSomeFieldsCheck(row, fieldName, $event, params) {
      if (this.editable == false) {
        return false;
      }
      params[fieldName] = $event
      return true;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getOption();
    })
  }
}

</script>

<style scoped>

</style>
