<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main">
		<!--编辑界面 JxAssessScheme 考核方案--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="id" prop="id">
					<el-input v-model="editForm.id" placeholder="id"></el-input>
				</el-form-item> 
				<el-form-item label="所属考核方案" prop="schemeType">
					<el-input v-model="editForm.schemeType" placeholder="所属考核方案"></el-input>
				</el-form-item> 
				<el-form-item label="计划开始天数" prop="planStartDay">
					<el-input v-model="editForm.planStartDay" placeholder="计划开始天数"></el-input>
				</el-form-item> 
				<el-form-item label="计划开始类型（1-之前；2-之后）" prop="planStartType">
					<el-input v-model="editForm.planStartType" placeholder="计划开始类型（1-之前；2-之后）"></el-input>
				</el-form-item> 
				<el-form-item label="说明" prop="remark">
					<el-input v-model="editForm.remark" placeholder="说明"></el-input>
				</el-form-item> 
				<el-form-item label="计划结束天数" prop="planEndDay">
					<el-input v-model="editForm.planEndDay" placeholder="计划结束天数"></el-input>
				</el-form-item> 
				<el-form-item label="计划结束类型（1-之前；2-之后）" prop="planEndType">
					<el-input v-model="editForm.planEndType" placeholder="计划结束类型（1-之前；2-之后）"></el-input>
				</el-form-item> 
				<el-form-item label="组织机构号" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="组织机构号"></el-input>
				</el-form-item> 
				<el-form-item label="是否启动方案（1-启动；0-不启动）" prop="planIsUseed">
					<el-input v-model="editForm.planIsUseed" placeholder="是否启动方案（1-启动；0-不启动）"></el-input>
				</el-form-item> 
				<el-form-item label="是否提醒考核（1-提醒；0-不提醒）" prop="planIsRemind">
					<el-input v-model="editForm.planIsRemind" placeholder="是否提醒考核（1-提醒；0-不提醒）"></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="createdAt">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.createdAt"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="更新时间" prop="updatedAt">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.updatedAt"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
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
	import { addJxAssessScheme,editJxAssessScheme } from '@/api/oa/jx/jxAssessScheme';
	import { mapGetters } from 'vuex'
	
	export default {
	    components: {
            //JxAssessSchemeEdit,
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['jxAssessScheme','visible','opType'],

		watch: {
	      'jxAssessScheme':function( jxAssessScheme ) {
	        if(jxAssessScheme){
	            this.editForm = jxAssessScheme;
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

				//编辑界面数据  JxAssessScheme 考核方案
				editForm: {
					id:'',schemeType:'',planStartDay:'',planStartType:'',remark:'',planEndDay:'',planEndType:'',branchId:'',status:'',remindStatus:'',createdAt:'',updatedAt:'',name:'',templateId:'',templateName:'',autoInit:''
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
			//编辑提交JxAssessScheme 考核方案父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							if(this.currOpType=='edit'){
							    editJxAssessScheme(params).then((res) => {
                                    this.load.edit=false
                                    var tips=res.data.tips;
                                    if(tips.isOk){
                                        this.$emit('submit');//  @submit="afterEditSubmit"
                                    }
                                    this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                                }).catch( err =>this.load.edit=false);
							}else{
							    addJxAssessScheme(params).then((res) => {
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
			    if(this.jxAssessScheme){
                    this.editForm = Object.assign({},this.jxAssessScheme);
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