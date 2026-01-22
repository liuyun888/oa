<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main">
		<!--编辑界面 JxAssessGradeDetail 考核分数详情表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="id" prop="id">
					<el-input v-model="editForm.id" placeholder="id"></el-input>
				</el-form-item> 
				<el-form-item label="复评分" prop="rePoints">
					<el-input v-model="editForm.rePoints" placeholder="复评分"></el-input>
				</el-form-item> 
				<el-form-item label="总分表id" prop="gradeId">
					<el-input v-model="editForm.gradeId" placeholder="总分表id"></el-input>
				</el-form-item> 
				<el-form-item label="自评分" prop="selfPoints">
					<el-input v-model="editForm.selfPoints" placeholder="自评分"></el-input>
				</el-form-item> 
				<el-form-item label="核定分" prop="vouchPoints">
					<el-input v-model="editForm.vouchPoints" placeholder="核定分"></el-input>
				</el-form-item> 
				<el-form-item label="考核项主键" prop="contentId">
					<el-input v-model="editForm.contentId" placeholder="考核项主键"></el-input>
				</el-form-item> 
				<el-form-item label="序号" prop="seqNum">
					<el-input-number v-model="editForm.seqNum" :min="0" :max="200"></el-input-number>
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
	import { addJxAssessGradeDetail,editJxAssessGradeDetail } from '@/api/oa/jx/jxAssessGradeDetail';
	import { mapGetters } from 'vuex'
	
	export default {
	    components: {
            //JxAssessGradeDetailEdit,
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['jxAssessGradeDetail','visible','opType'],

		watch: {
	      'jxAssessGradeDetail':function( jxAssessGradeDetail ) {
	        if(jxAssessGradeDetail){
	            this.editForm = jxAssessGradeDetail;
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

				//编辑界面数据  JxAssessGradeDetail 考核分数详情表
				editForm: {
					id:'',grade:'',gradeId:'',selfPoints:'',vouchPoints:'',contentId:'',seqNum:''
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
			//编辑提交JxAssessGradeDetail 考核分数详情表父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							if(this.currOpType=='edit'){
							    editJxAssessGradeDetail(params).then((res) => {
                                    this.load.edit=false
                                    var tips=res.data.tips;
                                    if(tips.isOk){
                                        this.$emit('submit');//  @submit="afterEditSubmit"
                                    }
                                    this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                                }).catch( err =>this.load.edit=false);
							}else{
							    addJxAssessGradeDetail(params).then((res) => {
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
			    if(this.jxAssessGradeDetail){
                    this.editForm = Object.assign({},this.jxAssessGradeDetail);
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