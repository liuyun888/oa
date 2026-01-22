<template>
   <section>
      
      <div class="continer" @contextmenu.prevent="onContextmenu">
         
         <div class="header">
            <div class="left">
               <i class="el-icon-tickets"></i>
            </div>

            <div class="center">
               <div class="title">
                  <span>合同起草 - 产品销售合同审批流程</span>
                  <i class="el-icon-paperclip"></i>
               </div>
               <ul class="list">
                  <!-- <li>流程表单</li> -->
                  <!-- <li>流程图</li> -->
               </ul>
            </div>

            <div class="right">
               <div class="btn2">
                  <el-button v-loading="load.add" @click="addSubmit('1')" size="mini" type="primary">提交</el-button>
                  <el-button @click="addSubmit('0')" size="mini" type="primary">保存</el-button>
                  <el-button @click="cancel" size="mini" type="primary">关闭</el-button>
               </div>
            </div>
         </div>

         <div class="nav">

            <div class="title">
                <h1>产品销售合同审批表</h1>
            </div>
            
            <div class="content">
               <el-form  size="mini" :model="addForm"  label-width="100px" :rules="addFormRules" ref="addForm">
                  
                  <line-components text="基本信息"></line-components>

                  <el-row>
                     <el-col :span="24">
                        <el-form-item label="标题">
                           <el-input v-model="addForm.title"></el-input>
                        </el-form-item>
                     </el-col>
                  </el-row>

                  <el-row>

                     <el-col :span="12">
                        <el-form-item label="客户经理">
                           <el-input suffix-icon="el-icon-search" @focus="visibleUserSelect=true" v-model="addForm.reqUserName"> </el-input>
                        </el-form-item>
                     </el-col>

                     <el-col :span="12">
                        <el-form-item label="部门">
                           <el-input suffix-icon="el-icon-search" @focus="visibleDeptSelect=true" v-model="addForm.reqDeptName"></el-input>
                        </el-form-item>
                     </el-col>
                  
                  </el-row>

                  <el-row>
                     <el-col :span="12">
                        <el-form-item label="创建日期">
                          	<el-date-picker v-model="addForm.reqDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" disabled></el-date-picker>
                        </el-form-item>
                     </el-col> 
                     <el-col :span="12">
                        <el-form-item label="成本中心" prop="cbCenterId"> 
                           <el-input suffix-icon="el-icon-search" @focus="visibleCbDeptSelect=true" v-model="addForm.cbCenterName"></el-input>
                        </el-form-item>
                     </el-col> 
                  </el-row>

                  <line-components text="合同信息"></line-components>

                  <el-row>
                     <el-col :span="24">
                        <el-form-item label="合同名称">
                           <el-input v-model="addForm.htName"></el-input>
                        </el-form-item>
                     </el-col>
                  </el-row>

                  <el-row>
                     <el-col :span="12">
                        <el-form-item label="签约主体">
                           <el-input v-model="addForm.htPartyName"> </el-input>
                        </el-form-item>
                     </el-col>
                     <el-col :span="12">
                        <el-form-item label="合同金额">
                           <el-input @change="amountCheck" v-model="addForm.htAmount"></el-input>
                        </el-form-item>
                     </el-col>
                  </el-row>

                  <el-row>
                     <el-col :span="24">
                        <el-form-item label="合同重要条款">
                           <el-input type="textarea" v-model="addForm.htImportantClause" :rows="4"></el-input>
                        </el-form-item>
                     </el-col>
                  </el-row>

                  <el-row>
                     <el-col :span="24">
                        <el-form-item label="合同说明">
                           <el-input type="textarea" v-model="addForm.htDemand" :rows="4"></el-input>
                        </el-form-item>
                     </el-col>
                  </el-row>

                  <line-components text="客户信息"></line-components>
                  
                  <el-row>
                     <el-col :span="24">
                        <el-form-item label="客户名称">
                           <el-input suffix-icon="el-icon-search" v-model="addForm.cpName" @focus="counterpartyVisible=true" ></el-input>
                        </el-form-item>
                     </el-col> 
                  </el-row>
                  
                  
                  <el-row>
                     <el-col :span="12">
                        <el-form-item label="客户法人">
                           <el-input v-model="addForm.cpFddb" ></el-input>
                        </el-form-item>
                     </el-col>
                     <el-col :span="12">
                        <el-form-item label="纳税人识别码">
                           <el-input v-model="addForm.cpGszch" ></el-input>
                        </el-form-item>
                     </el-col>
                  </el-row>
                  <el-row>
                     <el-col :span="12">
                        <el-form-item label="客户级别">
                           <el-input v-model="addForm.cpLevel" ></el-input>
                        </el-form-item>
                     </el-col>
                     <el-col :span="12">
                        <el-form-item label="客户类型">
                           <el-input v-model="addForm.cpType" ></el-input>
                        </el-form-item>
                     </el-col>
                  </el-row>

                  <el-row>
                     <el-col :span="24">
                        <el-form-item label="客户地址">
                           <el-input v-model="addForm.cpAddress" ></el-input>
                        </el-form-item>
                     </el-col>
                  </el-row>

                  <el-row>
                     <el-col :span="12">
                        <el-form-item label="开户行">
                           <el-input v-model="addForm.cpOpenBank" ></el-input>
                        </el-form-item>
                     </el-col>

                     <el-col :span="12">
                        <el-form-item label="开户行账号">
                           <el-input v-model="addForm.cpBankAccount" ></el-input>
                        </el-form-item>
                     </el-col>
                  </el-row>

                  <el-row>
                     <el-col :span="12">
                        <el-form-item label="联系人">
                           <el-input v-model="addForm.linkName" ></el-input>
                        </el-form-item>
                     </el-col>
                     
                     <el-col :span="12">
                        <el-form-item label="联系人方式">
                           <el-input v-model="addForm.linkPhone" ></el-input>
                        </el-form-item>
                     </el-col>
                  </el-row>
                  
                  <line-components text="开票信息"></line-components>
                  <el-row> 
                     <el-col :span="12">
                        <el-form-item label="开票类型" prop="invoiceType">
                           <el-select clearable style="width:100%;" v-model="addForm.invoiceType" placeholder="请选择">
                              <el-option
                                 v-for="item in invoiceTypeOptions"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                              </el-option>
                           </el-select>
                        </el-form-item>
                     </el-col>
                     <el-col :span="12">
                        <el-form-item label="税率" prop="invoicePoint">
                           <el-input type="number" min="1" max="100" style="width:80%;" v-model="addForm.invoicePoint"> </el-input>&nbsp;&nbsp;%
                        </el-form-item> 
                     </el-col>
                  </el-row> 
                  <line-components text="合同标的"></line-components>
                  
                  <el-table show-summary  :summary-method="getProDataSummaries" size="small" border :data="proData" stripe>
                     <el-table-column
                           label="序号"
                           type="index"
                           width="50">
                     </el-table-column>
                  
                     <el-table-column align="center" label="产品名称" width=""> 
                           <template slot-scope="row">
                              <el-input  size="mini" v-model="proData[row.$index].productName"> </el-input>
                           </template>
                     </el-table-column> 
                     <el-table-column align="center" label="产品类型" width="">
                           <template slot-scope="row">
                              <el-select clearable size="mini" v-model="proData[row.$index].productType">
                                 <el-option
                                    v-for="item in dicts.productType"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                 </el-option>
                              </el-select>
                           </template>
                     </el-table-column>
                     <el-table-column  align="center" label="规格型号" width="" >
                           <template slot-scope="row">
                              <el-input size="mini" v-model="proData[row.$index].productSpec"> </el-input>
                           </template>
                     </el-table-column>

                     <el-table-column  align="center" label="单位"  width="">
                           <template slot-scope="row">
                              <el-input size="mini"  v-model="proData[row.$index].productMeasUnit" ></el-input>
                           </template>
                     </el-table-column>

                     <el-table-column align="center" label="单价"  width="">
                           <template slot-scope="row">
                              <el-input-number size="mini" controls-position="right" v-model="proData[row.$index].productPrice"  :min="0" :step="1" ></el-input-number>
                           </template>
                     </el-table-column>

                        <el-table-column align="center" label="数量"  width="">
                           <template slot-scope="row">
                              <el-input-number size="mini" controls-position="right" v-model="proData[row.$index].productNum"  :min="0" :step="1" ></el-input-number>
                           </template>
                     </el-table-column>

                        <el-table-column align="center" label="总价"  width="">
                           <template slot-scope="row">
                              <el-input size="mini" readonly v-model="proData[row.$index].productGrossAmount"> </el-input>
                           </template>
                     </el-table-column>

                     <el-table-column align="center"  width="80">
                           <template slot="header">
                              <i class="el-icon-circle-plus-outline"  @click="addRow('pro');"></i>
                           </template>
                           <template slot-scope="row">
                              <i class="el-icon-remove-outline" @click="delRow('pro', row.$index)"></i>
                           </template>
                        </el-table-column>
                  </el-table>

                 <div style="margin: 20px">
                     <span>
                        是否需要第三方采购 &nbsp;&nbsp;
                        <el-radio v-model="isThirdParty" label="0">否</el-radio>
                        <el-radio v-model="isThirdParty" label="1">是</el-radio>
                     </span>
                 </div>

                  <el-table show-summary v-if="isThirdParty === '1'" :summary-method="getThirdPartySummaries" size="small" border :data="thirdPartyData" stripe>
                     <el-table-column
                           label="序号"
                           type="index"
                           width="50">
                     </el-table-column>
                  
                     <el-table-column align="center" label="产品名称" width=""> 
                           <template slot-scope="row">
                              <el-input  size="mini" v-model="thirdPartyData[row.$index].productName"> </el-input>
                           </template>
                     </el-table-column>

                     <el-table-column align="center" label="产品类型" width="">
                           <template slot-scope="row">
                              <el-select clearable size="mini" v-model="thirdPartyData[row.$index].productType">
                                 <el-option
                                    v-for="item in dicts.productType"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                 </el-option>
                              </el-select>
                           </template>
                     </el-table-column>

                     <el-table-column  align="center" label="规格型号" width="" >
                           <template slot-scope="row">
                              <el-input size="mini" v-model="thirdPartyData[row.$index].productSpec"> </el-input>
                           </template>
                     </el-table-column>

                     <el-table-column  align="center" label="单位"  width="">
                           <template slot-scope="row">
                              <el-input size="mini"  v-model="thirdPartyData[row.$index].productMeasUnit" ></el-input>
                           </template>
                     </el-table-column>

                     <el-table-column align="center" label="单价"  width="">
                           <template slot-scope="row">
                              <el-input-number size="mini" controls-position="right" v-model="thirdPartyData[row.$index].productPrice"  :min="0" :step="1" ></el-input-number>
                           </template>
                     </el-table-column>

                        <el-table-column align="center" label="数量"  width="">
                           <template slot-scope="row">
                              <el-input-number size="mini" controls-position="right" v-model="thirdPartyData[row.$index].productNum"  :min="0" :step="1" ></el-input-number>
                           </template>
                     </el-table-column>

                        <el-table-column align="center" label="总价"  width="">
                           <template slot-scope="row">
                              <el-input-number size="mini" controls-position="right" v-model="thirdPartyData[row.$index].productGrossAmount"  :min="0" :step="1" ></el-input-number>
                           </template>
                     </el-table-column>

                     <el-table-column align="center"  width="80">
                           <template slot="header">
                              <i class="el-icon-circle-plus-outline"  @click="addRow('thirdParty');"></i>
                           </template>
                           <template slot-scope="row">
                              <i class="el-icon-remove-outline" @click="delRow('thirdParty', row.$index)"></i>
                           </template>
                        </el-table-column>
                  </el-table>
                  

                  <line-components text="成本预估"></line-components>

                  <el-table size="small" border :data="cbData" stripe>
                     <el-table-column
                           label="序号"
                           type="index"
                           width="50">
                     </el-table-column>

                     <el-table-column align="center" label="成本类型" width="" >   
                           <template slot-scope="row">
                              <el-select clearable size="mini" v-model="cbData[row.$index].cbType">
                                 <el-option
                                    v-for="item in dicts.costType"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                 </el-option>
                              </el-select>
                           </template>
                     </el-table-column>

                     <el-table-column  align="center" label="人天估算"  width="">
                           <template slot-scope="row">
                              <el-input-number size="mini" controls-position="right" v-model="cbData[row.$index].cbMandayAmount" :min="0" :step="1" ></el-input-number>
                           </template>
                     </el-table-column>

                     <el-table-column align="center"  width="80">
                           <template slot="header">
                              <i class="el-icon-circle-plus-outline"  @click="addRow('cb');"></i>
                           </template>
                           <template slot-scope="row">
                              <i class="el-icon-remove-outline" @click="delRow('cb', row.$index)"></i>
                           </template>
                        </el-table-column>
                  </el-table> 
				      <line-components  :text="addForm.htParentType=='1'?'回款条件':'付款条件'"></line-components>  
				
                  <el-table size="small" border :data="conditionData" stripe>
                     <el-table-column
                           label="序号"
                           type="index"
                           width="50">
                     </el-table-column>

                     <el-table-column align="center" label="款项类别" width="">  
                           <template slot-scope="row">
                              <el-select clearable size="mini" v-model="conditionData[row.$index].conditionType">
                                 <el-option
                                    v-for="item in dicts.amountType"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                 </el-option>
                              </el-select>
                           </template>
                     </el-table-column>

                     <el-table-column  align="center" :label="addForm.htParentType=='1'?'回款条件':'付款条件'" width="" >
                           <template slot-scope="row">
                        <el-input size="mini" v-model="conditionData[row.$index].conditionTiaoJian"> </el-input>
                           </template>
                     </el-table-column>

                     <el-table-column  align="center" :label="addForm.htParentType=='1'?'回款比例%':'付款比例%'"  width="">
                           <template slot-scope="row">
                              <el-input-number size="mini" controls-position="right" v-model="conditionData[row.$index].conditionRatio" :min="0" :step="1" ></el-input-number>%
                           </template>
                     </el-table-column>

                     <el-table-column  align="center" :label="addForm.htParentType=='1'?'应收金额':'应付金额'"  width="">
                           <template slot-scope="row">
                              ￥<el-input-number size="mini" controls-position="right" v-model="conditionData[row.$index].conditionAmount" :min="0" :step="1" ></el-input-number>
                           </template>
                     </el-table-column>

                     <el-table-column  align="left" :label="addForm.htParentType=='1'?'收款状态':'付款状态'"  width="200">
                        <template slot-scope="row">
                           <el-select clearable size="mini" style="padding:5px;" v-model="conditionData[row.$index].conditionStatus" placeholder="请选择">
                              <el-option
                                 v-for="item in conditionStatusOption"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                              </el-option>
                           </el-select>
                        </template>
                     </el-table-column>

                     <el-table-column align="center"  width="80">
                        <template slot="header">
                           <i class="el-icon-circle-plus-outline"  @click="addRow('condition');"></i>
                        </template>
                        <template slot-scope="row">
                           <i class="el-icon-remove-outline" @click="delRow('condition', row.$index)"></i>
                        </template>
                     </el-table-column>
                  </el-table> 
                  <!-- <line-components text="用印文件"></line-components> -->
                  <!-- <el-row>
                     <el-col :span="12">
                        <el-form-item label="使用默认模板">
                           <el-input></el-input>
                        </el-form-item>
                     </el-col>

                     <el-col :span="12">
                        <el-form-item>
                           <el-button size="mini" type="primary">预览一下</el-button>
                        </el-form-item>
                     </el-col>
                  </el-row> -->


               </el-form>

               <!-- 组件 -->
               <el-dialog  append-to-body width="60%" :visible.sync="importDetailVisible">
                  <template slot="title">
                     <i class="el-icon-tickets"></i>&nbsp;<span>明细导入</span>
                  </template>
                  <imp-detail-components @get-excel-data="getExcelData" text="产品销售合同流程模板" @cancel="importDetailVisible=false"></imp-detail-components>
               </el-dialog>

               <el-dialog append-to-body width="60%" :visible.sync="checkDataVisible">
                  <template slot="title">
                     <i class="el-icon-timer"></i>&nbsp;<span>智能检查</span>
                  </template>
                  <check-data-components :props="checkProps"></check-data-components>
               </el-dialog>

               <el-dialog append-to-body width="60%" :visible.sync="counterpartyVisible">
                  <counterparty-components @row-click="getCounterparty" :visible="counterpartyVisible"></counterparty-components>
               </el-dialog>
               
               <el-dialog append-to-body title="选择部门" width="50%" top="5vh"  :visible.sync="visibleDeptSelect" >
                  <dept-tree :defaultExpandAll="true" @node-click="getDeptData"></dept-tree>
               </el-dialog>
               <el-dialog append-to-body title="选择成本中心" width="50%" top="5vh"  :visible.sync="visibleCbDeptSelect" >
                  <dept-tree :defaultExpandAll="true" @node-click="getCbDeptData"></dept-tree>
               </el-dialog>

               <el-dialog append-to-body title="人员选择" width="70%" top="5vh" :visible.sync="visibleUserSelect">
                  <user-select @confirm="getUserData" :isSingleUser="true"></user-select>
               </el-dialog>

            </div>
         </div>
      </div>
   </section>
</template>

<script>

import Vue from 'vue'
import util from '@/common/js/util';//全局公共库
import { mapGetters } from 'vuex'
import LineComponents from '../components/LineComponents'
import Contextmenu from "vue-contextmenujs"
import ImpDetailComponents from '../components/ImpDetailComponents';
import CheckDataComponents from '../components/CheckDataComponents';
import CounterpartyComponents from '../components/CounterpartyComponents';
import DeptTree from '@/views/mdp/sys/dept/DeptTree';
import UsersSelect from '@/views/mdp/sys/user/UsersSelect';
import { addContractDraft } from '@/api/oa/ht/contractDraft';
import {Decimal} from 'decimal.js';
import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
Vue.use(Contextmenu);

//金额正则
var amountReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
//正整数正则
var zheng = /^[1-9]\d*$/;


export default {
   
   computed: {
      ...mapGetters([
         'userInfo'
      ]),
   },

	props:['contractType','visible'],
   
   watch: {
      'contractType':function( contract ) {
      },

      'visible':function(visible) {
         if(visible==true){
            //从新打开页面时某些数据需要重新加载，可以在这里添加
            this.initData();
         }
      },

      proData: {
         handler:function(val, oldval) {
            val.forEach((v, index) => {
                v.productGrossAmount = Number(new Decimal(this.validateZheng(v.productNum) === null ? 0 : v.productNum).mul(new Decimal(this.validateAmount(v.productPrice) === null ? 0 : v.productPrice)));
            })
         },
         deep:true
      },

      thirdPartyData: {
         handler:function(val, oldval) {
            val.forEach((v, index) => {
               v.productGrossAmount = Number(new Decimal(this.validateZheng(v.productNum) === null ? 0 : v.productNum).mul(new Decimal(this.validateAmount(v.productPrice) === null ? 0 : v.productPrice)));
            })
         },
         deep:true
      },

   },
   
   data() {

      return {
         load: {add: false},
         addForm: {
				id:'',title:'',reqUserId:'',reqUserName:'',reqDeptId:'',reqDeptName:'',reqDate:'',htName:'',htParty:'',htPartyName:'',htSn:'',htBeginDate:'',htAmount:'',htImportantClause:'',htDemand:'',cpId:'',cpName:'',cpFddb:'',cpLevel:'',cpType:'',cpAddress:'',cpOpenBank:'',cpBankAccount:'',linkName:'',linkPhone:'',htParentType:'',htType:'',isUseMoban:'',fanbenId:'',status:'',cbCenterId:'',cbCenterName:''
			},
         //合同标的
         proData: [],  
         //成本数据
         cbData: [],
         //约定数据
         conditionData: [],
         //第三方采购数据
         thirdPartyData: [],
         //添加数据
         addFormRules: {
            title: [
					{ required: true, message: '标题不能为空', trigger: 'change' }
            ],

            cpName: [
               { required: true, message: '客户名称不能为空', trigger: 'change' }
            ],

            htPartyName: [
               { required: true, message: '签约主体不能为空', trigger: 'change' }
            ],

            linkPhone: [
               { required: true, message: '客户联系人电话不能为空', trigger: 'change' }
            ],
            cbCenterId:[
               { required: true, message: '成本中心不能为空', trigger: 'change' }
            ],
            htAmount:[
               { required: true, message: '合同总金额不能为空', trigger: 'change' }
            ]
         },
         
         conditionStatusOption:[
            {
               label: '初始',
               value: '0',
            },
            {
               label: '待收款',
               value: '1',
            },
            {
               label: '已收款',
               value: '2',
            }
         ],
         invoiceTypeOptions: [																																		
            {
               label: '增值税专业发票',
               value: '1',
            },
            {
               label: '增值税普通发票',
               value: '2',
            },
            {
               label: '其它',
               value: '3',
            }
         ],
         //是否第三方采购
         isThirdParty: "0",
         importDetailVisible: false,
         checkDataVisible: false,
         counterpartyVisible: false,
         visibleDeptSelect: false,
         visibleCbDeptSelect:false,
         visibleUserSelect: false,
         dicts:{
            costType:[ 
            ],
            productType:[ 
            ],
            amountType:[   
            ],
         }, 
         errorMsg: '',
         checkProps: [],
         defaultAddForm: {},
      }
   },
   
   methods: {

      addSubmit(type) {
         this.addForm.status = type;
         this.$refs.addForm.validate((valid) => {
            if (valid) {
               this.$confirm('确认提交吗？', '提示', {}).then(() => { 
                  this.load.add=true
                  let params = Object.assign({}, this.transferData(this.addForm));  
                  params.htTypeName=this.contractType.typeName
                  params.htType=this.contractType.typeId
                  params.htParentType=this.contractType.typeParentId
                  addContractDraft(params).then((res) => {
                     this.load.add=false
                     var tips=res.data.tips;
                     if(tips.isOk){
                        this.resetFields();
                        this.$emit('submit');//  @submit="afterAddSubmit"
                     }
                     this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
                  }).catch( err  => this.load.add=false);
               });
            }
			});
      },

      transferData(data) {
         let product = this.proData.concat(this.thirdPartyData);
         data.productList = product;
         data.cbList = this.cbData;
         data.conditionList = this.conditionData;
         return data;
      },

      onContextmenu(event) {
         this.$contextmenu({
            items: [
               { label: "提交", icon: "el-icon-circle-check"},
               { label: "导入明细", divided: true, icon: "el-icon-upload",
                  onClick: () => {
                     this.importDetailVisible = true;
                  }   
               },
               { label: "保存", icon: "el-icon-folder"},
               { label: "智能检查", icon: "el-icon-timer", 
                  onClick: () => {
                     //开始检查
                     this.smartCheck();
                  }
               },
               { label: "预览", icon: "el-icon-search"},
            ],
               event,
               customClass: "class-a",
               zIndex: 9999,
               minWidth: 230
         });
            return false;
      },

      //智能检查
      smartCheck() {
         this.checkDataVisible = true;
         let sfkIcon = 'el-icon-question';
         let zbjIcon = 'el-icon-question';

         this.conditionData.forEach(item => {
            if(item.conditionType === '1') {
               if(parseInt(this.conditionRatio) >= 30) {
                  sfkIcon = 'el-icon-success'
               }else {
                  sfkIcon = 'el-icon-error'
               }
            }
         })

         this.conditionData.forEach(item => {
            if(item.conditionType === '5') {
               if(parseInt(this.conditionRatio) >= 30) {
                  zbjIcon = 'el-icon-success'
               }else {
                  zbjIcon = 'el-icon-error'
               }
            }
         })

         this.checkProps = [
            {
               text: '是否采用标准合同范本',
               icon: 'el-icon-success'
            },
            {
               text: '产品价格是否低于公司限价',
               icon: 'el-icon-question'
            },

            {
               text: '首付款金额不能低于30%',
               icon: sfkIcon
            },
            {
               text: '质保金金额不能超过10%',
               icon: zbjIcon
            },
            {
               text: '开发人天不得超过总人天的30%',
               icon: 'el-icon-success'
            }
         ]
      },

      addRow(type) {
         switch(type) {
            case 'pro':
               this.proData.push(
                  {
                     productName : '',
                     productSpec : '',
                     productMeasUnit : '',
                     productPrice: '',
                     productNum : '',
                     productGrossAmount: '',
                     isThirdParty: '0',
                  }
               )
            break;
            case 'thirdParty' :
               this.thirdPartyData.push(
                  {
                     productName : '',
                     productType : '',
                     productSpec : '',
                     productMeasUnit : '',
                     productPrice: '',
                     productNum : '',
                     productGrossAmount: '',
                     isThirdParty: '1',
                  }
               )
            break;
            case 'cb' :
               this.cbData.push({
                  cbType: '',
                  cbMandayAmount: '',
               })
            break;
            case 'condition':
               var dct="";
						if(this.addForm.htParentType=='1'){
							dct="1"
						}else{
							dct="0"
						}
					this.conditionData.push(
						{  
							conditionType: '1',
							conditionTiaoJian: '',
							conditionRatio: '50',
							conditionAmount: '',
							conditionRemark: '',
							conditionStatus:'0',
							dct:dct
						}
					)
            break;
         }
      },

      delRow(type, index) {
         switch(type) {
            case 'pro':
               this.proData.splice(index, 1);
            break;
            case 'thirdParty' :
               this.thirdPartyData.splice(index, 1);
            break;
            case 'cb' :
               this.cbData.splice(index, 1);
            break;
            case 'condition':
               this.conditionData.splice(index, 1);
            break;
         }
      },

      getExcelData(data) {
         this.importDetailVisible = false;
         data.forEach((element, index) => {

            if(index === 0) {
               element.forEach(e => {
                  
                  let flag = this.dicts.amountType.some(item => {
                     return item.name=== e.款项类别;
                  })

                 
                  if(!flag) {
                     this.errorMsg += this.isNull(this.errorMsg) ? "," : "";
                     this.errorMsg = "付款约定第" +  (index + 1) + "行出错,已自动去除该行。";
                     return;
                  }
                  
                  if(flag) this.dicts.amountType.forEach(item => {if(item.name=== e.款项类别) e.款项类别 === item.id});

                  this.conditionData.push(
                     {
                        conditionType: e.款项类别,
                        conditionTiaoJian: e.付款条件,
                        conditionRatio:  e.付款比例,
                        conditionAmount: this.validateAmount(e.付款金额),
                        conditionRemark: e.备注,
                     }
                  )
               })
            }

            if(index === 1) {
               element.forEach(e => {
                  //校验数据
                  this.proData.push (
                     {
                        productName : e.产品名称,
                        productSpec : e.规格型号,
                        productMeasUnit : e.单位,
                        productPrice: this.validateAmount(e.单价),
                        productNum : this.validateZheng(e.数量),
                        productGrossAmount: '',
                        isThirdParty: '0',
                     }
                  )
               })
            }

            if(index === 2) {
               element.forEach((e,index) => {
                  let flag = this.dicts.costType.some(item => {
                     return item.name=== e.成本类型;
                  })

                  if(!flag) {
                     this.errorMsg += this.isNull(this.errorMsg) ? "," : "";
                     this.errorMsg += "成本预估第" + (index + 1) + "行出错,已自动去除该行。";
                     return;
                  }

                  if(flag) this.dicts.costType.forEach(item => {if(item.name=== e.成本类型) e.成本类型 === item.id});
                  
                  this.cbData.push({
                     cbType: e.成本类型,
                     cbMandayAmount: this.validateAmount(e.人天估算),
                  })

               })
            }

            if(index === 3) {
               this.isThirdParty = "1";
               element.forEach(e => {
                  this.thirdPartyData.push({
                     productName : e.产品名称,
                     productType : e.产品类型,
                     productSpec : e.规格型号,
                     productMeasUnit : e.单位,
                     productPrice: this.validateAmount(e.单价),
                     productNum : this.validateZheng(e.数量),
                     productGrossAmount: '',
                     isThirdParty: '1',
                  })
               })
            }
         });

         if(!this.isNull(this.errorMsg)) {
            this.$alert(this.errorMsg, {
               confirmButtonText: '确定',
               callback: action => {
                  this.errorMsg = '';
               }
            });
         }

      },

      getCounterparty(data) {
         this.counterpartyVisible = false;
         this.addForm.cpId = data.cpId;
         this.addForm.cpName = data.cpName;
         this.addForm.cpFddb = data.cpFddb;
         this.addForm.cpLevel = data.cpLevel;
         this.addForm.cpType = data.cpType;
         this.addForm.cpAddress = data.cpAddress;
         this.addForm.cpOpenBank = data.cpOpenBank;
         this.addForm.cpBankAccount = data.cpBankAccount;
         this.addForm.linkName = data.linkmanList[0].linkName;
         this.addForm.linkPhone = data.linkmanList[0].linkPhone;
      },

      getDeptData(data) {
         this.visibleDeptSelect = false;
         this.addForm.reqDeptId = data.deptid;
         this.addForm.reqDeptName = data.deptName;
      },  
      getCbDeptData(data) {
         this.visibleCbDeptSelect = false;
         this.addForm.cbCenterId = data.deptid;
         this.addForm.cbCenterName = data.deptName;
         this.$refs['addForm'].validateField('cbCenterId');
      },

      getUserData(data) {
         this.visibleUserSelect = false;
         this.addForm.reqUserId = data[0].userid;
         this.addForm.reqUserName = data[0].username;
      },


      //计算总价
      getProDataSummaries(param) {
         const { columns, data } = param;
         const sums = [];
         columns.forEach((column, index) => {

            if (index === 0) {
               sums[index] = '总价';
               return;
            }

            if (index === 5) {
               let total = new Decimal(0);
               data.forEach(p => {
                  if(this.isNull(p.productNum)) {
                     p.productNum = 0;
                  }
                  total = total.plus(p.productNum);
               })
               sums[index] = Number(total);
               return;
            }

            if (index === 6) {
               let gross = new Decimal(0);
               data.forEach(p => {
                  gross = gross.plus(new Decimal(p.productNum).mul(new Decimal(p.productPrice)));
               })
               sums[index] = Number(gross);
               return;
            }
            
         });
         return sums;
      },
      
      getThirdPartySummaries(param) {
         const { columns, data } = param;
         const sums = [];
         columns.forEach((column, index) => {
            if (index === 0) {
               sums[index] = '总价';
               return;
            }
            if (index === 6) {
               let total = new Decimal(0);
               data.forEach(p => {
                  if(this.isNull(p.productNum)) {
                     p.productNum = 0;
                  }
                  total = total.plus(p.productNum);
               })
               sums[index] = Number(total);
               return;
            }

            if (index === 7) {
               let gross = new Decimal(0);
               data.forEach(p => {
                  gross = gross.plus(new Decimal(p.productNum).mul(new Decimal(p.productPrice)));
               })
               sums[index] = Number(gross);
               return;
            }
         })
         return sums;
      },

      amountCheck() {
         this.addForm.htAmount = this.validateAmount(this.addForm.htAmount);
      },
      
      validateAmount(value) {
        if(this.isNull(value)) {return null;}
        if(amountReg.test(value)) {
           return value;
        }else {
           return null;
        }
      },

      //验证整数
      validateZheng(value) {
         if(this.isNull(value)) return null;
         if(zheng.test(value)) {
            return value;
         }else {
            return null;
         }
      },

      initData() {
         //设置起草合同所属合同分类类型
         this.addForm.htParentType = this.contractType.typeParentId;
         this.addForm.htType = this.contractType.typeId;
         //设置标题
         this.addForm.title = '产品销售合同-' + this.userInfo.username + "-" + util.formatDate(new Date(), 'yyyy-MM-dd');
         //设置合同名称
         this.addForm.htName = '销售合同';

         //设置默认合同编号 合同类型+年月日
         this.addForm.htSn = "XSHT" + util.formatDate(new Date(), "yyyyMMddHHmmss");

        //设置当前人为默认申请人和部门
         this.addForm.reqUserId = this.userInfo.userid;
         this.addForm.reqUserName = this.userInfo.username;
         this.addForm.reqDeptId = this.userInfo.deptid;
         this.addForm.reqDeptName = this.userInfo.deptName;
         //设置申请日期
         this.addForm.reqDate =  new Date().getTime();
         //签约主体设置为当前机构
         this.addForm.htParty = this.userInfo.branchId;
         this.addForm.htPartyName = this.userInfo.branchName;
      },

      isNull(data) {
         if(data === null || data === '' || data === undefined) {
            return true;
         }
         return false;
      },

      cancel() {
         this.resetFields();
         this.$emit('cancel');
      },

      //清空表单数据 + 表格数据
      resetFields() {
         this.isThirdParty = "0";
         this.addForm = JSON.parse(JSON.stringify(this.defaultAddForm));
         this.proData = [];
         this.conditionData = [];
         this.cbData = [];
         this.thirdPartyData = [];
      },
   },
   
   components: {  
      'line-components': LineComponents,
      'imp-detail-components' : ImpDetailComponents,
      'check-data-components' : CheckDataComponents,
      'counterparty-components' : CounterpartyComponents,
      'dept-tree' : DeptTree,
      'user-select' : UsersSelect,
   },

   mounted() {
      initSimpleDicts('all',['costType','amountType','productType']).then(res=>this.dicts=res.data.data); 
      this.defaultAddForm = JSON.parse(JSON.stringify(this.addForm));
      this.initData();
   }

}

</script>

<style scoped>

html, body{overflow:hidden}

ul {
    margin: 0;
    padding: 0;
}

ul li {
    margin: 0;
    padding: 0;
    list-style: none;
}

div::-webkit-scrollbar{
  width:10px;
  height:10px;
}
div::-webkit-scrollbar-track{
  background: rgb(239, 239, 239);
  border-radius:2px;
}
div::-webkit-scrollbar-thumb{
  background: #bfbfbf;
  border-radius:10px;
}
div::-webkit-scrollbar-thumb:hover{
  background: #333;
}
div::-webkit-scrollbar-corner{
  background: #179a16;
}

.line {
	background: #F7F7F7;
	height:30px;
	margin: 30px 0 30px 0;
}

.line :span {
	line-height: 30px;
	margin-left: 15px;
	color: #3c5c4c;
}

.line :span::before {
	content: " ";
	border: 2px solid #088;   
	opacity: 0.5;
	margin-right: 5px;
}

.continer {
   width: 100%;
   height: 100%;
   overflow: hidden;
   background-color: #f3f3f3;
}

.header {
   height: 70px;
   background-color: white;
   border-bottom: 1px solid rgb(241, 241, 241);
   position: relative;
}

.header .left {
   height: 100%;
   width: 50px;
   margin-left: 20px;
   float: left;
}

.header .left i {
   width: 100%;
   text-align: center;
   line-height: 70px;
   font-size: 34px;
}

.header .center {
   float: left;
   height: 100%;
   margin-left: 10px;
}

.header .center .title {
   margin-top: 17px;
}

.header .center .list {
   position: absolute;
   bottom: 5px;
}

.header .center .list li {
   display: inline-block;
   margin-right: 40px;
}

.header .right {
   float: right;
   margin-right: 20px;
   height: 100%;
}

.header .right .btn {
   line-height: 70px;
}


.nav {
   height: 100%;
   background-color: white;
   overflow-y: auto;
   margin: 0 auto;
   padding: 0 60px;
   padding-bottom: 200px;
}

.nav .title {
   height: 80px;
   border-bottom: 1px solid #dadcde;
}

.nav h1 {
   text-align: center;
   font-size: 19px;
   font-weight: normal;
   line-height: 80px;
}

.nav .content {
   padding: 0 40px;
}

.el-icon-circle-plus-outline, .el-icon-remove-outline {
	font-size: 18px;
	cursor: pointer;
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


</style>

<style>

.nav .content .el-form-item__label {
   font-size: 14px;
   font-weight: normal;
}

</style>