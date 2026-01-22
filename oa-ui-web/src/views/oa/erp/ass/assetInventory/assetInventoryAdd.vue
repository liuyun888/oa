<template>
  <section>
    <el-row class="page-container border padding">
      <el-row>
        <div>
          <el-button size="small" @click="cancel">取消</el-button>
          <!-- <el-button type="primary" size="small" @click="addSubmit('hold')">暂存</el-button> -->
          <el-button type="primary" size="small" @click="addSubmit('submit')">提交</el-button>
        </div>
        <el-divider content-position="center">资产盘点</el-divider>
      </el-row>

      <!--新增界面 PurRequire pur_require-->
      <el-form :model="addForm" size="small" label-width="100px" :rules="addFormRules" ref="addForm">
        <el-row>
          <el-form-item label="标题" prop="reqTitle">
            <el-input v-model="addForm.reqTitle" placeholder="请输入标题"></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="类别">
              <el-input disabled placeholder="资产盘点单"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="编号">
              <el-input disabled placeholder="系统自动生成"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="申请人" prop="reqUsername">
              <el-input readonly v-model="addForm.reqUsername"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请部门" prop="reqDeptName">
              <el-input readonly v-model="addForm.reqDeptName"></el-input>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="盘点任务" prop="reqUsername">
              <el-input readonly v-model="addForm.inventoryTask"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="申请日期">
              <el-date-picker
                  readonly
                  type="date"
                  v-model="addForm.reqDate"
                  placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-table size="small" border :data="assetData" stripe>
            <el-table-column label="序号" type="index" width="50">
            </el-table-column>

            <el-table-column prop="assetSn" align="center" label="资产编码" width="">
            </el-table-column>

            <el-table-column prop="assetName" align="center" label="资产名称" width="">
            </el-table-column>

            <el-table-column align="center" label="责任人" width="100">
              <template slot-scope="row">
                <el-input @focus="openUserSelect(row.$index)" v-model="assetData[row.$index].nowPsersonLiableUsername"
                          size="mini"></el-input>
              </template>
            </el-table-column>

            <el-table-column prop="warehouseName" align="center" label="存放地点" width="200">
              <template slot-scope="row">
                <el-input @focus="openWarehouseSelect(row.$index)" v-model="assetData[row.$index].nowWarehouseName"
                          size="mini"></el-input>
              </template>
            </el-table-column>

            <el-table-column prop="deptName" align="center" label="资产使用部门" width="200">
              <template slot-scope="row">
                <el-input @focus="openDeptSelect(row.$index)" v-model="assetData[row.$index].nowDeptName"
                          size="mini"></el-input>
              </template>
            </el-table-column>

            <el-table-column prop="deptName" align="center" label="资产使用状态" width="200">
              <template slot-scope="row">
                <el-select size="mini" v-model="assetData[row.$index].assetStatusAfter" placeholder="请选择">
                  <el-option
                      v-for="item in assetStatusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>


            <el-table-column align="center" label="备注" width="200">
              <template slot-scope="row">
                <el-input v-model="assetData[row.$index].disposeRemark" size="mini"></el-input>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="80">
              <template slot-scope="row">
                <i class="el-icon-remove-outline" @click="delRow(row.$index)"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-row>

        <el-row class="topSpace">
          <el-form-item label="备注" prop="reqReason">
            <el-input type="textarea" v-model="addForm.reqReason" :rows="4"></el-input>
          </el-form-item>
        </el-row>

        <el-row class="topSpace">
          <el-form-item label="上传">
            <attachment-upload :archiveId="uploadArchiveId" :categoryId="uploadCategoryId"
                               :branchId="userInfo.branchId"></attachment-upload>
          </el-form-item>
        </el-row>

      </el-form>

    </el-row>

    <el-dialog append-to-body title="选择部门" width="50%" top="5vh" :visible.sync="visibleDeptSelect">
      <dept-tree :defaultExpandAll="true" @node-click="getDeptData"></dept-tree>
    </el-dialog>

    <el-dialog append-to-body title="仓库选择" width="70%" top="5vh" :visible.sync="visibleWarehouseSelect">
      <warehouse-components @row-click="getWarehouseData"></warehouse-components>
    </el-dialog>

    <el-dialog append-to-body title="人员选择" width="70%" top="5vh" :visible.sync="visibleUserSelect">
      <user-select @confirm="getUserData" :isSingleUser="true"></user-select>
    </el-dialog>


  </section>
</template>

<script>
import util from '@/common/js/util';//全局公共库
import {mapGetters} from 'vuex';
import AttachmentUpload from '@/views/mdp/arc/archiveAttachment/AttachmentUpload';
import {sn} from '@/common/js/sequence'; //id生成器
import AssetCardComponents from '../components/AssetCardComponents';
import DeptTree from '@/views/mdp/sys/dept/DeptTree';
import UsersSelect from '@/views/mdp/sys/user/UsersSelect';
import WarehouseComponents from '../../stk/components/WarehouseComponents';
import {addAssetMng} from '@/api/oa/erp/ass/assetMng';

export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  props: ['assetInventory', 'visible', 'mngParams'],
  watch: {

    //   'assetInventory':function( assetInventoryOper ) {
    //         this.addForm = assetInventoryOper;
    //    },

    'visible': function (visible) {
      if (visible == true) {
        //从新打开页面时某些数据需要重新加载，可以在这里添加
        this.setDefaultParam();

      }
    },
    addForm: {
      handler: function (val, oldval) {
        if (!this.isNull(val.startDate) && !this.isNull(val.endDate)) {
          this.addForm.totalDay = this.getDaysBetween(val.startDate, val.endDate);
          this.addForm.totalDay < 0 ? this.dateTip = true : this.dateTip = false;
        }
      },
      deep: true
    }
  },
  data() {
    return {
      options: {},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
      load: {list: false, edit: false, del: false, add: false},//查询中...
      addFormRules: {
        id: [
          //{ required: true, message: '主键不能为空', trigger: 'change' }
        ],
        reqTitle: [
          {required: true, message: '标题不能为空', trigger: 'change'}
        ],
        inDeptName: [
          {required: true, message: '借入部门不能为空', trigger: 'change'}
        ],
        outDeptName: [
          {required: true, message: '借出部门不能为空', trigger: 'change'}
        ],

      },
      //新增界面数据 ass_asset_detail_oper
      addForm: {
        reqTitle: '',
        reqUserid: '',
        reqUsername: '',
        reqDeptid: '',
        reqDeptName: '',
        reqDate: '',
        id: '',
        opType: '',
        reqReason: '',
        startDate: '',
        endDate: '',
        totalDay: 0,
        inDeptId: '',
        inDeptName: '',
        outDeptId: '',
        outDeptName: '',
        inBranchId: '',
        inBranchName: '',
        outBranchId: '',
        outBranchName: '',
      },
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/
      uploadArchiveId: '',
      uploadCategoryId: '',
      assetData: [],
      visibleDeptSelect: false,
      visibleWarehouseSelect: false,
      visibleUserSelect: false,
      //是否是批量选择
      assetMng: "inventory",
      assetStatusOptions: [
        {
          label: '闲置',
          value: '0'
        },

        {
          label: '在用',
          value: '1'
        },

        {
          label: '借用',
          value: '2'
        },

        {
          label: '维修',
          value: '3'
        },

        {
          label: '报废',
          value: '4'
        }
      ]

      /**end 在上面加自定义属性**/
    }//end return
  },//end data
  methods: {

    cancel() {
      this.$refs['addForm'].resetFields();
      this.assetData = [];
      this.$emit('submit');
      // Object.assign(this.$data.addForm, this.$options.data().addForm);
    },

    // addClose() {
    //     this.$refs['addForm'].resetFields();
    //     this.assetData = [];
    //     Object.assign(this.$data.addForm, this.$options.data().addForm);
    // },

    addSubmit(status) {
      this.addForm.mngStatus = status;
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let flag = this.validateAssetData();
          if (!flag) return;
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.load.add = true
            //明细数据校验
            if (!this.isNull(this.addForm.reqDate) && this.addForm.reqDate instanceof Date) {
              this.addForm.reqDate = util.formatDate(this.addForm.reqDate, "yyyy-MM-dd HH:mm:ss")
            }
            let params = Object.assign({}, this.transfreData(this.addForm));
            addAssetMng(params).then((res) => {
              this.load.add = false
              var tips = res.data.tips;
              if (tips.isOk) {
                this.$refs['addForm'].resetFields();
                this.$emit('submit');//  @submit="afterAddSubmit"
              }
              this.$message({message: tips.msg, type: tips.isOk ? 'success' : 'error'});
            }).catch(err => this.load.add = false);
          });
        }
      });
    },

    transfreData(data) {

      if (!this.isNull(data.startDate) && data.startDate instanceof Date) {
        data.startDate = util.formatDate(data.startDate, "yyyy-MM-dd HH:mm:ss")
      }

      if (!this.isNull(data.endDate) && data.endDate instanceof Date) {
        data.endDate = util.formatDate(data.endDate, "yyyy-MM-dd HH:mm:ss")
      }

      this.assetData.forEach(p => {
        if (!this.isNull(p.allocDate) && p.allocDate instanceof Date) {
          p.allocDate = util.formatDate(p.allocDate, "yyyy-MM-dd HH:mm:ss")
        }
        p.cardStatus = p.assetStatusAfter;
      })


      let param = {
        assetMng: data,
        assetDetails: this.assetData
      };
      return param;
    },

    validateAssetData() {
      if (this.assetData.length <= 0) {
        this.$message.error("入库资产清单不能为空");
        return false;
      }

      //校验日期，结束日期不能早于开始日期
      if (this.dateTip) {
        this.$message.error("结束日期不能早于开始日期");
        return false;
      }

      return true;
    },

    //设置默认参数
    setDefaultParam() {
      let user = this.userInfo;
      this.addForm.reqUserid = user.userid;
      this.addForm.reqUsername = user.username;
      this.addForm.reqDeptid = user.deptid;
      this.addForm.reqDeptName = user.deptName;
      this.addForm.reqDate = new Date();
      this.addForm.id = sn();
      //操作类型：领用
      this.addForm.opType = "inventory";
      this.uploadArchiveId = this.addForm.id;
      this.uploadCategoryId = 'asset_inventory_upload';
      this.assetData = this.assetInventory;
      this.assetData.forEach(a => {
        this.$set(a, "nowDeptid", a.deptid);
        this.$set(a, "nowDeptName", a.deptName);
        this.$set(a, "nowPsersonLiableUserid", a.purchaseUserid);
        this.$set(a, "nowPsersonLiableUsername", a.purchaseUsername);
        this.$set(a, "nowWarehouseId", a.warehouseId);
        this.$set(a, "nowWarehouseName", a.warehouseName);
        this.$set(a, "nowStoreAddress", a.storeAddress);
        this.$set(a, "assetStatusAfter", a.cardStatus);
        this.$set(a, "assetStatusBefore", a.cardStatus);
        this.$set(a, "allocDate", new Date());
      })
      this.addForm.inventoryTask = this.mngParams.taskId;
    },

    //查询资产
    searchAsset() {
      this.selectAssetVisible = true;
    },

    //选择资产关闭
    assetClose() {
      this.$refs.assetDetail.cancel();
    },

    setCurrentRow(index) {
      this.currentRow = index;
    },

    //删除表单数据
    delRow(index) {
      this.assetData.splice(index, 1);
      if (this.assetData.length <= 0) this.batchDisabled = true;
    },

    isNull(data) {
      if (data === null || data === '' || data === undefined) {
        return true;
      }
      return false;
    },

    getDaysBetween(dateString1, dateString2) {
      var startDate = Date.parse(dateString1);
      var endDate = Date.parse(dateString2);
      var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
      return days;
    },


    openDeptSelect(index) {
      this.currentRow = index;
      this.visibleDeptSelect = true;
    },

    //获取选择部门数据
    getDeptData(data) {
      this.$set(this.assetData[this.currentRow], "nowDeptid", data.deptid);
      this.$set(this.assetData[this.currentRow], "nowDeptName", data.deptName);
      this.visibleDeptSelect = false;
    },

    openWarehouseSelect(index) {
      this.currentRow = index;
      this.visibleWarehouseSelect = true;
    },

    //打开仓库选择
    getWarehouseData(data) {
      this.$set(this.assetData[this.currentRow], "nowStoreAddress", data.address);
      this.$set(this.assetData[this.currentRow], "nowWarehouseId", data.id);
      this.$set(this.assetData[this.currentRow], "nowWarehouseName", data.name);
      this.visibleWarehouseSelect = false;
    },

    openUserSelect(index) {
      this.currentRow = index;
      this.visibleUserSelect = true;
    },

    getUserData(data) {
      this.$set(this.assetData[this.currentRow], "nowPsersonLiableUserid", data[0].userid);
      this.$set(this.assetData[this.currentRow], "nowPsersonLiableUsername", data[0].username);
      this.visibleUserSelect = false;
    },


  },

  components: {
    //在下面添加其它组件 'pur-require-edit':PurRequireEdit
    'attachment-upload': AttachmentUpload,
    'asset-card-components': AssetCardComponents,
    'dept-tree': DeptTree,
    'user-select': UsersSelect,
    'warehouse-components': WarehouseComponents
  },

  mounted() {
    this.setDefaultParam();
    //获取数据


  }//end mounted

}


</script>


<style>

.topSpace {
  margin-top: 20px;
}

</style>
