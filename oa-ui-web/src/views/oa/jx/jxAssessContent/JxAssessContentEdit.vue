<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main">
		<!--编辑界面 JxAssessContent 考核模板内容表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="id" prop="id">
					<el-input v-model="editForm.id" placeholder="id"></el-input>
				</el-form-item> 
				<el-form-item label="考核指标项" prop="name">
					<el-input v-model="editForm.name" placeholder="考核指标项"></el-input>
				</el-form-item> 
				<el-form-item label="考核指标说明" prop="remark">
					<el-input v-model="editForm.remark" placeholder="考核指标说明"></el-input>
				</el-form-item> 
				<el-form-item label="权重%" prop="weight">
					<el-input v-model="editForm.weight" placeholder="权重%"></el-input>
				</el-form-item> 
				<el-form-item label="权重说明" prop="remark">
					<el-input v-model="editForm.remark" placeholder="权重说明"></el-input>
				</el-form-item> 
				<el-form-item label="考核模板id" prop="templateId">
					<el-input v-model="editForm.templateId" placeholder="考核模板id"></el-input>
				</el-form-item> 
				<el-form-item label="组织id" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="组织id"></el-input>
				</el-form-item> 
				<el-form-item label="序号" prop="seqNum">
					<el-input v-model="editForm.seqNum" placeholder="序号"></el-input>
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
	import { addJxAssessContent,editJxAssessContent } from '@/api/oa/jx/jxAssessContent';
	import { mapGetters } from 'vuex'
	
	export default {
	    components: {
            //JxAssessContentEdit,
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['jxAssessContent','visible','opType'],

		watch: {
	      'jxAssessContent':function( jxAssessContent ) {
	        if(jxAssessContent){
	            this.editForm = jxAssessContent;
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
						//{ required: true, message: 'id不能为空', trigger: 'change' }
					]
				},

				//编辑界面数据  JxAssessContent 考核模板内容表
				editForm: {
					id:'',name:'',remark:'',weight:'',remark:'',templateId:'',branchId:'',seqNum:''
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
			//编辑提交JxAssessContent 考核模板内容表父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							if(this.currOpType=='edit'){
							    editJxAssessContent(params).then((res) => {
                                    this.load.edit=false
                                    var tips=res.data.tips;
                                    if(tips.isOk){
                                        this.$emit('submit');//  @submit="afterEditSubmit"
                                    }
                                    this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                                }).catch( err =>this.load.edit=false);
							}else{
							    addJxAssessContent(params).then((res) => {
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
			    if(this.jxAssessContent){
                    this.editForm = Object.assign({},this.jxAssessContent);
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