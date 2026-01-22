<template>
  <el-row>
    <el-row>
      <!--新增/编辑界面 DubanItem 督办表-->
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editFormRef">
        <el-form-item label="事项名称" prop="name">
          <el-input v-model="editForm.name" placeholder="事项名称" :maxlength="50"
                    @change="editSomeFields(editForm,'name',$event)" :disabled="disabledJudge('name')"/>
        </el-form-item>
        <el-form-item label="督办字号" prop="id">
          <!-- disabledJudge('id') -->
          <el-input v-model="editForm.id" placeholder="督办字号" :maxlength="50"
                    @change="editSomeFields(editForm,'id',$event)" :disabled=" true"/>
        </el-form-item>
        <!--        -->
        <!--        <el-form-item label="事项分类id" prop="categoryId">-->
        <!--          <el-input v-model="editForm.categoryId" placeholder="事项分类id" :maxlength="50"-->
        <!--                    @change="editSomeFields(editForm,'categoryId',$event)" :disabled="  disabledJudge('categoryId')"/>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="事项分类" prop="categoryName">-->
        <!--          <el-input v-model="editForm.categoryName" placeholder="事项分类" :maxlength="50"-->
        <!--                    @change="editSomeFields(editForm,'categoryName',$event)"-->
        <!--                    :disabled="  disabledJudge('categoryName')"/>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="创建人id" prop="createUserid">-->
        <!--          <el-input v-model="editForm.createUserid" placeholder="创建人id" :maxlength="50"-->
        <!--                    @change="editSomeFields(editForm,'createUserid',$event)"-->
        <!--                    :disabled="  disabledJudge('createUserid')"/>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="创建人名称" prop="createUsername">-->
        <!--          <el-input v-model="editForm.createUsername" placeholder="创建人名称" :maxlength="50"-->
        <!--                    @change="editSomeFields(editForm,'createUsername',$event)"-->
        <!--                    :disabled="  disabledJudge('createUsername')"/>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="责任人id" prop="dutyId">-->
        <!--          <el-input v-model="editForm.dutyId" placeholder="责任人id" :maxlength="50"-->
        <!--                    @change="editSomeFields(editForm,'dutyId',$event)" :disabled="  disabledJudge('dutyId')"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="责任人名称" prop="dutyId">
          <mdp-select-user v-model="editForm.dutyId" placeholder="责任人名称" :maxlength="50"
                           @change2="(option)=>{
                                        editSomeFields(editForm,'dutyName',option.name);
                                        editSomeFields(editForm,'dutyId',option.id); }"
                           :disabled="  disabledJudge('dutyId')"/>
        </el-form-item>
        <!--        <el-form-item label="牵头部门id" prop="betweenDeptid">-->
        <!--          <el-input v-model="editForm.betweenDeptid" placeholder="牵头部门id" :maxlength="50"-->
        <!--                    @change="editSomeFields(editForm,'betweenDeptid',$event)"-->
        <!--                    :disabled="  disabledJudge('betweenDeptid')"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="牵头部门名称" prop="betweenDeptid">
          <mdp-select-dept v-model="editForm.betweenDeptName" placeholder="牵头部门名称" :maxlength="50"
                           @change2="(option)=>{
                                        editSomeFields(editForm,'betweenDeptid',option.id);
                                        editSomeFields(editForm,'betweenDeptName',option.name);}"
                           :disabled="  disabledJudge('betweenDeptid')"/>
        </el-form-item>
        <!--        <el-form-item label="牵头人id||中间人id" prop="betweenId">-->
        <!--          <el-input v-model="editForm.betweenId" placeholder="牵头人id||中间人id" :maxlength="50"-->
        <!--                    @change="editSomeFields(editForm,'betweenId',$event)" :disabled="  disabledJudge('betweenId')"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="牵头人名称" prop="betweenId">
          <mdp-select-user v-model="editForm.betweenId" placeholder="牵头人名称" :maxlength="50"
                           @change2="(option)=>{
                                        editSomeFields(editForm,'betweenName',option.name);
                                        editSomeFields(editForm,'betweenId',option.id); }"
                           :disabled="  disabledJudge('betweenId')"/>
        </el-form-item>
        <!--        <el-form-item label="归属机构" prop="branchId">-->
        <!--          <el-input v-model="editForm.branchId" placeholder="归属机构" :maxlength="50"-->
        <!--                    @change="editSomeFields(editForm,'branchId',$event)" :disabled="  disabledJudge('branchId')"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="计划开始时间" prop="startTime">
          <el-date-picker type="date" placeholder="选择日期" v-model="editForm.startTime"
                          value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"
                          :disabled="  disabledJudge('startTime')"></el-date-picker>
        </el-form-item>
        <el-form-item label="计划结束时间" prop="endTime">
          <el-date-picker type="date" placeholder="选择日期" v-model="editForm.endTime"
                          value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"
                          :disabled="  disabledJudge('endTime')"></el-date-picker>
        </el-form-item>

        <el-form-item label="主办单位" prop="hostDeptName">
          <mdp-select-dept v-model="editForm.hostDeptName" placeholder="主办单位" :maxlength="50"
                           @change="editSomeFields(editForm,'hostDeptName',$event)"
                           :disabled="disabledJudge('hostDeptName')"/>
        </el-form-item>

        <el-form-item label="主办" prop="hostName">
          <mdp-select-user v-model="editForm.hostName" placeholder="主办" :maxlength="50"
                           @change="editSomeFields(editForm,'hostName',$event)" :disabled="disabledJudge('hostName')"/>
        </el-form-item>

        <el-form-item label="协办单位" prop="coopDepts">
          <mdp-select-dept placeholder="协办单位" :maxlength="50" multiple key="option[index].id"
                           v-model="editForm.coopDept"
                           :disabled="disabledJudge('coopDepts')" @change2="updateCoopDepts"/>
        </el-form-item>

        <el-form-item label="协办" prop="coopUsers ">
          <mdp-select-user placeholder="协办" :maxlength="50" multiple key="option[index].id"
                           v-model="editForm.coopUser"
                           :disabled="disabledJudge('coopUsers')" @change2="updateCoopUsers">
          </mdp-select-user>
        </el-form-item>
        <el-form-item label="任务描述" prop="remark">
          <vue-editor id="remark" :init-value="editForm.remark" :branch-id="editForm.branchId"
                      v-model="editForm.remark"></vue-editor>
        </el-form-item>

        <el-row>
          <el-col :offset="1" class="text" :span="20"><span>任务阶段</span></el-col>
          <el-col :span="3">
            <el-button @click="addRow" icon="el-icon-circle-plus-outline">添加任务</el-button>
          </el-col>
        </el-row>
        <!--        ----------------------------          -->
        <el-row class="row" v-for="(obj,key) in editForm.tasks" :key="key">
          <el-form :model="editForm.tasks[key]" label-width="120px">

            <el-row>
              <el-col :span="1">
                <el-tag style="font-size:25px">{{ key + 1 }}</el-tag>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="22">
                <el-form-item label="任务名称" prop="name">
                  <span class="vTip">*</span>
                  <el-input v-model="editForm.tasks[key].name" placeholder="任务名称" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :offset="1" :span="1">
                <!--                <el-button @click="delRow(key)" icon="el-icon-delete"></el-button>-->
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="任务开始时间" prop="startTime">
                  <el-date-picker
                    v-model="editForm.tasks[key].startTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="任务结束时间" prop="endTime">
                  <el-date-picker
                    v-model="editForm.tasks[key].endTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item style="display:none" label="主办单位id" prop="hostDeptId">
                  <mdp-select-dept v-model="editForm.tasks[key].hostDeptId" placeholder="主办单位id"></mdp-select-dept>
                </el-form-item>
                <el-form-item label="主办单位" prop="hostDeptName">
                  <span class="vTip">*</span>
                  <mdp-select-dept v-model="editForm.tasks[key].hostDeptName" placeholder="主办单位" @change2="(option)=> {
                    editForm.tasks[key].hostDeptId = option.deptid;
                    editForm.tasks[key].hostDeptName = option.deptName; }"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item style="display:none" label="主办id" prop="hostId">
                  <mdp-select-user v-model="editForm.tasks[key].hostId" placeholder="主办id"/>
                </el-form-item>
                <el-form-item label="主办" prop="hostId">
                  <span class="vTip">*</span>
                  <mdp-select-user v-model="editForm.tasks[key].hostName" placeholder="主办单位" @change2="(option)=>{
                   editForm.tasks[key].hostId = option.id;
                   editForm.tasks[key].hostName = option.name;}"/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="协办单位" prop="coopDeptName">
                  <mdp-select-dept v-model="editForm.tasks[key].coopDept" multiple/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="协办" prop="coopUser">
                  <mdp-select-user v-model="editForm.tasks[key].coopUser" multiple/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-form-item label="任务描述" prop="remark">
                <vue-editor id="remark" :init-value="editForm.tasks[key].remark" :branch-id="editForm.branchId"
                            v-model="editForm.tasks[key].remark"></vue-editor>
              </el-form-item>
            </el-row>

          </el-form>
          <el-row>
            <br/>
          </el-row>
        </el-row>

      </el-form>
    </el-row>
    <slot name="footer" :page="this">
      <el-row v-if="showBtn!==false" style="float:right;" class="footer">
        <el-button @click.native="close">关闭</el-button>
        <el-button v-if="true" v-loading="load.edit" type="primary" @click.native="saveSubmit"
                   :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交
        </el-button>
      </el-row>
    </slot>
  </el-row>
</template>

<script>
import * as DubanItemApi from '@/api/oa/duban/dubanItem';
import {MdpFormMixin} from '@/components/mdp-ui/mixin/MdpFormMixin.js';
import VueEditor from '@/components/Tinymce/index'
import SelectDept from "../../../../components/selectShopLocation/selectDept.vue";

export default {
  name: 'dubanItemForm',
  mixins: [MdpFormMixin],
  components: {
    SelectDept,
    VueEditor
  },
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
        name: [
          {required: true, message: '督办名称不能为空', trigger: 'change'},
          {max: 50, message: '不能超过 50 个字符', trigger: 'change'}
        ],
        dutyId: [
          {required: true, message: '责任人不能为空', trigger: 'change'},
          {max: 50, message: '不能超过 50 个字符', trigger: 'change'}
        ],
        startTime: [
          {required: true, message: '事项开始时间不能为空', trigger: 'change'},
        ],
        endTime: [
          {required: true, message: '事项结束时间不能为空', trigger: 'change'},
        ],
      },
      editForm: {
        id: '',
        name: '',
        categoryId: '',
        categoryName: '',
        createUserid: '',
        createUsername: '',
        dutyId: '',
        dutyName: '',
        betweenDeptid: '',
        betweenDeptName: '',
        betweenId: '',
        betweenName: '',
        branchId: '',
        startTime: '',
        endTime: '',
        hostDeptId: '',
        hostDeptName: '',
        hostId: '',
        hostName: '',
        remark: '',
        status: '',
        createTime: '',
        progress: '',
        coopDepts: [],
        coopDept: [],
        coopUsers: [],
        coopUser: [],
        tasks: []
      },
      //增删改查(含批量)接口
      apis: {
        queryById: DubanItemApi.queryDubanItemById,
        add: DubanItemApi.addDubanItem,
        edit: DubanItemApi.editDubanItem,
        editSomeFields: DubanItemApi.editSomeFieldsDubanItem
      },
      editable: true,//是否可编辑模式
    }
  },
  methods: {
    test(option) {
      console.log(option)
    },
    addRow() {
      let params = {
        id: '',
        dubanId: '',
        name: '',
        startTime: '',
        endTime: '',
        hostDeptId: '',
        hostDeptName: '',
        hostId: '',
        hostName: '',
        coopUser: [],
        coopDept: [],
        remark: '',
        createTime: ''
      }
      this.editForm.tasks.push(params);
    },

    updateCoopUsers(option) {
      let users = []
      option.forEach((item) => {
        users.push({
          userId: item.userid, username: item.username
        })
      })
      this.editForm.coopUsers = users
    },
    updateCoopDepts(option) {
      let depts = []
      option.forEach((item) => {
        depts.push({
          deptId: item.id, deptName: item.name
        })
      })
      this.editForm.coopDepts = depts
    },
    //由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
    initCurrData() {
      let userIds = [];
      let deptIds = [];
      this.editForm.coopUsers.forEach((item) => userIds.push(item.userId));
      this.editForm.coopDepts.forEach((item) => deptIds.push(item.deptId));
      this.editForm.coopUser = userIds;
      this.editForm.coopDept = deptIds;
      this.editForm.tasks = []
    },
    /**
     * 检查参数是否满足调用后台接口的条件
     * @returns true / false
     */
    preParamCheck(params) {
      params.coopUser = this.editForm.coopUsers
      params.coopDept = this.editForm.coopDepts
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
