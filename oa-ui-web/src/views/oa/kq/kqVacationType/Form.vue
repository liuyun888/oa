<template>
  <el-row>
    <el-row>
      <!--新增/编辑界面 VacationType 请假类型表-->
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editFormRef">

        <el-form-item label="假期类型" prop="vacationType">
          <mdp-select item-code="leaveType" v-model="editForm.vacationType"
                      placeholder="假期类型" :maxlength="30"
                      @change="editSomeFields(editForm,'vacationType',$event)"
                      :disabled="  disabledJudge('vacationType')"/>
        </el-form-item>

        <el-form-item label="假期名称" prop="name">
          <el-input v-model="editForm.name" placeholder="假期名称" :maxlength="255"
                    @change="editSomeFields(editForm,'name',$event)" :disabled="  disabledJudge('name')"/>
        </el-form-item>

        <el-form-item label="可请总时长，单位小时" prop="totalHours">
          <el-input-number v-model="editForm.totalHours" placeholder="可请总时长，单位小时" :maxlength="8"
                           :disabled="  disabledJudge('totalHours')"/>
        </el-form-item>

        <!--        <el-form-item label="性别要求0-男性可请，1-女性可请，2-全部" prop="sexRule">-->
        <!--          <el-input v-model="editForm.sexRule" placeholder="性别要求0-男性可请，1-女性可请，2-全部" :maxlength="8"-->
        <!--                    @change="editSomeFields(editForm,'sexRule',$event)" :disabled="  disabledJudge('sexRule')"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="性别要求" prop="sexRule">
          <el-radio-group v-model="editForm.sexRule" :maxlength="8" style="margin-left: 0"
                          @change="editSomeFields(editForm,'sexRule',$event)" :disabled=" disabledJudge('sexRule')">
            <el-radio label="2">全部
            </el-radio>
            <el-radio label="0">男性可请类型
            </el-radio>
            <el-radio label="1">女性可请类型
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="请假规则" prop="vacationRule">
          <el-input v-model="editForm.vacationRule" placeholder="请假规则描述：比如妇乳期只能女员工享有" :maxlength="255"
                    @change="editSomeFields(editForm,'vacationRule',$event)"
                    :disabled="  disabledJudge('vacationRule')"/>
        </el-form-item>

        <el-form-item label="入职(月)" prop="beginEmpMonths">
          <el-input-number v-model="editForm.beginEmpMonths" style="width:40%;" :min="0" :max="200" :precision="0"
                           :disabled="  disabledJudge('beginEmpMonths')"></el-input-number>
          &nbsp;月&nbsp;~&nbsp;
          <el-input-number v-model="editForm.endEmpMonths" style="width:40%;" :min="0" :max="200" :precision="0"
                           :disabled="  disabledJudge('endEmpMonths')"></el-input-number>
        </el-form-item>

        <el-form-item label="工龄(月)" prop="beginWorkingMonths">
          <el-input-number v-model="editForm.beginWorkingMonths" style="width:40%;" :min="0" :max="200" :precision="0"
                           :disabled="  disabledJudge('beginWorkingMonths')"></el-input-number>
          &nbsp;月&nbsp;~&nbsp;
          <el-input-number v-model="editForm.endWorkingMonths" style="width:40%;" :min="0" :max="200" :precision="0"
                           :disabled="  disabledJudge('endWorkingMonths')"></el-input-number>
        </el-form-item>


        <el-form-item label="启用" prop="status">
          <el-switch v-model="editForm.status" active-color="#13ce66" inactive-color="#ff4949"  active-value="1" inactive-value="0"
                     placeholder="启用" :maxlength="1"
                     @change="editSomeFields(editForm,'status',$event)" :disabled="  disabledJudge('status')">
          </el-switch>

        </el-form-item>

      </el-form>
    </el-row>
    <slot name="footer" :page="this">
      <el-row v-if="showBtn!==false" style="float:right;" class="footer">
        <el-button @click.native="close">关闭</el-button>
        <el-button v-if="currOpType=='add' || currOpType=='edit'" v-loading="load.edit" type="primary" @click.native="saveSubmit"
                   :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交
        </el-button>
      </el-row>
    </slot>
  </el-row>
</template>

<script>
import * as VacationTypeApi from '@/api/oa/kq/vacationType';
import {mapGetters} from 'vuex'
import {MdpFormMixin} from '@/components/mdp-ui/mixin/MdpFormMixin.js';

export default {
  name: 'vacationTypeForm',
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
        vacationType: '',
        vacationRule: '',
        branchId: '',
        totalHours: '',
        sexRule: '',
        name: '',
        beginEmpMonths: '',
        endEmpMonths: '',
        beginWorkingMonths: '',
        endWorkingMonths: '',
        status: ''
      },
      //增删改查(含批量)接口
      apis: {
        queryById: VacationTypeApi.queryVacationTypeById,
        add: VacationTypeApi.addVacationType,
        edit: VacationTypeApi.editVacationType,
        editSomeFields: VacationTypeApi.editSomeFieldsVacationType
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
