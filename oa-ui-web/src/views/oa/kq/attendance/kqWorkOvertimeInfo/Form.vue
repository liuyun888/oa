<template>
  <el-row>
    <el-row class="page-container border padding">
      <div class="header">加班申请单</div>
      <!--新增/编辑界面 WorkOvertimeInfo 加班表-->
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editFormRef" size="mini">
        <el-row :gutter="20">
          <div class="info">
            <span>|&nbsp;&nbsp;基本信息</span>
          </div>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="员工名称" prop="userid">
              <mdp-select-user v-model="editForm.userid" placeholder="员工名称" :maxlength="50"
                               @change2="(option)=>{
                                        editSomeFields(editForm,'username',option.name);
                                        editSomeFields(editForm,'userid',option.id); }"
                               :disabled="  disabledJudge('userid')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门id" prop="deptid">
              <mdp-select-dept v-model="editForm.deptid" placeholder="部门id" :maxlength="64"
                               @change2="(option)=>{
                                        editSomeFields(editForm,'deptid',option.id);
                                        editSomeFields(editForm,'deptName',option.name);}"
                               :disabled="  disabledJudge('deptid')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请时间" prop="applyTime">
              <el-date-picker type="date" placeholder="选择日期" v-model="editForm.applyTime"
                              value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"
                              :disabled="  disabledJudge('applyTime')"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <div class="info">
            <span>|&nbsp;&nbsp;加班信息</span>
          </div>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="加班类型" prop="workOvertimeType">
              <mdp-select item-code="overtimeType" v-model="editForm.workOvertimeType" placeholder="加班类型"
                          :maxlength="10"
                          @change="editSomeFields(editForm,'workOvertimeType',$event)"
                          :disabled="  disabledJudge('workOvertimeType')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="加班小时数" prop="workOvertimeHours">
              <el-input-number v-model="editForm.workOvertimeHours" placeholder="加班小时数" :maxlength="10"
                               @change="editSomeFields(editForm,'workOvertimeHours',$event)"
                               :disabled="  disabledJudge('workOvertimeHours')"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="beginTime">
              <el-date-picker type="date" placeholder="选择日期" v-model="editForm.beginTime"
                              value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"
                              :disabled="  disabledJudge('beginTime')"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker type="date" placeholder="选择日期" v-model="editForm.endTime"
                              value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"
                              :disabled="  disabledJudge('endTime')"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="加班原因" prop="reasonWorkOvertime">
              <el-input v-model="editForm.reasonWorkOvertime" placeholder="加班原因" :maxlength="500"
                        @change="editSomeFields(editForm,'reasonWorkOvertime',$event)"
                        :disabled="  disabledJudge('reasonWorkOvertime')"/>
            </el-form-item>
          </el-col>
        </el-row>

        <!--        附件上传-->
        <!--        <el-row>-->
        <!--          <el-row>-->
        <!--            <attachment-upload-->
        <!--              :limit="1"-->
        <!--              style="margin-top:20px"-->
        <!--              @on-change="onUpload"-->
        <!--              @on-remove="getRemoveMsg"-->
        <!--              :archiveId="editForm.id"-->
        <!--              :branchId="editForm.branchId"-->
        <!--            ></attachment-upload>-->
        <!--          </el-row>-->

      </el-form>
    </el-row>
    <slot name="footer" :page="this">
      <el-row v-if="showBtn!==false" style="float:right;" class="footer">
        <el-button @click.native="close">关闭</el-button>
        <el-button v-if="currOpType=='add' || currOpType=='edit'" v-loading="load.edit" type="primary"
                   @click.native="saveSubmit"
                   :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交
        </el-button>
      </el-row>
    </slot>
  </el-row>
</template>

<script>
import * as WorkOvertimeInfoApi from '@/api/oa/kq/workOvertimeInfo';
import {mapGetters} from 'vuex'
import {MdpFormMixin} from '@/components/mdp-ui/mixin/MdpFormMixin.js';

export default {
  name: 'workOvertimeInfoForm',
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
        ],
        title: [{required: true, message: "标题不能为空", trigger: "change"}],
        username: [
          {required: true, message: "姓名不能为空", trigger: "change"}
        ],
        workOvertimeType: [
          {required: true, message: "加班类型不能为空", trigger: "change"}
        ],
        beginTime: [
          {required: true, message: "开始时间不能为空", trigger: "change"}
        ],
        endTime: [
          {required: true, message: "结束时间不能为空", trigger: "change"}
        ],
        applyTime: [
          {required: true, message: "申请时间不能为空", trigger: "change"}
        ]
      },
      editForm: {
        id: '',
        userid: '',
        username: '',
        workOvertimeType: '',
        beginTime: '',
        endTime: '',
        workOvertimeHours: '',
        reasonWorkOvertime: '',
        branchId: '',
        deptid: '',
        deptName: '',
        applyTime: '',
        accessory: '',
        bizProcInstId: '',
        bizFlowState: '',
        title: ''
      },
      //增删改查(含批量)接口
      apis: {
        queryById: WorkOvertimeInfoApi.queryWorkOvertimeInfoById,
        add: WorkOvertimeInfoApi.addWorkOvertimeInfo,
        edit: WorkOvertimeInfoApi.editWorkOvertimeInfo,
        editSomeFields: WorkOvertimeInfoApi.editSomeFieldsWorkOvertimeInfo
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
.header {
  color: #374d58;
  font-size: 18pt;
  font-family: Microsoft YaHei;
  text-align: center;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #dadcde;
  padding: 20px;
}

.content {
  padding: 20px;
}

.info {
  height: 40px;
  background: #f6f6f6 !important;
  vertical-align: middle;
  word-break: break-all;
  word-wrap: break-word;
  word-break: break-word;
  text-align: left;
  padding-left: 4px;
  line-height: 40px;
  margin-bottom: 20px;
}

.explain {
  color: black;
  font-size: 9pt;
  font-family: Microsoft YaHei;
}
</style>
