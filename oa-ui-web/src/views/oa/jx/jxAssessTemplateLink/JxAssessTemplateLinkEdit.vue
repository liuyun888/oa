<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main">
		<!--编辑界面 JxAssessTemplateLink 考核模板和用户的关联表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="考核模板id" prop="templateId">
					<el-input v-model="editForm.templateId" placeholder="考核模板id"></el-input>
				</el-form-item> 
				<el-form-item label="组织id" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="组织id"></el-input>
				</el-form-item> 
				<el-form-item label="用户类型0-用户,1-部门，2-机构，3-项目，4-岗位" prop="linkType">
					<el-input v-model="editForm.linkType" placeholder="用户类型0-用户,1-部门，2-机构，3-项目，4-岗位"></el-input>
				</el-form-item> 
				<el-form-item label="当用户类型为0时存放用户编号，当用户类型为部门时，存部门编号，依次类推" prop="linkPkId">
					<el-input v-model="editForm.linkPkId" placeholder="当用户类型为0时存放用户编号，当用户类型为部门时，存部门编号，依次类推"></el-input>
				</el-form-item> 
				<el-form-item label="关联名称" prop="linkPkName">
					<el-input v-model="editForm.linkPkName" placeholder="关联名称"></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
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
	import { addJxAssessTemplateLink,editJxAssessTemplateLink } from '@/api/oa/jx/jxAssessTemplateLink';
	import { mapGetters } from 'vuex'
	
	export default {
	    components: {
            //JxAssessTemplateLinkEdit,
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['jxAssessTemplateLink','visible','opType'],

		watch: {
	      'jxAssessTemplateLink':function( jxAssessTemplateLink ) {
	        if(jxAssessTemplateLink){
	            this.editForm = jxAssessTemplateLink;
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
					templateId: [
						//{ required: true, message: '考核模板id不能为空', trigger: 'change' }
					]
				},

				//编辑界面数据  JxAssessTemplateLink 考核模板和用户的关联表
				editForm: {
					templateId:'',branchId:'',linkType:'',linkPkId:'',linkPkName:'',ctime:''
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
			//编辑提交JxAssessTemplateLink 考核模板和用户的关联表父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							if(this.currOpType=='edit'){
							    editJxAssessTemplateLink(params).then((res) => {
                                    this.load.edit=false
                                    var tips=res.data.tips;
                                    if(tips.isOk){
                                        this.$emit('submit');//  @submit="afterEditSubmit"
                                    }
                                    this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                                }).catch( err =>this.load.edit=false);
							}else{
							    addJxAssessTemplateLink(params).then((res) => {
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
			    if(this.jxAssessTemplateLink){
                    this.editForm = Object.assign({},this.jxAssessTemplateLink);
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