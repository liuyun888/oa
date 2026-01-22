<template>
  <section>
    <el-row class="page-container border padding">
      <!--新增/编辑界面 SigDevice 印章设备库-->
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editFormRef">

        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="editForm.deviceName" placeholder="设备名称" :maxlength="255"
                    @change="editSomeFields(editForm,'deviceName',$event)" :disabled="  disabledJudge('deviceName')"/>
        </el-form-item>
        <el-form-item label="归属部门" prop="deptid">
          <mdp-select-dept v-model="editForm.deptid" placeholder="归属部门" :maxlength="255"
                           @change="editSomeFields(editForm,'deptid',$event)" :disabled="  disabledJudge('deptid')"/>
        </el-form-item>

        <!--编辑才有 -->
        <el-form-item label="归属机构名称" prop="branchName" v-if="currOpType=='edit'">
          <el-input v-model="editForm.branchName" placeholder="归属机构名称" :maxlength="255"
                    @change="editSomeFields(editForm,'branchName',$event)" :disabled="  disabledJudge('branchName')"/>
        </el-form-item>

        <el-form-item label="设备标识码" prop="deviceSn">
          <el-input v-model="editForm.deviceSn" placeholder="设备标识码" :maxlength="255"
                    @change="editSomeFields(editForm,'deviceSn',$event)" :disabled="  disabledJudge('deviceSn')"/>
        </el-form-item>
        <!--        import BrandComponent from "@/views/oa/erp/pur/brand/BrandComponent"-->
        <el-form-item label="品牌名称" prop="brandName">
          <el-input v-model="editForm.brandName" placeholder="品牌名称" :maxlength="255"
                    @change="editSomeFields(editForm,'brandName',$event)"
                    :disabled=" true || disabledJudge('brandName')"/>
        </el-form-item>
        <el-form-item label="启用时间" prop="startTime">
          <el-date-picker type="date" placeholder="选择日期" v-model="editForm.startTime"
                          value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"
                          :disabled="  disabledJudge('startTime')"></el-date-picker>
        </el-form-item>
        <el-form-item label="停用时间" prop="endTime">
          <el-date-picker type="date" placeholder="选择日期" v-model="editForm.endTime"
                          value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"
                          :disabled="  disabledJudge('endTime')"></el-date-picker>
        </el-form-item>
        <el-form-item label="状态0停用1启用" prop="status">
          <el-radio v-model="editForm.status" label="0" placeholder="状态0停用1启用" :maxlength="1"
                    @change="editSomeFields(editForm,'status',$event)" :disabled="  disabledJudge('status')">停用
          </el-radio>
          <el-radio v-model="editForm.status" label="1" placeholder="状态0停用1启用" :maxlength="1"
                    @change="editSomeFields(editForm,'status',$event)" :disabled="  disabledJudge('status')">启动
          </el-radio>
        </el-form-item>
        <el-form-item label="保管地址" prop="address">
          <el-input v-model="editForm.address" placeholder="保管地址" :maxlength="255"
                    @change="editSomeFields(editForm,'address',$event)" :disabled="  disabledJudge('address')"/>
        </el-form-item>
        <el-form-item label="地址定位" prop="addressGps">
          <el-input v-model="editForm.addressGps" placeholder="地址定位" :maxlength="255"
                    @change="editSomeFields(editForm,'addressGps',$event)" :disabled="  disabledJudge('addressGps')"/>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-radio-group style="margin-left: 0;"  v-model="editForm.deviceType" placeholder="设备类型" :maxlength="1"
                          @change="editSomeFields(editForm,'deviceType',$event)"
                          :disabled="  disabledJudge('deviceType')">
            <el-radio label="0">便携机</el-radio>
            <el-radio label="1">台式机</el-radio>
            <el-radio label="2"> 普通印章</el-radio>
          </el-radio-group>

        </el-form-item>
        <el-form-item label="管理用户姓名" prop="admUserid">
          <mdp-select-user v-model="editForm.admUserid" placeholder="管理用户姓名" :maxlength="50"
                           @change="editSomeFields(editForm,'admUserid',$event)"
                           :disabled="  disabledJudge('admUserid')"/>
        </el-form-item>
        <el-form-item label="管理部门名称" prop="admDeptid">
          <mdp-select-dept v-model="editForm.admDeptid" placeholder="管理部门名称" :maxlength="50"
                           @change="editSomeFields(editForm,'admDeptid',$event)"
                           :disabled="  disabledJudge('admDeptid')"/>
        </el-form-item>
      </el-form>

    </el-row>
    <slot name="footer" :page="this">
      <el-row v-if="showBtn!==false" style="float:right;" class="footer">
        <el-button @click.native="close">关闭</el-button>
        <el-button v-if="currOpType=='add'|| currOpType=='edit'" v-loading="load.edit" type="primary"
                   @click.native="saveSubmit"
                   :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交
        </el-button>
      </el-row>
    </slot>
  </section>
</template>

<script>
import * as SigDeviceApi from '@/api/oa/sig/sigDevice';
import {mapGetters} from 'vuex'
import {MdpFormMixin} from '@/components/mdp-ui/mixin/MdpFormMixin.js';

export default {
  name: 'sigDeviceForm',
  mixins: [MdpFormMixin],
  components: {},
  computed: {},
  props: {},
  watch: {},
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
        deviceName: '',
        branchId: '',
        deptid: '',
        deptName: '',
        branchName: '',
        deviceSn: '',
        brandId: '',
        brandName: '',
        startTime: '',
        endTime: '',
        status: '',
        address: '',
        addressGps: '',
        deviceType: '',
        bizFlowState: '',
        bizProcInstId: '',
        admUserid: '',
        admUsername: '',
        admDeptid: '',
        admDeptName: '',
        admBranchId: ''
      },
      //增删改查(含批量)接口
      apis: {
        queryById: SigDeviceApi.querySigDeviceById,
        add: SigDeviceApi.addSigDevice,
        edit: SigDeviceApi.editSigDevice,
        editSomeFields: SigDeviceApi.editSomeFieldsSigDevice
      },
      editable: true,//是否可编辑模式
    }
  },
  methods: {
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
