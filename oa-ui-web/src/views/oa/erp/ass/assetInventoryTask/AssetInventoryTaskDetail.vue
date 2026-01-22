<template>
  <section>
    <el-row class="page-container border padding">

      <el-row>
        <div>
          <!-- <el-button size="small" @click="handleCancel">取消</el-button>
                    <el-button type="primary" size="small" @click="addSubmit('hold')">暂存</el-button>
          <el-button type="primary" size="small" @click="addSubmit('submit')">提交</el-button> -->
          <el-button v-show="detailForm.taskStatus === 'running'  && detailForm.reqStatus === 'submit' " type="primary"
                     size="small" @click="finish">盘点完成
          </el-button>
        </div>
        <el-divider content-position="center">资产盘点任务</el-divider>
      </el-row>

      <table class="tab">
        <tbody>
        <tr>
          <td colspan="1" class="tl">标题</td>
          <td colspan="3">{{ detailForm.reqTitle }}</td>
        </tr>

        <tr>
          <td class="tl">类别</td>
          <td>盘点任务单</td>
          <td class="tl">编号</td>
          <td>{{ detailForm.taskId }}</td>
        </tr>

        <tr>
          <td class="tl">申请人</td>
          <td>{{ detailForm.reqUsername }}</td>
          <td class="tl">申请日期</td>
          <td>{{ detailForm.reqDate }}</td>
        </tr>

        <tr>
          <td class="tl">分配用户</td>
          <td> {{ allocationTypeArr[parseInt(detailForm.allocationType)] }}</td>
          <td class="tl">用户</td>
          <td>
            {{ canOperUserName }}
          </td>
        </tr>


        <tr>
          <td class="tl">资产类别</td>
          <td>{{ detailForm.categoryName }}</td>
          <td class="tl">存放地点类别</td>
          <td>{{ detailForm.warehouseName }}</td>
        </tr>

        <tr>
          <td class="tl">采购时间</td>
          <td>{{ purchasedateTypeArr[parseInt(detailForm.purchasedateType)] }}</td>
          <td class="tl">时间区间</td>
          <div v-if="detailForm.purchasedateType === 2">{{ detailForm.beginTime }} 至 {{ detailForm.endTime }}</div>
          <td>

          </td>
        </tr>

        <tr>
          <td style="text-align:center" colspan="4" class="tl">盘点情况</td>
        </tr>

        <tr>
          <td colspan="4" class="tl">
            <el-row class="mt">
              <el-tabs style="height:600px" type="border-card">

                <el-tab-pane :label="tabLale1">
                  <div style="margin: 10px 0 10px 0">
                    <el-radio v-model="singerOrChoice" label="1">全部资产</el-radio>
                    <el-radio v-model="singerOrChoice" label="2">待我盘点的资产</el-radio>

                    <div v-show="singerOrChoice === '2'" style="float:right">
                      <el-button v-if="detailForm.taskStatus === 'running' &&  detailForm.reqStatus === 'submit'"
                                 size="mini" @click="batchPanDian" type="primary">批量盘点
                      </el-button>
                      <el-button v-if="detailForm.taskStatus === 'running' &&  detailForm.reqStatus === 'submit'"
                                 size="mini" @click="batchPanKui" type="danger">批量盘亏
                      </el-button>
                    </div>
                  </div>


                  <el-table height="400" v-loading="load.list" size="small" border :data="assetData"
                            @selection-change="selsChange" stripe>
                    <el-table-column sortable type="selection" width="50"></el-table-column>
                    <el-table-column label="序号" type="index" width="50"/>

                    <el-table-column prop="detailStatus" align="center" label="盘点状态" width="">
                      <template slot-scope="scope">
                        <span>{{ panDianStatusArr[scope.row.detailStatus] }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column align="center" label="资产状态" width="">
                      <template slot-scope="scope">
                        <span>{{ cardStatusArr[scope.row.cardStatus] }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column prop="assetSn" align="center" label="资产编码" width="">
                    </el-table-column>

                    <el-table-column prop="nowCardName" align="center" label="名称" width="">
                    </el-table-column>

                    <el-table-column prop="categoryName" align="center" label="资产类别" width="">
                    </el-table-column>

                    <el-table-column prop="spec" align="center" label="规格型号" width="">
                    </el-table-column>

                    <el-table-column align="center" label="操作" width="">
                      <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.isCanOper && detailForm.taskStatus === 'running' &&  detailForm.reqStatus === 'submit'"
                            type="primary" @click="assetInventory(scope.row)" size="mini">盘点
                        </el-button>
                        <el-button
                            v-if="scope.row.isCanOper && detailForm.taskStatus === 'running' &&  detailForm.reqStatus === 'submit'"
                            type="danger" @click="assetPanKui(scope.row)" size="mini">盘亏
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="margin-top: 10px">
                    <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
                                   @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]"
                                   :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"
                                   :total="pageInfo.total" style="float:right;"></el-pagination>
                  </div>
                </el-tab-pane>


                <el-tab-pane :label="tabLale2">
                  <el-table height="400" v-loading="load.list" size="small" border :data="yiPanDianData"
                            @selection-change="selsChange" stripe>
                    <el-table-column sortable type="selection" width="50"></el-table-column>
                    <el-table-column
                        label="序号"
                        type="index"
                        width="50">
                    </el-table-column>

                    <el-table-column prop="detailStatus" align="center" label="盘点状态" width="">
                      <template slot-scope="scope">
                        <span>{{ panDianStatusArr[scope.row.detailStatus] }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column align="center" label="资产状态" width="">
                      <template slot-scope="scope">
                        <span>{{ cardStatusArr[scope.row.cardStatus] }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column prop="assetSn" align="center" label="资产编码" width="">
                    </el-table-column>

                    <el-table-column prop="nowCardName" align="center" label="名称" width="">
                    </el-table-column>

                    <el-table-column prop="categoryName" align="center" label="资产类别" width="">
                    </el-table-column>

                    <el-table-column prop="spec" align="center" label="规格型号" width="">
                    </el-table-column>

                    <el-table-column align="center" label="操作" width="">
                      <template slot-scope="scope">
                        <span v-if="scope.row.detailStatus!=='3'" class="seeDetails" @click="gotoDetail2(scope.row)">查看详情</span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="margin-top: 10px">
                    <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange2"
                                   @size-change="handleSizeChange2" :page-sizes="[10,20, 50, 100, 500]"
                                   :current-page="pageInfo2.pageNum" :page-size="pageInfo2.pageSize"
                                   :total="pageInfo2.total" style="float:right;"></el-pagination>
                  </div>
                </el-tab-pane>

                <el-tab-pane :label="tabLale3">
                  <el-button style="float:right; margin:10px 0" type="primary" size="mini"
                             @click="selectAssetTypeVisible=true">增加盘盈
                  </el-button>
                  <el-table height="400" v-loading="load.list" size="small" border :data="panYingData"
                            @selection-change="selsChange" stripe>
                    <el-table-column sortable type="selection" width="50"></el-table-column>
                    <el-table-column
                        label="序号"
                        type="index"
                        width="50">
                    </el-table-column>

                    <el-table-column prop="detailStatus" align="center" label="盘点状态" width="">
                      <template slot-scope="scope">
                        <span>{{ panDianStatusArr[scope.row.detailStatus] }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column align="center" label="资产状态" width="">
                      <template slot-scope="scope">
                        <span>{{ cardStatusArr[scope.row.cardStatus] }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column prop="assetSn" align="center" label="资产编码" width="">
                    </el-table-column>

                    <el-table-column prop="nowCardName" align="center" label="名称" width="">
                    </el-table-column>

                    <el-table-column prop="categoryName" align="center" label="资产类别" width="">
                    </el-table-column>

                    <el-table-column prop="spec" align="center" label="规格型号" width="">
                    </el-table-column>

                    <el-table-column align="center" label="操作" width="">
                      <template slot-scope="scope">
                        <span class="seeDetails" @click="gotoDetail3(scope.row)">查看详情</span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="margin-top: 10px">
                    <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange3"
                                   @size-change="handleSizeChange3" :page-sizes="[10,20, 50, 100, 500]"
                                   :current-page="pageInfo3.pageNum" :page-size="pageInfo3.pageSize"
                                   :total="pageInfo3.total" style="float:right;"></el-pagination>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-row>
          </td>
        </tr>

        <tr>
          <td colspan="1" class="tl">文档附件</td>
          <td colspan="3">
          </td>
        </tr>

        <tr>
          <td colspan="1" class="tl">备注</td>
          <td colspan="3">{{ detailForm.reqReason }}</td>
        </tr>

        </tbody>
      </table>
    </el-row>

    <el-dialog append-to-body title="人员选择" width="70%" top="5vh" :visible.sync="visibleUserSelect">
      <user-select @confirm="getUserData"></user-select>
    </el-dialog>

    <el-dialog append-to-body title="仓库选择" width="70%" top="5vh" :visible.sync="visibleWarehouseSelect">
      <warehouse-components @row-click="getWarehouseData"></warehouse-components>
    </el-dialog>

    <el-dialog append-to-body title="资产卡片" center :fullscreen="true" :visible.sync="assetCardVisible"
               :close-on-click-modal="false">
      <asset-card-show :asset-detail="assetCardData" :visible="assetCardVisible"
                       @submit="assetCardVisible=false"></asset-card-show>
    </el-dialog>

    <el-dialog append-to-body title="新增盘点单" center :fullscreen="true" :visible.sync="addInventoryVisible"
               :close-on-click-modal="false">
      <asset-inventory-add :mng-params="mngParams" :asset-receive="cardData" :visible="addInventoryVisible"
                           @submit="addInventorySubmit" @cancel="addInventoryVisible=false"></asset-inventory-add>
    </el-dialog>

    <el-dialog append-to-body title="盘点明细" center :fullscreen="true" :visible.sync="panDianFormVisible"
               :close-on-click-modal="false">
      <asset-inventory-detail ref="assetInventoryDetail" :asset-receive="panDianForm" :visible="panDianFormVisible"
                              @cancel="panDianFormVisible=false"></asset-inventory-detail>
    </el-dialog>

    <el-dialog append-to-body title="新增资产处置单" center :fullscreen="true" :visible.sync="disposeFormVisible"
               :close-on-click-modal="false">
      <asset-dispose-add :dispose-data="disposeData" :mng-params="mngParams" :visible="disposeFormVisible"
                         @cancel="disposeFormVisible=false" @submit="addAssetPankuiSubmit"></asset-dispose-add>
    </el-dialog>

    <el-dialog append-to-body title="处置单明细" center :fullscreen="true" :visible.sync="disposeDetailFormVisible"
               :close-on-click-modal="false">
      <asset-dispose-detail :asset-receive="disposeForm" :visible="disposeDetailFormVisible"
                            @cancel="disposeDetailFormVisible=false"></asset-dispose-detail>
    </el-dialog>

    <el-dialog append-to-body title="选择资产分类" center width="60%" :visible.sync="selectAssetTypeVisible"
               :close-on-click-modal="false">
      <asset-category-tree @node-click="getSelectAssetTypeData"
                           @cancel="selectAssetTypeVisible=false"></asset-category-tree>
    </el-dialog>

    <el-dialog append-to-body title="新增卡片" center :fullscreen="true" :visible.sync="addAssetCardVisible"
               :close-on-click-modal="false">
      <asset-card-add :assetType="assetType" :visible="addAssetCardVisible" @cancel="addAssetCardVisible=false"
                      @submit="addAssetCardSubmit"></asset-card-add>
    </el-dialog>


  </section>
</template>

<script>
import util from '@/common/js/util';//全局公共库
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import {
  addAssetInventoryTask,
  getTaskDetail,
  getMyTaskDetail,
  getCanOperTaskUser,
  finishInventory
} from '@/api/oa/erp/ass/assetInventoryTask';
import {getTaskCountByStatus} from '@/api/oa/erp/ass/assetInventoryTaskDetail';
import {getInventoryCards} from '@/api/oa/erp/ass/assetCard';
import {mapGetters} from 'vuex';
import AttachmentUpload from '@/views/mdp/arc/archiveAttachment/AttachmentUpload';
import {sn} from '@/common/js/sequence'; //id生成器
import UsersSelect from '@/views/mdp/sys/user/UsersSelect';
import WarehouseComponents from '../../stk/components/WarehouseComponents';
import AssetCategoryTree from '../../ass/components/AssetCategoryTree';
import AssetCardShow from '../assetCard/AssetCardShow';
import AssetCardAdd from '../assetCard/AssetCardAdd';
import AssetInventoryAdd from '../assetInventory/assetInventoryAdd';
import AssetInventoryDetail from '../assetInventory/AssetInventoryDetail';
import assetDisposeAdd from '../assetDispose/assetDisposeAdd';
import assetDisposeDetail from '../assetDispose/assetDisposeDetail';


export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  props: ['assetInventoryTask', 'visible'],
  watch: {
    'assetInventoryTask': function (assetInventoryTask) {
      this.detailForm = this.assetInventoryTask;
      console.log(666, this.detailForm);
    },
    'visible': function (visible) {
      if (visible == true) {
        //从新打开页面时某些数据需要重新加载，可以在这里添加
        this.setDefaultParam();
        this.getDetail();
        this.getDetail2();
      }
    },

    detailForm: {
      handler: function (val, oldval) {
        val.purchasedateType === '2' ? this.purchasedateVisible = true : this.purchasedateVisible = false;
        val.allocationType !== '1' && !this.isNull(val.allocationType) ? this.allocationUserVisible = true : this.allocationUserVisible = false;
      },
      deep: true
    },

    singerOrChoice: {
      handler: function (val, oldval) {
        if (val === '2') {
          this.getCurrentUserOperData();
        } else {
          this.getDetail();
        }
      }

    }

  },
  data() {
    return {
      options: {},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
      load: {list: false, edit: false, del: false, add: false},//查询中...
      pageInfo: {//分页数据
        total: 0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10,//每页数据
        count: false,//是否需要重新计算总记录数
        pageNum: 1,//当前页码、从1开始计算
        orderFields: [],//排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: []//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },

      pageInfo2: {//分页数据
        total: 0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10,//每页数据
        count: false,//是否需要重新计算总记录数
        pageNum: 1,//当前页码、从1开始计算
        orderFields: [],//排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: []//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },

      pageInfo3: {//分页数据
        total: 0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10,//每页数据
        count: false,//是否需要重新计算总记录数
        pageNum: 1,//当前页码、从1开始计算
        orderFields: [],//排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: []//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },


      addFormRules: {
        taskId: [
          //{ required: true, message: '盘点任务id不能为空', trigger: 'change' }
        ],

        reqTitle: [
          {required: true, message: '盘点任务名称不能为空', trigger: 'change'}
        ],

        allocationType: [
          {required: true, message: '分配用户不能为空', trigger: 'change'}
        ],

        purchasedateType: [
          {required: true, message: '采购时间不能为空', trigger: 'change'}
        ]
      },
      //新增界面数据 ass_asset_inventory_task
      detailForm: {
        taskId: '',
        reqUsername: '',
        reqDeptid: '',
        reqDeptName: '',
        reqTitle: '',
        reqBranchId: '',
        reqBranchName: '',
        reqDate: '',
        allocationType: '',
        categoryId: '',
        categoryName: '',
        warehouseId: '',
        warehouseName: '',
        purchasedateType: '',
        startTime: '',
        endTime: '',
        taskStatus: '',
        reqStatus: '',
        reqReason: ''
      },
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/
      assetData: [],
      uploadArchiveId: '',
      uploadCategoryId: '',
      //分配用户选择
      //分配用户显示
      allocationUserVisible: false,
      allocationTypeArr: ['', '资产责任人盘点', '资产责任人盘点与指定盘点人员', '仅指定盘点人员'],
      purchasedateTypeArr: ['', '不限', '指定时间范围'],

      purchasedateVisible: false,
      timeSection: [],
      visibleUserSelect: false,
      visibleWarehouseSelect: false,
      //查询数据
      personLiableUseridArr: [],
      cardStatusArr: ['闲置', '在用', '借用', '维修', '报废', '调拨', '处置'],

      //盘点状态
      panDianStatusArr: ['', '待盘点', '正常', '未盘点', '盘盈', '盘亏'],

      //资产卡片展示
      assetCardVisible: false,
      assetCardData: '',

      //用盘点权限的用户数据
      showUserNameMsg: '',
      userData: [],

      //盘点单
      addInventoryVisible: false,
      cardData: [],
      //这个参数是盘点需要的参数
      mngParams: '',

      tabLale1: '待盘点',
      tabLale2: '已盘点/未盘点',
      tabLale3: '盘盈',

      //已经盘点数据
      yiPanDianData: [],
      panYingData: [],

      //盘点明细
      panDianFormVisible: false,
      panDianForm: {
        reqTitle: '', reqUserid: '', reqUsername: '', reqDeptid: '', reqDeptName: '', reqDate: '', id: '', opType: '',
        reqReason: '', startDate: '', endDate: '', totalDay: '', maintTotalFeeAmount: '', maintIsConsumables: '',
        dispTotalOrignAmount: '', dispTotalScrapSaleAmount: '', dispAddAssets: '', inDeptId: '', inDeptName: '',
        outDeptId: '', outDeptName: '', mngStatus: ''
      },

      disposeDetailFormVisible: false,
      disposeForm: {
        reqTitle: '', reqUserid: '', reqUsername: '', reqDeptid: '', reqDeptName: '', reqDate: '', id: '', opType: '',
        reqReason: '', startDate: '', endDate: '', totalDay: '', maintTotalFeeAmount: '', maintIsConsumables: '',
        dispTotalOrignAmount: '', dispTotalScrapSaleAmount: '', dispAddAssets: '', inDeptId: '', inDeptName: '',
        outDeptId: '', outDeptName: '', mngStatus: ''
      },

      //资产盘亏
      disposeFormVisible: false,
      disposeData: [],

      //资产分类
      selectAssetTypeVisible: false,

      //添加资产卡片
      addAssetCardVisible: false,
      assetType: '',

      //单选还是多选
      singerOrChoice: '1',

      //批量选择数据
      batchSelectData: [],

      //可以操作的用户名称
      canOperUserName: '',


      /**end 在上面加自定义属性**/
    }//end return
  },//end data
  methods: {
    // 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
    handleCancel: function () {
      this.$refs['detailForm'].resetFields();
      this.$emit('cancel');
    },

    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getDetail();
    },

    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getDetail();
    },

    handleSizeChange2(pageSize) {
      this.pageInfo2.pageSize = pageSize;
      this.getDetail2();
    },

    handleCurrentChange2(pageNum) {
      this.pageInfo2.pageNum = pageNum;
      this.getDetail2();
    },

    handleSizeChange3(pageSize) {
      this.pageInfo3.pageSize = pageSize;
      this.getDetail3();
    },

    handleCurrentChange3(pageNum) {
      this.pageInfo3.pageNum = pageNum;
      this.getDetail3();
    },

    //新增提交AssetInventoryTask ass_asset_inventory_task 父组件监听@submit="afterAddSubmit"
    addSubmit: function (status) {
      this.detailForm.reqStatus = status;
      this.$refs.detailForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.load.add = true
            if (!this.isNull(this.detailForm.reqDate) && this.detailForm.reqDate instanceof Date) {
              this.detailForm.reqDate = util.formatDate(this.detailForm.reqDate, "yyyy-MM-dd HH:mm:ss")
            }
            let params = Object.assign({}, this.transfreData());
            addAssetInventoryTask(params).then((res) => {
              this.load.add = false
              var tips = res.data.tips;
              if (tips.isOk) {
                this.$refs['detailForm'].resetFields();
                this.$emit('submit');//  @submit="afterAddSubmit"
              }
              this.$message({message: tips.msg, type: tips.isOk ? 'success' : 'error'});
            }).catch(err => this.load.add = false);
          });
        }
      });
    },
    /**begin 在下面加自定义方法,记得补上面的一个逗号**/

    transfreData() {
      //1.获取有盘点权限的用户数据。
      let inventoryUserData = [];

      //2.获取关联资产卡片的数据
      let inventoryTaskDetail = [];

      if (this.detailForm.allocationType === '1') {
        this.assetData.forEach(d => {
          if (this.isNull(d.personLiableUserid)) return;
          let param = {
            inventoryUserid: d.personLiableUserid,
            inventoryUsername: d.personLiableUsername
          }
          inventoryUserData.push(param);
        })
      }

      if (this.detailForm.allocationType === '2') {
        this.assetData.forEach(d => {
          if (this.isNull(d.personLiableUserid)) return;
          let param = {
            inventoryUserid: d.personLiableUserid,
            inventoryUsername: d.personLiableUsername
          }
          inventoryUserData.push(param);
        })

        this.userData.forEach(a => {
          if (this.isNull(a.inventoryUserid)) return;
          let param = {
            inventoryUserid: a.inventoryUserid,
            inventoryUsername: a.inventoryUsername
          }
          inventoryUserData.push(param);
        })
      }

      if (this.detailForm.allocationType === '3') {
        inventoryUserData = this.userData;
      }

      let hash = {};
      inventoryUserData = inventoryUserData.reduce((preVal, curVal) => {
        hash[curVal.inventoryUserid] ? '' : hash[curVal.inventoryUserid] = true && preVal.push(curVal);
        return preVal
      }, [])

      this.assetData.forEach(a => {
        let param = {
          cardId: a.cardId,
          nowCardName: a.assetName
        }
        inventoryTaskDetail.push(param);
      })

      let param = {
        inventoryUserDatas: inventoryUserData,
        inventoryTaskDetails: inventoryTaskDetail,
        inventoryTask: this.detailForm
      }

      return param;
    },

    //查看详情
    gotoDetail3(row) {
      this.assetCardData = row;
      Object.assign(this.assetCardData, row);
      this.assetCardData.inventoryTask = this.detailForm.taskId;
      this.assetCardVisible = true;
    },

    gotoDetail2(row) {
      if (row.opType === "inventory") {
        Object.assign(this.panDianForm, row);
        this.panDianForm.inventoryTask = this.detailForm.taskId;
        this.panDianForm.id = row.mngId;
        this.panDianFormVisible = true;
      } else {
        Object.assign(this.disposeForm, row);
        this.disposeForm.id = row.mngId;
        this.disposeForm.inventoryTask = this.detailForm.taskId;
        this.disposeDetailFormVisible = true;
      }
    },

    //获取用户数据
    getUserData(data) {
      if (!this.isNull(data)) {
        data.forEach(d => {
          let param = {
            inventoryUserid: d.userid,
            inventoryUsername: d.username
          }
          this.showUserNameMsg += d.username + ","
          this.userData.push(param);
        })
      }
      this.visibleUserSelect = false;
    },

    //获取选择的仓库数据
    getWarehouseData(data) {
      this.detailForm.warehouseId = data.id;
      this.detailForm.warehouseName = data.name;
      this.visibleWarehouseSelect = false;
    },

    //查询卡片
    showCard() {
      this.load.list = true;
      let params = {
        //采购开始时间
        startTime: (!this.isNull(this.timeSection) && this.timeSection.length !== 0) ? util.formatDate(this.timeSection[0], "yyyy-MM-dd HH:mm:ss") : '',
        //采购结束时间
        endTime: (!this.isNull(this.timeSection) && this.timeSection.length !== 0) ? util.formatDate(this.timeSection[1], "yyyy-MM-dd HH:mm:ss") : '',
        //分类
        categoryId: this.detailForm.categoryId,
        warehouseId: this.detailForm.warehouseId,
        //用户Id
        allocationType: this.detailForm.allocationType
      }
      getInventoryCards(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.assetData = res.data && res.data.data && res.data.data ? res.data.data.data : [];
        } else {
          this.$message({message: tips.msg, type: 'error'});
        }
        this.load.list = false;
      }).catch(err => this.load.list = false);
    },

    //设置默认参数
    setDefaultParam() {
      this.getDetail();
      this.getDetail2();
      this.getDetail3();
      //查询分配的用户
      this.selectCanOperUser();

      let user = this.userInfo;
      this.uploadArchiveId = this.detailForm.taskId;
      this.uploadCategoryId = 'asset_inventory_task_upload';
    },

    isNull(data) {
      if (data === null || data === '' || data === undefined) {
        return true;
      }
      return false;
    },

    getDetail() {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count,
        taskId: this.detailForm.taskId,
        detailStatusArr: "1"
      };
      if (this.pageInfo.orderFields != null && this.pageInfo.orderFields.length > 0) {
        let orderBys = [];
        for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
          orderBys.push(this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i])
        }
        params.orderBy = orderBys.join(",")
      }
      //查询申购单明细
      this.load.list = true;
      getTaskDetail(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.pageInfo.total = res.data.total;
          this.pageInfo.count = false;
          this.assetData = res.data && res.data.data && res.data.data ? res.data.data.data : [];
          this.tabLale1 = "待盘点(" + this.pageInfo.total + ")";
        }
        this.load.list = false;
      }).catch();
    },

    getDetail2() {
      let params = {
        pageSize: this.pageInfo2.pageSize,
        pageNum: this.pageInfo2.pageNum,
        total: this.pageInfo2.total,
        count: this.pageInfo2.count,
        taskId: this.detailForm.taskId,
        detailStatusArr: "2,3,5"
      };
      if (this.pageInfo2.orderFields != null && this.pageInfo2.orderFields.length > 0) {
        let orderBys = [];
        for (var i = 0; i < this.pageInfo2.orderFields.length; i++) {
          orderBys.push(this.pageInfo2.orderFields[i] + " " + this.pageInfo2.orderDirs[i])
        }
        params.orderBy = orderBys.join(",")
      }
      //查询申购单明细
      this.load.list = true;
      getTaskDetail(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.pageInfo2.total = res.data.total;
          this.pageInfo2.count = false;
          this.yiPanDianData = res.data && res.data.data && res.data.data.data ? res.data.data.data : [];
          this.tabLale2 = "已盘点/未盘点(" + this.pageInfo2.total + ")";
        }
        this.load.list = false;
      }).catch();
    },


    getDetail3() {
      let params = {
        pageSize: this.pageInfo3.pageSize,
        pageNum: this.pageInfo3.pageNum,
        total: this.pageInfo3.total,
        count: this.pageInfo3.count,
        taskId: this.detailForm.taskId,
        detailStatusArr: "4"
      };
      if (this.pageInfo3.orderFields != null && this.pageInfo3.orderFields.length > 0) {
        let orderBys = [];
        for (var i = 0; i < this.pageInfo3.orderFields.length; i++) {
          orderBys.push(this.pageInfo3.orderFields[i] + " " + this.pageInfo3.orderDirs[i])
        }
        params.orderBy = orderBys.join(",")
      }
      //查询申购单明细
      this.load.list = true;
      getTaskDetail(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.pageInfo3.total = res.data.total;
          this.pageInfo3.count = false;
          this.panYingData = res.data && res.data.data && res.data.data.data ? res.data.data.data : [];
          this.tabLale3 = "盘盈(" + this.pageInfo3.total + ")";
        }
        this.load.list = false;
      }).catch();
    },

    getCurrentUserOperData() {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count,
        taskId: this.detailForm.taskId,
        detailStatusArr: "1"
      };
      if (this.pageInfo.orderFields != null && this.pageInfo.orderFields.length > 0) {
        let orderBys = [];
        for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
          orderBys.push(this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i])
        }
        params.orderBy = orderBys.join(",")
      }
      //查询申购单明细
      this.load.list = true;
      getMyTaskDetail(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.pageInfo.total = res.data.total;
          this.pageInfo.count = false;
          this.assetData = res.data && res.data.data && res.data.data ? res.data.data.data : [];
          this.tabLale1 = "待盘点(" + this.pageInfo.total + ")";
        }
        this.load.list = false;
      }).catch();
    },


    //多选
    selsChange(data) {
      this.batchSelectData = data;
    },

    //批量盘点
    batchPanDian() {
      if (this.batchSelectData.length < 1) {
        this.$message({message: '请先选择数据', type: 'error'});
        return;
      }
      this.cardData = this.batchSelectData;
      this.mngParams = {
        taskId: this.detailForm.taskId,
      }
      this.addInventoryVisible = true;
    },


    //批量盘亏
    batchPanKui() {
      if (this.batchSelectData.length < 1) {
        this.$message({message: '请先选择数据', type: 'error'});
        return;
      }
      this.disposeData.this.batchSelectData;
      this.mngParams = {
        taskId: this.detailForm.taskId,
        isShowHold: false
      }
      this.disposeFormVisible = true;
    },

    //跳转资产盘点
    assetInventory(data) {
      this.cardData = [];
      this.cardData.push(data);
      this.mngParams = {
        taskId: this.detailForm.taskId,
      }
      this.addInventoryVisible = true;
    },

    addInventorySubmit() {
      this.refreshPage();
      this.singerOrChoice = '1'
      this.addInventoryVisible = false;
    },

    //跳转资产盘亏
    assetPanKui(data) {
      this.disposeData = [];
      this.disposeData.push(data);
      this.mngParams = {
        taskId: this.detailForm.taskId,
        isShowHold: false
      }
      this.disposeFormVisible = true;
    },

    addAssetPankuiSubmit() {
      this.refreshPage();
      this.singerOrChoice = '1'
      this.disposeFormVisible = false;
    },


    //获取资产分类数据
    getSelectAssetTypeData(data) {
      //1.打开添加资产卡片页面
      this.assetType = {
        categoryId: data.categoryId,
        categoryName: data.categoryName,
        inventoryTask: this.detailForm.taskId
      }
      this.selectAssetTypeVisible = false;
      this.addAssetCardVisible = true;
    },

    addAssetCardSubmit() {
      this.getDetail3();
      this.addAssetCardVisible = false;
    },

    //可以操作的用户
    selectCanOperUser() {
      let params = {
        taskId: this.detailForm.taskId,
      }
      //查询申购单明细
      getCanOperTaskUser(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.canOperUserName = '';
          if (res.data.data !== null && res.data.data.length > 0) {
            res.data.data.forEach(r => {
              if (r.inventoryUsername != null) {
                this.canOperUserName += r.inventoryUsername + ",";
              }
            })
          }
        }
      }).catch();
    },


    //盘点完成
    finish() {

      if (this.detailForm.taskStatus === 'running' && this.detailForm.reqStatus === 'submit') {
        this.$message({message: '当前状态下不能操作', type: 'error'});
        return;
      }

      //查询当前是否还有未盘点的数据
      let params = {
        taskId: this.detailForm.taskId,
        detailStatus: '1'
      }
      getTaskCountByStatus(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          if (res.data.data > 0) {
            this.$confirm('当前还存在' + res.data.data + '条数据未进行盘点,是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              //调用完成接口
              let finishParams = {
                taskId: this.detailForm.taskId,
              }
              finishInventory(finishParams).then((res) => {
                var tips = res.data.tips;
                if (tips.isOk) {
                  this.$message({message: "操作成功", type: tips.isOk ? 'success' : 'error'});
                  this.getDetail();
                  this.getDetail2();
                }
              }).catch(() => {
                this.$message({message: tips.msg, type: tips.isOk ? 'success' : 'error'});
              });

            }).catch(() => {
            });
          }
        }
      }).catch();

    },


    refreshPage() {
      this.getDetail();
      this.getDetail2();
      this.getDetail3();
    }


    /**end 在上面加自定义方法**/

  },//end method
  components: {
    //在下面添加其它组件 'asset-inventory-task-edit':AssetInventoryTaskEdit
    'attachment-upload': AttachmentUpload,
    'user-select': UsersSelect,
    'warehouse-components': WarehouseComponents,
    'asset-category-tree': AssetCategoryTree,
    'asset-card-show': AssetCardShow,
    'asset-inventory-add': AssetInventoryAdd,
    'asset-inventory-detail': AssetInventoryDetail,
    'asset-dispose-add': assetDisposeAdd,
    'asset-dispose-detail': assetDisposeDetail,
    'asset-card-add': AssetCardAdd
  },

  mounted() {
    console.log(999, this.assetInventoryTask);
    this.detailForm = Object.assign(this.detailForm, this.assetInventoryTask);
    /**在下面写其它函数***/
    this.setDefaultParam();
  }//end mounted
}

</script>

<style scoped>

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

.mt {
  margin-top: 20px;

}

.seeDetails {
  text-decoration: underline;
  cursor: pointer;
  color: rgba(10, 69, 169, 1.0);
}

.seeDetails:hover {
  color: rgba(10, 69, 169, 0.6);
}

.seeDetails {
  text-decoration: underline;
  cursor: pointer;
  color: rgba(10, 69, 169, 1.0);
}

.seeDetails:hover {
  color: rgba(10, 69, 169, 0.6);
}

</style>
