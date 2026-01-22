<template>
  <section class="page-container border padding">
    <el-row class="page-header">
      <mdp-select item-code="duban_category" v-model="filters.categoryId" style="width: 20%;"
                  placeholder="事项分类id查询 输入 *字符* >10 <9 等" clearable
                  title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
      <el-input v-model="filters.id" style="width: 20%;" placeholder="督办字号查询 输入 *字符* >10 <9 等" clearable
                title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
      <el-input v-model="filters.name" style="width: 20%;" placeholder="事项名称查询 输入 *字符* >10 <9 等" clearable
                title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
      <el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search"
                 type="primary">查询
      </el-button>
      <span style="float:right;" v-if="currOpType=='mng'">
                <el-button
                  :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) || this.sels.length===0 || load.del==true"
                  type="danger" v-loading="load.del" @click="batchDel" icon="el-icon-delete">批量删除</el-button>
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
    <el-row class="page-main padding-top">
      <el-col class="itemTable">
        <el-table ref="procdefsTable" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas"
                  @sort-change="sortChange" highlight-current-row v-loading="load.list" border
                  @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
          <el-table-column type="selection" width="55" show-overflow-tooltip fixed="left"
                           v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
          <el-table-column sortable type="index" width="55" show-overflow-tooltip fixed="left"></el-table-column>
          <el-table-column prop="id" label="督办字号" min-width="120" show-overflow-tooltip fixed="left"
                           col-type="String"
                           v-if="showCol('id')"></el-table-column>
          <el-table-column prop="name" label="事项名称" min-width="120" show-overflow-tooltip col-type="String"
                           v-if="showCol('name')">
            <template slot-scope="scope">
              <mdp-input show-style="tag" v-model="scope.row.name" :maxlength="50"
                         @change="editSomeFields(scope.row,'name',$event)"
                         :disabled="!editable || disabledJudge('name')"/>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="状态" min-width="80">
            <template slot-scope="scope">
              <mdp-select item-code="duban_status" show-style="tag" v-model="scope.row.status" :maxlength="1"
                          @change="editSomeFields(scope.row,'status',$event)"
                          :disabled="!editable || disabledJudge('status')"/>
            </template>
          </el-table-column>

          <el-table-column prop="progress" label="进度" min-width="120">
            <template slot-scope="scope">
              <el-progress v-if="scope.row.progress < 25 " :text-inside="true" :stroke-width="26"
                           :percentage="Number(scope.row.progress)" status="exception"></el-progress>
              <el-progress v-if="scope.row.progress < 50 && scope.row.progress >= 25 " :text-inside="true"
                           :stroke-width="26" :percentage="Number(scope.row.progress)" status="warning"></el-progress>
              <el-progress v-if="scope.row.progress < 100 && scope.row.progress >= 50 " :text-inside="true"
                           :stroke-width="26" :percentage="Number(scope.row.progress)"></el-progress>
              <el-progress v-if="scope.row.progress >= 100" :text-inside="true" :stroke-width="26"
                           :percentage="Number(scope.row.progress)" status="success"></el-progress>
            </template>
          </el-table-column>

          <el-table-column prop="createUsername" label="创建人名称" min-width="120" show-overflow-tooltip
                           col-type="String" v-if="showCol('createUsername')">
            <template slot-scope="scope">
              <mdp-input show-style="tag" v-model="scope.row.createUsername" :maxlength="50"
                         @change="editSomeFields(scope.row,'createUsername',$event)"
                         :disabled="!editable || disabledJudge('createUsername')"/>
            </template>
          </el-table-column>

          <el-table-column prop="categoryId" label="事项分类" min-width="120" show-overflow-tooltip col-type="String"
                           v-if="showCol('categoryId')">
            <template slot-scope="scope" >
              <mdp-select item-code="duban_category" show-style="tag" v-model="scope.row.categoryId" :maxlength="50"
                          @change="editSomeFields(scope.row,'categoryId',$event)"
                          :disabled="!editable || disabledJudge('categoryId')"/>
            </template>
          </el-table-column>

          <el-table-column prop="dutyName" label="责任人名称" min-width="120" show-overflow-tooltip col-type="String"
                           v-if="showCol('dutyName')">
            <template slot-scope="scope">
              <mdp-input show-style="tag" v-model="scope.row.dutyName" :maxlength="50"
                         @change="editSomeFields(scope.row,'dutyName',$event)"
                         :disabled="!editable || disabledJudge('dutyName')"/>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="计划开始时间" min-width="120" show-overflow-tooltip col-type="Date"
                           v-if="showCol('startTime')">
            <template slot-scope="scope">
              <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.startTime"
                        @change="editSomeFields(scope.row,'startTime',$event)" value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd" :disabled="!editable || disabledJudge('startTime')"/>
            </template>
          </el-table-column>
          <el-table-column prop="endTime" label="计划结束时间" min-width="120" show-overflow-tooltip col-type="Date"
                           v-if="showCol('endTime')">
            <template slot-scope="scope">
              <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.endTime"
                        @change="editSomeFields(scope.row,'endTime',$event)" value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd" :disabled="!editable || disabledJudge('endTime')"/>
            </template>
          </el-table-column>

          <el-table-column prop="hostDeptName" label="主办单位" min-width="120" show-overflow-tooltip col-type="String"
                           v-if="showCol('hostDeptName')">
            <template slot-scope="scope">
              <mdp-input show-style="tag" v-model="scope.row.hostDeptName" :maxlength="50"
                         @change="editSomeFields(scope.row,'hostDeptName',$event)"
                         :disabled="!editable || disabledJudge('hostDeptName')"/>
            </template>
          </el-table-column>

          <el-table-column label="操作" :width="currOpType=='mng'?150:50" fixed="right">
            <template scope="scope" v-if="currOpType=='mng'">
              <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary"
                         @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row,title:'修改'})"
                         icon="el-icon-edit" title="修改一条数据"/>
              <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) " type="danger"
                         @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete" title="删除一条数据"/>
            </template>
          </el-table-column>

        </el-table>
        </el-col>
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
        style="float:right;" >
      </el-pagination>
    </el-row>
    <el-row>
      <!--新增修改明细 DubanItem 督办表界面-->
      <mdp-dialog :ref="refId+'FormDialog'">
        <template v-slot="{visible,data,dialog}">
          <duban-item-form :ref="refId+'Form'" :visible="visible" :parent-op-type="currOpType"
                           :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose"
                           @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
        </template>
      </mdp-dialog>
    </el-row>
  </section>
</template>

<script>
import {MdpTableMixin} from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import * as DubanItemApi from '@/api/oa/duban/dubanItem';
import {mapGetters} from 'vuex'
import DubanItemForm from './Form';//新增修改明细界面

export default {
  name: 'dubanItemMng',
  mixins: [MdpTableMixin],
  components: {
    DubanItemForm,
  },
  computed: {},
  watch: {},
  data() {
    return {
      menuDefId: '',//menu_def.id 菜单表菜单编号，用于按钮权限判断
      menuDefName: '督办表',//menu_def.name 功能名称，用于导出excel等文件名
      pkNames: ["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
      refId: 'dubanItemMng',
      currOpType: 'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
      filters: {//查询参数

      },
      defaultFilters: {//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

      },

      defaultCheckColumnNum: 8,//默认展示的表格列数，前8列

      editable: false,//是否可编辑模式

      //增删改查(含批量)接口
      apis: {
        list: DubanItemApi.listDubanItem,
        add: DubanItemApi.addDubanItem,
        del: DubanItemApi.delDubanItem,
        edit: DubanItemApi.editDubanItem,
        editSomeFields: DubanItemApi.editSomeFieldsDubanItem,
        batchAdd: DubanItemApi.batchAddDubanItem,
        batchDel: DubanItemApi.batchDelDubanItem,
        batchEdit: DubanItemApi.batchEditDubanItem,
      }
    }
  },
  methods: {
    test(option) {
      console.log("option",option)
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
.itemTable {
  position: relative;
}

.showMenuIcon {
  font-size: 40px;
  /* color: royalblue; */
  position: absolute;
  cursor: pointer;
  left: -15px;
  height: 58px;
  padding: 10px;
  background: url('../../../../assets/image/show-drawer.png') -2px 0px no-repeat;
}
</style>


<style>
.app-container {
  padding: 20px;
  padding-bottom: 0;
}
</style>
