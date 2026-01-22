<template>
  <section>
    <el-row class="page-container border padding">

      <el-row>
        <div>
          <el-button size="small" @click="close">取消</el-button>
          <!-- <el-button type="primary" size="small" @click="editSubmit('hold')">暂存</el-button> -->
          <el-button type="primary" size="small" @click="editSubmit('submit')">提交</el-button>
        </div>
        <el-divider content-position="center">资产盘点</el-divider>
      </el-row>

      <!--新增/编辑界面 AssetMng 资产出租/出借单-->
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editFormRef">
        <el-row>
          <el-form-item label="申请标题" prop="reqTitle">
            <el-input v-model="editForm.reqTitle" placeholder="申请标题" :maxlength="50"
                      @change="editSomeFields(editForm,'reqTitle',$event)" :disabled="  disabledJudge('reqTitle')"/>
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
            <el-form-item label="申请人姓名" prop="reqUserid">
              <mdp-select-user v-model="editForm.reqUserid" placeholder="申请人姓名" :maxlength="50"
                               @change2="(option)=>{
                                        this.editForm.reqUsername = option.name;
                                        editSomeFields(editForm,'reqUsername',option.name);
                                        editSomeFields(editForm,'reqUserid',option.id); }"
                               :disabled="disabledJudge('reqUsername')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请单位名称" prop="reqDeptid">
              <mdp-select-dept v-model="editForm.reqDeptid" placeholder="申请单位名称" :maxlength="50"
                               @change2="(option)=>{
                                        this.editForm.reqDeptName = option.name;
                                        editSomeFields(editForm,'reqDeptid',option.id);
                                        editSomeFields(editForm,'reqDeptName',option.name);}"
                               :disabled="disabledJudge('reqDeptName')"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="盘点任务" prop="inventoryTask">
              <el-input v-model="editForm.inventoryTask" placeholder="盘点任务" :maxlength="50"
                        @change="editSomeFields(editForm,'inventoryTask',$event)"
                        :disabled="  disabledJudge('inventoryTask')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请日期" prop="reqDate">
              <el-date-picker type="date" placeholder="选择日期" v-model="editForm.reqDate"
                              value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"
                              :disabled="  disabledJudge('reqDate')"></el-date-picker>
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
                <mdp-select-user v-model="assetData[row.$index].nowPsersonLiableUsername" size="mini"
                                 @change2="(option)=>{
                                   assetData[row.$index].nowPsersonLiableUsername = option.name;
                                   assetData[row.$index].nowPsersonLiableUserid = option.id; }"/>
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
                <!--                <el-input @focus="openDeptSelect(row.$index)" v-model="assetData[row.$index].nowDeptName"-->
                <!--                          size="mini"></el-input>-->
                <mdp-select-dept v-model="assetData[row.$index].nowDeptName"
                                 size="mini" @change2="(option)=>{getDeptData(option,row.$index)}"/>
              </template>
            </el-table-column>

            <el-table-column prop="deptName" align="center" label="资产使用状态" width="200">
              <template slot-scope="row">
                <mdp-select item-code="card_status" size="mini" v-model="assetData[row.$index].assetStatusAfter"
                            placeholder="请选择">
                </mdp-select>
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
          <el-form-item label="申请事由" prop="reqReason">
            <el-input v-model="editForm.reqReason" placeholder="申请事由" :maxlength="255"
                      @change="editSomeFields(editForm,'reqReason',$event)" :disabled="  disabledJudge('reqReason')"/>
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

    <slot name="footer" :page="this">
      <el-row v-if="showBtn!==false" style="float:right;" class="footer">
        <el-button @click.native="close">关闭</el-button>
        <el-button v-if="currOpType=='add' || currOpType =='edit'" v-loading="load.edit" type="primary"
                   @click.native="saveSubmit"
                   :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交
        </el-button>
      </el-row>
    </slot>

    <el-dialog append-to-body title="仓库选择" width="70%" top="5vh" :visible.sync="visibleWarehouseSelect">
      <warehouse-components @row-click="getWarehouseData"></warehouse-components>
    </el-dialog>
  </section>
</template>

<script>
import util from '@/common/js/util'; //全局公共库
import AttachmentUpload from '@/views/mdp/arc/archiveAttachment/AttachmentUpload';
import * as AssetMngApi from '@/api/oa/erp/ass/assetMng';
import {getDetail} from '@/api/oa/erp/ass/assetMng';
import {MdpFormMixin} from '@/components/mdp-ui/mixin/MdpFormMixin.js';
import {sn} from '@/common/js/sequence'; //id生成器

import WarehouseComponents from '../../stk/components/WarehouseComponents';

export default {
  name: 'assetMngForm',
  mixins: [MdpFormMixin],
  components: {
    'attachment-upload': AttachmentUpload,
    'warehouse-components': WarehouseComponents,
  },
  computed: {},
  props: {},
  watch: {
    'editForm': {
      deep: true,
      handler(newV, oldV) {
        console.log("----", newV, "----")
      },
    },
    'currOpType': {
      immediate: true,
      handler(newV, oldV) {
        console.log("------", newV, '---------')
      },
      'assetData': {
        immediate: true,
        delete: true,
        handler(newV, oldV) {
          console.log('-----', newV, '------')
        },
      },
    }
  },
  data() {
    return {
      load: {list: false, edit: false, del: false, add: false},//查询中...
      menuDefId: '',//menu_def.id 菜单表菜单编号，用于按钮权限判断
      pkNames: ["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
      currOpType: 'add',//表单 add、edit，所有按钮可动、detail-只看不能操作
      editFormRules: {
        id: [
          //{ required: true, message: '此项必填', trigger: 'change' },
          //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
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
      editForm: {
        id: '',
        reqUserid: '',
        reqUsername: '',
        reqDeptid: '',
        reqDeptName: '',
        reqBranchId: '',
        reqBranchName: '',
        reqTitle: '',
        reqDate: '',
        reqReason: '',
        startDate: '',
        endDate: '',
        totalDay: '',
        opType: '',
        maintTotalFeeAmount: '',
        maintIsConsumables: '',
        dispTotalOrignAmount: '',
        dispTotalScrapSaleAmount: '',
        dispAddAssets: '',
        inDeptId: '',
        inDeptName: '',
        outDeptId: '',
        outDeptName: '',
        inBranchId: '',
        inBranchName: '',
        outBranchId: '',
        outBranchName: '',
        mngStatus: '',
        inventoryTask: '',
        bizProcInstId: '',
        bizKey: '',
        commentMsg: '',
        assignee: '',
        assigneeName: '',
        agree: '',
        flowLastTime: '',
        flowEndTime: '',
        actId: '',
        taskName: '',
        bizFlowState: ''
      },
      //增删改查(含批量)接口
      apis: {
        queryById: AssetMngApi.queryAssetMngById,
        add: AssetMngApi.addAssetMng,
        edit: AssetMngApi.editAssetMng,
        editSomeFields: AssetMngApi.editSomeFieldsAssetMng
      },
      editable: true,//是否可编辑模式
      assetData: [],
      uploadArchiveId: '',
      uploadCategoryId: '',
      currentRow: -1,
      visibleWarehouseSelect: false,
    }
  },
  methods: {
    test(option) {
      console.log(option)
    },
    transfreData(data) {
      if (!this.isNull(data.startDate) && data.startDate instanceof Date) {
        data.startDate = util.formatDate.format(data.startDate, "yyyy-MM-dd HH:mm:ss")
      }
      if (!this.isNull(data.endDate) && data.endDate instanceof Date) {
        data.endDate = util.formatDate.format(data.endDate, "yyyy-MM-dd HH:mm:ss")
      }
      this.assetData.forEach(p => {
        if (!this.isNull(p.allocDate) && p.allocDate instanceof Date) {
          p.allocDate = util.formatDate.format(p.allocDate, "yyyy-MM-dd HH:mm:ss")
        }
        p.cardStatus = p.assetStatusAfter;
      })
      return {
        assetMng: data,
        assetDetails: this.assetData,
        haoCai: []
      };
    },
    isNull(data) {
      return data === null || data === '' || data === undefined;
    },
    editSubmit(status) {
      this.editForm.mngStatus = status;
      this.saveSubmit()
    },
    //获取选择部门数据
    getDeptData(data, index) {
      this.$set(this.assetData[index], "nowDeptid", data.deptid);
      this.$set(this.assetData[index], "nowDeptName", data.deptName);
      this.visibleDeptSelect = false;
    },

    //删除表单数据
    delRow(index) {
      this.assetData.splice(index, 1);
      if (this.assetData.length <= 0) this.batchDisabled = true;
    },
    //打开仓库选择
    getWarehouseData(data) {
      this.$set(this.assetData[this.currentRow], "nowStoreAddress", data.address);
      this.$set(this.assetData[this.currentRow], "nowWarehouseId", data.id);
      this.$set(this.assetData[this.currentRow], "nowWarehouseName", data.name);
      this.visibleWarehouseSelect = false;
    },
    openWarehouseSelect(index) {
      this.currentRow = index;
      this.visibleWarehouseSelect = true;
    },
    getDetailData() {
      let params = {
        requireId: this.editForm.id
      };
      //查询申购单明细
      this.load.list = true;
      getDetail(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.assetData = res.data.data;
        }
        this.load.list = false;
      }).catch();
    },

    //设置编辑默认参数
    setEditDefaultParam() {
      this.getDetailData();
      let user = this.userInfo;
      //操作类型：领用
      this.uploadArchiveId = this.editForm.id;
      this.uploadCategoryId = 'asset_inventory_upload';
    },

    //设置新增默认参数
    setAddDefaultParam() {
      let user = this.userInfo;
      this.editForm.reqUserid = user.userid;
      this.editForm.reqUsername = user.username;
      this.editForm.reqDeptid = user.deptid;
      this.editForm.reqDeptName = user.deptName;
      this.editForm.reqDate = new Date();
      // this.editForm.id = sn();
      //操作类型：领用
      this.editForm.opType = "inventory";
      // this.uploadArchiveId = this.editForm.id;
      this.uploadCategoryId = 'asset_inventory_upload';
      // this.assetData = this.assetInventory;
      this.assetData = []
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
      this.editForm.inventoryTask = this.mngParams.taskId;
    },

    //由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
    initCurrData() {
      this.assetData = [];
      this.uploadArchiveId = '';
      this.uploadCategoryId = '';
      if (this.currOpType == 'add') {
        this.setAddDefaultParam();
      } else if (this.currOpType == 'edit') {
        this.setEditDefaultParam()
      }
    },
    /**
     * 检查参数是否满足调用后台接口的条件
     * @returns true / false
     */
    preParamCheck(params) {
      //明细数据校验
      if (!this.isNull(this.editForm.reqDate) && this.editForm.reqDate instanceof Date) {
        this.editForm.reqDate = util.formatDate.format(this.editForm.reqDate, "yyyy-MM-dd HH:mm:ss")
      }
      Object.keys(params).forEach(item => delete params[item]);
      Object.assign(params, this.transfreData(this.editForm));
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

  }
}

</script>

<style scoped>
.topSpace {
  margin-top: 20px;
}
</style>
