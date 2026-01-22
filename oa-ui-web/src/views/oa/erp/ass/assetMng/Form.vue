<template>
  <el-row>
    <el-row v-if="!editForm.opType">
      <mdp-select item-code="op_type" v-model="editForm.opType" placeholder="单据类型" clearable/>
    </el-row>
    <el-row v-else>
      <mdp-select item-code="op_type" v-model="editForm.opType" placeholder="单据类型" clearable/>
    </el-row>
    <el-row v-if="editForm.opType=='use'">
      <asset-receive-add :asset-receive="editForm" @cancel="onAddCancel" @submit="afterAddSubmit"></asset-receive-add>
    </el-row>
    <el-row v-if="editForm.opType=='return'">
      <asset-return-add :asset-return="editForm" @cancel="onAddCancel" @submit="afterAddSubmit"></asset-return-add>
    </el-row>
    <el-row v-if="editForm.opType=='maint'">
      <asset-maint-add :asset-maint="editForm" @cancel="onAddCancel" @submit="afterAddSubmit"></asset-maint-add>
    </el-row>
    <el-row v-if="editForm.opType=='dispose'">
      <asset-dispose-add :asset-dispose="editForm" @cancel="onAddCancel" @submit="afterAddSubmit"></asset-dispose-add>
    </el-row>
    <el-row v-if="editForm.opType=='change'">
      <asset-change-add :asset-change="editForm" @cancel="onAddCancel" @submit="afterAddSubmit"></asset-change-add>
    </el-row>
    <el-row v-if="editForm.opType=='reallocation'">
      <asset-reallocation-add :asset-reallocation="editForm" @cancel="onAddCancel"
                              @submit="afterAddSubmit"></asset-reallocation-add>
    </el-row>
    <el-row v-if="editForm.opType=='lease'">
      <asset-lease-add :asset-lease="editForm" @cancel="onAddCancel" @submit="afterAddSubmit"></asset-lease-add>
    </el-row>

    <!--    <slot name="footer" :page="this">-->
    <!--      <el-row v-if="showBtn!==false" style="float:right;" class="footer">-->
    <!--        <el-button @click.native="close">关闭</el-button>-->
    <!--        <el-button v-if="currOpType=='add' || currOpType=='edit'" v-loading="load.edit" type="primary" @click.native="saveSubmit"-->
    <!--                   :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交-->
    <!--        </el-button>-->
    <!--      </el-row>-->
    <!--    </slot>-->
  </el-row>
</template>

<script>
import * as AssetMngApi from '@/api/oa/erp/ass/assetMng';
import {mapGetters} from 'vuex'
import {MdpFormMixin} from '@/components/mdp-ui/mixin/MdpFormMixin.js';
import AssetReceiveAdd from "../assetReceive/assetReceiveAdd.vue";
import AssetMaintAdd from "../assetMaint/assetMaintAdd.vue";
import AssetReallocationAdd from "../assetReallocation/assetReallocationAdd.vue";
import AssetDisposeAdd from "../assetDispose/assetDisposeAdd.vue";
import AssetLeaseAdd from "../assetLease/assetLeaseAdd.vue";
import AssetReturnAdd from "../assetReturn/assetReturnAdd.vue";
import AssetChangeAdd from "../assetChange/assetChangeAdd.vue";

export default {
  name: 'assetMngForm',
  mixins: [MdpFormMixin],
  components: {
    AssetChangeAdd,
    AssetReturnAdd,
    AssetLeaseAdd,
    AssetDisposeAdd,
    AssetReallocationAdd,
    AssetMaintAdd,
    AssetReceiveAdd
  },
  computed: {},
  props: {},
  watch: {
    editForm: {
      deep: true,
      handler(newV, oldV) {
        console.log(newV)
      },
    }
  },
  data() {
    return {
      menuDefId: '',//menu_def.id 菜单表菜单编号，用于按钮权限判断
      pkNames: ["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
      currOpType: 'add',//表单 add、edit，所有按钮可动、detail-只看不能操作
      editFormRules: {
        id: [
          //{ required: true, message: '此项必填', trigger: 'change' },
          //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
        ]
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
    }
  },
  methods: {
    onAddCancel() {
      // this.$emit('cancel');
      this.close()
      this.editForm = []
    },
    afterAddSubmit(data) {
      // this.$emit('submit', data);
      this.close()
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

  }
}

</script>

<style scoped>

</style>
