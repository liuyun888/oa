<template>
  <section>
    <el-row class="page-container border padding">
      <el-row>
        <el-button size="small" @click="close">取消</el-button>
        <el-button type="primary" size="small" @click="addSubmit('hold')">暂存</el-button>
        <el-button type="primary" size="small" @click="addSubmit('submit')">提交</el-button>
      </el-row>
      <el-divider content-position="center">资产盘点任务</el-divider>

      <!--新增/编辑界面 AssetInventoryTask ass_asset_inventory_task-->
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editFormRef">
        <el-form-item label="盘点任务名称" prop="reqTitle">
          <el-input v-model="editForm.reqTitle" placeholder="申请标题" :maxlength="50"
                    @change="editSomeFields(editForm,'reqTitle',$event)" :disabled="  disabledJudge('reqTitle')"/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="类别">
              <el-input disabled placeholder="盘点任务单"></el-input>
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
            <el-form-item label="申请人姓名" prop="reqUsername">
              <mdp-select-user v-model="editForm.reqUsername" placeholder="申请人姓名" :maxlength="50"
                               @change="editSomeFields(editForm,'reqUsername',$event)"
                               :disabled="  disabledJudge('reqUsername')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请日期">
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" readonly type="date"
                              v-model="editForm.reqDate"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="分配用户" prop="allocationType">
              <mdp-select item-code="allocation_type" v-model="editForm.allocationType" placeholder="分配用户"
                          :maxlength="1" @change="editSomeFields(editForm,'allocationType',$event)"
                          :disabled="  disabledJudge('allocationType')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="allocationUserVisible">
            <el-form-item label="用户">
              <mdp-select-user v-model="showUserNameMsg" @change2="getUserData" multiple/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="资产类别名称" prop="categoryName">
              <el-input v-model="editForm.categoryName" placeholder="资产类别名称" :maxlength="50"
                        clearable @focus="selectAssetTypeVisible=true"
                        @change="editSomeFields(editForm,'categoryName',$event)"
                        :disabled="  disabledJudge('categoryName')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓库名称" prop="warehouseName">
              <el-input v-model="editForm.warehouseName" placeholder="仓库名称" :maxlength="50"
                        clearable @focus="visibleWarehouseSelect=true"
                        @change="editSomeFields(editForm,'warehouseName',$event)"
                        :disabled="  disabledJudge('warehouseName')"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="采购时间" prop="purchasedateType">
              <el-select v-model="editForm.purchasedateType" placeholder="采购时间" :maxlength="1"
                         @change="editSomeFields(editForm,'purchasedateType',$event)"
                         :disabled="  disabledJudge('purchasedateType')">
                <el-option
                    v-for="item in purchasedateTypeArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-button type="primary" size="mini" @click="showCard">点击查看范围</el-button>
        </el-row>
        <el-row class="mt">
          <el-table v-loading="load.list" size="small" border :data="assetData" stripe>
            <el-table-column label="序号" type="index" width="50"/>

            <el-table-column prop="cardStatus" label="资产状态" align="center">
              <template slot-scope="scope">
                <mdp-select item-code="card_status" v-model="scope.row.cardStatus"/>
              </template>
            </el-table-column>

            <el-table-column prop="assetSn" align="center" label="资产编码" width="">
            </el-table-column>

            <el-table-column prop="assetName" align="center" label="资产名称" width="">
            </el-table-column>

            <el-table-column prop="categoryName" align="center" label="资产类别" width="">
            </el-table-column>

            <el-table-column prop="spec" align="center" label="规格型号" width="">
            </el-table-column>

            <el-table-column prop="personLiableUsername" align="center" label="责任人" width="">
            </el-table-column>

            <el-table-column align="center" label="链接" width="">
              <template slot-scope="scope">
                <span class="seeDetails" @click="gotoDetail(scope.row)">查看详情</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="">
              <template slot-scope="row">
                <i class="el-icon-remove-outline" @click="delRow(row.$index)"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-row>


        <el-row style="margin-top: 20px">
          <el-form-item label="备注" prop="reqReason">
            <el-input v-model="editForm.reqReason" placeholder="备注" :maxlength="255" :rows="4"
                      @change="editSomeFields(editForm,'reqReason',$event)" :disabled="  disabledJudge('reqReason')"/>
          </el-form-item>
        </el-row>
        <el-row>
          <el-row style="margin-top: 20px">
            <el-form-item label="上传">
              <attachment-upload :archiveId="uploadArchiveId" :categoryId="uploadCategoryId"
                                 :branchId="userInfo.branchId"></attachment-upload>
            </el-form-item>
          </el-row>
        </el-row>

      </el-form>
    </el-row>
    <!--    <slot name="footer" :page="this">-->
    <!--      <el-row v-if="showBtn!==false" style="float:right;" class="footer">-->
    <!--        <el-button @click.native="close">关闭</el-button>-->
    <!--        <el-button v-if="currOpType=='add'" v-loading="load.edit" type="primary" @click.native="saveSubmit"-->
    <!--                   :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交-->
    <!--        </el-button>-->
    <!--      </el-row>-->
    <!--    </slot>-->

    <el-dialog append-to-body title="选择资产分类" center width="60%" :visible.sync="selectAssetTypeVisible"
               :close-on-click-modal="false">
      <asset-category-tree @node-click="getSelectAssetTypeData"
                           @cancel="selectAssetTypeVisible=false"></asset-category-tree>
    </el-dialog>

    <el-dialog append-to-body title="仓库选择" width="70%" top="5vh" :visible.sync="visibleWarehouseSelect">
      <warehouse-components @row-click="getWarehouseData" @cancel="selectAssetTypeVisible=false"></warehouse-components>
    </el-dialog>

    <el-dialog append-to-body title="资产卡片" center :fullscreen="true" :visible.sync="assetCardVisible"
               :close-on-click-modal="false">
      <asset-card-show :asset-card="assetCardData" :visible="assetCardVisible"
                       @submit="assetCardVisible=false"></asset-card-show>
    </el-dialog>
  </section>
</template>

<script>

import AssetCardShow from '../assetCard/AssetCardShow';
import * as AssetInventoryTaskApi from '@/api/oa/erp/ass/assetInventoryTask';
import {mapGetters} from 'vuex'
import {MdpFormMixin} from '@/components/mdp-ui/mixin/MdpFormMixin.js';
import AssetCategoryTree from '../../ass/components/AssetCategoryTree';
import {getInventoryCards} from '@/api/oa/erp/ass/assetCard';
import WarehouseComponents from '../../stk/components/WarehouseComponents';
import util from '@/common/js/util';
import AttachmentUpload from '@/views/mdp/arc/archiveAttachment/AttachmentUpload';
//全局公共库
export default {
  name: 'assetInventoryTaskForm',
  mixins: [MdpFormMixin],
  components: {
    'attachment-upload': AttachmentUpload,
    'warehouse-components': WarehouseComponents,
    'asset-category-tree': AssetCategoryTree,
    'asset-card-show': AssetCardShow,
  },
  computed: {},
  props: {},
  watch: {},
  data() {
    return {
      uploadArchiveId: '',
      uploadCategoryId: '',
      //资产卡片展示
      assetCardVisible: false,
      assetCardData: null,
      load: {list: false, edit: false, del: false, add: false},//查询中...
      assetData: [],
      purchasedateTypeArr: [
        {
          label: '不限',
          value: '1',
        },
        {
          label: '指定时间范围',
          value: '2',
        },
      ],
      visibleWarehouseSelect: false,
      selectAssetTypeVisible: false,
      //分配用户显示
      allocationUserVisible: false,
      showUserNameMsg: [],
      menuDefId: '',//menu_def.id 菜单表菜单编号，用于按钮权限判断
      pkNames: ["taskId"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
      currOpType: 'add',//表单 add、edit，所有按钮可动、detail-只看不能操作
      editFormRules: {
        taskId: [
          //{ required: true, message: '此项必填', trigger: 'change' },
          //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
        ],
        reqTitle: [
          {required: true, message: '盘点任务名称不能为空', trigger: 'change'}
        ],

        allocationType: [
          {required: true, message: '分配用户不能为空', trigger: 'change'}
        ],

        purchasedateType: [
          {required: true, message: '采购时间不能为空', trigger: 'change'}
        ]
      },
      editForm: {
        taskId: '',
        reqUsername: '',
        reqDeptid: '',
        reqDeptName: '',
        reqTitle: '',
        reqBranchId: '',
        reqDate: '',
        allocationType: '',
        categoryId: '',
        categoryName: '',
        warehouseId: '',
        warehouseName: '',
        purchasedateType: '',
        startTime: '',
        endTime: '',
        taskStatus: '',
        reqStatus: '',
        reqReason: ''
      },
      //增删改查(含批量)接口
      apis: {
        queryById: AssetInventoryTaskApi.queryAssetInventoryTaskById,
        add: AssetInventoryTaskApi.addAssetInventoryTask,
        edit: AssetInventoryTaskApi.editAssetInventoryTask,
        editSomeFields: AssetInventoryTaskApi.editSomeFieldsAssetInventoryTask
      },
      editable: false,//是否可编辑模式
      userData: [],
    }
  },
  methods: {
    transfreData() {
      //1.获取有盘点权限的用户数据。
      let inventoryUserData = [];
      //2.获取关联资产卡片的数据
      let inventoryTaskDetail = [];
      if (this.editForm.allocationType === '1') {
        this.assetData.forEach(d => {
          if (this.isNull(d.personLiableUserid)) return;
          let param = {
            inventoryUserid: d.personLiableUserid,
            inventoryUsername: d.personLiableUsername
          }
          inventoryUserData.push(param);
        })
      }
      if (this.editForm.allocationType === '2') {
        this.assetData.forEach(d => {
          if (this.isNull(d.personLiableUserid)) return;
          let param = {
            inventoryUserid: d.personLiableUserid,
            inventoryUsername: d.personLiableUsername
          }
          inventoryUserData.push(param);
        })
        this.userData.forEach(a => {
          if (this.isNull(a.inventoryUserid)) return;
          let param = {
            inventoryUserid: a.inventoryUserid,
            inventoryUsername: a.inventoryUsername
          }
          inventoryUserData.push(param);
        })
      }
      if (this.editForm.allocationType === '3') {
        inventoryUserData = this.userData;
      }
      let hash = {};
      inventoryUserData = inventoryUserData.reduce((preVal, curVal) => {
        hash[curVal.inventoryUserid] ? '' : hash[curVal.inventoryUserid] = true && preVal.push(curVal);
        return preVal
      }, [])
      this.assetData.forEach(a => {
        let param = {
          cardId: a.cardId,
          nowCardName: a.assetName
        }
        inventoryTaskDetail.push(param);
      })

      let param = {
        inventoryUserDatas: inventoryUserData,
        inventoryTaskDetails: inventoryTaskDetail,
        inventoryTask: this.editForm
      }
      console.log(param)
      return param;
    },
    addSubmit: function (status) {
      this.editForm.reqStatus = status;
      // this.transfreData();
      this.saveSubmit()
    },
    //删除一行
    delRow(index) {
      this.assetData.splice(index, 1);
    },
    //查看详情
    gotoDetail(row) {
      this.assetCardData = row;
      Object.assign(this.assetCardData, row);
      this.assetCardVisible = true;
      console.log(this.assetCardData)
    },
    //查询卡片
    showCard() {
      this.load.list = true;
      let params = {
        //采购开始时间
        startTime: (!this.isNull(this.timeSection) && this.timeSection.length !== 0) ? util.formatDate.format(this.timeSection[0], "yyyy-MM-dd HH:mm:ss") : '',
        //采购结束时间
        endTime: (!this.isNull(this.timeSection) && this.timeSection.length !== 0) ? util.formatDate.format(this.timeSection[1], "yyyy-MM-dd HH:mm:ss") : '',
        //分类
        categoryId: this.editForm.categoryId,
        warehouseId: this.editForm.warehouseId,
        //用户Id
        allocationType: this.editForm.allocationType
      }
      getInventoryCards(params).then((res) => {
        let tips = res.data.tips;
        if (tips.isOk) {
          this.assetData = res.data && res.data.data ? res.data.data : null;
        } else {
          this.$message({message: tips.msg, type: 'error'});
        }
        this.load.list = false;
      }).catch(err => this.load.list = false);
    },
    //获取选择的仓库数据
    getWarehouseData(data) {
      this.editForm.warehouseId = data.id;
      this.editForm.warehouseName = data.name;
      this.visibleWarehouseSelect = false;
    },
    getSelectAssetTypeData(data) {
      this.editForm.categoryId = data.categoryId;
      this.editForm.categoryName = data.categoryName
      this.selectAssetTypeVisible = false;
    },
    isNull(data) {
      return data === null || data === '' || data === undefined;
    },
    //获取用户数据
    getUserData(option) {
      this.showUserNameMsg = [];
      if (!this.isNull(option)) {
        option.forEach(d => {
          let param = {
            inventoryUserid: d.userid,
            inventoryUsername: d.username
          }
          this.showUserNameMsg.push(d.userid)
          this.userData.push(param);
        })
      }
    },

    //由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
    initCurrData() {
      this.showUserNameMsg = [];
    },
    /**
     * 检查参数是否满足调用后台接口的条件
     * @returns true / false
     */
    preParamCheck(params) {
      Object.keys(params).forEach(key => delete params[key]);
      Object.assign(params, this.transfreData());
      params.inventoryTask.reqBranchId = this.userInfo.branchId;
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

.mt {
  margin-top: 20px
}

.seeDetails {
  text-decoration: underline;
  cursor: pointer;
  color: rgba(10, 69, 169, 1.0);
}

.seeDetails:hover {
  color: rgba(10, 69, 169, 0.6);
}
</style>
