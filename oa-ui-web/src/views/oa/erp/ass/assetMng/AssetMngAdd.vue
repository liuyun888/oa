<template>
	<section  class="page-container padding">
		<el-row v-if="!editForm.opType"> 
			<el-select  size="small" v-model="editForm.opType" placeholder="单据类型" clearable>
				<el-option :value="item.id" :label="item.name" :key="index" v-for="(item,index) in opTypes"></el-option> 
			</el-select>
		</el-row>
		<el-row v-if="editForm.opType=='use'">
			<asset-receive-add :asset-receive="editForm" @cancel="onAddCancel" @submit="afterAddSubmit"></asset-receive-add>
		</el-row>
		<el-row v-if="editForm.opType=='return'">
			<asset-return-add :asset-return="editForm"  @cancel="onAddCancel" @submit="afterAddSubmit"></asset-return-add>
		</el-row>
		<el-row v-if="editForm.opType=='maint'">
			<asset-maint-add :asset-maint="editForm" @cancel="onAddCancel" @submit="afterAddSubmit"></asset-maint-add>
		</el-row>
		<el-row v-if="editForm.opType=='dispose'">
			<asset-dispose-add :asset-dispose="editForm" @cancel="onAddCancel" @submit="afterAddSubmit"></asset-dispose-add>
		</el-row>
		<el-row v-if="editForm.opType=='change'">
			<asset-change-add :asset-change="editForm" @cancel="onAddCancel" @submit="afterAddSubmit"></asset-change-add>
		</el-row>
		<el-row v-if="editForm.opType=='reallocation'">
			<asset-reallocation-add :asset-reallocation="editForm" @cancel="onAddCancel" @submit="afterAddSubmit"></asset-reallocation-add>
		</el-row>
		<el-row v-if="editForm.opType=='lease'">
			<asset-lease-add :asset-lease="editForm" @cancel="onAddCancel" @submit="afterAddSubmit"></asset-lease-add>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { addAssetMng,editAssetMng } from '@/api/oa/erp/ass/assetMng';
	import { mapGetters } from 'vuex'
import AssetReceiveAdd from '../assetReceive/assetReceiveAdd.vue';
import AssetReturnAdd from '../assetReturn/assetReturnAdd.vue';
import AssetMaintAdd from '../assetMaint/assetMaintAdd.vue';
import AssetDisposeAdd from '../assetDispose/assetDisposeAdd.vue';
import AssetChangeAdd from '../assetChange/assetChangeAdd.vue';
import AssetReallocationAdd from '../assetReallocation/assetReallocationAdd.vue';
import AssetLeaseAdd from '../assetLease/assetLeaseAdd.vue';
	
	export default {
	    name:'assetMngEdit',
	    components: {
			AssetReceiveAdd,
			AssetReturnAdd,
			AssetMaintAdd,
			AssetDisposeAdd,
			AssetChangeAdd,
			AssetReallocationAdd,
			AssetLeaseAdd, 

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
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					id: [
						//{ required: true, message: '主键（采购申请单）不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					id:'',reqUserid:'',reqUsername:'',reqDeptid:'',reqDeptName:'',reqBranchId:'',reqBranchName:'',reqTitle:'',reqDate:'',reqReason:'',startDate:'',endDate:'',totalDay:'',opType:'',maintTotalFeeAmount:'',maintIsConsumables:'',dispTotalOrignAmount:'',dispTotalScrapSaleAmount:'',dispAddAssets:'',inDeptId:'',inDeptName:'',outDeptId:'',outDeptName:'',inBranchId:'',inBranchName:'',outBranchId:'',outBranchName:'',mngStatus:'',inventoryTask:'',bizProcInstId:'',bizKey:'',commentMsg:'',assignee:'',assigneeName:'',agree:'',flowLastTime:'',flowEndTime:'',actId:'',taskName:'',bizFlowState:''
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
			    if(this.assetMng){
                    this.editForm = Object.assign({},this.assetMng);
                } 
				this.editForm.opType='' 
            },
			onAddCancel(){
				this.$emit('cancel');
			},
			afterAddSubmit(data){
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