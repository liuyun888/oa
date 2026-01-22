<template>
  <section class="border padding">
    <el-row>
      <el-col :span="24">
        <mdp-select-dept size="small" v-model="filters.cbCenterNames" @change2="onCbCenterSelected" multiple
                         :width="35+'%'" placeholder="请选择成本中心"/>
        <mdp-select-dept size="small" v-model="filters.useDeptNames" @change2="onDeptsSelected" multiple
                         :width="35+'%'" placeholder="请选择申请部门"/>
        <!--        todo todo todo -->
        <el-date-picker size="small"
                        v-model="filters.reqDateScope"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="申请日期"
                        end-placeholder="申请日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00','23:59:59']"
                        :picker-options="pickerOptions">
        </el-date-picker>
      </el-col>
    </el-row>

    <el-row>
      <el-input v-model="filters.opType" style="width: 20%;" placeholder="单据类型 查询 输入 *字符* >10 <9 等"
                clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
      <el-input v-model="filters.reqUsername" style="width: 20%;" placeholder="申请人 查询 输入 *字符* >10 <9 等"
                clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
      <el-input v-model="filters.reqTitle" style="width: 20%;" placeholder="申请标题 查询 输入 *字符* >10 <9 等"
                clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

      <!--      <el-input v-model="filters.id" style="width: 20%;" placeholder="主键（采购申请单）查询 输入 *字符* >10 <9 等"-->
      <!--                clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>-->

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
      <!--列表 AssetMng 资产出租/出借单-->
      <el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas"
                @sort-change="sortChange" highlight-current-row v-loading="load.list" border
                @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
        <el-table-column type="selection" width="55" show-overflow-tooltip fixed="left"
                         v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
        <el-table-column sortable type="index" width="55" show-overflow-tooltip fixed="left"></el-table-column>
        <el-table-column prop="id" label="申请单编号" min-width="120" show-overflow-tooltip fixed="left"
                         col-type="String" v-if="showCol('id')"></el-table-column>
        <el-table-column prop="reqTitle" label="申请标题" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('reqTitle')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.reqTitle" :maxlength="50"
                       @change="editSomeFields(scope.row,'reqTitle',$event)"
                       :disabled="!editable || disabledJudge('reqTitle')"/>
          </template>
        </el-table-column>
        <el-table-column prop="opType"
                         label="单据类型"
                         min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('opType')">
          <template slot-scope="scope">
            <mdp-select item-code="op_type" show-style="tag" v-model="scope.row.opType" :maxlength="20"
                        @change="editSomeFields(scope.row,'opType',$event)"
                        :disabled="!editable || disabledJudge('opType')"/>
          </template>
        </el-table-column>
        <el-table-column prop="reqUsername" label="申请人姓名" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('reqUsername')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.reqUsername" :maxlength="50"
                       @change="editSomeFields(scope.row,'reqUsername',$event)"
                       :disabled="!editable || disabledJudge('reqUsername')"/>
          </template>
        </el-table-column>
        <el-table-column prop="reqDeptName" label="申请单位名称" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('reqDeptName')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.reqDeptName" :maxlength="50"
                       @change="editSomeFields(scope.row,'reqDeptName',$event)"
                       :disabled="!editable || disabledJudge('reqDeptName')"/>
          </template>
        </el-table-column>
        <el-table-column prop="reqDate" label="申请日期" min-width="120" show-overflow-tooltip col-type="Date"
                         v-if="showCol('reqDate')">
          <template slot-scope="scope">
            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.reqDate"
                      @change="editSomeFields(scope.row,'reqDate',$event)" value-format="yyyy-MM-dd HH:mm:ss"
                      format="yyyy-MM-dd" :disabled="!editable || disabledJudge('reqDate')"/>
          </template>
        </el-table-column>
        <el-table-column prop="reqReason" label="申请事由" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('reqReason')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.reqReason" :maxlength="255"
                       @change="editSomeFields(scope.row,'reqReason',$event)"
                       :disabled="!editable || disabledJudge('reqReason')"/>
          </template>
        </el-table-column>
        <el-table-column prop="bizFlowState" label="状态" min-width="120"
                         show-overflow-tooltip col-type="String" v-if="showCol('bizFlowState')">
          <template slot-scope="scope">
            <span>
            <mdp-select item-code="bizFlowState" show-style="tag" v-model="scope.row.bizFlowState" :maxlength="1"
                        @change="editSomeFields(scope.row,'bizFlowState',$event)"
                        :disabled="!editable || disabledJudge('bizFlowState')"/>
              <p> {{ scope.row.assigneeName }}&nbsp;&nbsp;{{ scope.row.commentMsg }}</p>
            </span>
          </template>
        </el-table-column>

        <!--        操作-->
        <el-table-column label="操作" :width="currOpType=='mng'?180:100" fixed="right">
          <template scope="scope" v-if="currOpType=='mng'">
            <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary"
                       @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row,title:'修改'})"
                       icon="el-icon-edit" title="修改一条数据"/>
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
      <!--新增修改明细 AssetMng 资产出租/出借单界面-->
      <mdp-dialog :ref="refId+'FormDialog'">
        <template v-slot="{visible,data,dialog}">
          <asset-mng-form :ref="refId+'Form'" :visible="visible" :parent-op-type="currOpType"
                          :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose"
                          @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
        </template>
      </mdp-dialog>
    </el-row>
  </section>
</template>

<script>

import {MdpTableMixin} from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import * as AssetMngApi from '@/api/oa/erp/ass/assetMng';
import AssetMngForm from './Form';//新增修改明细界面
import {mapGetters} from 'vuex'
import util from '@/common/js/util';
import SelectDept from "../../../../../components/selectShopLocation/selectDept.vue";
//全局公共库

export default {
  name: 'assetMngMng',
  mixins: [MdpTableMixin],
  components: {
    SelectDept,
    AssetMngForm,
  },
  props: ['visible', 'queryScene'],
  computed: {},
  watch: {},
  data() {
    const fromStartTime = new Date();
    const toStartTime = new Date();
    fromStartTime.setTime(fromStartTime.getTime() - 3600 * 1000 * 24 * 7 * 4);

    return {

      addFormVisible: false,//新增assetMng界面是否显示
      pickerOptions: util.pickerOptions,
      menuDefId: '',//menu_def.id 菜单表菜单编号，用于按钮权限判断
      menuDefName: '资产出租/出借单',//menu_def.name 功能名称，用于导出excel等文件名
      refId: 'assetMng',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
      pkNames: ["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
      currOpType: 'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
      filters: {//查询参数
        reqDateScope: [util.formatDate.format(fromStartTime, 'yyyy-MM-dd hh:mm:ss'), util.formatDate.format(toStartTime, 'yyyy-MM-dd hh:mm:ss')],
      },
      defaultFilters: {//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

      },

      defaultCheckColumnNum: 15,//默认展示的表格列数，前8列

      editable: false,//是否可编辑模式

      //增删改查(含批量)接口
      apis: {
        list: AssetMngApi.listAssetMng,
        add: AssetMngApi.addAssetMng,
        del: AssetMngApi.delAssetMng,
        edit: AssetMngApi.editAssetMng,
        editSomeFields: AssetMngApi.editSomeFieldsAssetMng,
        batchAdd: AssetMngApi.batchAddAssetMng,
        batchDel: AssetMngApi.batchDelAssetMng,
        batchEdit: AssetMngApi.batchEditAssetMng,
      }
    }
  },
  methods: {
    rowClick: function (row, event, column) {
      this.editForm = row;
      if (event.label != '操作' && event.type != 'selection') {
        // this.detailShowVisible = true;
        this.openForm({parentOpType: 'mng', subOpType: 'edit', formData: row, title: '修改'})
      }
      this.$emit('row-click', row, event, column);//  @row-click="rowClick"
    },
    onDeptsSelected(nodes) {
      // 后端没有处理 useDeptNames
      if (nodes == null || nodes.length === 0) {
        this.filters.useDeptids = "";
        this.filters.useDeptNames = "";
      } else {
        this.filters.useDeptids = nodes.map((i) => i.deptid).join(",");
        this.filters.useDeptNames = nodes.map((i) => i.deptName).join(",");
      }
    },
    onCbCenterSelected(nodes) {
      // 后端没有处理 cbCenterNames
      if (nodes == null || nodes.length === 0) {
        this.filters.cbCenterIds = '';
        this.filters.cbCenterNames = "";
      } else {
        this.filters.cbCenterIds = nodes.map((i) => i.deptid).join(",");
        this.filters.cbCenterNames = nodes.map((i) => i.deptName).join(",");
      }
    },

    //页面初始化需要配置的特殊逻辑写这里
    initCurrData() {
      // test
      // this.filters.reqDateScope = []
      this.searchTableDatas();
    },

    /**
     * 检查参数是否满足调用后台接口的条件
     *
     * @param params 提交给后台的参数池,map类型
     * @returns true / false
     */
    preQueryParamCheck(params) {
      if (this.queryScene === 'my') {
        params.reqUserid = this.userInfo.userid
      }

      if (this.filters.reqDateScope && this.filters.reqDateScope.length === 2) {
        params.reqDate = `$between ${this.filters.reqDateScope[0]},${this.filters.reqDateScope[1]}`
      }

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
