<template>
  <el-row class="page-container border padding">
    <div class="content">
      <el-row>
        <!--新增/编辑界面 EmpVacationInfo 员工请假信息表-->
        <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editFormRef">
          <el-row :gutter="20">
            <div class="info">
              <span>|&nbsp;&nbsp;基本信息</span>
            </div>
          </el-row>
          <el-form-item label="员工名称" prop="username">
            <mdp-select-user v-model="editForm.username" placeholder="员工名称" :maxlength="50"
                             @change2="(option)=>{
                                        editSomeFields(editForm,'username',option.name);
                                        editSomeFields(editForm,'userid',option.id); }"
                             :disabled="  disabledJudge('username')"/>
          </el-form-item>
          <el-form-item label="部门名称" prop="deptName">
            <mdp-select-dept v-model="editForm.deptName" placeholder="部门名称" :maxlength="20"
                             @change2="(option)=>{
                                        editSomeFields(editForm,'deptid',option.id);
                                        editSomeFields(editForm,'deptName',option.name);}"
                             :disabled="  disabledJudge('deptName')"/>
          </el-form-item>
          <el-form-item label="紧急程度" prop="emergencyDegree">
            <mdp-select item-code="vacation_degree" v-model="editForm.emergencyDegree" placeholder="紧急程度"
                        :maxlength="2"
                        @change="editSomeFields(editForm,'emergencyDegree',$event)"
                        :disabled="  disabledJudge('emergencyDegree')"/>
          </el-form-item>

          <el-row :gutter="20">
            <div class="info">
              <span>|&nbsp;&nbsp;请假信息</span>
            </div>
          </el-row>
          <el-form-item label="假期类型" prop="vacationType">
            <mdp-select item-code="leaveType" v-model="editForm.vacationType" placeholder="假期类型" :maxlength="1"
                        @change="editSomeFields(editForm,'vacationType',$event)"
                        :disabled="  disabledJudge('vacationType')"/>
          </el-form-item>

          <el-form-item label="请假小时数" prop="vacationHours">
            <el-input-number v-model="editForm.vacationHours" placeholder="请假小时数" :maxlength="8" :step="0.5"
                             :min="0"
                             @change="editSomeFields(editForm,'vacationHours',$event)"
                             :disabled="  disabledJudge('vacationHours')"/>
          </el-form-item>

          <el-form-item label="开始日期" prop="beginDate">
            <el-date-picker type="date" placeholder="选择日期" v-model="editForm.beginDate"
                            value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"
                            :disabled="  disabledJudge('beginDate')"></el-date-picker>
          </el-form-item>

          <el-form-item label="结束日期" prop="endDate">
            <el-date-picker type="date" placeholder="选择日期" v-model="editForm.endDate"
                            value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"
                            :disabled="  disabledJudge('endDate')"></el-date-picker>
          </el-form-item>
          <el-form-item label="请假事由" prop="reason">
            <el-input v-model="editForm.reason" placeholder="请假事由" :maxlength="255" type="textarea"
                      @change="editSomeFields(editForm,'reason',$event)" :disabled="  disabledJudge('reason')"/>
          </el-form-item>

        </el-form>
      </el-row>

      <!--    <el-row>-->
      <!--      <attachment-upload-->
      <!--        :limit="1"-->
      <!--        style="margin-top:20px"-->
      <!--        @on-change="onUpload"-->
      <!--        @on-remove="getRemoveMsg"-->
      <!--        :archiveId="editForm.id"-->
      <!--        :branchId="editForm.branchId"-->
      <!--      ></attachment-upload>-->
      <!--    </el-row>-->
      <el-row :gutter="20" style="margin-top:20px">
        <div class="info">
          <span>|&nbsp;&nbsp;请假说明</span>
        </div>
      </el-row>
      <el-row style="margin-bottom:20px">
              <span class="explain">
                员工因临时或突发情况无法到岗，未能提前请病假或事假的，则应用电话通知直接上级批准后，短信通知人事行政部，说明请假事由，并在上班后第一时间补办请假手续，如在2个工作日内未提交请假流程，超过2个工作日补流程无效，均视为旷工，扣除当日双倍工资。混合假期不得连续超过15天，两次请长假之间的间隔期不得低于一个月
                <br/>1、年假：工作满一年以上每年可享受带薪年假，当年的年假使用期至次年10月31日止；未经用人单位批准，员工不得自行休假。
                <br/>2、事假：按照平均工作日扣发薪资（包含工资及各类补贴福利）；单次事假原则上不应超过3天。
                <br/>3、病假：两天及以上病假必须持工作地二级甲等以上医院相关病假证明单或就医记录证明，否则无法享受病假工资；单次病假超过5天，应当持有工作所在地三级甲等医院提供的病假证明单。
                <br/>4、婚假：婚假为十天自然日，包含国家规定3天及增加的7天，增加的婚假7天遇法定节假日可顺延，最多不得超过13天，请婚假必须持结婚证明，结婚证必须在泛微工作期间领取，且婚假必须在一年内使用完毕，不得分次休假，国家或地方政府有其他规定的按照当地要求执行；
                <br/>5、产假及哺乳假：按国家及地方法律法规执行，包含休息日与法定节假日，生育假遇法定节假日可顺延；
                <br/>6、陪产假：泛微正式男性员工在工作期间配偶生育的，可凭子女出生证明，享受十个自然日陪产假。
                <br/>7、丧假：直系亲属：配偶、子女、父母可享受三天，岳父母、祖父母、外祖父母可享受一天
                <br/>
              </span>
      </el-row>

    </div>

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
import * as EmpVacationInfoApi from '@/api/oa/kq/empVacationInfo';
import {mapGetters} from 'vuex'
import {MdpFormMixin} from '@/components/mdp-ui/mixin/MdpFormMixin.js';
import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件

export default {
  name: 'empVacationInfoForm',
  mixins: [MdpFormMixin],
  components: {"attachment-upload": AttachmentUpload,},
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
        vacationId: [
          {required: true, message: "请假类型不能为空", trigger: "change"}
        ],
        beginDate: [
          {required: true, message: "起始日期不能为空", trigger: "change"}
        ],
        endDate: [
          {required: true, message: "结束日期不能为空", trigger: "change"}
        ],
      },
      editForm: {
        id: '',
        userid: '',
        username: '',
        deptid: '',
        deptName: '',
        vacationId: '',
        beginDate: '',
        endDate: '',
        reason: '',
        branchId: '',
        beginTime: '',
        endTime: '',
        emergencyDegree: '',
        dutyDescription: '',
        vacationHours: '',
        title: '',
        accessory: '',
        bizProcInstId: '',
        bizFlowState: '',
        vacationType: '',
        vacationName: ''
      },
      //增删改查(含批量)接口
      apis: {
        queryById: EmpVacationInfoApi.queryEmpVacationInfoById,
        add: EmpVacationInfoApi.addEmpVacationInfo,
        edit: EmpVacationInfoApi.editEmpVacationInfo,
        editSomeFields: EmpVacationInfoApi.editSomeFieldsEmpVacationInfo
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
