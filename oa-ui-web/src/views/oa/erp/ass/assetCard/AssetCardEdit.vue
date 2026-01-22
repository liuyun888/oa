<template>
  <section>
    <el-row id="containers" class="page-container border padding">

      <el-row style="margin-bottom: 20px">
        <div>
          <el-button size="small" @click="cancel">取消</el-button>
          <el-button type="primary" size="small" @click="addSubmit('hold')">保存</el-button>
        </div>
      </el-row>
      <el-form :model="editForm" size="small" label-width="120px" :rules="addFormRules" ref="editForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="资产名称" prop="assetName">
              <el-input v-model="editForm.assetName"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="资产编码" prop="assetSn">
              <el-input @blur="validateAssetSn" v-model="editForm.assetSn" :disabled="true"></el-input>
              <div v-if="assetMsgShow">
                <i class="el-icon-warning"></i>
                <span class="tipMsg">{{ assetMsgTip }}</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="资产类别" prop="categoryName">
              <el-input @focus="visibleSelectAssetType=true" v-model="editForm.categoryName"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="资产序列号" prop="assetNo">
              <el-input v-model="editForm.assetNo"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="规格型号" prop="spec">
              <el-input v-model="editForm.spec"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="计量单位" prop="measUnit">
              <el-input v-model="editForm.measUnit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>


          <el-col :span="12">
            <el-form-item label="资产原值" prop="orignUnitAmount">
              <el-select v-model="editForm.currency" size="mini">
                <el-option
                    v-for="item in currencyArr"
                    :key="item.optionValue"
                    :label="item.optionName"
                    :value="item.optionValue">
                </el-option>
              </el-select>
              <el-input-number size="mini" controls-position="right" @focus="setHaoCaiCurrentRow(row.$index)"
                               v-model="editForm.orignUnitAmount" :min="0" :step="1"></el-input-number>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="使用年限(月)" prop="servLife">
              <el-input v-model="editForm.servLife"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="组织机构代码" prop="branchId">
              <el-input v-model="editForm.branchId"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="使用部门" prop="deptname">
              <el-input suffix-icon="el-icon-collection-tag" @focus="openDeptSelect" readonly=""
                        v-model="editForm.deptName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="存放地点" prop="storeAddress">
              <el-input suffix-icon="el-icon-collection-tag" @focus="openWarehouseSelect"
                        v-model="editForm.warehouseName"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="责任人" prop="personLiableUsername">
              <el-input suffix-icon="el-icon-collection-tag" @focus="openPersonLiableUserSelect"
                        v-model="editForm.personLiableUsername"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="采购人" prop="purchaseUsername">
              <el-input suffix-icon="el-icon-collection-tag" @focus="openPurchaseUserSelect"
                        v-model="editForm.purchaseUsername"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="采购日期" prop="purchaseDate">
              <el-date-picker
                  v-model="editForm.purchaseDate"
                  type="date"
                  placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="入库单号" prop="receiptNo">
              <el-input v-model="editForm.receiptNo"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="入库日期" prop="warehouseDate">
              <el-date-picker
                  v-model="editForm.warehouseDate"
                  type="date"
                  placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="供应商" prop="supplierName">
              <el-input suffix-icon="el-icon-collection-tag" @focus="openSupplierSelect" readonly=""
                        v-model="editForm.supplierName"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="保修期" prop="defectsLiabilityPeriod">
              <el-input v-model="editForm.defectsLiabilityPeriod"></el-input>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="12">
            <el-form-item label="所属父资产" prop="supplierName">
              <el-input @focus="openAssetSelect=visibleAssetSelect=true" readonly
                        v-model="editForm.passetName"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="所属父子产编码" prop="defectsLiabilityPeriod">
              <el-input v-model="editForm.passetSn"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="资产状态" prop="cardStatus">
              <el-radio v-model="editForm.cardStatus" label="0">闲置</el-radio>
              <el-radio v-model="editForm.cardStatus" label="1">在用</el-radio>
              <el-radio v-model="editForm.cardStatus" label="2">借用</el-radio>
              <el-radio v-model="editForm.cardStatus" label="3">维修</el-radio>
              <el-radio v-model="editForm.cardStatus" label="4">报废</el-radio>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="开始使用日期" prop="startUseDate">
              <el-date-picker
                  v-model="editForm.startUseDate"
                  type="date"
                  placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="盘点任务" prop="inventoryTask">
              <el-input v-model="editForm.inventoryTask"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="配置说明" prop="confDesc">
              <el-input v-model="editForm.confDesc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="editForm.remark"></el-input>
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

    <el-dialog append-to-body title="选择资产分类" center width="60%" :visible.sync="visibleSelectAssetType"
               :close-on-click-modal="false">
      <asset-category-tree @node-click="getSelectAssetTypeData"
                           @cancel="visibleSelectAssetType=false"></asset-category-tree>
    </el-dialog>


    <el-dialog append-to-body title="选择部门" width="50%" top="5vh" :visible.sync="visibleDeptSelect">
      <dept-tree :defaultExpandAll="true" @node-click="getDeptData"></dept-tree>
    </el-dialog>

    <el-dialog append-to-body title="仓库选择" width="70%" top="5vh" :visible.sync="visibleWarehouseSelect">
      <warehouse-components @row-click="getWarehouseData"></warehouse-components>
    </el-dialog>

    <el-dialog append-to-body title="人员选择" width="70%" top="5vh" :visible.sync="visiblepersonLiableUserSelect">
      <user-select @confirm="getPersonLiableUserData" :isSingleUser="true"></user-select>
    </el-dialog>

    <el-dialog append-to-body title="人员选择" width="70%" top="5vh" :visible.sync="visiblePurchaseUserSelect">
      <user-select @confirm="getPurchaseUserData" :isSingleUser="true"></user-select>
    </el-dialog>

    <supplier-components :append-to-body="true" :visible="visibleSupplierSelect"
                         @row-click="getSupplierData"></supplier-components>

    <el-dialog top="10vh" title="选择资产" append-to-body width="60%" :visible.sync="visibleAssetSelect"
               :close-on-click-modal="false">
      <asset-card-components isSingerSelect="true" @row-click="getAssetData" ref="assetDetail"
                             :visible="visibleAssetSelect" @cancel="visibleAssetSelect=false"></asset-card-components>
    </el-dialog>


  </section>
</template>

<script>
import util from '@/common/js/util';//全局公共库
import {mapGetters} from 'vuex';
import {editAssetCard} from '@/api/oa/erp/ass/assetCard';
import AssetCategoryTree from '../../ass/components/AssetCategoryTree';
import DeptTree from '@/views/mdp/sys/dept/DeptTree';
import WarehouseComponents from '../../stk/components/WarehouseComponents';
import UsersSelect from '@/views/mdp/sys/user/UsersSelect';
import SupplierComponents from '../../pur/components/SupplierComponents';
import AssetCardComponents from '../components/AssetCardComponents';
import AttachmentUpload from '@/views/mdp/arc/archiveAttachment/AttachmentUpload';
import {isExitAssetSn} from '@/api/oa/erp/ass/assetCard';
import {listOption} from "@/api/mdp/meta/itemOption"; //下拉框数据查询


export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  props: ['assetCard', 'visible', 'assetType'],
  watch: {

    'assetCard': function (assetReceiveOper) {
      this.editForm = assetReceiveOper;
    },

    'assetType': function (data) {
      this.assetTypeObj = data;
    },

    'visible': function (visible) {
      if (visible == true) {
        //从新打开页面时某些数据需要重新加载，可以在这里添加
        this.editForm = Object.assign(this.editForm, this.assetCard);
        this.setDefaultParams();
      }
    }

  },
  data() {
    return {
      options: {},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
      load: {list: false, edit: false, del: false, add: false},//查询中...
      //新增界面数据 ass_asset_detail_oper
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
        currency: ''
      },
      addFormRules: {
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
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/
      assetTypeObj: '',
      visibleSelectAssetType: false,
      visibleDeptSelect: false,
      visibleWarehouseSelect: false,
      visiblepersonLiableUserSelect: false,
      visiblePurchaseUserSelect: false,
      visibleSupplierSelect: false,
      visibleAssetSelect: false,

      //上传数据
      uploadArchiveId: '',
      uploadCategoryId: '',

      //限制上传个数
      uploadLimit: 1,

      assetMsgShow: false,
      assetMsgTip: '',

      currencyArr: [],

      /**end 在上面加自定义属性**/
    }//end return
  },//end data
  methods: {

    cancel() {
      //this.$refs['editForm'].resetFields();

      this.$emit('cancel');
      //this.$emit('submit');
    },

    addClose() {
      this.$refs['editForm'].resetFields();
    },

    isNull(data) {
      if (data === null || data === '' || data === undefined) {
        return true;
      }
      return false;
    },

    getSelectAssetTypeData(data) {
      this.editForm.categoryId = data.categoryId;
      this.editForm.categoryName = data.categoryName;
      this.visibleSelectAssetType = false;
    },

    //开启部门选择
    openDeptSelect() {
      this.visibleDeptSelect = true;
    },

    //获取部门数据
    getDeptData(data) {
      this.editForm.deptid = data.deptid;
      this.editForm.deptName = data.deptName;
      this.visibleDeptSelect = false;
    },


    //开启仓库地址选择
    openWarehouseSelect() {
      this.visibleWarehouseSelect = true;
    },

    //获取仓库地址数据
    getWarehouseData(data) {
      this.editForm.warehouseId = data.id;
      this.editForm.warehouseName = data.name;
      this.editForm.storeAddress = data.address;
      this.visibleWarehouseSelect = false;
    },

    //开启责任人选择
    openPersonLiableUserSelect() {
      this.visiblepersonLiableUserSelect = true;
    },


    //获取责任人数据
    getPersonLiableUserData(data) {
      this.editForm.personLiableUserid = data[0].userid;
      this.editForm.personLiableUsername = data[0].username;
      this.visiblepersonLiableUserSelect = false;
    },

    openPurchaseUserSelect() {
      this.visiblePurchaseUserSelect = true;
    },

    getPurchaseUserData(data) {
      this.editForm.purchaseUserid = data[0].userid;
      this.editForm.purchaseUsername = data[0].username;
      this.visiblePurchaseUserSelect = false;
    },


    //打开供应商显示
    openSupplierSelect() {
      this.visibleSupplierSelect = true;
    },

    //获得供应商数据
    getSupplierData(data) {
      this.editForm.supplierId = data.cpId;
      this.editForm.supplierName = data.cpName;
      this.visibleSupplierSelect = false;
    },


    //获得资产卡片数据
    getAssetData(data) {
      this.editForm.passetName = data.assetName;
      this.editForm.passetSn = data.assetSn;
      this.visibleAssetSelect = false;
    },

    //获取资产图片
    getImageUrl(file, fileList2) {
      fileList2.length === 0 ? this.editForm.assetImageUrl = '' : this.editForm.assetImageUrl = file.url;
    },

    setDefaultParams() {
      this.getOption();
      this.uploadArchiveId = this.editForm.cardId;
      this.uploadCategoryId = 'asset_card_upload';
    },


    addSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.load.add = true
            //明细数据校验
            if (!this.isNull(this.editForm.purchaseDate) && this.editForm.purchaseDate instanceof Date) {
              this.editForm.purchaseDate = util.formatDate(this.editForm.purchaseDate, "yyyy-MM-dd HH:mm:ss")
            }

            if (!this.isNull(this.editForm.warehouseDate) && this.editForm.warehouseDate instanceof Date) {
              this.editForm.warehouseDate = util.formatDate(this.editForm.warehouseDate, "yyyy-MM-dd HH:mm:ss")
            }

            if (!this.isNull(this.editForm.startUseDate) && this.editForm.startUseDate instanceof Date) {
              this.editForm.startUseDate = util.formatDate(this.editForm.startUseDate, "yyyy-MM-dd HH:mm:ss")
            }

            let params = Object.assign({}, this.editForm);
            editAssetCard(params).then((res) => {
              this.load.add = false
              var tips = res.data.tips;
              if (tips.isOk) {
                this.$emit('submit', res.data.data);//  @submit="afterAddSubmit"
              }
              this.$message({message: tips.msg, type: tips.isOk ? 'success' : 'error'});
            }).catch(err => this.load.add = false);
          });
        }
      });
    },


    validateAssetSn() {
      // if(!this.isNull(this.editForm.assetSn)) {
      //     isExitAssetSn({"assetSn": this.editForm.assetSn}).then((res) => {
      //         var tips=res.data.tips;
      //         if(tips.isOk){
      //             this.assetMsgShow = false;
      //         }else{
      //             this.assetMsgShow = true;
      //             this.assetMsgTip = "该资产编码已存在，请重新输入";
      //         }
      //     }).catch();
      // }
    },


    getOption() {
      let params = [
        {categoryId: "all", itemCode: "currency"},
      ];
      listOption(params).then(res => {
        // this.currencyArr = res.data.data.currency;
        this.currencyArr = res.data && res.data.data && res.data.data.currency ? res.data.data.currency : [];
      });
    },


  },

  components: {
    //在下面添加其它组件 'pur-require-edit':PurRequireEdit
    "asset-category-tree": AssetCategoryTree,
    'dept-tree': DeptTree,
    'warehouse-components': WarehouseComponents,
    'user-select': UsersSelect,
    'supplier-components': SupplierComponents,
    'asset-card-components': AssetCardComponents,
    'attachment-upload': AttachmentUpload,
  },

  mounted() {
    this.editForm = Object.assign(this.editForm, this.assetCard);
    this.$nextTick(() => {
      this.setDefaultParams();
    })
  }
}

</script>

<style scoped>
.el-icon-warning {
  position: relative;
  top: 9px;
  margin-right: 2px;
}

.el-icon-warning, .tipMsg {
  color: red;
  float: left;
}

</style>
