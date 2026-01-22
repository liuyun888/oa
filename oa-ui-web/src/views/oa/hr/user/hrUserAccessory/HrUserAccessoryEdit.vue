<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="id" prop="id">
					<el-input v-model="editForm.id" placeholder="id"></el-input>
				</el-form-item> 
				<el-form-item label="附件名称" prop="name">
					<el-input v-model="editForm.name" placeholder="附件名称"></el-input>
				</el-form-item> 
				<el-form-item label="类型0-合同，1-简历，2-其他" prop="type">
					<el-input v-model="editForm.type" placeholder="类型0-合同，1-简历，2-其他"></el-input>
				</el-form-item> 
				<el-form-item label="附件地址" prop="accessory">
					<el-input v-model="editForm.accessory" placeholder="附件地址"></el-input>
				</el-form-item> 
				<el-form-item label="用户id" prop="userid">
					<el-input v-model="editForm.userid" placeholder="用户id"></el-input>
				</el-form-item> 
				<el-form-item label="上传时间" prop="uploadTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.uploadTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item> 
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>  
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editHrUserAccessory } from '@/api/oa/hr/user/hrUserAccessory';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['hrUserAccessory','visible'],
		watch: {
	      'hrUserAccessory':function( hrUserAccessory ) {
	        this.editForm = hrUserAccessory;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					id: [
						//{ required: true, message: 'id不能为空', trigger: 'change' }
					]
				},
				//编辑界面数据  HrUserAccessory hr_user_accessory
				editForm: {
					id:'',name:'',type:'',accessory:'',userid:'',uploadTime:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交HrUserAccessory hr_user_accessory父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editHrUserAccessory(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err =>this.load.edit=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'hr-user-accessory-edit':HrUserAccessoryEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.hrUserAccessory);  
		}
	}

</script>

<style scoped>

</style>