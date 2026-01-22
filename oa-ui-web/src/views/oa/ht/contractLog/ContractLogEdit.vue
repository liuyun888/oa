<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main">
		<!--编辑界面 ContractLog ht_contract_log--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="操作编号" prop="id">
					<el-input v-model="editForm.id" placeholder="操作编号"></el-input>
				</el-form-item> 
				<el-form-item label="合同编号" prop="htId">
					<el-input v-model="editForm.htId" placeholder="合同编号"></el-input>
				</el-form-item> 
				<el-form-item label="操作描述" prop="opRemark">
					<el-input v-model="editForm.opRemark" placeholder="操作描述"></el-input>
				</el-form-item> 
				<el-form-item label="操作人编号" prop="opUserid">
					<el-input v-model="editForm.opUserid" placeholder="操作人编号"></el-input>
				</el-form-item> 
				<el-form-item label="操作人姓名" prop="opUsername">
					<el-input v-model="editForm.opUsername" placeholder="操作人姓名"></el-input>
				</el-form-item> 
				<el-form-item label="操作时间" prop="opTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.opTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="操作者机器ip" prop="opIp">
					<el-input v-model="editForm.opIp" placeholder="操作者机器ip"></el-input>
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
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { addContractLog,editContractLog } from '@/api/oa/ht/contractLog';
	import { mapGetters } from 'vuex'
	
	export default {
	    components: {
            //ContractLogEdit,
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['contractLog','visible','opType'],

		watch: {
	      'contractLog':function( contractLog ) {
	        if(contractLog){
	            this.editForm = contractLog;
	        }

	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
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
						//{ required: true, message: '操作编号不能为空', trigger: 'change' }
					]
				},

				//编辑界面数据  ContractLog ht_contract_log
				editForm: {
					id:'',htId:'',opRemark:'',opUserid:'',opUsername:'',opTime:'',opIp:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/

			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交ContractLog ht_contract_log父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							if(this.currOpType=='edit'){
							    editContractLog(params).then((res) => {
                                    this.load.edit=false
                                    var tips=res.data.tips;
                                    if(tips.isOk){
                                        this.$emit('submit');//  @submit="afterEditSubmit"
                                    }
                                    this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                                }).catch( err =>this.load.edit=false);
							}else{
							    addContractLog(params).then((res) => {
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
							}
						});
					}
				});
			},
			initData: function(){
			    this.currOpType=this.opType
			    if(this.contractLog){
                    this.editForm = Object.assign({},this.contractLog);
                }

                if(this.opType=='edit'){

                }else{

                }
            },
			/**begin 在下面加自定义方法**/

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