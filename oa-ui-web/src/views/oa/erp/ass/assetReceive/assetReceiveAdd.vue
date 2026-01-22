<template>
  <section>
    <el-row class="page-container border padding">

      <el-row>
        <div>
          <el-button size="small" @click="cancel">取消</el-button>
          <el-button type="primary" size="small" @click="addSubmit('hold')">暂存</el-button>
          <el-button type="primary" size="small" @click="addSubmit('submit')">提交并发审</el-button>
        </div>
        <el-divider content-position="center">资产领用</el-divider>
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
              <el-input disabled placeholder="资产领用单"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="编号">
              <el-input disabled placeholder="系统自动生成"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="申请人" prop="reqUsername">
              <el-input readonly v-model="addForm.reqUsername"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请部门" prop="reqDeptName">
              <el-input readonly v-model="addForm.reqDeptName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
          <el-form-item label="选择资产">
            <el-button type="primary" size="mini" @click="searchAsset">查找</el-button>
          </el-form-item>
        </el-row>
        <el-row>
          <el-table size="small" border :data="assetData" stripe>
            <el-table-column label="序号" type="index" width="50"/>
            <el-table-column prop="assetSn" align="center" label="资产编码" width="">
            </el-table-column>
            <el-table-column prop="assetName" align="center" label="资产名称" width="">
            </el-table-column>
            <el-table-column prop="categoryName" align="center" label="资产类别" width="">
            </el-table-column>
            <el-table-column prop="spec" align="center" label="规格型号" width="">
            </el-table-column>
            <el-table-column prop="orignUnitAmount" align="center" label="原值" width="">
            </el-table-column>
            <el-table-column prop="" align="center" label="领用日期" width="245">
              <template slot-scope="row">
                <el-date-picker @focus="setCurrentRow(row.$index)"
                                v-model="assetData[row.$index].allocDate"
                                type="date"
                                size="mini"
                                placeholder="选择日期"
                                :clearable="false">
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column prop="" align="center" label="资产使用部门" width="200">
              <template slot-scope="row">
                <span class="vTip">*</span>
                <el-input @focus="openDeptSelect(row.$index)" v-model="assetData[row.$index].nowDeptName"
                          size="mini"></el-input>
                <div v-show="validateData[row.$index].oneShow">
                  <i class="el-icon-warning"></i>
                  <span class="tipMsg">{{ validateData[row.$index].oneMsg }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="" align="center" label="责任人" width="100">
              <template slot-scope="row">
                <span class="vTip">*</span>
                <el-input @focus="openUserSelect(row.$index)" v-model="assetData[row.$index].nowPsersonLiableUsername"
                          size="mini"></el-input>
                <div v-show="validateData[row.$index].twoShow">
                  <i class="el-icon-warning"></i>
                  <span class="tipMsg">{{ validateData[row.$index].twoMsg }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="" align="center" label="存放地点" width="200">
              <template slot-scope="row">
                <span class="vTip">*</span>
                <el-input @focus="openWarehouseSelect(row.$index)" v-model="assetData[row.$index].nowWarehouseName"
                          size="mini"></el-input>
                <div v-show="validateData[row.$index].threeShow">
                  <i class="el-icon-warning"></i>
                  <span class="tipMsg">{{ validateData[row.$index].threeMsg }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="80">
              <template slot-scope="row">
                <i class="el-icon-remove-outline" @click="delRow(row.$index)"></i>
              </template>
            </el-table-column>
          </el-table>

          <div class="operBar">
            <div class="operBtn">
              <el-row>
                <el-button :disabled="batchDisabled" type="primary" size="mini" @click="batchUsed('dept')">使用部门
                </el-button>
                <el-button :disabled="batchDisabled" type="primary" size="mini" @click="batchUsed('user')">责任人
                </el-button>
                <el-button :disabled="batchDisabled" type="primary" size="mini" @click="batchUsed('warehouse')">
                  存放地点
                </el-button>
              </el-row>
            </div>
          </div>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-form-item label="申请事由" prop="reqReason">
            <el-input type="textarea" v-model="addForm.reqReason" :rows="4"></el-input>
          </el-form-item>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-form-item label="上传">
            <attachment-upload :archiveId="uploadArchiveId" :categoryId="uploadCategoryId"
                               :branchId="userInfo.branchId"></attachment-upload>
          </el-form-item>
        </el-row>
      </el-form>
    </el-row>

    <el-dialog top="10vh" title="选择资产" append-to-body width="60%" :visible.sync="selectAssetVisible"
               @close="assetClose" :close-on-click-modal="false">
      <asset-card-components :assetMng="assetMng" @confirm="getAssetData" ref="assetDetail"
                             :visible="selectAssetVisible" @cancel="selectAssetVisible=false"></asset-card-components>
    </el-dialog>

    <el-dialog append-to-body @close="selectDeptClose" title="选择部门" width="50%" top="5vh"
               :visible.sync="visibleDeptSelect">
      <dept-tree :defaultExpandAll="true" @node-click="getDeptData"></dept-tree>
    </el-dialog>

    <el-dialog append-to-body @close="selectUserClose" title="人员选择" width="70%" top="5vh"
               :visible.sync="visibleUserSelect">
      <user-select @confirm="getUserData" :isSingleUser="true"></user-select>
    </el-dialog>

    <el-dialog append-to-body @close="selectWarehouseClose" title="仓库选择" width="70%" top="5vh"
               :visible.sync="visibleWarehouseSelect">
      <warehouse-components @row-click="getWarehouseData"></warehouse-components>
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
import UsersSelect from '@/views/mdp/sys/user/UsersSelect'
import WarehouseComponents from '../../stk/components/WarehouseComponents';
import {addMngFlow} from '@/api/oa/erp/ass/assetMng';
import {sendReceiveToProcessApprova} from '@/api/oa/erp/ass/assUtil';


export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  props: ['assetReceive', 'visible'],
  watch: {
    'assetReceive': function (assetReceiveOper) {
      this.addForm = assetReceiveOper;
    },
    'visible': function (visible) {
      if (visible == true) {
        //从新打开页面时某些数据需要重新加载，可以在这里添加
        this.setDefaultParam();
      }
    }
  },
  data() {
    return {
      options: {},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
      load: {list: false, edit: false, del: false, add: false},//查询中...
      addFormRules: {
        reqTitle: [
          {required: true, message: '标题不能为空', trigger: 'change'}
        ]
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
      },
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/
      uploadArchiveId: '',
      uploadCategoryId: '',
      assetData: [],
      selectAssetVisible: false,
      visibleDeptSelect: false,
      visibleUserSelect: false,
      visibleWarehouseSelect: false,
      //是否是批量选择
      isBatchChange: false,
      batchDisabled: true,
      //验证数据
      validateData: [],
      assetMng: "use",
      currentRow: 0,
      /**end 在上面加自定义属性**/
    }//end return
  },//end data
  methods: {

    cancel() {
      this.$refs['addForm'].resetFields();
      this.assetData = [];
      this.validateData = [];
      this.$emit('cancel');
    },

    addClose() {
      this.$refs['addForm'].resetFields();
      this.assetData = [];
      this.validateData = [];
    },

    addSubmit(status) {
      this.addForm.mngStatus = 'hold';
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let flag = this.validateAssetData();
          if (!flag) return;
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.load.add = true
            //明细数据校验
            if (!this.isNull(this.addForm.reqDate) && this.addForm.reqDate instanceof Date) {
              this.addForm.reqDate = util.formatDate.format(this.addForm.reqDate, "yyyy-MM-dd HH:mm:ss")
            }
            let params = Object.assign({}, this.transfreData(this.addForm));
            addMngFlow(params).then((res) => {
              this.load.add = false
              var tips = res.data.tips;
              if (tips.isOk) {
                this.$refs['addForm'].resetFields();
                this.detailData = [];
                if (status == 'submit') {
                  sendReceiveToProcessApprova(this, res.data.data);
                  this.$emit('submit', res.data.data, false);//  @submit="afterAddSubmit"
                } else {
                  this.$emit('submit');
                }
              }
              this.$message({message: tips.msg, type: tips.isOk ? 'success' : 'error'});
            }).catch(err => this.load.add = false);
          });
        }
      });
    },

    transfreData(data) {
      if (this.assetData.length > 0) {
        this.assetData.forEach(p => {
          if (!this.isNull(p.allocDate) && p.allocDate instanceof Date) {
            p.allocDate = util.formatDate.format(p.allocDate, "yyyy-MM-dd HH:mm:ss")
          }
        })
      }

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

      this.assetData.forEach((d, index) => {
        this.validateDetail(index, "one");
        this.validateDetail(index, "two");
        this.validateDetail(index, "three");
      })

      //验证是否完成
      let flag = "true";
      this.validateData.forEach(d => {
        if (d.oneShow) {
          flag = false;
          return flag;
        }
        if (d.twoShow) {
          flag = false;
          return flag;
        }
        if (d.threeShow) {
          flag = false;
          return flag;
        }
      })
      if (!flag) {
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
      this.addForm.opType = "use";
      this.uploadArchiveId = this.addForm.id;
      this.uploadCategoryId = 'asset_receive_upload';
    },

    validateDetail(index, position) {
      let param = this.assetData[index];
      let data = this.validateData[index];
      switch (position) {
        case 'one' :
          this.isNull(param.nowDeptName) ? data.oneShow = true : data.oneShow = false;
          break;
        case 'two' :
          this.isNull(param.nowPsersonLiableUsername) ? data.twoShow = true : data.twoShow = false;
          break;
        case 'three' :
          this.isNull(param.nowWarehouseName) ? data.threeShow = true : data.threeShow = false;
          break;
      }
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

    //获取选择的资产数据
    getAssetData(data) {
      data.forEach(d => {
        let flag = this.assetData.some(item => {
          if (item.cardId == d.cardId) {
            return true;
          }
        })
        if (flag) {
          return
        }
        this.$set(d, "allocDate", new Date());
        this.$set(d, "nowPsersonLiableUserid", this.userInfo.userid);
        this.$set(d, "nowPsersonLiableUsername", this.userInfo.username);
        this.$set(d, "nowDeptid", this.userInfo.deptid);
        this.$set(d, "nowDeptName", this.userInfo.deptName);
        this.assetData.push(d);
        let validate = {
          oneMsg: "资产使用部门不能为空",
          twoMsg: "责任人不能为空",
          threeMsg: "存放地点不能为空",
          oneShow: false,
          twoShow: false,
          threeShow: false,
        }
        this.validateData.push(validate);
      })
      if (data.length > 0) this.batchDisabled = false;
      this.selectAssetVisible = false;
    },

    //开启部门选择
    openDeptSelect(index) {
      this.currentRow = index;
      this.visibleDeptSelect = true;
    },

    //获取选择部门数据
    getDeptData(data) {
      if (this.isBatchChange) {
        this.assetData.forEach(a => {
          this.$set(a, "nowDeptid", data.deptid);
          this.$set(a, "nowDeptName", data.deptName);
        })
      } else {
        this.$set(this.assetData[this.currentRow], "nowDeptid", data.deptid);
        this.$set(this.assetData[this.currentRow], "nowDeptName", data.deptName);
      }
      this.isBatchChange = false;
      this.visibleDeptSelect = false;
      this.batchRemoveValidate(1);
    },

    //开启用户选择
    openUserSelect(index) {
      this.currentRow = index;
      this.visibleUserSelect = true;
    },

    //获取用户数据
    getUserData(data) {
      if (this.isBatchChange) {
        this.assetData.forEach(a => {
          this.$set(a, "nowPsersonLiableUserid", data[0].userid);
          this.$set(a, "nowPsersonLiableUsername", data[0].username);
        })
      } else {
        this.$set(this.assetData[this.currentRow], "nowPsersonLiableUserid", data[0].userid);
        this.$set(this.assetData[this.currentRow], "nowPsersonLiableUsername", data[0].username);
      }
      this.isBatchChange = false;
      this.visibleUserSelect = false;
      this.batchRemoveValidate(2);
    },

    openWarehouseSelect(index) {
      this.currentRow = index;
      this.visibleWarehouseSelect = true;
    },

    //打开仓库选择
    getWarehouseData(data) {
      if (this.isBatchChange) {
        this.assetData.forEach(a => {
          this.$set(a, "nowWarehouseId", data.id);
          this.$set(a, "nowWarehouseName", data.name);
          this.$set(a, "nowStoreAddress", data.address);
        })
      } else {
        this.$set(this.assetData[this.currentRow], "nowWarehouseId", data.id);
        this.$set(this.assetData[this.currentRow], "nowWarehouseName", data.name);
        this.$set(this.assetData[this.currentRow], "nowStoreAddress", data.address);
      }
      this.isBatchChange = false;
      this.visibleWarehouseSelect = false;
      this.batchRemoveValidate(3);
    },

    //批量选择取消验证
    batchRemoveValidate(index) {
      this.validateData.forEach(v => {
        if (index === 1) {
          v.oneShow = false;
        }

        if (index === 2) {
          v.twoShow = false;
        }

        if (index === 3) {
          v.threeShow = false;
        }
      })
    },

    batchUsed(type) {
      if (this.assetData.length === 0) {
        return;
      }
      this.isBatchChange = true;
      switch (type) {
        case 'dept':
          this.visibleDeptSelect = true;
          break;
        case 'user':
          this.visibleUserSelect = true;
          break;
        case 'warehouse':
          this.visibleWarehouseSelect = true;
          break;
      }
    },

    //选择部门关闭
    selectDeptClose() {
      this.isNull(this.assetData[this.currentRow].nowDeptName) ? this.validateData[this.currentRow].oneShow = true : this.validateData[this.currentRow].oneShow = false;
    },

    selectUserClose() {
      this.isNull(this.assetData[this.currentRow].nowPsersonLiableUsername) ? this.validateData[this.currentRow].twoShow = true : this.validateData[this.currentRow].twoShow = false;
    },

    selectWarehouseClose() {
      this.isNull(this.assetData[this.currentRow].nowWarehouseName) ? this.validateData[this.currentRow].threeShow = true : this.validateData[this.currentRow].threeShow = false;
    },

    isNull(data) {
      if (data === null || data === '' || data === undefined) {
        return true;
      }
      return false;
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
    this.addForm = Object.assign(this.addForm, this.assetReceive);
    this.setDefaultParam();
  }//end mounted


}


</script>


<style>

.operBar {
  width: 100%;
  height: 40px;
  border: 1px solid #EBEEF5;
}

.operBtn {
  line-height: 40px;
  float: right;
  margin-right: 10px;
}


.vTip {
  color: red;
  display: block;
  position: absolute;
  left: 1px;
}

.el-icon-warning {
  position: relative;
  top: 5px;
  margin-right: 1px;
}

.el-icon-warning, .tipMsg {
  color: red;
  float: left;
}


</style>
