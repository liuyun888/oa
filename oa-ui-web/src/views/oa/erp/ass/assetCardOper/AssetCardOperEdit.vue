<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main">
		<!--编辑界面 AssetCardOper ass_asset_card_oper--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="卡片主键Id" prop="cardId">
					<el-input v-model="editForm.cardId" placeholder="卡片主键Id"></el-input>
				</el-form-item> 
				<el-form-item label="资产编码" prop="assetSn">
					<el-input v-model="editForm.assetSn" placeholder="资产编码"></el-input>
				</el-form-item> 
				<el-form-item label="操作后资产状态" prop="assetStatusAfter">
					<el-input v-model="editForm.assetStatusAfter" placeholder="操作后资产状态"></el-input>
				</el-form-item> 
				<el-form-item label="操作前资产状态" prop="assetStatusBefore">
					<el-input v-model="editForm.assetStatusBefore" placeholder="操作前资产状态"></el-input>
				</el-form-item> 
				<el-form-item label="单据编号" prop="assetMngId">
					<el-input v-model="editForm.assetMngId" placeholder="单据编号"></el-input>
				</el-form-item> 
				<el-form-item label="调整库存数量" prop="adjustStockNum">
					<el-input v-model="editForm.adjustStockNum" placeholder="调整库存数量"></el-input>
				</el-form-item> 
				<el-form-item label="调拨日期" prop="allocDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.allocDate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="新责任人" prop="nowPsersonLiableUserid">
					<el-input v-model="editForm.nowPsersonLiableUserid" placeholder="新责任人"></el-input>
				</el-form-item> 
				<el-form-item label="新责任人名称" prop="nowPsersonLiableUsername">
					<el-input v-model="editForm.nowPsersonLiableUsername" placeholder="新责任人名称"></el-input>
				</el-form-item> 
				<el-form-item label="新使用部门编号" prop="nowDeptid">
					<el-input v-model="editForm.nowDeptid" placeholder="新使用部门编号"></el-input>
				</el-form-item> 
				<el-form-item label="新使用部门名称" prop="nowDeptName">
					<el-input v-model="editForm.nowDeptName" placeholder="新使用部门名称"></el-input>
				</el-form-item> 
				<el-form-item label="新机构编号" prop="nowBranchId">
					<el-input v-model="editForm.nowBranchId" placeholder="新机构编号"></el-input>
				</el-form-item> 
				<el-form-item label="新机构名称" prop="nowBranchName">
					<el-input v-model="editForm.nowBranchName" placeholder="新机构名称"></el-input>
				</el-form-item> 
				<el-form-item label="新地点" prop="nowStoreAddress">
					<el-input v-model="editForm.nowStoreAddress" placeholder="新地点"></el-input>
				</el-form-item> 
				<el-form-item label="仓库编号" prop="nowWarehouseId">
					<el-input v-model="editForm.nowWarehouseId" placeholder="仓库编号"></el-input>
				</el-form-item> 
				<el-form-item label="仓库名称" prop="nowWarehouseName">
					<el-input v-model="editForm.nowWarehouseName" placeholder="仓库名称"></el-input>
				</el-form-item> 
				<el-form-item label="新地点定位" prop="nowStoreAddressGps">
					<el-input v-model="editForm.nowStoreAddressGps" placeholder="新地点定位"></el-input>
				</el-form-item> 
				<el-form-item label="资产处置单-残值" prop="residualValue">
					<el-input v-model="editForm.residualValue" placeholder="资产处置单-残值"></el-input>
				</el-form-item> 
				<el-form-item label="资产处置单-净值" prop="netWorth">
					<el-input v-model="editForm.netWorth" placeholder="资产处置单-净值"></el-input>
				</el-form-item> 
				<el-form-item label="资产出直单-报废变卖值" prop="premiumSale">
					<el-input v-model="editForm.premiumSale" placeholder="资产出直单-报废变卖值"></el-input>
				</el-form-item> 
				<el-form-item label="资产处置单-处置方式0出让1转让2出售3报废4报损5置换6盘亏7拍卖8捐赠" prop="disposalType">
					<el-input v-model="editForm.disposalType" placeholder="资产处置单-处置方式0出让1转让2出售3报废4报损5置换6盘亏7拍卖8捐赠"></el-input>
				</el-form-item> 
				<el-form-item label="维修方式" prop="maintType">
					<el-input v-model="editForm.maintType" placeholder="维修方式"></el-input>
				</el-form-item> 
				<el-form-item label="维修费用" prop="maintFee">
					<el-input v-model="editForm.maintFee" placeholder="维修费用"></el-input>
				</el-form-item> 
				<el-form-item label="外部维修单位" prop="maintOutBranchId">
					<el-input v-model="editForm.maintOutBranchId" placeholder="外部维修单位"></el-input>
				</el-form-item> 
				<el-form-item label="外部维修单位名称" prop="maintOutBranchName">
					<el-input v-model="editForm.maintOutBranchName" placeholder="外部维修单位名称"></el-input>
				</el-form-item> 
				<el-form-item label="占原值百分比" prop="maintOrignAmountPct">
					<el-input v-model="editForm.maintOrignAmountPct" placeholder="占原值百分比"></el-input>
				</el-form-item> 
				<el-form-item label="创建日期" prop="createDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.createDate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="主键" prop="id">
					<el-input v-model="editForm.id" placeholder="主键"></el-input>
				</el-form-item> 
				<el-form-item label="ass_asset_mng操作单编号" prop="requireId">
					<el-input v-model="editForm.requireId" placeholder="ass_asset_mng操作单编号"></el-input>
				</el-form-item> 
				<el-form-item label="资产处置备注文本" prop="disposeRemark">
					<el-input v-model="editForm.disposeRemark" placeholder="资产处置备注文本"></el-input>
				</el-form-item> 
				<el-form-item label="老的责任人" prop="oldPsersonLiableUserid">
					<el-input v-model="editForm.oldPsersonLiableUserid" placeholder="老的责任人"></el-input>
				</el-form-item> 
				<el-form-item label="老的责任人名称" prop="oldPsersonLiableUsername">
					<el-input v-model="editForm.oldPsersonLiableUsername" placeholder="老的责任人名称"></el-input>
				</el-form-item> 
				<el-form-item label="老的使用部门编号" prop="oldDeptid">
					<el-input v-model="editForm.oldDeptid" placeholder="老的使用部门编号"></el-input>
				</el-form-item> 
				<el-form-item label="老的使用部门名称" prop="oldDeptName">
					<el-input v-model="editForm.oldDeptName" placeholder="老的使用部门名称"></el-input>
				</el-form-item> 
				<el-form-item label="老的机构编号" prop="oldBranchId">
					<el-input v-model="editForm.oldBranchId" placeholder="老的机构编号"></el-input>
				</el-form-item> 
				<el-form-item label="老的机构名称" prop="oldBranchName">
					<el-input v-model="editForm.oldBranchName" placeholder="老的机构名称"></el-input>
				</el-form-item> 
				<el-form-item label="老的地点" prop="oldStoreAddress">
					<el-input v-model="editForm.oldStoreAddress" placeholder="老的地点"></el-input>
				</el-form-item> 
				<el-form-item label="老的仓库编号" prop="oldWarehouseId">
					<el-input v-model="editForm.oldWarehouseId" placeholder="老的仓库编号"></el-input>
				</el-form-item> 
				<el-form-item label="老的仓库名称" prop="oldWarehouseName">
					<el-input v-model="editForm.oldWarehouseName" placeholder="老的仓库名称"></el-input>
				</el-form-item> 
				<el-form-item label="老的新地点定位" prop="oldStoreAddressGps">
					<el-input v-model="editForm.oldStoreAddressGps" placeholder="老的新地点定位"></el-input>
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
	import { addAssetCardOper,editAssetCardOper } from '@/api/oa/erp/ass/assetCardOper';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'assetCardOperEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['assetCardOper','visible','opType'],

		watch: {
	      'assetCardOper':function( assetCardOper ) {
	        if(assetCardOper){
	            this.editForm = assetCardOper;
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
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					cardId:'',assetSn:'',assetStatusAfter:'',assetStatusBefore:'',assetMngId:'',adjustStockNum:'',allocDate:'',nowPsersonLiableUserid:'',nowPsersonLiableUsername:'',nowDeptid:'',nowDeptName:'',nowBranchId:'',nowBranchName:'',nowStoreAddress:'',nowWarehouseId:'',nowWarehouseName:'',nowStoreAddressGps:'',residualValue:'',netWorth:'',premiumSale:'',disposalType:'',maintType:'',maintFee:'',maintOutBranchId:'',maintOutBranchName:'',maintOrignAmountPct:'',createDate:'',id:'',requireId:'',disposeRemark:'',oldPsersonLiableUserid:'',oldPsersonLiableUsername:'',oldDeptid:'',oldDeptName:'',oldBranchId:'',oldBranchName:'',oldStoreAddress:'',oldWarehouseId:'',oldWarehouseName:'',oldStoreAddressGps:''
				},

			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//新增、编辑提交AssetCardOper ass_asset_card_oper父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addAssetCardOper
							if(this.currOpType=='edit'){
							    func=editAssetCardOper
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
			    if(this.assetCardOper){
                    this.editForm = Object.assign({},this.assetCardOper);
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