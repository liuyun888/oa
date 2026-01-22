<template>
  <section>
    <el-row class="page-container border padding">
      <!--新增/编辑界面 SigSignet 印章库-->
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editFormRef">
        <el-form-item label="印章标识码" prop="signetSn">
          <el-input v-model="editForm.signetSn" placeholder="印章标识码" :maxlength="50"
                    @change="editSomeFields(editForm,'signetSn',$event)" :disabled="  disabledJudge('signetSn')"/>
        </el-form-item>
        <el-form-item label="印章设备" prop="deviceId">
          <el-select v-model="editForm.deviceId" placeholder="印章设备" :maxlength="50"
                     @change="editSomeFields(editForm,'deviceId',$event)" :disabled="  disabledJudge('deviceId')">
            <el-option v-for="device in devices" :key="device.id" :label="device.deviceName" :value="device.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="印章类型" prop="signetType">
          <mdp-select item-code="signetType" v-model="editForm.signetType"
                      placeholder="印章类型公章0法人代表章1法人代表章" :maxlength="50"
                      @change="editSomeFields(editForm,'signetType',$event)" :disabled="  disabledJudge('signetType')"/>
        </el-form-item>
        <el-form-item label="印章简称" prop="signetSimpleName">
          <el-input v-model="editForm.signetSimpleName" placeholder="印章简称" :maxlength="50"
                    @change="editSomeFields(editForm,'signetSimpleName',$event)"
                    :disabled="  disabledJudge('signetSimpleName')"/>
        </el-form-item>
        <el-form-item label="印章全称" prop="signetName">
          <el-input v-model="editForm.signetName" placeholder="印章全称" :maxlength="255"
                    @change="editSomeFields(editForm,'signetName',$event)" :disabled="  disabledJudge('signetName')"/>
        </el-form-item>
        <el-form-item label="章面信息" prop="signetContext">
          <el-input v-model="editForm.signetContext" placeholder="章面信息" :maxlength="255"
                    @change="editSomeFields(editForm,'signetContext',$event)"
                    :disabled="  disabledJudge('signetContext')"/>
        </el-form-item>
        <el-form-item label="印章状态" prop="signetStatus">
          <el-switch v-model="editForm.signetStatus" placeholder="印章状态" :maxlength="1"
                     active-color="#13ce66" inactive-color="#ff4949" active-value="0"
                     inactive-value="1"
                     @change="editSomeFields(editForm,'signetStatus',$event)"
                     :disabled="  disabledJudge('signetStatus')"/>
        </el-form-item>
        <el-form-item label="印章形态" prop="signetForm">
          <mdp-select item-code="signetForm" v-model="editForm.signetForm" placeholder="印章形态0电子印章1物理印章"
                      :maxlength="1"
                      @change="editSomeFields(editForm,'signetForm',$event)" :disabled="  disabledJudge('signetForm')"/>
        </el-form-item>
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
  </section>
</template>

<script>
import * as SigSignetApi from '@/api/oa/sig/sigSignet';
import {mapGetters} from 'vuex'
import {MdpFormMixin} from '@/components/mdp-ui/mixin/MdpFormMixin.js';
import {listSigDevice} from "@/api/oa/sig/sigDevice";

export default {
  name: 'sigSignetForm',
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
      devices: [], //设备集合
      editForm: {
        id: '',
        signetSn: '',
        deviceId: '',
        signetType: '',
        signetSimpleName: '',
        signetName: '',
        keepRecordId: '',
        signetContext: '',
        signetStatus: '',
        signetBranchId: '',
        signetBranchName: '',
        bizFlowState: '',
        bizProcInstId: '',
        signetForm: ''
      },
      //增删改查(含批量)接口
      apis: {
        queryById: SigSignetApi.querySigSignetById,
        add: SigSignetApi.addSigSignet,
        edit: SigSignetApi.editSigSignet,
        editSomeFields: SigSignetApi.editSomeFieldsSigSignet
      },
      editable: true,//是否可编辑模式
    }
  },
  methods: {
    getAllDevice() {
      listSigDevice().then(res => {
        if (res.data.tips.isOk) {
          this.devices = res.data.data;
        }
      });
    },

    //由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
    initCurrData() {
      this.getAllDevice();
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
