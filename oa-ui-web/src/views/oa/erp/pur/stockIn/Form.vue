<template>
  <section>
    <el-row class="page-container border padding" v-if="(currOpType=='edit' && editable===true) || currOpType=='add'">
      <el-row>
        <el-button v-if="editable==true" size="small" @click.native="editable=false">取消编辑</el-button>
        <!--        <el-button type="primary" size="small" @click.native="editSubmit(false)">暂存</el-button>-->
        <!--        <el-button type="primary" size="small" @click.native="editSubmit(true)">提交</el-button>-->
        <el-button v-if="currOpType == 'edit' || currOpType == 'add' " v-loading="load.edit" type="primary"
                   @click.native="editSubmit(false)"
                   :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">暂存
        </el-button>
        <el-button v-if="currOpType == 'edit' || currOpType == 'add' " v-loading="load.edit" type="primary"
                   @click.native="editSubmit(true)"
                   :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交
        </el-button>
        <el-divider content-position="center">资产入库</el-divider>
      </el-row>
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
        <el-row>
          <el-form-item label="入库单标题" prop="title">
            <el-input v-model="editForm.title" placeholder="入库单标题" :maxlength="255"
                      @change="editSomeFields(editForm,'title',$event)" :disabled="  disabledJudge('title')"/>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="入库单类别" prop="categoryId">
              <el-input v-model="editForm.categoryId" placeholder="入库单类别" :maxlength="255"
                        @change="editSomeFields(editForm,'categoryId',$event)" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编号">
              <el-input disabled placeholder="系统自动生成"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="申请人姓名" prop="reqUsername">
              <mdp-select-user v-model="editForm.reqUsername" placeholder="申请人姓名" :maxlength="50"
                               @change2="(option)=>{
                                 editSomeFields(editForm,'reqUsername',option.name);
                                 editSomeFields(editForm,'reqUserid',option.id);}"
                               :disabled="disabledJudge('reqUsername')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请日期" prop="reqDate">
              <el-date-picker type="date" placeholder="选择日期" v-model="editForm.reqDate"
                              value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"
                              :disabled="  disabledJudge('reqDate')"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">采购单明细</el-divider>
        <el-row>
          <el-button type="primary" size="mini" @click="searchCaiGou">选择采购单物资明细</el-button>
        </el-row>
        <el-row style="margin-bottom:20px">
          <el-table size="small" border :data="caiGouData" stripe>
            <el-table-column label="序号" type="index" width="50"/>

            <el-table-column prop="purOrderId" align="center" label="采购单编号" width="200">
            </el-table-column>

            <el-table-column prop="assetName" align="center" label="资产名称" width="">
            </el-table-column>

            <el-table-column prop="spec" align="center" label="规格型号" width="">
            </el-table-column>

            <el-table-column prop="measUnit" align="center" label="单位" width="155">
            </el-table-column>

            <el-table-column prop="orignUnitAmount" align="center" label="单价" width="155">
            </el-table-column>

            <el-table-column prop="stockNum" align="center" label="采购数量" width="">
            </el-table-column>

            <el-table-column prop="reachNum" align="center" label="已到数量" width="">
            </el-table-column>

            <el-table-column prop="purchaseUsername" align="center" label="采购人" width="">
            </el-table-column>

            <el-table-column prop="supplierName" align="center" label="供应商" width="200">
            </el-table-column>

            <el-table-column prop="purchaseDate" align="center" label="采购日期" width="">
            </el-table-column>

            <el-table-column align="center" label="操作" width="80">
              <template slot-scope="scope">
                <i class="el-icon-remove-outline" @click="delRow(scope.$index)"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-row>

        <el-divider content-position="center">入库资产清单</el-divider>

        <el-row style="margin-bottom:20px">
          <el-table size="small" border :data="ruKuData" stripe>
            <el-table-column label="序号" type="index" width="50"/>

            <el-table-column prop="purOrderId" align="center" label="采购单编号" width="85">
            </el-table-column>

            <el-table-column prop="assetName" align="center" label="资产名称" width="85">
            </el-table-column>

            <el-table-column prop="stockNum" align="center" label="采购数量" width="85">
            </el-table-column>

            <el-table-column prop="reachNum" align="center" label="已到数量" width="85">
            </el-table-column>

            <el-table-column align="center" label="资产类别" width="">
              <template slot-scope="scope">
                <span class="vTip">*</span>
                <el-input @focus="openAssetCategorySelect(scope.$index)"
                          @blur="validateDetail(scope.row, 'categoryName')" size="mini"
                          v-model="scope.row.categoryName"></el-input>
                <div v-show="scope.row.validate.categoryNameShow">
                  <i class="el-icon-warning"></i>
                  <span class="tipMsg">{{ scope.row.validate.categoryNameMsg }}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column align="center" label="资产序列号" width="170">
              <template slot-scope="scope">
                <span class="vTip">*</span>
                <el-input @input="validateDetail(scope.row, 'assetNo')" size="mini"
                          v-model="scope.row.assetNo"></el-input>
                <div v-show="scope.row.validate.assetNoShow">
                  <i class="el-icon-warning"></i>
                  <span class="tipMsg">{{ scope.row.validate.assetNoMsg }}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column align="center" label="资产编码" width="">
              <template slot-scope="scope">
                <span class="vTip">*</span>
                <el-input @input="validateDetail(scope.row, 'assetSn')" size="mini" v-model="scope.row.assetSn">
                  <template slot="append">
                    <el-button @click="visibleAssetDetailSelect=true">选择</el-button>
                  </template>
                </el-input>
                <div v-show="scope.row.validate.assetSnShow">
                  <i class="el-icon-warning"></i>
                  <span class="tipMsg">{{ scope.row.validate.assetSnMsg }}</span>
                </div>
              </template>
            </el-table-column>

            <!-- <el-table-column align="center" label="组织机构代码"  width="">
              <template slot-scope="scope">
                <span class="vTip">*</span>
                <el-input @change="validateDetail(scope.row, 'four')"  size="mini" v-model="scope.row.branchId"> </el-input>
                <div v-show="scope.row.validate.fourShow">
                  <i class="el-icon-warning"></i>
                  <span class="tipMsg">{{scope.row.validate.fourMsg}}</span>
                </div>
              </template>
            </el-table-column> -->

            <el-table-column align="center" label="到货数量" width="">
              <template slot-scope="scope">
                <span class="vTip">*</span>
                <el-input-number @input="validateDetail(scope.row, 'inNum')" size="mini"
                                 v-model="scope.row.inNum"></el-input-number>
                <div v-show="scope.row.validate.inNumShow">
                  <i class="el-icon-warning"></i>
                  <span class="tipMsg">{{ scope.row.validate.inNumMsg }}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column align="center" label="所属仓库" width="">
              <template slot-scope="scope">
                <span class="vTip">*</span>
                <el-input @focus="openWarehouse(scope.$index)" @blur="validateDetail(scope.row, 'warehouseName')"
                          size="mini" v-model="scope.row.warehouseName"></el-input>
                <div v-show="scope.row.validate.warehouseNameShow">
                  <i class="el-icon-warning"></i>
                  <span class="tipMsg">{{ scope.row.validate.warehouseNameMsg }}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column align="center" label="品牌" width="">
              <template slot-scope="scope">
                <span class="vTip">*</span>
                <el-input @focus="openBrand(scope.$index)" @blur="validateDetail(scope.row, 'brandName')" size="mini"
                          v-model="scope.row.brandName"></el-input>
                <div v-show="scope.row.validate.brandNameShow">
                  <i class="el-icon-warning"></i>
                  <span class="tipMsg">{{ scope.row.validate.brandNameMsg }}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="80">
              <template slot-scope="scope">
                <i class="el-icon-remove-outline" @click="delRow(scope.$index)"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-row>

        <tr>
          <td colspan="1" class="tl">是否生成资产卡片</td>
          <td colspan="3">
            <el-radio disabled v-model="editForm.isAssetCard" label="1">是</el-radio>
            <el-radio disabled v-model="editForm.isAssetCard" label="0">否</el-radio>
          </td>
        </tr>

        <tr>
          <td colspan="1" class="tl">资产卡片是否按数量拆分</td>
          <td colspan="3">
            <el-radio disabled v-model="editForm.cardDisByNum" label="1">是</el-radio>
            <el-radio disabled v-model="editForm.cardDisByNum" label="0">否</el-radio>
          </td>
        </tr>
      </el-form>
    </el-row>


    <el-row class="page-container border padding" v-else>
      <el-row>
        <div>
          <el-button size="small" @click="editable=true">编辑</el-button>
          <el-button size="small" v-print="'#printArea'">打印</el-button>
        </div>
      </el-row>
      <el-row id="printArea">
        <el-row>
          <el-divider content-position="center">资产入库</el-divider>
        </el-row>

        <table class="tab">
          <tbody>
          <tr>
            <td colspan="1" class="tl">标题</td>
            <td colspan="3">{{ editForm.title }}</td>
          </tr>

          <tr>
            <td class="tl">类别</td>
            <td>资产入库单</td>
            <td class="tl">编号</td>
            <td>{{ editForm.id }}</td>
          </tr>

          <tr>
            <td class="tl">申请人</td>
            <td>{{ editForm.reqUsername }}</td>
            <td class="tl">申请日期</td>
            <td>{{ editForm.reqDate }}</td>
          </tr>


          <tr>
            <td colspan="4">
              <el-table v-loading="load.list" border size="small" :data="caiGouData" stripe>
                <el-table-column
                    label="序号"
                    type="index"
                    width="50">
                </el-table-column>

                <el-table-column prop="purOrderId" align="center" label="采购单编号" width="200">
                </el-table-column>

                <el-table-column prop="assetName" align="center" label="资产名称" width="">
                </el-table-column>

                <el-table-column prop="spec" align="center" label="规格型号" width="">
                </el-table-column>

                <el-table-column prop="measUnit" align="center" label="单位" width="155">
                </el-table-column>

                <el-table-column prop="orignUnitAmount" align="center" label="单价" width="155">
                </el-table-column>

                <el-table-column prop="stockNum" align="center" label="采购数量" width="">
                </el-table-column>

                <el-table-column prop="reachNum" align="center" label="已到数量" width="">
                </el-table-column>

                <el-table-column prop="purchaseUsername" align="center" label="采购人" width="">
                </el-table-column>

                <el-table-column prop="supplierName" align="center" label="供应商" width="200">
                </el-table-column>

                <el-table-column prop="purchaseDate" align="center" label="采购日期" width="">
                </el-table-column>
              </el-table>
            </td>
          </tr>

          <tr>
            <td colspan="4" class="tl" style="text-align:center">入库资产清单</td>
          </tr>

          <tr>
            <td colspan="4">
              <el-table v-loading="load.list" size="small" border :data="ruKuData" stripe>
                <el-table-column
                    label="序号"
                    type="index"
                    width="50">
                </el-table-column>

                <el-table-column prop="purOrderId" align="center" label="采购单编号" width="100">
                </el-table-column>

                <el-table-column prop="assetName" align="center" label="资产名称" width="100">
                </el-table-column>

                <el-table-column prop="stockNum" align="center" label="采购数量" width="85">
                </el-table-column>

                <el-table-column align="center" label="资产类别" prop="categoryName" width="">
                </el-table-column>

                <el-table-column align="center" label="资产序列号" prop="assetNo" width="170">
                </el-table-column>

                <el-table-column align="center" label="资产编码" prop="assetSn" width="">
                </el-table-column>

                <el-table-column align="center" label="到货数量" prop="inNum" width="">
                </el-table-column>

                <el-table-column align="center" label="所属仓库" prop="warehouseName" width="">
                </el-table-column>

                <el-table-column align="center" label="品牌" prop="brandName" width="">
                </el-table-column>
              </el-table>
            </td>
          </tr>

          <tr>
            <td colspan="1" class="tl">是否生成资产卡片</td>
            <td colspan="3">
              <el-radio disabled v-model="editForm.isAssetCard" label="1">是</el-radio>
              <el-radio disabled v-model="editForm.isAssetCard" label="0">否</el-radio>
            </td>
          </tr>

          <tr>
            <td colspan="1" class="tl">资产卡片是否按数量拆分</td>
            <td colspan="3">
              <el-radio disabled v-model="editForm.cardDisByNum" label="1">是</el-radio>
              <el-radio disabled v-model="editForm.cardDisByNum" label="0">否</el-radio>
            </td>
          </tr>

          </tbody>
        </table>

      </el-row>
    </el-row>
    <!--    <span v-if="editable==true">-->
    <!--      <slot name="footer" :page="this">-->
    <!--        <el-row v-if="showBtn!==false" style="float:right;" class="footer">-->
    <!--          <el-button @click.native="close" type="primary">关闭</el-button>-->
    <!--          <el-button v-if="currOpType == 'edit' || currOpType == 'add' " v-loading="load.edit" type="primary"-->
    <!--                     @click.native="saveSubmit"-->
    <!--                     :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交-->
    <!--          </el-button>-->
    <!--        </el-row>-->
    <!--      </slot>-->
    <!--    </span>-->


    <!--    dialog-->
    <el-dialog append-to-body title="选择采购物资清单" center width="60%" :visible.sync="selectAssetVisible"
               :close-on-click-modal="false">
      <order-detail-components :pur-order-id="purOrderId" :visible="selectAssetVisible"
                               @cancel="selectAssetVisible=false"
                               @add-submit="getSelectAssetData"></order-detail-components>
    </el-dialog>
  </section>
</template>

<script>
import {sendStockInToProcessApprova, showFlowTaskDetail} from '@/api/oa/erp/ass/assUtil';
import util from '@/common/js/util';//全局公共库
import {isExitAssetSn} from '@/api/oa/erp/ass/assetCard';
import * as StockInApi from '@/api/oa/erp/pur/stockIn';
import {mapGetters} from 'vuex'
import {MdpFormMixin} from '@/components/mdp-ui/mixin/MdpFormMixin.js';
import {rules} from "vue-loader/.eslintrc";
import {Decimal} from 'decimal.js';
import OrderDetailComponents from '../components/OrderDetailComponents';
import {addStockIn, editStockIn, listStorkInDetail} from '@/api/oa/erp/pur/stockIn';

export default {
  name: 'stockInForm',
  mixins: [MdpFormMixin],
  components: {
    "order-detail-components": OrderDetailComponents,
  },
  computed: {
    rules() {
      return rules
    }
  },
  props: {},
  watch: {},
  data() {
    return {
      load: {list: false, edit: false, del: false, add: false},//查询中...
      caiGouData: [],
      ruKuData: [],
      purOrderId: '',
      selectAssetVisible: false,
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
        id: '',
        title: '',
        reqUserid: '',
        reqUsername: '',
        reqDate: '',
        reqBranchId: '',
        isAssetCard: '',
        cardDisByNum: '',
        stockStatus: '',
        bizProcInstId: '',
        bizKey: '',
        commentMsg: '',
        assignee: '',
        assigneeName: '',
        agree: '',
        flowLastTime: '',
        flowEndTime: '',
        actId: '',
        taskName: '',
        bizFlowState: '',
        totalInNum: '',
        totalStockNum: '',
        reqDeptid: '',
        reqDeptName: '',
        reqReason: ''
      },
      //增删改查(含批量)接口
      apis: {
        queryById: StockInApi.queryStockInById,
        add: StockInApi.addStockIn,
        edit: StockInApi.editStockIn,
        editSomeFields: StockInApi.editSomeFieldsStockIn
      },
      editable: false,//是否可编辑模式
    }
  },
  methods: {
    editSubmit(isFlow) {
      // this.editFormVisible = false;
      let res = this.saveSubmit()
      let data = res && res.data && res.data.data ? res.data.data : null;
      console.log(res)
      this.getDetailData()
      if (isFlow) {
        // sendStockInToProcessApprova(this, data)
      }
    },

    setDefaultParam() {
      if (this.opType == 'add') {
        let user = this.userInfo;
        this.editForm.reqUserid = user.userid;
        this.editForm.reqUsername = user.username;
        this.editForm.reqDeptid = user.deptid;
        this.editForm.reqDeptName = user.deptName;
        this.editForm.reqDate = util.formatDate.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        this.editForm.id = '';
      } else {
        this.editForm = Object.assign(this.editForm, this.stockIn);
      }
    },

    //删除列表
    delRow(index) {
      this.caiGouData.splice(index, 1);
      this.ruKuData.splice(index, 1);
    },
    //验证明细参数
    validateDetail(row, position) {
      // debugger;
      let param = row;
      let data = row.validate;
      switch (position) {
        case 'categoryName' :
          this.isNull(param.categoryName) ? data.categoryNameShow = true : data.categoryNameShow = false;
          break;
        case 'assetNo' :
          this.isNull(param.assetNo) ? data.assetNoShow = true : data.assetNoShow = false;
          break;
        case 'assetSn' :
          //查询资产编码是否重复
          if (this.isNull(param.assetSn)) {
            data.assetSnShow = true
          } else {
            data.assetSnShow = false;
            isExitAssetSn({"assetSn": param.assetSn}).then((res) => {
              var tips = res.data.tips;
              if (tips.isOk) {
              } else {
                data.assetSnShow = true;
                data.assetSnMsg = "该资产编码已存在，请重新输入"
              }
            }).catch();
          }
          break;
          // case 'four' :
          // 	this.isNull(param.branchId) ? data.fourShow = true : data.fourShow = false;
          // break;
        case 'inNum' :
          if (this.isNull(param.inNum) || param.inNum === 0) {
            data.inNumShow = true
            data.inNumMsg = '到货数量不能为空';
          } else if (Number(new Decimal(param.inNum).add(new Decimal(param.reachNum ? param.reachNum : 0))) > (param.stockNum ? param.stockNum : 0)) {
            data.inNumShow = true;
            data.inNumMsg = '到货数量不能超过采购数量';
          } else {
            data.inNumShow = false;
          }
          break;
        case 'warehouseName' :
          this.isNull(param.warehouseName) ? data.warehouseNameShow = true : data.warehouseNameShow = false;
          break;
        case 'brandName' :
          this.isNull(param.brandName) ? data.brandNameShow = true : data.brandNameShow = false;
          break;
      }
    },
    isNull(data) {
      return data === null || data === '' || data === undefined;
    },
    //开启资产分类选择器
    openAssetCategorySelect(index) {
      this.currentRow = index;
      this.selectAssetTypeVisible = true;
    },
    getSelectAssetData(data) {
      this.selectAssetVisible = false;
      var datas = data.filter(i => !this.ruKuData.some(k => k.orderDetailId == i.id))
      datas.forEach(d => {
        d.orderDetailId = d.id
        this.caiGouData.push({...d})
        let validate = {
          categoryNameMsg: "资产类别不能为空",
          assetNoMsg: "资产序列号不能为空",
          assetSnMsg: "资产编码不能为空",
          // fourMsg: "代码不能为空",
          inNumMsg: "到货数量不能为空",
          warehouseNameMsg: "仓库不能为空",
          brandNameMsg: "品牌不能为空",
          categoryNameShow: false,
          assetNoShow: false,
          assetSnShow: false,
          // fourShow: false,
          inNumShow: false,
          warehouseNameShow: false,
          brandNameShow: false,
        }
        d.validate = validate
        d["inNum"] = 0
        this.ruKuData.push({...d})
      })
    },
    getDetailData() {
      let params = {
        id: this.editForm.id
      };
      //查询申购单明细
      this.load.list = true;
      listStorkInDetail(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.caiGouData = res.data.data.caiGouData;
          this.ruKuData = res.data.data.ruKuData;
          this.ruKuData.forEach(c => {
            this.caiGouData.forEach(g => {
              if (c.purOrderId === g.purOrderId) {
                c.reachNum = g.reachNum;
                c.yuanAssetSn = g.assetSn;
              }
            })
            let validate = {
              categoryNameMsg: "资产类别不能为空",
              assetNoMsg: "资产序列号不能为空",
              assetSnMsg: "资产编码不能为空",
              // fourMsg: "代码不能为空",
              inNumMsg: "到货数量不能为空",
              warehouseNameMsg: "仓库不能为空",
              brandNameMsg: "品牌不能为空",
              categoryNameShow: false,
              assetNoShow: false,
              assetSnShow: false,
              // fourShow: false,
              inNumShow: false,
              warehouseNameShow: false,
              brandNameShow: false,
            }
            c.validate = validate
          })
        }
        this.load.list = false;
      }).catch();
    },
    searchCaiGou() {
      this.selectAssetVisible = true;
    },
    //由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
    initCurrData() {
      this.editable = false;
      this.setDefaultParam();
      this.caiGouData = [];
      this.ruKuData = [];
      this.orderData = [];
      /**在下面写其它函数***/
      if (this.currOpType == 'edit') {
        this.getDetailData();
      }
    },
    /**
     * 检查参数是否满足调用后台接口的条件
     * @returns true / false
     */
    preParamCheck(params) {
      this.ruKuData.forEach(r => {
        let flag = this.orderData.some(item => {
          if (item.assetSn == r.yuanAssetSn) {
            return true;
          }
        })
        if (flag) {
          return
        }
        let param = {
          inNum: r.inNum,
          assetSn: r.yuanAssetSn
        }
        this.orderData.push(param);
      })
      Object.keys(params).forEach(k => delete params[k])
      params.stockIn = this.editForm;
      params.stockInDetails = this.ruKuData;
      params.order = this.orderData;
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

.el-icon-remove-outline {
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
}

.vTip {
  color: red;
  display: block;
  position: absolute;
  left: 1px;
}

.el-icon-warning {
  position: relative;
  top: 5px;
  margin-right: 1px;
}

.el-icon-warning, .tipMsg {
  color: red;
  float: left;
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
</style>
