<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="资产编码" prop="assetSn">
					<el-input v-model="addForm.assetSn" placeholder="资产编码" ></el-input>
				</el-form-item> 
				<el-form-item label="资产类别" prop="categoryId">
					<el-input v-model="addForm.categoryId" placeholder="资产类别" ></el-input>
				</el-form-item> 
				<el-form-item label="资产序列号" prop="assetNo">
					<el-input v-model="addForm.assetNo" placeholder="资产序列号" ></el-input>
				</el-form-item> 
				<el-form-item label="规格型号" prop="spec">
					<el-input v-model="addForm.spec" placeholder="规格型号" ></el-input>
				</el-form-item> 
				<el-form-item label="计量单位" prop="measUnit">
					<el-input v-model="addForm.measUnit" placeholder="计量单位" ></el-input>
				</el-form-item> 
				<el-form-item label="资产原值" prop="orignUnitAmount">
					<el-input v-model="addForm.orignUnitAmount" placeholder="资产原值" ></el-input>
				</el-form-item> 
				<el-form-item label="使用期限" prop="servLife">
					<el-input v-model="addForm.servLife" placeholder="使用期限" ></el-input>
				</el-form-item> 
				<el-form-item label="组织机构代码" prop="branchId">
					<el-input v-model="addForm.branchId" placeholder="组织机构代码" ></el-input>
				</el-form-item> 
				<el-form-item label="使用部门" prop="deptid">
					<el-input v-model="addForm.deptid" placeholder="使用部门" ></el-input>
				</el-form-item> 
				<el-form-item label="存放地点" prop="storeAddress">
					<el-input v-model="addForm.storeAddress" placeholder="存放地点" ></el-input>
				</el-form-item> 
				<el-form-item label="责任人" prop="personLiableUserid">
					<el-input v-model="addForm.personLiableUserid" placeholder="责任人" ></el-input>
				</el-form-item> 
				<el-form-item label="采购人" prop="purchaseUserid">
					<el-input v-model="addForm.purchaseUserid" placeholder="采购人" ></el-input>
				</el-form-item> 
				<el-form-item label="供应商编号" prop="supplierId">
					<el-input v-model="addForm.supplierId" placeholder="供应商编号" ></el-input>
				</el-form-item> 
				<el-form-item label="所属父资产" prop="passetSn">
					<el-input v-model="addForm.passetSn" placeholder="所属父资产" ></el-input>
				</el-form-item> 
				<el-form-item label="所属父资产资产编码" prop="passetName">
					<el-input v-model="addForm.passetName" placeholder="所属父资产资产编码" ></el-input>
				</el-form-item> 
				<el-form-item label="保修期（月）" prop="defectsLiabilityPeriod">
					<el-input v-model="addForm.defectsLiabilityPeriod" placeholder="保修期（月）" ></el-input>
				</el-form-item> 
				<el-form-item label="入库日期" prop="warehouseDate">
					<el-input v-model="addForm.warehouseDate" placeholder="入库日期" ></el-input>
				</el-form-item> 
				<el-form-item label="资产状态0闲置1在用2借用3维修4报废" prop="assetStatus">
					<el-input v-model="addForm.assetStatus" placeholder="资产状态0闲置1在用2借用3维修4报废" ></el-input>
				</el-form-item> 
				<el-form-item label="开始使用日期" prop="startUseDate">
					<el-input v-model="addForm.startUseDate" placeholder="开始使用日期" ></el-input>
				</el-form-item> 
				<el-form-item label="盘点任务" prop="inventoryTask">
					<el-input v-model="addForm.inventoryTask" placeholder="盘点任务" ></el-input>
				</el-form-item> 
				<el-form-item label="配置说明" prop="confDesc">
					<el-input v-model="addForm.confDesc" placeholder="配置说明" ></el-input>
				</el-form-item> 
				<el-form-item label="备注" prop="remark">
					<el-input v-model="addForm.remark" placeholder="备注" ></el-input>
				</el-form-item> 
				<el-form-item label="资产图片" prop="assetImageUrl">
					<el-input v-model="addForm.assetImageUrl" placeholder="资产图片" ></el-input>
				</el-form-item> 
				<el-form-item label="创建人" prop="createUserid">
					<el-input v-model="addForm.createUserid" placeholder="创建人" ></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="createTime">
					<el-input v-model="addForm.createTime" placeholder="创建时间" ></el-input>
				</el-form-item> 
				<el-form-item label="最后修改人" prop="lastEditUserid">
					<el-input v-model="addForm.lastEditUserid" placeholder="最后修改人" ></el-input>
				</el-form-item> 
				<el-form-item label="最后修改时间" prop="lastEditTime">
					<el-input v-model="addForm.lastEditTime" placeholder="最后修改时间" ></el-input>
				</el-form-item> 
				<el-form-item label="入库单号" prop="receiptNo">
					<el-input v-model="addForm.receiptNo" placeholder="入库单号" ></el-input>
				</el-form-item> 
				<el-form-item label="供应商" prop="supplierName">
					<el-input v-model="addForm.supplierName" placeholder="供应商" ></el-input>
				</el-form-item> 
				<el-form-item label="资产名称" prop="assetName">
					<el-input v-model="addForm.assetName" placeholder="资产名称" ></el-input>
				</el-form-item> 
				<el-form-item label="数量" prop="stockNum">
					<el-input v-model="addForm.stockNum" placeholder="数量"></el-input>
				</el-form-item> 
				<el-form-item label="仓库编号" prop="warehouseId">
					<el-input v-model="addForm.warehouseId" placeholder="仓库编号" ></el-input>
				</el-form-item> 
				<el-form-item label="产品编号" prop="productId">
					<el-input v-model="addForm.productId" placeholder="产品编号" ></el-input>
				</el-form-item> 
				<el-form-item label="产品编码" prop="productSn">
					<el-input v-model="addForm.productSn" placeholder="产品编码" ></el-input>
				</el-form-item> 
				<el-form-item label="品牌编号" prop="brandId">
					<el-input v-model="addForm.brandId" placeholder="品牌编号" ></el-input>
				</el-form-item> 
				<el-form-item label="品牌名称" prop="brandName">
					<el-input v-model="addForm.brandName" placeholder="品牌名称" ></el-input>
				</el-form-item> 
				<el-form-item label="申购单号" prop="requireId">
					<el-input v-model="addForm.requireId" placeholder="申购单号" ></el-input>
				</el-form-item> 
				<el-form-item label="采购单编号" prop="purOrderId">
					<el-input v-model="addForm.purOrderId" placeholder="采购单编号" ></el-input>
				</el-form-item> 
				<el-form-item>
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addOrderDetail } from '@/api/oa/erp/pur/orderDetail';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['orderDetail','visible'],
		watch: {
	      'orderDetail':function( orderDetail ) {
	        this.addForm = orderDetail;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					assetSn: [
						//{ required: true, message: '资产编码不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 pur_order_detail
				addForm: {
					assetSn:'',categoryId:'',assetNo:'',spec:'',measUnit:'',orignUnitAmount:'',servLife:'',branchId:'',deptid:'',storeAddress:'',personLiableUserid:'',purchaseUserid:'',supplierId:'',passetSn:'',passetName:'',defectsLiabilityPeriod:'',warehouseDate:'',assetStatus:'',startUseDate:'',inventoryTask:'',confDesc:'',remark:'',assetImageUrl:'',createUserid:'',createTime:'',lastEditUserid:'',lastEditTime:'',receiptNo:'',supplierName:'',assetName:'',stockNum:'',warehouseId:'',productId:'',productSn:'',brandId:'',brandName:'',requireId:'',purOrderId:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交OrderDetail pur_order_detail 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addOrderDetail(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'order-detail-edit':OrderDetailEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.orderDetail);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>