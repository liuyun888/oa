<template>
	<section>
		<el-row class="page-container border padding" v-if=" (opType=='edit' && editVisible==true) || opType=='add'">

			<el-row>
				<div>
					<el-button v-if="editVisible==true" size="small" @click.native="editVisible=false">取消编辑</el-button>
					<el-button type="primary" size="small" @click="editSubmit(false)">暂存</el-button>
					<el-button type="primary" size="small" @click="editSubmit(true)">提交</el-button>
				</div>
    			<el-divider content-position="center">资产入库</el-divider>
			</el-row>

			<!--新增界面 StockIn pur_stock_in-->
			<el-form :model="editForm"  label-width="120px" :rules="addFormRules" ref="editForm">

				<el-row>
					<el-form-item label="标题" prop="title">
						<el-input v-model="editForm.title" placeholder="入库单标题" ></el-input>
					</el-form-item>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="类别">
							<el-input disabled placeholder="资产入库单"></el-input>
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
							<el-input readonly v-model="editForm.reqUsername"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item  label="申请日期">
							<el-date-picker
								readonly
								type="datetime"
								v-model="editForm.reqDate"
								placeholder="选择日期">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>

				<el-divider content-position="center">采购单明细</el-divider>
				<el-row>
						<el-button type="primary" size="mini" @click="searchCaiGou">选择采购单物资明细</el-button>
				</el-row>

				<el-row>
					<el-table v-loading="load.list" border size="small" :data="caiGouData" stripe>
						<el-table-column
							label="序号"
							type="index"
							width="50">
						</el-table-column>

						<el-table-column prop="purOrderId"  align="center" label="采购单编号" width="200">
						</el-table-column>

						<el-table-column prop="assetName" align="center" label="资产名称" width="" >
						</el-table-column>

						<el-table-column prop="spec" align="center" label="规格型号" width="">
						</el-table-column>

						<el-table-column prop="measUnit" align="center" label="单位" width="155">
						</el-table-column>

						<el-table-column prop="orignUnitAmount" align="center" label="单价" width="155">
						</el-table-column>

						<el-table-column prop="stockNum" align="center" label="采购数量"  width="">
						</el-table-column>

						<el-table-column prop="reachNum" align="center" label="已到数量"  width="">
						</el-table-column>

						<el-table-column prop="purchaseUsername" align="center" label="采购人"  width="">
						</el-table-column>

						<el-table-column prop="supplierName" align="center" label="供应商" width="200">
						</el-table-column>

						<el-table-column prop="purchaseDate" align="center" label="采购日期"  width="">
						</el-table-column>

						<el-table-column align="center" label="操作"  width="80">
							 <template slot-scope="scope">
								<i class="el-icon-remove-outline" @click="delRow(scope.$index)"></i>
							</template>
						</el-table-column>

					</el-table>
				</el-row>

				<el-divider content-position="center">入库资产清单</el-divider>

				<el-row style="margin-bottom:20px">
					<el-table  size="small" border :data="ruKuData" stripe>
						<el-table-column
							label="序号"
							type="index"
							width="50">
						</el-table-column>

						<el-table-column prop="purOrderId"  align="center" label="采购单编号" width="85">
						</el-table-column>

						<el-table-column prop="assetName" align="center" label="资产名称" width="85" >
						</el-table-column>

						<el-table-column prop="stockNum" align="center" label="采购数量"  width="85">
						</el-table-column>

						<el-table-column prop="reachNum" align="center" label="已到数量"  width="85">
						</el-table-column>

						<el-table-column align="center" label="资产类别"  width="">
							<template slot-scope="scope">
								<span class="vTip">*</span>
								<el-input @focus="openAssetCategorySelect(scope.$index)" @blur="validateDetail(scope.row, 'categoryName')" size="mini" v-model="scope.row.categoryName"> </el-input>
								<div v-show="scope.row.validate.categoryNameShow">
									<i class="el-icon-warning"></i>
									<span class="tipMsg">{{scope.row.validate.categoryNameMsg}}</span>
								</div>
							</template>
						</el-table-column>

						<el-table-column align="center" label="资产序列号" width="170">
							<template slot-scope="scope">
								<span class="vTip">*</span>
								<el-input @input="validateDetail(scope.row, 'assetNo')"  size="mini" v-model="scope.row.assetNo"> </el-input>
								<div v-show="scope.row.validate.assetNoShow">
									<i class="el-icon-warning"></i>
									<span class="tipMsg">{{scope.row.validate.assetNoMsg}}</span>
								</div>
							</template>
						</el-table-column>

						<el-table-column align="center" label="资产编码"  width="">
							<template slot-scope="scope">
								<span class="vTip">*</span>
								<el-input @input="validateDetail(scope.row, 'assetSn')"  size="mini" v-model="scope.row.assetSn">
									<template slot="append">
										<el-button @click="visibleAssetDetailSelect=true">选择</el-button>
									</template>
								</el-input>
								<div v-show="scope.row.validate.assetSnShow">
									<i class="el-icon-warning"></i>
									<span class="tipMsg">{{scope.row.validate.assetSnMsg}}</span>
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

						<el-table-column align="center" label="到货数量"  width="">
							<template slot-scope="scope">
								<span class="vTip">*</span>
								<el-input-number @input="validateDetail(scope.row, 'inNum')"  size="mini" v-model="scope.row.inNum"> </el-input-number>
								<div v-show="scope.row.validate.inNumShow">
									<i class="el-icon-warning"></i>
									<span class="tipMsg">{{scope.row.validate.inNumMsg}}</span>
								</div>
							</template>
						</el-table-column>

						<el-table-column align="center" label="所属仓库" width="">
							<template slot-scope="scope">
								<span class="vTip">*</span>
								<el-input  @focus="openWarehouse(scope.$index)" @blur="validateDetail(scope.row, 'warehouseName')" size="mini" v-model="scope.row.warehouseName"> </el-input>
								<div v-show="scope.row.validate.warehouseNameShow">
									<i class="el-icon-warning"></i>
									<span class="tipMsg">{{scope.row.validate.warehouseNameMsg}}</span>
								</div>
							</template>
						</el-table-column>

						<el-table-column align="center" label="品牌" width="">
							<template slot-scope="scope">
								<span class="vTip">*</span>
								<el-input  @focus="openBrand(scope.$index)" @blur="validateDetail(scope.row, 'brandName')" size="mini" v-model="scope.row.brandName"> </el-input>
								<div v-show="scope.row.validate.brandNameShow">
									<i class="el-icon-warning"></i>
									<span class="tipMsg">{{scope.row.validate.brandNameMsg}}</span>
								</div>
							</template>
						</el-table-column>

						<el-table-column align="center" label="操作"  width="80">
							 <template slot-scope="scope">
								<i class="el-icon-remove-outline" @click="delRow(scope.$index)"></i>
							</template>
						</el-table-column>
					</el-table>
				</el-row >

				<el-form-item label="是否生成资产卡片" prop="isAssetCard">
					 <el-radio v-model="editForm.isAssetCard" label="1">是</el-radio>
  					 <el-radio v-model="editForm.isAssetCard" label="0">否</el-radio>
				</el-form-item>

				<el-form-item label="资产卡片是否按数量拆分" prop="cardDisByNum">
					<el-radio v-model="editForm.cardDisByNum" label="1">是</el-radio>
  					<el-radio v-model="editForm.cardDisByNum" label="0">否</el-radio>
				</el-form-item>
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
				<el-row>
					<el-divider content-position="center">资产入库</el-divider>
				</el-row>

				<table class="tab">
					<tbody>
						<tr>
							<td colspan="1" class="tl">标题</td>
							<td colspan="3">{{stockIn.title}}</td>
						</tr>

						<tr>
							<td class="tl">类别</td>
							<td>资产入库单</td>
							<td class="tl">编号</td>
							<td>{{stockIn.id}}</td>
						</tr>

							<tr>
							<td class="tl">申请人</td>
							<td >{{stockIn.reqUsername}}</td>
							<td class="tl">申请日期</td>
							<td >{{stockIn.reqDate}}</td>
						</tr>


						<tr>
							<td colspan="4">
								<el-table v-loading="load.list" border size="small" :data="caiGouData" stripe>
									<el-table-column
										label="序号"
										type="index"
										width="50">
									</el-table-column>

									<el-table-column prop="purOrderId"  align="center" label="采购单编号" width="200">
									</el-table-column>

									<el-table-column prop="assetName" align="center" label="资产名称" width="" >
									</el-table-column>

									<el-table-column prop="spec" align="center" label="规格型号" width="">
									</el-table-column>

									<el-table-column prop="measUnit" align="center" label="单位" width="155">
									</el-table-column>

									<el-table-column prop="orignUnitAmount" align="center" label="单价" width="155">
									</el-table-column>

									<el-table-column prop="stockNum" align="center" label="采购数量"  width="">
									</el-table-column>

									<el-table-column prop="reachNum" align="center" label="已到数量"  width="">
									</el-table-column>

									<el-table-column prop="purchaseUsername" align="center" label="采购人"  width="">
									</el-table-column>

									<el-table-column prop="supplierName" align="center" label="供应商" width="200">
									</el-table-column>

									<el-table-column prop="purchaseDate" align="center" label="采购日期"  width="">
									</el-table-column>
								</el-table>
							</td>
						</tr>

						<tr>
							<td colspan="4" class="tl" style="text-align:center">入库资产清单</td>
						</tr>

						<tr>
							<td colspan="4">
								<el-table  v-loading="load.list" size="small" border :data="ruKuData" stripe>
									<el-table-column
										label="序号"
										type="index"
										width="50">
									</el-table-column>

									<el-table-column prop="purOrderId"  align="center" label="采购单编号" width="100">
									</el-table-column>

									<el-table-column prop="assetName" align="center" label="资产名称" width="100" >
									</el-table-column>

									<el-table-column prop="stockNum" align="center" label="采购数量"  width="85">
									</el-table-column>

									<el-table-column align="center" label="资产类别"  prop="categoryName" width="">
									</el-table-column>

									<el-table-column align="center" label="资产序列号" prop="assetNo" width="170">
									</el-table-column>

									<el-table-column align="center" label="资产编码"  prop="assetSn" width="">
									</el-table-column>

									<el-table-column align="center" label="到货数量" prop="inNum"  width="">
									</el-table-column>

									<el-table-column align="center" label="所属仓库" prop="warehouseName" width="">
									</el-table-column>

									<el-table-column align="center" label="品牌" prop="brandName"  width="">
									</el-table-column>
								</el-table>
							</td>
						</tr>

						<tr>
							<td colspan="1" class="tl">是否生成资产卡片</td>
							<td colspan="3">
								<el-radio disabled v-model="stockIn.isAssetCard" label="1">是</el-radio>
								<el-radio disabled v-model="stockIn.isAssetCard" label="0">否</el-radio>
							</td>
						</tr>

						<tr>
							<td colspan="1" class="tl">资产卡片是否按数量拆分</td>
							<td colspan="3">
								<el-radio disabled v-model="stockIn.cardDisByNum" label="1">是</el-radio>
								<el-radio disabled v-model="stockIn.cardDisByNum" label="0">否</el-radio>
							</td>
						</tr>

					</tbody>
				</table>

			</el-row>
		</el-row>


         <el-dialog top="10vh" title="选择资产" append-to-body width="60%" :visible.sync="visibleAssetDetailSelect"  :close-on-click-modal="false">
			<asset-detail-components isSingerSelect=true  @confirm="onAssetDetailSelected" ref="assetDetail" :visible="visibleAssetDetailSelect" @cancel="visibleAssetDetailSelect=false" ></asset-detail-components>
		</el-dialog>

		<el-dialog append-to-body title="选择资产分类" center width="60%" :visible.sync="selectAssetTypeVisible"  :close-on-click-modal="false">
			<asset-category-tree @node-click="getSelectAssetTypeData" @cancel="selectAssetTypeVisible=false" ></asset-category-tree>
		</el-dialog>

		<el-dialog append-to-body title="选择采购物资清单" center width="60%" :visible.sync="selectAssetVisible" :close-on-click-modal="false">
			<order-detail-components :pur-order-id="purOrderId" :visible="selectAssetVisible" @cancel="selectAssetVisible=false" @add-submit="getSelectAssetData"></order-detail-components>
		</el-dialog>

		<el-dialog append-to-body title="选择仓库"  center width="60%" :visible.sync="selectWareHouseVisible" :close-on-click-modal="false">
			<warehouse-components :visible="selectWareHouseVisible" @cancel="selectWareHouseVisible=false" @row-click="getWareHouseData"></warehouse-components>
		</el-dialog>

		<el-dialog append-to-body title="选择品牌"  center width="60%" :visible.sync="selectBrandVisible" :close-on-click-modal="false">
			<brand-component :visible="selectBrandVisible"  @cancel="selectBrandVisible=false" @selectBrand="getBrandData"></brand-component>
		</el-dialog>

	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { addStockIn ,editStockIn, listStorkInDetail } from '@/api/oa/erp/pur/stockIn';
	import { isExitAssetSn } from '@/api/oa/erp/ass/assetCard';
	import { mapGetters } from 'vuex';
	import OrderDetailComponents from '../components/OrderDetailComponents';
	import AssetCategoryTree from '../../ass/components/AssetCategoryTree';
	import WarehouseComponents from '../components/WarehouseComponents';
	import BrandComponent from '../brand/BrandComponent';
	import {Decimal} from 'decimal.js';
	import AssetDetailComponents from '../../ass/components/AssetDetailComponents';


	export default {
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['stockIn','visible','opType','purOrderId'],
		watch: {
	      'stockIn':function( stockIn ) {
	        this.editForm = stockIn;
	      },
	      'visible':function(visible) {
	      	if(visible==true){
				  //从新打开页面时某些数据需要重新加载，可以在这里添加
				  this.setDefaultParam();
				  if(this.opType=='edit'){
					this.getDetailData();
				  }

	      	}
	      }
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					id: [
						//{ required: true, message: '入库单号不能为空', trigger: 'change' }
					],
					title: [
						{ required: true, message: '标题不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 pur_stock_in
				editForm: {
					id:'',title:'',reqUserid:'',reqUsername:'',reqDate:'',isAssetCard:'1',cardDisByNum:'1', stockStatus: '',
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				caiGouData: [],
				ruKuData: [],
				selectAssetVisible: false,
				selectAssetTypeVisible: false,
				currentRow: 0,
				//显示仓库dialog
				selectWareHouseVisible : false,
				selectBrandVisible: false,
				orderData: [],
				editVisible:false,
				visibleAssetDetailSelect:false,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.caiGouData = [];
				this.ruKuData = [];
				this.orderData = [];
				this.$emit('cancel');
			},

			cancel: function() {
				this.$refs['editForm'].resetFields();
				this.caiGouData = [];
				this.ruKuData = [];
				this.orderData = [];
			},

			//新增提交StockIn pur_stock_in 父组件监听@submit="afterAddSubmit"
			editSubmit: function (isFlow) {
				this.editForm.stockStatus = "";
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						let flag = this.validateDetailData();
						if(!flag) return;
						//数据转换
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.add=true
							//日期转换
							if(!this.isNull(this.editForm.reqDate) && this.editForm.reqDate instanceof Date) {
								this.editForm.reqDate = util.formatDate(this.editForm.reqDate, "yyyy-MM-dd HH:mm:ss")
							}
							let params = Object.assign({}, this.transfreData(this.editForm));
							var func=addStockIn
							if(this.opType=='edit'){
								func=editStockIn
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

			transfreData(data) {

				this.ruKuData.forEach(r => {
					let flag = this.orderData.some(item => {
						if(item.assetSn == r.yuanAssetSn) {
							return true;
						}
					})
					if(flag) {return};
					let param = {
						inNum: r.inNum,
						assetSn: r.yuanAssetSn
					}
					this.orderData.push(param);
				})


				let param = {
					stockIn: data,
					stockInDetails: this.ruKuData,
					order: this.orderData
				};
				return param;
			},

			validateParam() {
				this.ruKuData.forEach((d, index) => {
					this.validateDetail(d, "categoryName");
					this.validateDetail(d, "assetNo");
					this.validateDetail(d, "assetSn");
					//this.validateDetail(d, "four");
					this.validateDetail(d, "inNum");
					this.validateDetail(d, "warehouseName");
					this.validateDetail(d, "brandName");
				})
			},


			//校验明细数据
			validateDetailData() {
				if(this.ruKuData.length <= 0) {
					this.$message.error("入库资产清单不能为空");
					return false;
				}
				this.validateParam();

				//验证是否完成
				let flag = true;
				this.ruKuData.forEach (k => {
					var d=k.validate
					if(d.categoryNameShow) {
						flag = false;
						return flag;
					}
					if(d.assetNoShow) {
						flag = false;
						return flag;
					}

					if(d.assetSnShow) {
						flag = false;
						return flag;
					}

					// if(d.fourShow) {
					// 	flag = false;
					// 	return flag;
					// }
					if(d.inNumShow) {
						flag = false;
						return flag;
					}
					if(d.warehouseNameShow) {
						flag = false;
						return flag;
					}
					if(d.brandNameShow) {
						flag = false;
						return flag;
					}
				})

				if(!flag) {
					return false;
				}
				return true;
			},


			searchCaiGou() {
				this.selectAssetVisible = true;
			},

			getSelectAssetData(data) {
				this.selectAssetVisible = false;
				var datas=data.filter(i=>!this.ruKuData.some(k=>k.orderDetailId==i.id))
				datas.forEach(d => {
						d.orderDetailId=d.id
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
						d.validate=validate
						d["inNum"]=0
						this.ruKuData.push({...d})
				})
			},
			//获得资产卡片数据
            onAssetDetailSelected(datas) {
				if(datas && datas.length==1){
					var data=datas[0]
					this.ruKuData[this.currentRow].assetSn=data.assetSn
					this.ruKuData[this.currentRow].categoryName=data.categoryName
					this.ruKuData[this.currentRow].categoryId=data.categoryId
					this.ruKuData[this.currentRow].assetNo=data.assetNo
					this.visibleAssetDetailSelect=false
				}else if(datas && datas.length>1){
					this.$message.error("只能选择一个资产");
				}else{
					this.$message.error("请选择一个资产");
				}


            },
			//开启资产分类选择器
			openAssetCategorySelect(index) {
				this.currentRow = index;
				this.selectAssetTypeVisible = true;
			},

			//获得资产分类数据
			getSelectAssetTypeData(data) {
				this.$set(this.ruKuData[this.currentRow],"categoryName", data.categoryName);
				this.$set(this.ruKuData[this.currentRow],"categoryId",  data.categoryId);
				this.selectAssetTypeVisible = false;
				this.validateDetail(this.ruKuData[this.currentRow],"categoryName")
			},

			//删除列表
			delRow(index) {
				this.caiGouData.splice(index, 1);
				this.ruKuData.splice(index, 1);
			},

			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			setDefaultParam() {

				if(this.opType=='add'){
					let user = this.userInfo;
					this.editForm.reqUserid = user.userid;
					this.editForm.reqUsername = user.username;
					this.editForm.reqDeptid = user.deptid;
					this.editForm.reqDeptName = user.deptName;
					this.editForm.reqDate = util.formatDate(new Date(),'yyyy-MM-dd HH:mm:ss');
					this.editForm.id = '';
				}else{
					this.editForm=Object.assign(this.editForm, this.stockIn);
				}
			},

			//setCurrentRow
			setCurrentRow(index) {
				this.currentRow = index;
			},

			//验证明细参数
			validateDetail(row, position) {
				debugger;
				let param = row;
				let data = row.validate;
				switch(position) {
					case 'categoryName' :
						this.isNull(param.categoryName) ? data.categoryNameShow = true : data.categoryNameShow = false;
					break;
					case 'assetNo' :
						this.isNull(param.assetNo) ? data.assetNoShow = true : data.assetNoShow = false;
					break;
					case 'assetSn' :
						//查询资产编码是否重复
						if(this.isNull(param.assetSn)) {
							data.assetSnShow = true
						}else {
							data.assetSnShow = false;
							isExitAssetSn({"assetSn": param.assetSn}).then((res) => {
								var tips=res.data.tips;
								if(tips.isOk){
								}else{
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
						if(this.isNull(param.inNum) || param.inNum === 0) {
							data.inNumShow = true
							data.inNumMsg = '到货数量不能为空';
						}else if(Number(new Decimal(param.inNum).add(new Decimal(param.reachNum?param.reachNum:0))) > (param.stockNum?param.stockNum:0)) {
							data.inNumShow = true;
							data.inNumMsg = '到货数量不能超过采购数量';
						}else {
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
				if(data === null || data === '' || data === undefined) {
					return true;
				}
				return false;
			},

			openWarehouse(index) {
				this.currentRow = index;
				this.selectWareHouseVisible = true;
			},

			//获取仓库属性
			getWareHouseData(data) {
				this.selectWareHouseVisible = false;
				this.$set(this.ruKuData[this.currentRow],"warehouseId", data.id);
				this.$set(this.ruKuData[this.currentRow],"warehouseName", data.name);
				this.$set(this.ruKuData[this.currentRow],"storeAddress", data.address);

				this.validateDetail(this.ruKuData[this.currentRow],"warehouseName")
			},


			//获取品牌
			openBrand(index) {
				this.currentRow = index;
				this.selectBrandVisible = true;
			},

			getBrandData(data) {
				if(this.isNull(data)) return;
				this.$set(this.ruKuData[this.currentRow],"brandId", data.id);
				this.$set(this.ruKuData[this.currentRow],"brandName", data.brandName);
				this.selectBrandVisible = false;

				this.validateDetail(this.ruKuData[this.currentRow],"brandName")
			},


			getDetailData() {

				let params = {
					id: this.editForm.id
				};
				//查询申购单明细
				this.load.list = true;
				listStorkInDetail(params).then((res) => {
                    var tips=res.data.tips;
					if(tips.isOk){
                        this.caiGouData = res.data.data.caiGouData;
						this.ruKuData = res.data.data.ruKuData;
						this.ruKuData.forEach(c => {
							this.caiGouData.forEach(g => {
								if(c.purOrderId === g.purOrderId) {
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
							c.validate=validate
						})
					}
					this.load.list = false;
				}).catch();
			},

			/**end 在上面加自定义方法**/

		},//end method
		components: {
			//在下面添加其它组件 'stock-in-edit':StockInEdit
			"order-detail-components" : OrderDetailComponents,
			"asset-category-tree" : AssetCategoryTree,
			"warehouse-components" : WarehouseComponents,
			"brand-component" : BrandComponent,
			AssetDetailComponents,
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.stockIn);
			/**在下面写其它函数***/
			this.setDefaultParam();
			if(this.opType=='edit'){
				this.getDetailData();
			}


		}//end mounted
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
