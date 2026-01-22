<template>
	<section>
		<el-row class="page-container border padding" v-if="(opType=='edit' && editVisible==true) || opType=='add'">

			<el-row>
				<div>
					<el-button v-if="opType=='edit'" size="small" @click="editVisible=false">取消编辑</el-button>
					<el-button type="primary" size="small" @click="addSubmit('0')">暂存</el-button>
					<el-button type="primary" size="small" @click="addSubmit('1')">提交</el-button>
				</div>
    			<el-divider content-position="center">资产采购</el-divider>
			</el-row>
			<!--新增界面 PurRequire pur_require-->
			<el-form :model="addForm" size="small"  label-width="100px" :rules="addFormRules" ref="addForm">
				<el-row>
					<el-form-item label="标题" prop="purTitle">
						<el-input v-model="addForm.purTitle" placeholder="请输入标题" ></el-input>
					</el-form-item>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="类别">
							<el-input disabled placeholder="资产采购单"></el-input>
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
						<el-form-item label="申请人" prop="purUsername">
							<el-input readonly v-model="addForm.purUsername"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item  label="申请日期">
							<el-date-picker
								readonly
								type="date"
								v-model="addForm.purDate"
								value-format="yyyy-MM-dd HH:mm:ss"
								placeholder="选择日期">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-divider content-position="center">采购单明细</el-divider>
				</el-row>


				<el-row>
					<el-button @click="visibleAssetSelect=true">从资产库中快速选择</el-button>
					<el-button @click="requireDetailMngVisible=true">从申购单中快速选择</el-button>
				</el-row>
				 <el-table border show-summary :summary-method="getSummaries" size="small" :data="detailData" stripe>
					<el-table-column
						label="序号"
						type="index"
						width="50">
					</el-table-column>

					<el-table-column  align="center" label="资产名称" width="160">
						<template slot-scope="scope">
							<span class="vTip">*</span>
							<el-input @blur="validateParam(scope.row, 'assetName')"  size="mini" v-model="scope.row.assetName"> </el-input>
							<div v-show="scope.row.validate.assetNameShow">
								<i class="el-icon-warning"></i>
								<span class="tipMsg">{{scope.row.validate.assetNameMsg}}</span>
							</div>
						</template>
					</el-table-column>

					<el-table-column align="center" label="规格型号" width="160" >
						<template slot-scope="scope">
							<span class="vTip">*</span>
							<el-input @blur="validateParam(scope.row, 'spec')"  size="mini" v-model="scope.row.spec"> </el-input>
							<div v-show="scope.row.validate.specShow">
								<i class="el-icon-warning"></i>
								<span class="tipMsg">{{scope.row.validate.specMsg}}</span>
							</div>
						</template>
					</el-table-column>

					<el-table-column align="center" label="单位" width="120">
						<template slot-scope="scope">
							<span class="vTip">*</span>
							<el-input @blur="validateParam(scope.row, 'measUnit')"  size="mini" v-model="scope.row.measUnit"> </el-input>
							<div v-show="scope.row.validate.measUnitShow">
								<i class="el-icon-warning"></i>
								<span class="tipMsg">{{scope.row.validate.measUnitMsg}}</span>
							</div>
						</template>
					</el-table-column>

					<el-table-column align="center" label="采购数量" width="155">
						<template slot-scope="scope">
							<span class="vTip">*</span>
							<el-input-number @change="validateParam(scope.row, 'stockNum')" @blur="validateParam(scope.row, 'stockNum')" size="mini" controls-position="right" @input="jiSuan(scope.row)"  v-model="scope.row.stockNum" :min="0" :step="1" ></el-input-number>
							<div v-show="scope.row.validate.stockNumShow">
								<i class="el-icon-warning"></i>
								<span class="tipMsg">{{scope.row.validate.stockNumMsg}}</span>
							</div>
						</template>
					</el-table-column>

					<el-table-column align="center" label="单价" width="155">
						<template slot-scope="scope">
							<span class="vTip">*</span>
							<el-input-number @change="validateParam(scope.row, 'orignUnitAmount')" @blur="validateParam(scope.row, 'orignUnitAmount')" size="mini" controls-position="right" @input="jiSuan(scope.row)"  v-model="scope.row.orignUnitAmount" :precision="2" :min="0" :step="1" ></el-input-number>
							<div v-show="scope.row.validate.orignUnitAmountShow">
								<i class="el-icon-warning"></i>
								<span class="tipMsg">{{scope.row.validate.orignUnitAmountMsg}}</span>
							</div>
						</template>
					</el-table-column>

					<el-table-column align="center" label="小计"  width="">
						<template slot-scope="scope">
							<el-input readonly  size="mini" v-model="scope.row.subtotal"> </el-input>
						</template>

					</el-table-column>

					<el-table-column align="center" label="采购人"  width="">
						<template slot-scope="scope">
							<el-input readonly @focus="openUserDialog(scope.$index)" size="mini" v-model="scope.row.purchaseUsername"> </el-input>
						</template>
					</el-table-column>

					<el-table-column align="center" label="供应商"  width="">
						<template slot-scope="scope">
							<el-input  readonly @focus="openSupplierDialog(scope.$index)" size="mini" v-model="scope.row.supplierName"> </el-input>
						</template>
					</el-table-column>

					<el-table-column align="center" label="采购日期" width="200">
						<template slot-scope="scope">
							<el-date-picker 
								v-model="scope.row.purchaseDate"
								type="date"
								size="mini"
								value-format="yyyy-MM-dd HH:mm:ss"
								placeholder="选择日期">
							</el-date-picker>
						</template>
					</el-table-column>

					<el-table-column align="center" label="备注"  width="">
						<template slot-scope="scope">
							<el-input   size="mini" v-model="scope.row.remark"> </el-input>
						</template>
					</el-table-column>

					<el-table-column align="center"  width="80">
						<template slot="header">
							<i class="el-icon-circle-plus-outline"  @click="addRow"></i>
						</template>

						 <template slot-scope="scope">
							 <i class="el-icon-remove-outline" @click="delRow(scope.$index)"></i>
						</template>
					</el-table-column>
				</el-table>

				<el-row style="margin-top: 20px" >
					<el-form-item label="采购事项" prop="purItems">
						<el-input type="textarea" v-model="addForm.purItems" :rows="4"></el-input>
					</el-form-item>
				</el-row>

				<el-row style="margin-top: 20px">
					<el-form-item label="上传附件">
						<attachment-upload :archiveId="uploadArchiveId" :categoryId="uploadCategoryId" :branchId="userInfo.branchId"></attachment-upload>
					</el-form-item>
				</el-row>

				<supplier-components :append-to-body="true" :visible="isOpenSupplier" @row-click="getSupplierData"></supplier-components>

				<el-dialog append-to-body title="人员选择" width="70%" top="5vh" :visible.sync="visibleUserSelect">
					<user-select @confirm="getUserData" :isSingleUser="true" :isSelectByDept="true"></user-select>
				</el-dialog>

			</el-form>
		</el-row>
		
		<el-row class="page-container border padding" v-else>
			
			
			<el-row>
				<div>
					<el-button size="small" @click="editVisible=true">编辑</el-button> 
					<el-button  size="small" v-print="'#printArea'">打印</el-button>

				</div>
    			
			</el-row>
			<el-row id="printArea"> 
				<el-divider content-position="center">资产申购</el-divider>
			 <table class="tab">
                <tbody>
                    <tr>
                        <td colspan="1" class="tl">标题</td>
                        <td colspan="3">{{order.purTitle}}</td>
                    </tr>

                    <tr>
                        <td class="tl">类别</td>
                        <td>资产采购单</td>
                        <td class="tl">编号</td>
                        <td>{{order.id}}</td>
                    </tr>

                    <tr>
                        <td class="tl">申请人</td>
                        <td >{{order.purUsername}}</td>
						<td class="tl">申请日期</td>
                        <td >{{order.purDate}}</td>
                    </tr>

                    <tr>
                        <td colspan="4">
                            <el-table border show-summary :summary-method="getSummaries" size="small" :data="detailData" stripe>
								<el-table-column
									label="序号"
									type="index"
									width="50">
								</el-table-column>
							
								<el-table-column  align="center" prop="assetName" label="资产名称" width="200">
								</el-table-column>

								<el-table-column align="center" label="规格型号" prop="spec" width="" >
								</el-table-column>

								<el-table-column align="center" label="单位" prop="measUnit" width="">
								</el-table-column>

								<el-table-column align="center" label="采购数量" prop="stockNum" width="155">
								</el-table-column>

								<el-table-column align="center" label="单价" prop="orignUnitAmount" width="155">
								</el-table-column>

								<el-table-column align="center" label="小计" prop="subtotal"  width="">
								</el-table-column>

								<el-table-column align="center" label="采购人" prop="purchaseUsername"  width="250">
								</el-table-column>

								<el-table-column align="center" label="供应商" prop="supplierName" width="">
								</el-table-column>

								<el-table-column align="center" label="采购日期" prop="purchaseDate" width="200">
								</el-table-column>

								<el-table-column align="center" label="备注" prop="remark"  width="">
								</el-table-column>
								
							</el-table>
                        </td>
                    </tr>

                    <tr>
                        <td colspan="1" class="tl">采购事项</td>
                        <td colspan="3">{{order.purItems}}</td>
                    </tr>

                     <tr>
                        <td colspan="1" class="tl">附件</td>
                        <td colspan="3">
							<attachment-upload :isDisabled="true" :eliminate="eliminate"  :archiveId="uploadArchiveId" :categoryId="uploadCategoryId" :branchId="userInfo.branchId"></attachment-upload>
                        </td>
                    </tr>
                </tbody>
            </table>
			
			</el-row>

		</el-row>
		
		
		
         <el-dialog top="10vh" title="选择资产" append-to-body width="60%" :visible.sync="visibleAssetSelect"  :close-on-click-modal="false">
			<asset-detail-components   @confirm="onAssetDetailSelected" ref="assetDetail" :visible="visibleAssetSelect" @cancel="visibleAssetSelect=false" ></asset-detail-components>
		</el-dialog>
		
         <el-dialog top="10vh" title="选择申购物资" append-to-body width="60%" :visible.sync="requireDetailMngVisible"  :close-on-click-modal="false">
			<require-detail-mng is-select=true  @confirm="onRequireDetailSelected" ref="requireDetailMng" :visible="requireDetailMngVisible" @cancel="requireDetailMngVisible=false" ></require-detail-mng>
		</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { addOrder,editOrder } from '@/api/oa/erp/pur/order';
	import { mapGetters } from 'vuex'
	import AttachmentUpload from '@/views/mdp/arc/archiveAttachment/AttachmentUpload';
	import {Decimal} from 'decimal.js';
	import moneyTransToChinese from '@/utils/moneyTransToChinese';
	import SupplierComponents from '../components/SupplierComponents';
	import UsersSelect from '@/views/mdp/sys/user/UsersSelect'
	import {sn} from '@/common/js/sequence'; //id生成器
  import config from "@/common/config"; //全局公共库
  
	import { listOrderDetail } from '@/api/oa/erp/pur/orderDetail';	
	import AssetDetailComponents from '../../ass/components/AssetDetailComponents';
	import RequireDetailMng from '../requireDetail/RequireDetailMng'; 

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo'
			]),

		},

		props:['order','visible','opType'],
		watch: {
	      'order':function( order ) {
			this.addForm = order;
		  },

	      'visible':function(visible) {
	      	if(visible==true){
				//从新打开页面时某些数据需要重新加载，可以在这里添加
				this.setDefaultParam();
	      	}
	      }
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					purTitle: [
						{ required: true, message: '申购标题不能为空', trigger: 'change' },
					],

					assetName: [
						{ required: true, message: '资产名称必须填写', trigger: 'change' },
					]
				},
				//新增界面数据 pur_require
				addForm: {
					//申购标题
					purTitle: '',
					//申请人id
					purUserid: '',
					//申请人名称
					purUsername: '',
					//申请人部门id
					purDeptid: '',
					//申请人部门名称
					purDeptName: '',
					//申请人机构编号
					purBranchId: '',
					//申请人机构名称
					purBranchName: '',
					//申购日期
					purDate: new Date(),
					//申购事由
					purItems: '',
					orderStatus: '',
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				//资产明细表格数据
				detailData: [],
				//当前行数
				currentRow: 0,

				//是否开启供应商选择页面
				isOpenSupplier: false,
				visibleUserSelect: false,
				//上传必要参数
				uploadArchiveId: '',
				uploadCategoryId: '',
				editVisible:false,
				visibleAssetSelect:false,
				defaultRow: {
					//资产名称
					assetName: '',
					//规格型号
					spec:'',
					//计量单位
					measUnit: '',
					//申购数量
					stockNum: 0,
					//资产原值
					orignUnitAmount: 0,
					//小计
					subtotal: 0,
					//采购日期
					purchaseDate: '',
					//供应商名称
					supplierName: '',
					supplierId: '',
					//采购人名称
					purchaseUsername: '',
					purchaseUserid: '',
					//备注
					remark: '',
					validate: {
						//detail验证
						assetNameShow: false,
						assetNameMsg: "资产名称不能为空",
						specShow: false,
						specMsg: "规格型号不能为空",
						measUnitShow: false,
						measUnitMsg: "单位不能为空",
						stockNumShow: false,
						stockNumMsg: "采购数量不能为0",
						orignUnitAmountShow: false,
						orignUnitAmountMsg: "预估单价不能为空",
					}
				},
				requireDetailMngVisible:false,
				detailLinks:[/**{orderDetailId:'',requireDetailId:}**/]

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交PurRequire pur_require 父组件监听@submit="afterAddSubmit"
			addSubmit: function (status) {
				this.addForm.orderStatus = '0';
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						let flag = this.validateDetailData();
						if(!flag) return;
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.add=true
							//明细数据校验 
							let params = Object.assign({}, this.transfreData(this.addForm));
							var func=addOrder;
							if(this.opType=='edit'){
								func=editOrder
							}
							func(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.detailData = [];
									this.$emit('submit');//  @submit="afterAddSubmit"
                  if(status=='1'){
                    this.sendToProcessApprova(res.data.data,"erp_order_add_approva");
                  }
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},

			//点击按钮关闭dialog
			cancel() {
				this.$refs['addForm'].resetFields();
				this.detailData = [];
				this.$emit('submit');
			},

			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			transfreData(data) { 
				var detailLinks=this.detailLinks.filter(i=>this.detailData.some(k=>k.id==i.orderDetailId))
				let param = {
					order: data,
					orderDetailList: this.detailData,
					detailLinks:detailLinks,
				};
				return param;
			},

			//资产明细添加一行
			addRow() {
				let p={...this.defaultRow} 
				this.detailData.push(p);
			},

			delRow(index) {
				this.detailData.splice(index, 1);
			},

			//校验明细数据
			validateDetailData() {
				if(this.detailData.length <= 0) {
					this.$message.error("申购明细不能为空");
					return false;
				}

				this.detailData.forEach((d, index) => {
					this.validateParam(d, "assetName");
					this.validateParam(d, "spec");
					this.validateParam(d, "measUnit");
					this.validateParam(d, "stockNum");
					this.validateParam(d, "orignUnitAmount");
				})

				//验证是否完成
				let flag = "true";
				this.detailData.forEach (d => {
					if(d.validate.assetNameShow) {
						flag = false;
						return flag;
					}
					if(d.validate.specShow) {
						flag = false;
						return flag;
					}
					if(d.validate.measUnitShow) {
						flag = false;
						return flag;
					}

					if(d.validate.stockNumShow) {
						flag = false;
						return flag;
					}

					if(d.validate.orignUnitAmountShow) {
						flag = false;
						return flag;
					}
				})

				if(!flag) {
					return false;
				}
				return true;
			},

			//设置默认参数
			setDefaultParam() {
				if(this.opType=='add'){
					let user = this.userInfo;
					this.addForm.purUserid = user.userid;
					this.addForm.purUsername = user.username;
					this.addForm.purDeptid = user.deptid;
					this.addForm.purDeptName = user.deptName;
					this.addForm.purDate = util.formatDate(new Date(),'yyyy-MM-dd HH:mm:ss');
					this.addForm.id = sn();
				}
				if(this.opType=='edit'){
					this.getDetailData();
				}
				
				this.uploadArchiveId = this.addForm.id;
				this.uploadCategoryId = 'order_upload';
			},
 

			jiSuan(row) {
				var stockNum=row.stockNum
				stockNum=stockNum?stockNum:0
				var orignUnitAmount=row.orignUnitAmount
				orignUnitAmount=orignUnitAmount?orignUnitAmount:0
				row.subtotal = Number(new Decimal(stockNum)
						.mul(new Decimal(orignUnitAmount)));
			},

			validateParam(data, position) { 
				switch(position) {
					case 'assetName' :
						this.isNull(data.assetName) ? data.validate.assetNameShow = true : data.validate.assetNameShow = false;
					break;
					case 'spec' :
						this.isNull(data.spec) ? data.validate.specShow = true : data.validate.specShow = false;
					break;
					case 'measUnit' :
						this.isNull(data.measUnit) ? data.validate.measUnitShow = true : data.validate.measUnitShow = false;
					break;
					case 'stockNum' :
						this.isNull(data.stockNum) || data.stockNum === 0 ? data.validate.stockNumShow = true : data.validate.stockNumShow = false;
					break;
					case 'orignUnitAmount' :
						this.isNull(data.orignUnitAmount) ? data.validate.orignUnitAmountShow = true : data.validate.orignUnitAmountShow = false;
					break;
				}
			},

			isNull(data) {
				if(data === null || data === '' || data === undefined) {
					return true;
				}
				return false;
			},

			//重写总计方法
            getSummaries(param) {
                const {
                    columns,
                    data
                } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '总价';
                        return;
                    }

                    if (index === 4) {
                        let amount = new Decimal(0);
                        param.data.forEach(p => {
                            amount = amount.plus(p.stockNum?p.stockNum:0);
                        })
                        sums[index] = Number(amount);
                        return;
					}

					if (index === 5) {
                        let amount = new Decimal(0);
                        param.data.forEach(p => {
                            amount = amount.plus(p.orignUnitAmount?p.orignUnitAmount:0);
                        })
                        sums[index] = Number(amount);
                        return;
					}

					if (index === 6) {
                        let amount = new Decimal(0);
                        param.data.forEach(p => {
                            amount = amount.plus(p.subtotal?p.subtotal:0);
                        })
						sums[index] = this.format(Number(amount)) + "元";
                        return;
					}

					if (index === 7) {
						let amount = new Decimal(0);
                        param.data.forEach(p => {
                            amount = amount.plus(p.subtotal?p.subtotal:0);
						})
						if(Number(amount) === null || Number(amount) === '' || Number(amount) === 0) {
							sums[index] = '零元'
						}else {
							sums[index] = moneyTransToChinese.transToChinese(amount);
						}
                        return;
					}

                });
                return sums;
			},

			format(num) {
                return num.toString().replace(/\d+/, function (n) {
                    // 先提取整数部分
                    return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
                        // 对整数部分添加分隔符
                        return $1 + ",";
                    });
                });
			},

			openSupplierDialog(index) {
				this.currentRow = index;
				this.isOpenSupplier = true;
			},

			getSupplierData(data) {
				this.detailData[this.currentRow].supplierName = data.cpName;
				this.detailData[this.currentRow].supplierId = data.cpId;
				this.isOpenSupplier = false;
			},

			openUserDialog(index) {
				this.currentRow = index;
				this.visibleUserSelect = true;
			},


			getUserData(data) {
				this.detailData[this.currentRow].purchaseUsername = data[0].username;
				this.detailData[this.currentRow].purchaseUserid = data[0].userid
				this.visibleUserSelect = false;
			},

      sendToProcessApprova:function(row,bizKey){
        let extVars={purOrderId:row.order.id}
        let jsonExtVars=JSON.stringify(extVars);

        var currDomain=window.location.protocol+"//"+window.location.host;
        var fullPath=this.$route.fullPath;
        var bizUrl=currDomain+'/'+process.env.CONTEXT+'/'+process.env.VERSION+'/#'+fullPath+'?extVars='+jsonExtVars

        var titleNames=row.order.purUsername
        var mainTitle=''
        var mainContext=''
        if(bizKey=='erp_order_add_approva'){
          mainTitle='关于【'+titleNames+"申购资产"+row.order.purTitle+"】的审批"
          mainContext=mainTitle+',采购事项：'+row.order.purItems+",申请时间："+row.order.purDate+",申请部门："+row.order.purDeptName;
        }else{
          this.$message.error("暂不支持的业务审批");
          return;
        }

        let params={
          mainContext:mainContext,
          mainTitle:mainTitle,
          bizKey:bizKey,
          bizUrl:bizUrl,
          restUrl:config.getOaBasePath()+"/erp/pur/order/processApprova",
          //restUrl:"http://localhost:7078"+"/erp/pur/order/processApprova",
          extVars:extVars,
          flowVars:{
            subscribeTaskEvent:'TASK_COMPLETED,TASK_CREATED',
            purOrderId:row.order.id,
            branchId:row.order.purBranchId
          },
        }
        let jsonParmas=encodeURIComponent(JSON.stringify(params));//对方要 decodeURICompassetNament
        this.$router.push({path:'/mdp/workflow/re/procdef/ProcdefListForBizStart',query:{params:jsonParmas}});
      },
			/**end 在上面加自定义方法**/
		getDetailData() {
				let params = {
					purOrderId: this.addForm.id
				};
				//查询申购单明细
				listOrderDetail(params).then((res) => {
					var tips=res.data.tips; 
					if(tips.isOk){
						res.data.data.forEach(i => {
							i.validate={}
							 this.jiSuan(i)
						});
						this.detailData = res.data.data;
					}
				}).catch();
			},
			//获得资产卡片数据
            onAssetDetailSelected(datas) { 
				var selectRows=datas.filter(i=>!this.detailData.some(k=>k.assetSn==i.assetSn))
				if(selectRows.length<=0){
					this.$message.error("采购明细清单中已存在该资产");
					return;
				}
				
				selectRows.forEach(i=>{
					let p={...this.defaultRow}
					var params=Object.assign(p,i)  
					this.detailData.push(params);
				}) 
				this.visibleAssetSelect=false
                
            },
			getKey(i){
				var key="key_"+i.brandId+"_"+i.brandName+"_"+i.assetName+"_"+i.spec;
				return key;
			},
			//获得申购物资数据
            onRequireDetailSelected(datas) {  
				if(datas.some(i=>i.purOrderId)){
					this.$message.error("请选择未加入过采购清单的申购物资");
					return;
				} 
				var selectRows=[...datas]; 
				
				selectRows.forEach(i=>{
					let p={...this.defaultRow}
					var params=Object.assign(p,i)  
					if(i.assetSn){
						if(this.detailData.some(k=>k.assetSn==i.assetSn)){
							var detail=this.detailData.find(k=>k.assetSn==i.assetSn)
							detail.stockNum=parseInt(detail.stockNum)+parseInt(i.stockNum)
							this.jiSuan(detail) 
							if(!this.detailLinks.some(k=>k.orderDetailId==detail.id && k.requireDetailId==i.id)){
								this.detailLinks.push({orderDetailId:detail.id,requireDetailId:i.id})
							}
						}else{
							params.id=sn()
							this.jiSuan(params)
							this.detailData.push(params);
							this.detailLinks.push({orderDetailId:params.id,requireDetailId:i.id})

						}
					}else{
						var key=this.getKey(i);
						if(this.detailData.some(k=>this.getKey(k)==key)){
							var detail=this.detailData.find(k=>this.getKey(k)==key)
							detail.stockNum=parseInt(detail.stockNum)+parseInt(i.stockNum)
							this.jiSuan(detail)
							if(!this.detailLinks.some(k=>k.orderDetailId==detail.id && k.requireDetailId==i.id)){
								this.detailLinks.push({orderDetailId:detail.id,requireDetailId:i.id})
							}
						}else{
							params.id=sn()
							this.jiSuan(params)
							this.detailData.push(params);
							this.detailLinks.push({orderDetailId:params.id,requireDetailId:i.id})
						}

					}  
				}) 
 				this.requireDetailMngVisible=false
                
            },
			
		},//end method
		components: {
			//在下面添加其它组件 'pur-require-edit':PurRequireEdit
			'attachment-upload': AttachmentUpload,
			'supplier-components': SupplierComponents,
			'user-select' : UsersSelect,
			AssetDetailComponents,
			RequireDetailMng,
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.order);
			this.setDefaultParam();
		}//end mounted
	}

</script>

<style scoped>

.app-container .el-dialog__body {
	padding-top:2px;
}

/* .app-container .el-form-item__label {
	font-weight: normal;
} */

.el-icon-circle-plus-outline, .el-icon-remove-outline {
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

table,th,td{
	border:1px solid rgb(159, 159, 159);
}

table{
	width:100%;
}

.tab{
    border-collapse:collapse;
}

.tab tr td{
    text-align: left;
    line-height: 26px;
    padding: 4px;
}

.tab .tl {
    background: rgb(246, 246, 246);
}
</style>
