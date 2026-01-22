<template>
  <el-row>
    <el-row>
      <!--新增/编辑界面 DubanCategory 督办分类表-->
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editFormRef">
        <!--            <el-form-item label="主键" prop="id">-->
        <!--                <el-input  v-model="editForm.id" placeholder="主键" :maxlength="50" @change="editSomeFields(editForm,'id',$event)" :disabled="  disabledJudge('id')"/>-->
        <!--            </el-form-item>-->
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="editForm.name" placeholder="分类名称" :maxlength="50"
                    @change="editSomeFields(editForm,'name',$event)" :disabled="  disabledJudge('name')"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="editForm.status" active-color="#13ce66" inactive-color="#ff4949" active-value="1"
                     inactive-value="0" placeholder="状态1启用0禁用"
                     :maxlength="1" @change="editSomeFields(editForm,'status',$event)"
                     :disabled="  disabledJudge('status')"/>
        </el-form-item>
        <!--            <el-form-item label="归属机构" prop="branchId">-->
        <!--                <el-input  v-model="editForm.branchId" placeholder="归属机构" :maxlength="50" @change="editSomeFields(editForm,'branchId',$event)" :disabled="  disabledJudge('branchId')"/>-->
        <!--            </el-form-item>-->
        <el-form-item label="备注说明" prop="remark">
          <el-input v-model="editForm.remark" placeholder="备注说明" :maxlength="50"
                    @change="editSomeFields(editForm,'remark',$event)" :disabled="  disabledJudge('remark')"/>
        </el-form-item>
        <!--            <el-form-item label="新增时间" prop="createTime">-->
        <!--                <el-date-picker type="date" placeholder="选择日期"  v-model="editForm.createTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="  disabledJudge('createTime')"></el-date-picker>-->
        <!--            </el-form-item>-->
      </el-form>
    </el-row>
    <slot name="footer" :page="this">
      <el-row v-if="showBtn!==false" style="float:right;" class="footer">
        <el-button @click.native="close">关闭</el-button>
        <el-button v-if="currOpType== 'add' || 'edit'" v-loading="load.edit" type="primary" @click.native="saveSubmit"
                   :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交
        </el-button>
      </el-row>
    </slot>
  </el-row>
</template>

<script>
import * as DubanCategoryApi from '@/api/oa/duban/dubanCategory';
import {mapGetters} from 'vuex'
import {MdpFormMixin} from '@/components/mdp-ui/mixin/MdpFormMixin.js';

export default {
  name: 'dubanCategoryForm',
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
        id: '', name: '', status: '', branchId: '', remark: '', createTime: ''
      },
      //增删改查(含批量)接口
      apis: {
        queryById: DubanCategoryApi.queryDubanCategoryById,
        add: DubanCategoryApi.addDubanCategory,
        edit: DubanCategoryApi.editDubanCategory,
        editSomeFields: DubanCategoryApi.editSomeFieldsDubanCategory
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
