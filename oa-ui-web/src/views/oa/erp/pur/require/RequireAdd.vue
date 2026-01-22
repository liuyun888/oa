<template>
	<section>
		<el-row class="page-container border padding" v-if=" (opType=='edit' && editVisible==true) || opType=='add'">

			<el-row>
				<div>
					<el-button size="small" v-if="editVisible==true" @click="editVisible=false">取消编辑</el-button>
					<el-button type="primary" size="small" @click="addSubmit(false)">保存</el-button>
					<el-button type="primary" size="small" @click="addSubmit(true)">提交</el-button>
				</div>
    			<el-divider content-position="center">资产申购</el-divider>
			</el-row>


			<!--新增界面 PurRequire pur_require-->
			<el-form :model="addForm" size="small"  label-width="100px" :rules="addFormRules" ref="addForm">
				<el-row>
					<el-form-item label="标题" prop="reqTitle">
						<el-input v-model="addForm.reqTitle" placeholder="请输入标题" ></el-input>
					</el-form-item>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="类别">
							<el-input disabled placeholder="资产申购单"></el-input>
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
						<el-form-item label="申请人" prop="reqUsername">
							<el-input readonly v-model="addForm.reqUsername"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="申请部门" prop="reqDeptName">
							<el-input readonly v-model="addForm.reqDeptName"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="申请日期">
							<el-date-picker
								type="date"
								value-format="yyyy-MM-dd HH:mm:ss"
								v-model="addForm.reqDate"
								placeholder="选择日期">
							</el-date-picker>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="是否计划内">
							<el-radio v-model="addForm.isPlan" label="1">是</el-radio>
							<el-radio v-model="addForm.isPlan" label="0">否</el-radio>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-divider content-position="center">申购明细</el-divider>
				</el-row>
				<el-row><el-button @click="visibleAssetSelect=true">从资产库中选择</el-button></el-row>
				 <el-table border show-summary :summary-method="getSummaries" size="small" :data="detailData" stripe>
					<el-table-column
						label="序号"
						type="index"
						width="50">
					</el-table-column>

					<el-table-column  align="center" label="资产名称" width="">
						<template slot-scope="scope">
							<span class="vTip">*</span>
							<el-input @blur="validateParam(scope.row, 'assetName')"  size="mini" v-model="scope.row.assetName"> </el-input>
							<div v-show="scope.row.validate.assetNameShow">
								<i class="el-icon-warning"></i>
								<span class="tipMsg">{{scope.row.validate.assetNameMsg}}</span>
							</div>
						</template>
					</el-table-column>

					<el-table-column align="center" label="规格型号" width="" >
						<template slot-scope="scope">
							<el-input  size="mini" v-model="scope.row.spec"> </el-input>
						</template>
					</el-table-column>

					<el-table-column align="center" label="单位" width="">
						<template slot-scope="scope">
							<el-input  size="mini" v-model="scope.row.measUnit"> </el-input>
						</template>
					</el-table-column>

					<el-table-column align="center" label="申购数量" >
						<template slot-scope="scope">
							<span class="vTip">*</span>
							<el-input-number @change="validateParam(scope.row, 'stockNum')" @blur="validateParam(scope.row, 'stockNum')" size="mini" controls-position="right" @input="jiSuan(scope.row)"  v-model="scope.row.stockNum" :min="0" :step="1" ></el-input-number>
							<div v-show="scope.row.validate.stockNumShow">
								<i class="el-icon-warning"></i>
								<span class="tipMsg">{{scope.row.validate.stockNumMsg}}</span>
							</div>
						</template>
					</el-table-column>

					<el-table-column align="center" label="预估单价" >
						<template slot-scope="scope">
							<span class="vTip">*</span>
							<el-input-number @change="validateParam(scope.row, 'estimatePrice')"  size="mini" controls-position="right" @input="jiSuan(scope.row)"  v-model="scope.row.estimatePrice" :precision="2" :min="0" :step="1" ></el-input-number>
							<div v-show="scope.row.validate.estimatePriceShow">
								<i class="el-icon-warning"></i>
								<span class="tipMsg">{{scope.row.validate.estimatePriceMsg}}</span>
							</div>
						</template>
					</el-table-column>

					<el-table-column align="center" label="小计"  width="">
						<template slot-scope="scope">
							<el-input readonly  size="mini" v-model="scope.row.subtotal"> </el-input>
						</template>
					</el-table-column>

					<el-table-column align="center" label="建议到货日期" width="280">
						<template slot-scope="scope">
							<el-date-picker 
								v-model="scope.row.suggestArrivalDate"
								type="date"
								size="mini"
								value-format="yyyy-MM-dd HH:mm:ss"
								placeholder="选择日期">
							</el-date-picker>
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
					<el-form-item label="申请事由" prop="reqReason">
						<el-input type="textarea" v-model="addForm.reqReason" :rows="4"></el-input>
					</el-form-item>
				</el-row>

				<el-row style="margin-top: 20px">
					<el-form-item label="上传">
						<attachment-upload :archiveId="uploadArchiveId" :categoryId="uploadCategoryId" :branchId="userInfo.branchId"></attachment-upload>
					</el-form-item>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="申购方式" prop="reqType">
							<el-radio v-model="addForm.reqType" label="0">新购</el-radio>
							<el-radio v-model="addForm.reqType" label="1">内部调拨</el-radio>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row style="margin-top: 20px">
					<el-form-item label="采购询价意见" prop="purchaseInquiryRemark">
						<el-input type="textarea" v-model="addForm.purchaseInquiryRemark" :rows="4"></el-input>
					</el-form-item>
				</el-row>

			</el-form>
		</el-row>
		<el-row class="page-container border padding" v-if="opType=='edit' && editVisible==false"> 
			
			<el-row>
				<div>
					<el-button size="small" @click="editVisible=true">编辑</el-button> 
					<el-button  size="small" v-print="'#printArea'">打印</el-button> 
				</div>
    			<el-divider content-position="center">资产申购</el-divider>
			</el-row>
			<el-form  id="printArea" :model="purRequire" size="small"  label-width="100px" :rules="addFormRules" ref="purRequire">

				<el-row>
					<el-divider content-position="center">申购明细</el-divider>
				</el-row>

				<table class="tab">
					<tbody>
						<tr>
							<td colspan="1" class="tl">标题</td>
                        	<td colspan="3">{{purRequire.reqTitle}}</td>
						</tr>

						<tr>
							<td class="tl">类别</td>
							<td>资产申购单</td>
							<td class="tl">编号</td>
							<td>{{purRequire.id}}</td>
						</tr>

						 <tr>
							<td class="tl">申请人</td>
							<td >{{purRequire.reqUsername}}</td>
							<td class="tl">申请部门</td>
							<td >{{purRequire.reqDeptName}}</td>
						</tr>

						<tr>
							<td class="tl">申请日期</td>
							<td >{{purRequire.reqDate}}</td>
							<td class="tl">是否计划内</td>
							<td >{{purRequire.isPlan==='0' ? '否' : '是'}}</td>
						</tr>

						<tr>
							<td colspan="4">
								<el-table v-loading="load.list" border show-summary :summary-method="getSummaries" size="small" :data="detailData" stripe>
									<el-table-column
										label="序号"
										type="index"
										width="50">
									</el-table-column>
								
									<el-table-column  prop="assetName" align="center" label="资产名称" width="">
									</el-table-column>

									<el-table-column align="center" label="规格型号" width="" prop="spec">
									</el-table-column>

									<el-table-column align="center" label="单位" width="" prop="measUnit">
									</el-table-column>

									<el-table-column align="center" label="申购数量" prop="stockNum">
									</el-table-column>

									<el-table-column align="center" label="预估单价" prop="estimatePrice">
									</el-table-column>

									<el-table-column align="center" label="小计"  width="" prop="subtotal">
									</el-table-column>

									<el-table-column align="center" label="建议到货日期" width="280" prop="suggestArrivalDate">
									</el-table-column>
								</el-table>
							</td>
						</tr>

						<tr>
							<td colspan="1" class="tl">申请事由</td>
                        	<td colspan="3">{{purRequire.reqReason}}</td>
						</tr>

						<tr>
							<td colspan="1" class="tl">上传</td>
                        	<td colspan="3">
								<attachment-upload  :isDisabled="true" :archiveId="uploadArchiveId" :categoryId="uploadCategoryId" :branchId="userInfo.branchId"></attachment-upload>
							</td>
						</tr>

						<tr>
							<td colspan="1" class="tl">申购方式</td>
                        	<td colspan="3">
								<el-radio disabled  v-model="purRequire.reqType" label="0">新购</el-radio>
								<el-radio disabled  v-model="purRequire.reqType" label="1">内部调拨</el-radio>
							</td>
						</tr>

						<tr>
							<td colspan="1" class="tl">采购询价意见</td>
                        	<td colspan="3">
								{{purRequire.purchaseInquiryRemark}}
							</td>
						</tr>

					</tbody>
				</table>
			
			</el-form>
		</el-row>
		
		
         <el-dialog top="10vh" title="选择资产" append-to-body width="60%" :visible.sync="visibleAssetSelect"  :close-on-click-modal="false">
			<asset-detail-components   @confirm="onAssetDetailSelected" ref="assetDetail" :visible="visibleAssetSelect" @cancel="visibleAssetSelect=false" ></asset-detail-components>
		</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { addRequire,editRequire } from '@/api/oa/erp/pur/Require';
	import { mapGetters } from 'vuex'
	import AttachmentUpload from '@/views/mdp/arc/archiveAttachment/AttachmentUpload';
	import {Decimal} from 'decimal.js';
	import moneyTransToChinese from '@/utils/moneyTransToChinese';


	import { listRequireDetail } from '@/api/oa/erp/pur/requireDetail';	
	import AssetDetailComponents from '../../ass/components/AssetDetailComponents';
	
	import {sn} from '@/common/js/sequence'; //id生成器

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo'
			]),

		},

		props:['purRequire','visible','opType'],
		watch: {
	      'purRequire':function( purRequire ) {
			this.addForm = purRequire;
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
					reqTitle: [
						{ required: true, message: '申购标题不能为空', trigger: 'change' },
					],

					assetName: [
						{ required: true, message: '资产名称必须填写', trigger: 'change' },
					]
				},
				//新增界面数据 pur_require
				addForm: {
					id: '',
					//申购标题
					reqTitle: '',
					//申请人id
					reqUserid: '',
					//申请人名称
					reqUsername: '',
					//申请人部门id
					reqDeptid: '',
					//申请人部门名称
					reqDeptName: '',
					//申请人机构编号
					reqBranchId: '',
					//申请人机构名称
					reqBranchName: '',
					//申购日期
					reqDate: new Date(),
					//申购事由
					reqReason: '',
					//采购询价意见
					purchaseInquiryRemark: '',
					//申购方式
					reqType: "0",
					//是否计划
					isPlan: "1",
					reqStatus: '',
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				//资产明细表格数据
				detailData: [], 
				//上传必要参数
				uploadArchiveId: '',
				uploadCategoryId: '',
				visibleAssetSelect:false,
				editVisible:false,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
				this.detailData = [];
			},
			//新增提交PurRequire pur_require 父组件监听@submit="afterAddSubmit"
			addSubmit: function (isFlow) { 
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						let flag = this.validateDetailData();
						if(!flag) return;
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.add=true 
							let params = Object.assign({}, this.transfreData(this.addForm));
							var func=addRequire;
							if(this.opType=='edit'){
								func=editRequire
							}
							func(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$emit('submit',res.data.data,isFlow);//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},

			//点击按钮关闭dialog
			cancel() {
				this.detailData = [];
				this.$refs['addForm'].resetFields();
				this.$emit('canccel');
			},

			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			transfreData(data) { 
				let param = {
					purRequire: data,
					purRequireDetail: this.detailData
				};
				return param;
			},

			//资产明细添加一行
			addRow() {
				let params = {
					//资产名称
					assetName: '',
					//规格型号
					spec:'',
					//计量单位
					measUnit: '',
					//申购数量
					stockNum: 0,
					//预估单价
					estimatePrice: 0,
					//小计
					subtotal: 0,
					//建议到货日期
					suggestArrivalDate: '',
					validate: {
						//detail验证
						assetNameShow: false,
						assetNameMsg: "资产名称不能为空",
						stockNumShow: false,
						stockNumMsg: "申购数量不能为0",
						estimatePriceShow: false,
						estimatePriceMsg: "预估单价不能为空"
					}
				}
				this.detailData.push(params);
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
					this.validateParam(d, "stockNum");
					this.validateParam(d, "estimatePrice");
				})

				//验证是否完成
				let flag = "true";
				this.detailData.forEach (d => {
					if(d.validate.assetNameShow) {
						flag = false;
						return flag;
					}
					if(d.validate.stockNumShow) {
						flag = false;
						return flag;
					}
					if(d.validate.estimatePriceShow) {
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
					this.addForm.reqUserid = user.userid;
					this.addForm.reqUsername = user.username;
					this.addForm.reqDeptid = user.deptid;
					this.addForm.reqDeptName = user.deptName;
					this.addForm.reqDate = util.formatDate(new Date(),'yyyy-MM-dd HH:mm:ss');
					this.addForm.id = sn();
				}
				
				this.uploadArchiveId = this.addForm.id;
				this.uploadCategoryId = 'require_upload';
				if(this.opType=='edit'){ 
					this.getRequireDetails();
				}
			},
 

			jiSuan(row) {
				row.stockNum=row.stockNum?row.stockNum:0
				row.estimatePrice=row.estimatePrice?row.estimatePrice:0
				row.subtotal = Number(new Decimal(row.stockNum)
						.mul(new Decimal(row.estimatePrice)));
			},

			validateParam(data, position) { 
				switch(position) {
					case 'assetName' :
						this.isNull(data.assetName) ? data.validate.assetNameShow = true : data.validate.assetNameShow = false;
					break;
					case 'stockNum' :
						this.isNull(data.stockNum) || data.stockNum === 0 ? data.validate.stockNumShow = true : data.validate.stockNumShow = false;
					break;
					case 'estimatePrice' :
						this.isNull(data.estimatePrice) ? data.validate.estimatePriceShow = true : data.validate.estimatePriceShow = false;
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
                            amount = amount.plus(p.stockNum);
                        })
                        sums[index] = Number(amount);
                        return;
					}

					if (index === 5) {
                        let amount = new Decimal(0);
                        param.data.forEach(p => {
                            amount = amount.plus(p.estimatePrice);
                        })
                        sums[index] = Number(amount);
                        return;
					}

					if (index === 6) {
                        let amount = new Decimal(0);
                        param.data.forEach(p => {
                            amount = amount.plus(p.subtotal);
                        })
						sums[index] = this.format(Number(amount)) + "元";
                        return;
					}

					if (index === 7) {
						let amount = new Decimal(0);
                        param.data.forEach(p => {
                            amount = amount.plus(p.subtotal);
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


            //获得资产卡片数据
            onAssetDetailSelected(datas) { 
				var selectRows=datas.filter(i=>!this.detailData.some(k=>k.assetSn==i.assetSn))
				if(selectRows.length<=0){
					this.$message.error("申购明细清单中已存在该资产");
					return;
				}
				
				selectRows.forEach(i=>{
					var p={
						//资产名称
						assetName: '',
						//规格型号
						spec:'',
						//计量单位
						measUnit: '',
						//申购数量
						stockNum: 0,
						//预估单价
						estimatePrice: 0,
						//小计
						subtotal: 0,
						//建议到货日期
						suggestArrivalDate: '',
						validate: {
							//detail验证
							assetNameShow: false,
							assetNameMsg: "资产名称不能为空",
							stockNumShow: false,
							stockNumMsg: "申购数量不能为0",
							estimatePriceShow: false,
							estimatePriceMsg: "预估单价不能为空"
						}
					} 
					var params=Object.assign(p,i)  
					this.detailData.push(params);
				}) 
				this.visibleAssetSelect=false
                
            },
			

			getRequireDetails() {
				let params = { 
					requireId:this.addForm.id
				}; 
				this.load.list = true;
				listRequireDetail(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){  
						var detailData = res.data.data;
						detailData.forEach(i=>i.validate={})
						detailData.forEach(i=>{
							this.jiSuan(i)
						})
						this.detailData=detailData
					}else{
						this.$message({ showClose:true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},
			/**end 在上面加自定义方法**/

		},//end method
		components: {
			//在下面添加其它组件 'pur-require-edit':PurRequireEdit
			'attachment-upload': AttachmentUpload,
			AssetDetailComponents,
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.purRequire);
			this.setDefaultParam();
		}//end mounted
	}

</script>

<style  scoped>

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
