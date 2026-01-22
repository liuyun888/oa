<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main">
		<!--编辑界面 RequireDetail pur_require_detail--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="资产编码" prop="assetSn">
					<el-input v-model="editForm.assetSn" placeholder="资产编码"></el-input>
				</el-form-item> 
				<el-form-item label="资产类别" prop="categoryId">
					<el-input v-model="editForm.categoryId" placeholder="资产类别"></el-input>
				</el-form-item> 
				<el-form-item label="资产序列号" prop="assetNo">
					<el-input v-model="editForm.assetNo" placeholder="资产序列号"></el-input>
				</el-form-item> 
				<el-form-item label="规格型号" prop="spec">
					<el-input v-model="editForm.spec" placeholder="规格型号"></el-input>
				</el-form-item> 
				<el-form-item label="计量单位" prop="measUnit">
					<el-input v-model="editForm.measUnit" placeholder="计量单位"></el-input>
				</el-form-item> 
				<el-form-item label="预估价格" prop="estimatePrice">
					<el-input v-model="editForm.estimatePrice" placeholder="预估价格"></el-input>
				</el-form-item> 
				<el-form-item label="资产原值" prop="orignUnitAmount">
					<el-input v-model="editForm.orignUnitAmount" placeholder="资产原值"></el-input>
				</el-form-item> 
				<el-form-item label="使用期限" prop="servLife">
					<el-input v-model="editForm.servLife" placeholder="使用期限"></el-input>
				</el-form-item> 
				<el-form-item label="组织机构代码" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="组织机构代码"></el-input>
				</el-form-item> 
				<el-form-item label="使用部门" prop="deptid">
					<el-input v-model="editForm.deptid" placeholder="使用部门"></el-input>
				</el-form-item> 
				<el-form-item label="存放地点" prop="storeAddress">
					<el-input v-model="editForm.storeAddress" placeholder="存放地点"></el-input>
				</el-form-item> 
				<el-form-item label="责任人" prop="liableUserid">
					<el-input v-model="editForm.liableUserid" placeholder="责任人"></el-input>
				</el-form-item> 
				<el-form-item label="采购人" prop="purchaseUserid">
					<el-input v-model="editForm.purchaseUserid" placeholder="采购人"></el-input>
				</el-form-item> 
				<el-form-item label="供应商编号" prop="supplierId">
					<el-input v-model="editForm.supplierId" placeholder="供应商编号"></el-input>
				</el-form-item> 
				<el-form-item label="所属父资产" prop="passetSn">
					<el-input v-model="editForm.passetSn" placeholder="所属父资产"></el-input>
				</el-form-item> 
				<el-form-item label="所属父资产资产编码" prop="passetName">
					<el-input v-model="editForm.passetName" placeholder="所属父资产资产编码"></el-input>
				</el-form-item> 
				<el-form-item label="保修期（月）" prop="defectsLiabilityPeriod">
					<el-input v-model="editForm.defectsLiabilityPeriod" placeholder="保修期（月）"></el-input>
				</el-form-item> 
				<el-form-item label="入库日期" prop="warehouseDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.warehouseDate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="资产状态0闲置1在用2借用3维修4报废" prop="assetStatus">
					<el-input v-model="editForm.assetStatus" placeholder="资产状态0闲置1在用2借用3维修4报废"></el-input>
				</el-form-item> 
				<el-form-item label="开始使用日期" prop="startUseDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.startUseDate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="盘点任务" prop="inventoryTask">
					<el-input v-model="editForm.inventoryTask" placeholder="盘点任务"></el-input>
				</el-form-item> 
				<el-form-item label="配置说明" prop="confDesc">
					<el-input v-model="editForm.confDesc" placeholder="配置说明"></el-input>
				</el-form-item> 
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" placeholder="备注"></el-input>
				</el-form-item> 
				<el-form-item label="资产图片" prop="assetImageUrl">
					<el-input v-model="editForm.assetImageUrl" placeholder="资产图片"></el-input>
				</el-form-item> 
				<el-form-item label="创建人" prop="createUserid">
					<el-input v-model="editForm.createUserid" placeholder="创建人"></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="createTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.createTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="最后修改人" prop="lastEditUserid">
					<el-input v-model="editForm.lastEditUserid" placeholder="最后修改人"></el-input>
				</el-form-item> 
				<el-form-item label="最后修改时间" prop="lastEditTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.lastEditTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="入库单号" prop="receiptNo">
					<el-input v-model="editForm.receiptNo" placeholder="入库单号"></el-input>
				</el-form-item> 
				<el-form-item label="供应商" prop="supplierName">
					<el-input v-model="editForm.supplierName" placeholder="供应商"></el-input>
				</el-form-item> 
				<el-form-item label="资产名称" prop="assetName">
					<el-input v-model="editForm.assetName" placeholder="资产名称"></el-input>
				</el-form-item> 
				<el-form-item label="数量" prop="stockNum">
					<el-input v-model="editForm.stockNum" placeholder="数量"></el-input>
				</el-form-item> 
				<el-form-item label="仓库编号" prop="warehouseId">
					<el-input v-model="editForm.warehouseId" placeholder="仓库编号"></el-input>
				</el-form-item> 
				<el-form-item label="产品编号" prop="productId">
					<el-input v-model="editForm.productId" placeholder="产品编号"></el-input>
				</el-form-item> 
				<el-form-item label="产品编码" prop="productSn">
					<el-input v-model="editForm.productSn" placeholder="产品编码"></el-input>
				</el-form-item> 
				<el-form-item label="品牌编号" prop="brandId">
					<el-input v-model="editForm.brandId" placeholder="品牌编号"></el-input>
				</el-form-item> 
				<el-form-item label="品牌名称" prop="brandName">
					<el-input v-model="editForm.brandName" placeholder="品牌名称"></el-input>
				</el-form-item> 
				<el-form-item label="申购单号" prop="requireId">
					<el-input v-model="editForm.requireId" placeholder="申购单号"></el-input>
				</el-form-item> 
				<el-form-item label="建议到货时间" prop="suggestArrivalDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.suggestArrivalDate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="采购单中明细编号-加入采购单后回填" prop="orderDetailId">
					<el-input v-model="editForm.orderDetailId" placeholder="采购单中明细编号-加入采购单后回填"></el-input>
				</el-form-item> 
				<el-form-item label="采购订单编号-加入采购单后回填" prop="orderId">
					<el-input v-model="editForm.orderId" placeholder="采购订单编号-加入采购单后回填"></el-input>
				</el-form-item> 
				<el-form-item label="编号" prop="id">
					<el-input v-model="editForm.id" placeholder="编号"></el-input>
				</el-form-item> 
				<el-form-item label="资产明细编号" prop="assetDetailId">
					<el-input v-model="editForm.assetDetailId" placeholder="资产明细编号"></el-input>
				</el-form-item> 
			</el-form>
		</el-row>

		<el-row   class="page-bottom bottom-fixed">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { addRequireDetail,editRequireDetail } from '@/api/oa/erp/pur/requireDetail';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'requireDetailEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['requireDetail','visible','opType'],

		watch: {
	      'requireDetail':function( requireDetail ) {
	        if(requireDetail){
	            this.editForm = requireDetail;
	        }

	      },
	      'visible':function(visible) { 
	      	if(visible==true){
 	      		this.initData()
	      	}
	      } 
	    },
		data() {
			return {
			    currOpType:'add',//add/edit
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					id: [
						//{ required: true, message: '编号不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					assetSn:'',categoryId:'',assetNo:'',spec:'',measUnit:'',estimatePrice:'',orignUnitAmount:'',servLife:'',branchId:'',deptid:'',storeAddress:'',liableUserid:'',purchaseUserid:'',supplierId:'',passetSn:'',passetName:'',defectsLiabilityPeriod:'',warehouseDate:'',assetStatus:'',startUseDate:'',inventoryTask:'',confDesc:'',remark:'',assetImageUrl:'',createUserid:'',createTime:'',lastEditUserid:'',lastEditTime:'',receiptNo:'',supplierName:'',assetName:'',stockNum:'',warehouseId:'',productId:'',productSn:'',brandId:'',brandName:'',requireId:'',suggestArrivalDate:'',orderDetailId:'',orderId:'',id:'',assetDetailId:''
				},

			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//新增、编辑提交RequireDetail pur_require_detail父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addRequireDetail
							if(this.currOpType=='edit'){
							    func=editRequireDetail
							}
							func(params).then((res) => {
                                this.load.edit=false
                                var tips=res.data.tips;
                                if(tips.isOk){
                                    this.editForm=res.data.data
                                    this.initData()
                                    this.currOpType="edit";
                                    this.$emit('submit');//  @submit="afterAddSubmit"
                                }
                                this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                            }).catch( err =>this.load.edit=false);
						});
					}else{
					    this.$message({ showClose:true, message: "表单验证不通过，请修改表单数据再提交", type: 'error' });
					}
				});
			},
			initData: function(){
			    this.currOpType=this.opType
			    if(this.requireDetail){
                    this.editForm = Object.assign({},this.requireDetail);
                }

                if(this.opType=='edit'){

                }else{

                }
            },

		},//end method
		mounted() {
		    this.$nextTick(() => {
                //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
                this.initData()
            });
		}
	}

</script>

<style scoped>

</style>