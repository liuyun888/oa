<template>
  <section class="border padding">
    <el-row>
      <el-input v-model="filters.name" style="width: 20%;" placeholder="假期名称查询 输入 *字符* >10 <9 等" clearable
                title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
      <el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search"
                 type="primary">查询
      </el-button>
      <span style="float:right;" v-if="currOpType=='mng'">
                <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary"
                           @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm,title:'新增'})"
                           icon="el-icon-plus"/>
                <el-button
                  :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) || this.sels.length===0 || load.del==true"
                  type="danger" v-loading="load.del" @click="batchDel" icon="el-icon-delete"/>
            </span>
      <span style="float:right;" v-else-if="currOpType=='select' &&  this.multiple==true">
                <el-button :disabled="disabledJudge('selectBtn') || this.sels.length===0" type="primary"
                           @click="selectListConfirm" icon="el-icon-check"/>
            </span>
    </el-row>
    <el-row>
      <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
      <el-button type="text" icon="el-icon-zoom-out" @click="searchReset()">重置查询</el-button>&nbsp;&nbsp;&nbsp;
    </el-row>
    <el-row>
      <!--列表 VacationType 请假类型表-->
      <el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas"
                @sort-change="sortChange" highlight-current-row v-loading="load.list" border
                @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">

        <el-table-column type="selection" width="55" show-overflow-tooltip fixed="left"
                         v-if="currOpType=='mng' || this.multiple==true"></el-table-column>

        <el-table-column sortable type="index" width="55" show-overflow-tooltip fixed="left"></el-table-column>

        <el-table-column prop="name" label="假期名称" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('name')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.name" :maxlength="255"
                       @change="editSomeFields(scope.row,'name',$event)"
                       :disabled="!editable || disabledJudge('name')"/>
          </template>
        </el-table-column>

        <el-table-column prop="totalHours" label="总时长（小时）" min-width="120" show-overflow-tooltip
                         col-type="BigDecimal" v-if="showCol('totalHours')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.totalHours"
                       @change="editSomeFields(scope.row,'totalHours',$event)" :maxlength="8"
                       :disabled="!editable || disabledJudge('totalHours')"/>
          </template>
        </el-table-column>

        <el-table-column prop="vacationRule" label="请假规则" min-width="120"
                         show-overflow-tooltip col-type="String" v-if="showCol('vacationRule')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.vacationRule" :maxlength="255"
                       @change="editSomeFields(scope.row,'vacationRule',$event)"
                       :disabled="!editable || disabledJudge('vacationRule')"/>
          </template>
        </el-table-column>

        <el-table-column prop="sexRule" label="性别要求" min-width="120"
                         show-overflow-tooltip col-type="String" v-if="showCol('sexRule')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.sexRule" :maxlength="8"
                       @change="editSomeFields(scope.row,'sexRule',$event)"
                       :disabled="!editable || disabledJudge('sexRule')">
              {{scope.row.status == '0' ? '男性可请' : (scope.row.status == '1' ? '女性可请' : '全部')}}
            </mdp-input>
          </template>
        </el-table-column>

        <el-table-column prop="beginEmpMonths" label="在职要求(月" min-width="120" show-overflow-tooltip
                         col-type="Integer" v-if="showCol('beginEmpMonths')">
          <template slot-scope="scope">
            <mdp-number show-style="tag" v-model="scope.row.beginEmpMonths"
                        @change="editSomeFields(scope.row,'beginEmpMonths',$event)" :precision="0"
                        :disabled="!editable || disabledJudge('beginEmpMonths')"/>
          </template>
        </el-table-column>

        <el-table-column prop="beginWorkingMonths" label="工龄要求(月）" min-width="120" show-overflow-tooltip
                         col-type="Integer" v-if="showCol('beginWorkingMonths')">
          <template slot-scope="scope">
            <mdp-number show-style="tag" v-model="scope.row.beginWorkingMonths"
                        @change="editSomeFields(scope.row,'beginWorkingMonths',$event)" :precision="0"
                        :disabled="!editable || disabledJudge('beginWorkingMonths')"/>
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作" :width="currOpType=='mng'?150:80" fixed="right">
          <template scope="scope" v-if="currOpType=='mng'">
            <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary"
                       @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row,title:'修改'})"
                       icon="el-icon-edit" title="编辑请假类型表"/>
            <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) " type="danger"
                       @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete" title="删除一条数据"/>
          </template>

          <template scope="scope" v-else-if="currOpType=='list'">
            <el-button type="primary" @click="openForm({parentOpType:currOpType,subOpType:'detail',formData:scope.row})"
                       icon="el-icon-view"/>
          </template>

          <template scope="scope" v-else-if="currOpType=='select' && this.multiple!=true">
            <el-button type="primary" @click="selectConfirm(scope.row)" icon="el-icon-check"/>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination
        layout="slot,total, sizes, prev, next,pager,jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[10,20, 50, 100, 500]"
        :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize"
        :total="pageInfo.total"
        style="float:right;"
      >
      </el-pagination>
    </el-row>
    <el-row>
      <!--新增修改明细 VacationType 请假类型表界面-->
      <mdp-dialog :ref="refId+'FormDialog'">
        <template v-slot="{visible,data,dialog}">
          <vacation-type-form :ref="refId+'Form'" :visible="visible" :parent-op-type="currOpType"
                              :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose"
                              @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
        </template>
      </mdp-dialog>
    </el-row>
  </section>
</template>

<script>

import {MdpTableMixin} from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import * as VacationTypeApi from '@/api/oa/kq/vacationType';
import VacationTypeForm from './Form';//新增修改明细界面
import {mapGetters} from 'vuex'

export default {
  name: 'index',
  mixins: [MdpTableMixin],
  components: {
    VacationTypeForm,
  },
  computed: {},
  watch: {},
  data() {
    return {
      menuDefId: '',//menu_def.id 菜单表菜单编号，用于按钮权限判断
      menuDefName: '请假类型表',//menu_def.name 功能名称，用于导出excel等文件名
      refId: 'vacationType',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
      pkNames: ["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
      currOpType: 'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
      filters: {//查询参数

      },
      defaultFilters: {//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

      },

      defaultCheckColumnNum: 8,//默认展示的表格列数，前8列

      editable: false,//是否可编辑模式

      //增删改查(含批量)接口
      apis: {
        list: VacationTypeApi.listVacationType,
        add: VacationTypeApi.addVacationType,
        del: VacationTypeApi.delVacationType,
        edit: VacationTypeApi.editVacationType,
        editSomeFields: VacationTypeApi.editSomeFieldsVacationType,
        batchAdd: VacationTypeApi.batchAddVacationType,
        batchDel: VacationTypeApi.batchDelVacationType,
        batchEdit: VacationTypeApi.batchEditVacationType,
      }
    }
  },
  methods: {
    //页面初始化需要配置的特殊逻辑写这里
    initCurrData() {
      this.searchTableDatas();
    },

    /**
     * 检查参数是否满足调用后台接口的条件
     *
     * @param params 提交给后台的参数池,map类型
     * @returns true / false
     */
    preQueryParamCheck(params) {
      return true;
    },

    //页面数据加载完后需要对数据进行加工处理的
    afterList(tableDatas, isOk, apiName) {

    },

    /**
     * 对修改的字段进行判断，返回false ,将取消更新数据库
     * @param {*} row 当前选中的行
     * @param {*} fieldName 修改的字段名
     * @param {*} $event 修改后的值
     * @param {*} params 将要提交服务器的参数
     * @returns true/false 返回false ,将取消更新数据库
     */
    editSomeFieldsCheck(row, fieldName, $event, params) {
      if (this.currOpType == 'add' || this.currOpType == 'detail') {
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
