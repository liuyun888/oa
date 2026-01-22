<template>
  <section>

    <el-row class="page-container border padding">
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="资产信息" name="assetDetail">
          <asset-detail-edit op-type='edit' :asset-detail="detailForm" v-if="editFormVisible==true"
                             @cancel="editFormVisible=false" @submit="afterAssetCardSubmit"></asset-detail-edit>

          <el-row style="margin-bottom: 20px" v-if="editFormVisible==false">
            <div>
              <el-button type="primary" size="small" @click="editFormVisible=true">编辑</el-button>
              <el-button size="small" v-print="'#printArea'">打印</el-button>
            </div>
          </el-row>
          <table class="tab" id="printArea" v-if="editFormVisible==false">
            <tbody>
            <tr>
              <td class="tl">资产名称</td>
              <td>{{ detailForm.assetName }}</td>
              <td class="tl">资产编码</td>
              <td>{{ detailForm.assetSn }}</td>
            </tr>
            <tr>
              <td class="tl">资产类别</td>
              <td>{{ detailForm.categoryName }}</td>
              <td class="tl">资产序列号</td>
              <td>{{ detailForm.assetNo }}</td>
            </tr>
            <tr>
              <td class="tl">规格型号</td>
              <td>{{ detailForm.spec }}</td>
              <td class="tl">计量单位</td>
              <td>{{ detailForm.measUnit }}</td>
            </tr>
            <tr>
              <td class="tl">资产原值</td>
              <td>{{ detailForm.currency }} {{ detailForm.currencyName }} {{ detailForm.orignUnitAmount }}</td>
              <td class="tl">使用年限(月)</td>
              <td>{{ detailForm.servLife }}</td>
            </tr>

            <tr>
              <td class="tl">组织机构代码</td>
              <td>{{ detailForm.branchId }}</td>
              <td class="tl">使用部门</td>
              <td>{{ detailForm.deptName }}</td>
            </tr>

            <tr>
              <td class="tl">存放地点</td>
              <td>{{ detailForm.storeAddress }}</td>
              <td class="tl">责任人</td>
              <td>{{ detailForm.personLiableUsername }}</td>
            </tr>

            <tr>
              <td class="tl">采购人</td>
              <td>{{ detailForm.purchaseUsername }}</td>
              <td class="tl">采购日期</td>
              <td>{{ detailForm.purchaseDate }}</td>
            </tr>

            <tr>
              <td class="tl">入库单号</td>
              <td>{{ detailForm.receiptNo }}</td>
              <td class="tl">入库日期</td>
              <td>{{ detailForm.warehouseDate }}</td>
            </tr>

            <tr>
              <td class="tl">供应商</td>
              <td>{{ detailForm.supplierName }}</td>
              <td class="tl">保修期</td>
              <td>{{ detailForm.defectsLiabilityPeriod }}</td>
            </tr>

            <tr>
              <td colspan="1" class="tl">资产状态</td>
              <td colspan="3">
                <el-radio disabled v-model="detailForm.cardStatus" label="0">闲置</el-radio>
                <el-radio disabled v-model="detailForm.cardStatus" label="1">在用</el-radio>
                <el-radio disabled v-model="detailForm.cardStatus" label="2">借用</el-radio>
                <el-radio disabled v-model="detailForm.cardStatus" label="3">维修</el-radio>
                <el-radio disabled v-model="detailForm.cardStatus" label="4">报废</el-radio>
              </td>
            </tr>

            <tr>
              <td colspan="1" class="tl">开始使用日期</td>
              <td colspan="3">{{ detailForm.startUseDate }}</td>
            </tr>

            <tr>
              <td colspan="1" class="tl">盘点任务</td>
              <td colspan="3">{{ detailForm.inventoryTask }}</td>
            </tr>

            <tr>
              <td colspan="1" class="tl">配置说明</td>
              <td colspan="3">{{ detailForm.confDesc }}</td>
            </tr>

            <tr>
              <td colspan="1" class="tl">备注</td>
              <td colspan="3">{{ detailForm.remark }}</td>
            </tr>

            <tr>
              <td colspan="1" class="tl">资产图片</td>
              <td colspan="3">
                <div v-if="detailForm.assetImageUrl !== null && detailForm.assetImageUrl !== ''">
                  <img :src="imgShowUrl + detailForm.assetImageUrl" alt="">
                </div>
              </td>
            </tr>

            <tr>
              <td colspan="1" class="tl">创建人</td>
              <td colspan="3">{{ detailForm.createUsername }}</td>
            </tr>

            <tr>
              <td colspan="1" class="tl">创建时间</td>
              <td colspan="3">{{ detailForm.createTime }}</td>
            </tr>

            <tr>
              <td colspan="1" class="tl">最后修改人</td>
              <td colspan="3">{{ detailForm.lastEditUsername }}</td>
            </tr>

            <tr>
              <td colspan="1" class="tl">最后修改时间</td>
              <td colspan="3">{{ detailForm.lastEditTime }}</td>
            </tr>

            </tbody>
          </table>
        </el-tab-pane>
        <el-tab-pane label="资产卡片" name="assetCard">
          <asset-card-mng :asset-detail="assetDetail"></asset-card-mng>
        </el-tab-pane>
        <el-tab-pane label="生命周期" name="detailOperList">
          <asset-card-oper-mng :asset-detail="assetDetail"></asset-card-oper-mng>
        </el-tab-pane>
        <el-tab-pane label="当前审批流" name="currFlow">
          <task-mng v-if="procInstIds && procInstIds.length>0" ref="tabTaskMngRef" :proc-inst-ids="procInstIds"
                    v-loading="load.list"></task-mng>
          <div v-else v-loading="load.list">{{ load.list ? "加载中。。。。。" : "无数据" }}</div>
        </el-tab-pane>
        <el-tab-pane label="历史审批流" name="hisFlow">
          <procinst-mng v-if="procInstIds && procInstIds.length>0" ref="tabHisTaskMngRef" isAll="true"
                        :proc-inst-ids="procInstIds" v-loading="load.list"></procinst-mng>
          <div v-else v-loading="load.list">{{ load.list ? "加载中。。。。。" : "无数据" }}</div>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </section>
</template>

<script>
import util from '@/common/js/util';//全局公共库
import {mapGetters} from 'vuex';

import AssetDetailEdit from '../assetDetail/AssetDetailEdit.vue';
import AssetCardMng from '../assetCard/Index.vue';
import AssetCardOperMng from '../assetCardOper/AssetCardOperMng.vue';

import TaskMng from '@/views/mdp/workflow/ru/task/TaskMng';

import ProcinstMng from '@/views//mdp/workflow/hi/procinst/ProcinstMng';
import {getDetailAllProcInstIds} from '@/api/oa/erp/ass/assetCardOper';


export default {

  components: {
    AssetCardMng, AssetCardOperMng, TaskMng, ProcinstMng, AssetDetailEdit,
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  props: ['assetDetail', 'visible'],
  watch: {
    'assetDetail': function (assetReceiveOper) {
      this.detailForm = assetReceiveOper;
    },
    'visible': function (visible) {
      if (visible == true) {
        //从新打开页面时某些数据需要重新加载，可以在这里添加
      }
    }
  },
  data() {
    return {
      options: {},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
      load: {list: false, edit: false, del: false, add: false},//查询中...
      //新增界面数据 ass_asset_detail_oper
      detailForm: {
        id: '',
        assetSn: '',
        categoryId: '',
        assetNo: '',
        spec: '',
        currency: '',
        measUnit: '',
        orignUnitAmount: '',
        servLife: '',
        branchId: '',
        deptid: '',
        storeAddress: '',
        personLiableUserid: '',
        purchaseUserid: '',
        supplierId: '',
        passetSn: '',
        passetName: '',
        defectsLiabilityPeriod: '',
        warehouseDate: '',
        assetStatus: '',
        startUseDate: '',
        inventoryTask: '',
        confDesc: '',
        remark: '',
        assetImageUrl: '',
        createUserid: '',
        createTime: '',
        lastEditUserid: '',
        lastEditTime: '',
        receiptNo: '',
        supplierName: '',
        assetName: '',
        stockNum: '',
        warehouseId: '',
        productId: '',
        productSn: '',
        brandId: '',
        brandName: ''
      },
      activeName: 'assetDetail',
      disposalType: [
        {
          value: 'lease',
          label: '租用'
        },

        {
          value: 'reallocation',
          label: '调拨'
        },

        {
          value: 'maint',
          label: '维修'
        },

        {
          value: 'use',
          label: '领用'
        },

        {
          value: 'return',
          label: '归还'
        },

        {
          value: 'change',
          label: '变更'
        },

        {
          value: 'dispose',
          label: '处置'
        },

        {
          value: 'inventory',
          label: '盘点'
        },
      ],
      disposeTupeArr: ['出让', '转让', '出售', '报废', '报损', '置换', '盘亏', '拍卖', '捐赠'],
      procInstIds: [],
      editFormVisible: false,
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/
      /**end 在上面加自定义属性**/
    }//end return
  },//end data
  methods: {

    cancel() {
      this.$refs['detailForm'].resetFields();
      this.assetData = [];
      this.validateData = [];
      this.$emit('submit');
    },

    addClose() {
      this.$refs['detailForm'].resetFields();
      this.assetData = [];
      this.validateData = [];
    },

    isNull(data) {
      if (data === null || data === '' || data === undefined) {
        return true;
      }
      return false;
    },
    handleTabClick(tab) {
      if (tab.name == 'currFlow' || tab.name == 'hisFlow') {
        this.getDetailAllProcInstIds();
      }
    },
    getDetailAllProcInstIds() {
      var params = {
        detailId: this.detailForm.id
      }
      this.load.list = true
      getDetailAllProcInstIds(params).then(res => {
        this.load.list = false
        var tips = res.data.tips;
        if (tips.isOk) {
          this.procInstIds = res.data.data
        } else {
          this.procInstIds = []
        }
      })
    },
    afterAssetCardSubmit(data) {
      this.$emit('submit', data)
    }

  },

  mounted() {
    this.detailForm = Object.assign(this.detailForm, this.assetDetail);
    console.log(this.detailForm, "this.detailForm");
  }
}


</script>


<style scoped>

.footer {
  position: absolute;
  left: 0;
  bottom: 0;
}

.nav {
  width: 100%;
  height: 60px;
  border-top: 1px solid rgb(159, 159, 159);
  position: fixed;
  bottom: 0;
  background: white;
}

.btn {
  margin: 10px 0 0 20px;

}


table, th, td {
  border: 1px solid rgb(159, 159, 159);
}

table {
  width: 100%;
}

.tab {
  border-collapse: collapse;
}

.tab tr td {
  text-align: left;
  line-height: 26px;
  padding: 4px;
}

.tab .tl {
  background: rgb(246, 246, 246);
}

.leftCycle {
  /* height: 400px; */
}

.leftCycle .top {
  margin-top: 20px;
  font-size: 14px;
}


</style>
