<template>
  <section class="border padding">
    <el-row>
      <el-date-picker v-model="filters.month" type="month" value-format="yyyy-MM" placeholder="选择月">
      </el-date-picker>
      <el-input v-model="filters.username" style="width: 20%;" placeholder="员工名称查询 输入 *字符* >10 <9 等"
                clearable
                title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
      <el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search"
                 type="primary">查询
      </el-button>

    </el-row>
    <el-row>
      <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
      <el-button type="text" icon="el-icon-zoom-out" @click="searchReset()">重置查询</el-button>&nbsp;&nbsp;&nbsp;
    </el-row>
    <el-row>
      <!--列表 WorkOvertimeInfo 加班表-->
      <el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas"
                @sort-change="sortChange" highlight-current-row v-loading="load.list" border
                @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
        <el-table-column type="selection" width="55" show-overflow-tooltip fixed="left"
                         v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
        <el-table-column sortable type="index" width="55" show-overflow-tooltip fixed="left"></el-table-column>

        <el-table-column prop="username" label="员工名称" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('username')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.username" :maxlength="50"
                       @change="editSomeFields(scope.row,'username',$event)"
                       :disabled="!editable || disabledJudge('username')"/>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('title')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.title" :maxlength="255"
                       @change="editSomeFields(scope.row,'title',$event)"
                       :disabled="!editable || disabledJudge('title')"/>
          </template>
        </el-table-column>
        <el-table-column prop="workOvertimeType" label="加班类型" min-width="120" show-overflow-tooltip
                         col-type="String" v-if="showCol('workOvertimeType')">
          <template slot-scope="scope">
            <mdp-select item-code="overtimeType" show-style="tag" v-model="scope.row.workOvertimeType" :maxlength="10"
                        @change="editSomeFields(scope.row,'workOvertimeType',$event)"
                        :disabled="!editable || disabledJudge('workOvertimeType')"/>
          </template>
        </el-table-column>
        <el-table-column prop="beginTime" label="开始时间" min-width="120" show-overflow-tooltip col-type="Date"
                         v-if="showCol('beginTime')">
          <template slot-scope="scope">
            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.beginTime"
                      @change="editSomeFields(scope.row,'beginTime',$event)" value-format="yyyy-MM-dd HH:mm:ss"
                      format="yyyy-MM-dd" :disabled="!editable || disabledJudge('beginTime')"/>
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" min-width="120" show-overflow-tooltip col-type="Date"
                         v-if="showCol('endTime')">
          <template slot-scope="scope">
            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.endTime"
                      @change="editSomeFields(scope.row,'endTime',$event)" value-format="yyyy-MM-dd HH:mm:ss"
                      format="yyyy-MM-dd" :disabled="!editable || disabledJudge('endTime')"/>
          </template>
        </el-table-column>
        <el-table-column prop="workOvertimeHours" label="加班小时数" min-width="120" show-overflow-tooltip
                         col-type="String" v-if="showCol('workOvertimeHours')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.workOvertimeHours" :maxlength="10"
                       @change="editSomeFields(scope.row,'workOvertimeHours',$event)"
                       :disabled="!editable || disabledJudge('workOvertimeHours')"/>
          </template>
        </el-table-column>
        <el-table-column prop="reasonWorkOvertime" label="加班原因" min-width="120" show-overflow-tooltip
                         col-type="String" v-if="showCol('reasonWorkOvertime')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.reasonWorkOvertime" :maxlength="50"
                       @change="editSomeFields(scope.row,'reasonWorkOvertime',$event)"
                       :disabled="!editable || disabledJudge('reasonWorkOvertime')"/>
          </template>
        </el-table-column>

        <el-table-column prop="deptName" label="部门名称" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('deptName')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.deptName" :maxlength="50"
                       @change="editSomeFields(scope.row,'deptName',$event)"
                       :disabled="!editable || disabledJudge('deptName')"/>
          </template>
        </el-table-column>
        <el-table-column prop="applyTime" label="申请时间" min-width="120" show-overflow-tooltip col-type="Date"
                         v-if="showCol('applyTime')">
          <template slot-scope="scope">
            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.applyTime"
                      @change="editSomeFields(scope.row,'applyTime',$event)" value-format="yyyy-MM-dd HH:mm:ss"
                      format="yyyy-MM-dd" :disabled="!editable || disabledJudge('applyTime')"/>
          </template>
        </el-table-column>

        <el-table-column prop="bizFlowState" label="当前流程状态" min-width="120" show-overflow-tooltip
                         col-type="String" v-if="showCol('bizFlowState')">
          <template slot-scope="scope">
            <mdp-select item-code="vacation_status" show-style="tag" v-model="scope.row.bizFlowState" :maxlength="1"
                        @change="editSomeFields(scope.row,'bizFlowState',$event)"
                        :disabled="!editable || disabledJudge('bizFlowState')"/>
          </template>
        </el-table-column>

        <el-table-column label="操作" :width="currOpType=='mng'?200:50" fixed="right">

          <template scope="scope" v-if="currOpType=='mng'">
            <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary"
                       @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row,title:'编辑'})"
                       icon="el-icon-edit" title="修改一条数据"/>
            <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) " type="danger"
                       @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete" title="删除一条数据"/>

            <el-dropdown @command="handleCommand" :hide-on-click="false">
              <span class="el-dropdown-link">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-success" :command="{type:'sendToProcessApprova',row:scope.row}">发审
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
      <!--新增修改明细 WorkOvertimeInfo 加班表界面-->
      <mdp-dialog :ref="refId+'FormDialog'">
        <template v-slot="{visible,data,dialog}">
          <work-overtime-info-form :ref="refId+'Form'" :visible="visible" :parent-op-type="currOpType"
                                   :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose"
                                   @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
        </template>
      </mdp-dialog>
    </el-row>
  </section>
</template>

<script>
import config from "@/common/config"; //全局公共库
import {MdpTableMixin} from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import * as WorkOvertimeInfoApi from '@/api/oa/kq/workOvertimeInfo';
import WorkOvertimeInfoForm from './Form';//新增修改明细界面
import {mapGetters} from 'vuex'
import {processApprovaWorkOvertimeInfo} from "../../../../../api/oa/kq/workOvertimeInfo";

export default {
  name: 'workOvertimeInfoMng',
  mixins: [MdpTableMixin],
  components: {
    WorkOvertimeInfoForm,
  },
  computed: {},
  watch: {},
  data() {
    return {
      menuDefId: '',//menu_def.id 菜单表菜单编号，用于按钮权限判断
      menuDefName: '加班表',//menu_def.name 功能名称，用于导出excel等文件名
      refId: 'workOvertimeInfo',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
      pkNames: ["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
      currOpType: 'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
      filters: {//查询参数

      },
      defaultFilters: {//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

      },

      defaultCheckColumnNum: 15,//默认展示的表格列数，前8列

      editable: false,//是否可编辑模式

      //增删改查(含批量)接口
      apis: {
        list: WorkOvertimeInfoApi.listWorkOvertimeInfo,
        add: WorkOvertimeInfoApi.addWorkOvertimeInfo,
        del: WorkOvertimeInfoApi.delWorkOvertimeInfo,
        edit: WorkOvertimeInfoApi.editWorkOvertimeInfo,
        editSomeFields: WorkOvertimeInfoApi.editSomeFieldsWorkOvertimeInfo,
        batchAdd: WorkOvertimeInfoApi.batchAddWorkOvertimeInfo,
        batchDel: WorkOvertimeInfoApi.batchDelWorkOvertimeInfo,
        batchEdit: WorkOvertimeInfoApi.batchEditWorkOvertimeInfo,
        proceseApprova: WorkOvertimeInfoApi.processApprovaWorkOvertimeInfo
      }
    }
  },
  methods: {
    sendToProcessApprova: function (row, bizKey) {
      if (row.bizFlowState != '0') {
        this.$message.error("非初始，不允许发起审核");
        return;
      }
      let extVars = {
        workOvertimeId: row.id
      }
      let jsonExtVars = JSON.stringify(extVars);

      var currDomain = window.location.protocol + "//" + window.location.host;
      var fullPath = this.$route.fullPath;
      var bizUrl = currDomain + '/' + process.env.CONTEXT + '/' + process.env.VERSION + '/#' + fullPath +
        '?extVars=' + jsonExtVars

      var titleNames = row.username
      var mainTitle = ''
      var mainContext = ''
      if (bizKey == 'work_overtime_info_approva') {
        mainTitle = '关于【' + titleNames + "加班" + row.workOvertimeHours + "小时】的审批"
        mainContext = mainTitle + ',加班原因：' + row.reasonWorkOvertime + ",开始日期：" + row.beginTime + ",结束日期：" + row
          .endTime;
      } else {
        this.$message.error("暂不支持的业务审批");
        return;
      }

      let params = {
        mainContext: mainContext,
        mainTitle: mainTitle,
        bizKey: bizKey,
        bizUrl: bizUrl,
        restUrl: config.getOaBasePath() + "/kq/workOvertimeInfo/processApprova",
        extVars: extVars,
        flowVars: {
          subscribeTaskEvent: 'TASK_COMPLETED,TASK_CREATED',
          branchId: row.branchId,
          workOvertimeId: row.id
        },
      }
      let jsonParmas = encodeURIComponent(JSON.stringify(params)); //对方要 decodeURIComponent
      // todo 跳到了其他页面
      this.$router.push({
        path: '/mdp/workflow/re/procdef/ProcdefListForBizStart',
        query: {
          params: jsonParmas
        }
      });
    },
    handleCommand(command) {
      if (command.type == 'sendToProcessApprova') {
        this.sendToProcessApprova(command.row, 'work_overtime_info_approva');
      }
    },
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
