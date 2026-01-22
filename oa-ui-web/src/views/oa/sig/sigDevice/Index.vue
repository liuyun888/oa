<template>
  <section class="border padding">
    <el-row>
      <el-input v-model="filters.deviceName" style="width: 20%;" placeholder="印章设备名称查询 输入 *字符* >10 <9 等" clearable
                title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
      <el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search"
                 type="primary">查询
      </el-button>
      <span style="float:right;" v-if="currOpType=='mng'">
                <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary"
                           @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm,title:'新增'})"
                           icon="el-icon-plus">添加设备</el-button>
                <el-button
                  :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) || this.sels.length===0 || load.del==true"
                  type="danger" v-loading="load.del" @click="batchDel" icon="el-icon-delete">批量删除</el-button>
            </span>
      <span style="float:right;" v-else-if="currOpType=='select' &&  this.multiple==true">
                <el-button :disabled="disabledJudge('selectBtn') || this.sels.length===0" type="primary"
                           @click="selectListConfirm" icon="el-icon-check"></el-button>
            </span>
    </el-row>
    <el-row>
      <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
      <el-button type="text" icon="el-icon-zoom-out" @click="searchReset()">重置查询</el-button>&nbsp;&nbsp;&nbsp;
    </el-row>
    <el-row>
      <!--列表 SigDevice 印章设备库-->
      <el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas"
                @sort-change="sortChange" highlight-current-row v-loading="load.list" border
                @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
        <el-table-column type="selection" width="55" show-overflow-tooltip fixed="left"
                         v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
        <el-table-column sortable type="index" width="55" show-overflow-tooltip fixed="left"></el-table-column>
        <el-table-column prop="id" label="印章设备编号" min-width="120" show-overflow-tooltip fixed="left"
                         col-type="String" v-if="showCol('id')"></el-table-column>
        <el-table-column prop="deviceName" label="设备名称" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('deviceName')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.deviceName" :maxlength="255"
                       @change="editSomeFields(scope.row,'deviceName',$event)"
                       :disabled="!editable || disabledJudge('deviceName')"/>
          </template>
        </el-table-column>
        <el-table-column prop="deptName" label="归属部门" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('deptName')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.deptName" :maxlength="255"
                       @change="editSomeFields(scope.row,'deptName',$event)"
                       :disabled="!editable || disabledJudge('deptName')"/>
          </template>
        </el-table-column>
        <el-table-column prop="branchName" label="归属机构名称" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('branchName')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.branchName" :maxlength="255"
                       @change="editSomeFields(scope.row,'branchName',$event)"
                       :disabled="!editable || disabledJudge('branchName')"/>
          </template>
        </el-table-column>
        <el-table-column prop="brandName" label="品牌名称" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('brandName')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.brandName" :maxlength="255"
                       @change="editSomeFields(scope.row,'brandName',$event)"
                       :disabled="!editable || disabledJudge('brandName')"/>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="启用时间" min-width="120" show-overflow-tooltip col-type="Date"
                         v-if="showCol('startTime')">
          <template slot-scope="scope">
            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.startTime"
                      @change="editSomeFields(scope.row,'startTime',$event)" value-format="yyyy-MM-dd HH:mm:ss"
                      format="yyyy-MM-dd" :disabled="!editable || disabledJudge('startTime')"/>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('status')">
          <template slot-scope="scope">
            <mdp-select item-code="device_status" show-style="tag" v-model="scope.row.status" :maxlength="1"
                       @change="editSomeFields(scope.row,'status',$event)"
                       :disabled="!editable || disabledJudge('status')"/>

          </template>
        </el-table-column>
        <el-table-column prop="address" label="保管地址" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('address')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.address" :maxlength="255"
                       @change="editSomeFields(scope.row,'address',$event)"
                       :disabled="!editable || disabledJudge('address')"/>
          </template>
        </el-table-column>
        <el-table-column prop="addressGps" label="地址定位" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('addressGps')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.addressGps" :maxlength="255"
                       @change="editSomeFields(scope.row,'addressGps',$event)"
                       :disabled="!editable || disabledJudge('addressGps')"/>
          </template>
        </el-table-column>
        <el-table-column prop="deviceType" label="设备类型" min-width="120" show-overflow-tooltip
                         col-type="String" v-if="showCol('deviceType')">
          <template slot-scope="scope">
            <mdp-select item-code="device_type" show-style="tag" v-model="scope.row.deviceType" :maxlength="1"
                       @change="editSomeFields(scope.row,'deviceType',$event)"
                       :disabled="!editable || disabledJudge('deviceType')"/>
          </template>
        </el-table-column>
        <el-table-column prop="admUsername" label="管理员姓名" min-width="120" show-overflow-tooltip col-type="String"
                         v-if="showCol('admUsername')">
          <template slot-scope="scope">
            <mdp-input show-style="tag" v-model="scope.row.admUsername" :maxlength="50"
                       @change="editSomeFields(scope.row,'admUsername',$event)"
                       :disabled="!editable || disabledJudge('admUsername')"/>
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
      <!--新增修改明细 SigDevice 印章设备库界面-->
      <mdp-dialog :ref="refId+'FormDialog'">
        <template v-slot="{visible,data,dialog}">
          <sig-device-form :ref="refId+'Form'" :visible="visible" :parent-op-type="currOpType"
                           :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose"
                           @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
        </template>
      </mdp-dialog>
    </el-row>
  </section>
</template>

<script>

import {MdpTableMixin} from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import * as SigDeviceApi from '@/api/oa/sig/sigDevice';
import SigDeviceForm from './Form';//新增修改明细界面
import {mapGetters} from 'vuex'

export default {
  name: 'sigDeviceMng',
  mixins: [MdpTableMixin],
  components: {
    SigDeviceForm,
  },
  computed: {},
  watch: {},
  data() {
    return {
      menuDefId: '',//menu_def.id 菜单表菜单编号，用于按钮权限判断
      menuDefName: '印章设备库',//menu_def.name 功能名称，用于导出excel等文件名
      refId: 'sigDevice',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
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
        list: SigDeviceApi.listSigDevice,
        add: SigDeviceApi.addSigDevice,
        del: SigDeviceApi.delSigDevice,
        edit: SigDeviceApi.editSigDevice,
        editSomeFields: SigDeviceApi.editSomeFieldsSigDevice,
        batchAdd: SigDeviceApi.batchAddSigDevice,
        batchDel: SigDeviceApi.batchDelSigDevice,
        batchEdit: SigDeviceApi.batchEditSigDevice,
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
