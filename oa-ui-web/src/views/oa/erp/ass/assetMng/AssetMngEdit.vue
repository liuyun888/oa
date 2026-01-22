<template>
	<section  class="page-container padding"> 
		<el-row v-if="editForm.opType=='use'">
			<asset-receive-edit :asset-receive="editForm"  @cancel="onEditCancel" @submit="afterEditSubmit"></asset-receive-edit>
		</el-row>
		<el-row v-if="editForm.opType=='return'">
			<asset-return-edit :asset-return="editForm"  @cancel="onEditCancel" @submit="afterEditSubmit"></asset-return-edit>
		</el-row>
		<el-row v-if="editForm.opType=='maint'">
			<asset-maint-edit :asset-maint="editForm" @cancel="onEditCancel" @submit="afterEditSubmit"></asset-maint-edit>
		</el-row>
		<el-row v-if="editForm.opType=='dispose'">
			<asset-dispose-edit :asset-dispose="editForm" @cancel="onEditCancel" @submit="afterEditSubmit"></asset-dispose-edit>
		</el-row>
		<el-row v-if="editForm.opType=='change'">
			<asset-change-edit :asset-change="editForm" @cancel="onEditCancel" @submit="afterEditSubmit"></asset-change-edit>
		</el-row>
		<el-row v-if="editForm.opType=='reallocation'">
			<asset-reallocation-edit :asset-reallocation="editForm" @cancel="onEditCancel" @submit="afterEditSubmit"></asset-reallocation-edit>
		</el-row>
		<el-row v-if="editForm.opType=='lease'">
			<asset-lease-edit :asset-lease="editForm" @cancel="onEditCancel" @submit="afterEditSubmit"></asset-lease-edit>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { addAssetMng,editAssetMng } from '@/api/oa/erp/ass/assetMng';
	import { mapGetters } from 'vuex'
import AssetReceiveEdit from '../assetReceive/assetReceiveEdit.vue';
import AssetReturnEdit from '../assetReturn/assetReturnEdit.vue';
import AssetMaintEdit from '../assetMaint/assetMaintEdit.vue';
import AssetDisposeEdit from '../assetDispose/assetDisposeEdit.vue';
import AssetChangeEdit from '../assetChange/assetChangeEdit.vue';
import AssetReallocationEdit from '../assetReallocation/assetReallocationEdit.vue';
import AssetLeaseEdit from '../assetLease/assetLeaseEdit.vue';
	
	export default {
	    name:'assetMngEdit',
	    components: {
			AssetReceiveEdit,
			AssetReturnEdit,
			AssetMaintEdit,
			AssetDisposeEdit,
			AssetChangeEdit,
			AssetReallocationEdit,
			AssetLeaseEdit, 

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['assetMng','visible'],

		watch: {
	      'assetMng':function( assetMng ) {
	        if(assetMng){
	            this.editForm = assetMng;
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
						//{ required: true, message: '主键（采购申请单）不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					id:'',reqUserid:'',reqUsername:'',reqDeptid:'',reqDeptName:'',reqBranchId:'',reqBranchName:'',reqTitle:'',reqDate:'',reqReason:'',startDate:'',endDate:'',totalDay:'',opType:'',maintTotalFeeAmount:'',maintIsConsumables:'',dispTotalOrignAmount:'',dispTotalScrapSaleAmount:'',dispEditAssets:'',inDeptId:'',inDeptName:'',outDeptId:'',outDeptName:'',inBranchId:'',inBranchName:'',outBranchId:'',outBranchName:'',mngStatus:'',inventoryTask:'',bizProcInstId:'',bizKey:'',commentMsg:'',assignee:'',assigneeName:'',agree:'',flowLastTime:'',flowEndTime:'',actId:'',taskName:'',bizFlowState:''
				},
				
				opTypes:[
					{id:'use',name:'申领单'},
					{id:'return',name:'归还单'},
					{id:'maint',name:'维修单'},
					{id:'dispose',name:'处置单'},
					{id:'change',name:'变更单'},
					{id:'reallocation',name:'调拨单'},
					{id:'lease',name:'租借单'},
				],

			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//新增、编辑提交AssetMng 资产出租/出借单父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addAssetMng
							if(this.currOpType=='edit'){
							    func=editAssetMng
							}
							func(params).then((res) => {
                                this.load.edit=false
                                var tips=res.data.tips;
                                if(tips.isOk){
                                    this.editForm=res.data.data
                                    this.initData()
                                    this.currOpType="edit";
                                    this.$emit('submit');//  @submit="afterEditSubmit"
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
			    if(this.assetMng){
                    this.editForm = Object.assign({},this.assetMng);
                }
  
            },
			onEditCancel(){
				this.$emit('cancel');
			},
			afterEditSubmit(data){
				this.$emit('submit',data)
			}

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