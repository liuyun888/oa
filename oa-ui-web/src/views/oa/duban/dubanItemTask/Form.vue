<template>
<el-row>
    <el-row>
    <!--新增/编辑界面 DubanItemTask 督办任务表-->
        <el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
            <el-form-item label="主键" prop="id">
                <el-input  v-model="editForm.id" placeholder="主键" :maxlength="50" @change="editSomeFields(editForm,'id',$event)" :disabled="  disabledJudge('id')"/>
            </el-form-item>
            <el-form-item label="督办主键" prop="dubanId">
                <el-input  v-model="editForm.dubanId" placeholder="督办主键" :maxlength="50" @change="editSomeFields(editForm,'dubanId',$event)" :disabled="  disabledJudge('dubanId')"/>
            </el-form-item>
            <el-form-item label="事项分类id" prop="categoryId">
                <el-input  v-model="editForm.categoryId" placeholder="事项分类id" :maxlength="50" @change="editSomeFields(editForm,'categoryId',$event)" :disabled="  disabledJudge('categoryId')"/>
            </el-form-item>
            <el-form-item label="事项分类" prop="categoryName">
                <el-input  v-model="editForm.categoryName" placeholder="事项分类" :maxlength="50" @change="editSomeFields(editForm,'categoryName',$event)" :disabled="  disabledJudge('categoryName')"/>
            </el-form-item>
            <el-form-item label="任务名称" prop="name">
                <el-input  v-model="editForm.name" placeholder="任务名称" :maxlength="50" @change="editSomeFields(editForm,'name',$event)" :disabled="  disabledJudge('name')"/>
            </el-form-item>
            <el-form-item label="任务开始时间" prop="startTime">
                <el-date-picker type="date" placeholder="选择日期"  v-model="editForm.startTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="  disabledJudge('startTime')"></el-date-picker>
            </el-form-item>
            <el-form-item label="任务结束时间" prop="endTime">
                <el-date-picker type="date" placeholder="选择日期"  v-model="editForm.endTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="  disabledJudge('endTime')"></el-date-picker>
            </el-form-item>
            <el-form-item label="创建人id" prop="createUserid">
                <el-input  v-model="editForm.createUserid" placeholder="创建人id" :maxlength="50" @change="editSomeFields(editForm,'createUserid',$event)" :disabled="  disabledJudge('createUserid')"/>
            </el-form-item>
            <el-form-item label="创建人名称" prop="createUsername">
                <el-input  v-model="editForm.createUsername" placeholder="创建人名称" :maxlength="50" @change="editSomeFields(editForm,'createUsername',$event)" :disabled="  disabledJudge('createUsername')"/>
            </el-form-item>
            <el-form-item label="主办单位id" prop="hostDeptId">
                <el-input  v-model="editForm.hostDeptId" placeholder="主办单位id" :maxlength="50" @change="editSomeFields(editForm,'hostDeptId',$event)" :disabled="  disabledJudge('hostDeptId')"/>
            </el-form-item>
            <el-form-item label="主办单位" prop="hostDeptName">
                <el-input  v-model="editForm.hostDeptName" placeholder="主办单位" :maxlength="50" @change="editSomeFields(editForm,'hostDeptName',$event)" :disabled="  disabledJudge('hostDeptName')"/>
            </el-form-item>
            <el-form-item label="主办id" prop="hostId">
                <el-input  v-model="editForm.hostId" placeholder="主办id" :maxlength="50" @change="editSomeFields(editForm,'hostId',$event)" :disabled="  disabledJudge('hostId')"/>
            </el-form-item>
            <el-form-item label="主办" prop="hostName">
                <el-input  v-model="editForm.hostName" placeholder="主办" :maxlength="50" @change="editSomeFields(editForm,'hostName',$event)" :disabled="  disabledJudge('hostName')"/>
            </el-form-item>
            <el-form-item label="任务描述" prop="remark">
                <el-input  v-model="editForm.remark" placeholder="任务描述" :maxlength="65535" @change="editSomeFields(editForm,'remark',$event)" :disabled="  disabledJudge('remark')"/>
            </el-form-item>
            <el-form-item label="创建时间" prop="createTime">
                <el-date-picker type="date" placeholder="选择日期"  v-model="editForm.createTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="  disabledJudge('createTime')"></el-date-picker>
            </el-form-item>
            <el-form-item label="状态0已申报1进行中2已完成3已超时" prop="status">
                <el-input  v-model="editForm.status" placeholder="状态0已申报1进行中2已完成3已超时" :maxlength="1" @change="editSomeFields(editForm,'status',$event)" :disabled="  disabledJudge('status')"/>
            </el-form-item>
            <el-form-item label="进度" prop="progress">
                <el-input  v-model="editForm.progress" placeholder="进度" :maxlength="5" @change="editSomeFields(editForm,'progress',$event)" :disabled="  disabledJudge('progress')"/>
            </el-form-item>
        </el-form>
    </el-row>
    <slot name="footer" :page="this">
        <el-row v-if="showBtn!==false" style="float:right;" class="footer">
            <el-button @click.native="close">关闭</el-button>
            <el-button v-if="currOpType=='add'" v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交</el-button>
        </el-row>
    </slot>
</el-row>
</template>

<script>
import * as DubanItemTaskApi from '@/api/oa/duban/dubanItemTask';
import { mapGetters } from 'vuex'
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js';

export default {
    name:'dubanItemTaskForm',
    mixins:[MdpFormMixin],
    components: {
    },
    computed: {
    },
    props:{
    },
    watch: {
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            pkNames:["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'add',//表单 add、edit，所有按钮可动、detail-只看不能操作
            editFormRules: {
                id:[
                //{ required: true, message: '此项必填', trigger: 'change' },
                //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                ]
            },
            editForm: {
                id:'',dubanId:'',categoryId:'',categoryName:'',name:'',startTime:'',endTime:'',createUserid:'',createUsername:'',hostDeptId:'',hostDeptName:'',hostId:'',hostName:'',remark:'',createTime:'',status:'',progress:''
            },
            //增删改查(含批量)接口
            apis:{
                queryById: DubanItemTaskApi.queryDubanItemTaskById,
                add: DubanItemTaskApi.addDubanItemTask,
                edit: DubanItemTaskApi.editDubanItemTask,
                editSomeFields: DubanItemTaskApi.editSomeFieldsDubanItemTask
            },
            editable:true,//是否可编辑模式
        }
    },
    methods: {
         //由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
         initCurrData(){

         },
        /**
         * 检查参数是否满足调用后台接口的条件
         * @returns true / false
         */
        preParamCheck(params){
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
        editSomeFieldsCheck(row,fieldName,$event,params){
            if(this.editable==false){
                return false;
            }
            params[fieldName]=$event
            return true;
        },
    },
    mounted() {

    }
}

</script>

<style scoped>

</style>