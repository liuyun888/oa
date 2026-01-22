<template>
	<section>
		<el-row>
			<!--工具条1-->  
			<!--如果有更多工具条,放开此注释
			<el-col :span="24" class="toolbar" size="small" style="padding-bottom: 0px;">
				<el-col :span="4">
				</el-col>
			</el-col>
			-->
			 
			<!--新增界面 MatterInspectStandard 事项检查依据--> 
			<el-form :model="addForm" size="small" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="id" prop="id">
					<el-input v-model="addForm.id" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="依据名称（检查依据）" prop="accordingName">
					<el-input v-model="addForm.accordingName" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="依据条款（检查依据）" prop="clause">
					<el-input v-model="addForm.clause" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="检查内容id" prop="contentId">
					<el-input v-model="addForm.contentId" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="云用户机构编号" prop="branchId">
					<el-input v-model="addForm.branchId" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="检查标准" prop="standard">
					<el-input v-model="addForm.standard" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item>
					<el-col :span="24" size="small">
						<el-col :span="4" :offset="16"> 
							<el-button @click.native="handleCancel">取消</el-button> 
						</el-col>
						<el-col :span="4"> 
							<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>  
						</el-col>
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库
	//import { selectCacheOptions,getDefaultValue,getCodeName } from '../../../../api/common/code';//下拉框数据查询
	import { addMatterInspectStandard } from '../../../../api/oa/matter/matterInspectStandard';
	
	export default {
		props:['matterInspectStandard','visible'],
		watch: {
	      'matterInspectStandard':function( matterInspectStandard ) {
	        this.addForm = matterInspectStandard;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },	
		data() {
			return {
				options:{},//下拉选择框的所有静态数据
				addLoading: false,
				addFormRules: {
					id: [
						//{ required: true, message: 'id', trigger: 'change' }
					]
				},
				//新增界面数据 事项检查依据
				addForm: {
					id:'',accordingName:'',clause:'',contentId:'',branchId:'',standard:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增提交MatterInspectStandard 事项检查依据 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true; 
							let params = Object.assign({}, this.addForm); 
							addMatterInspectStandard(params).then((res) => {
								this.addLoading = false; 
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.addLoading = false;
							});
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'matter-inspect-standard-edit':MatterInspectStandardEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.matterInspectStandard);
			//加载下拉列表 如有需要去掉注释
			/**
			let optionsParams={code:'all',fieldNames:['sex']};
			selectCacheOptions(optionsParams).then(res=>{
				this.options=res.data.data;
			}); 
			**/
			//给下拉列表初始化默认值
			//this.addForm.xxx=getDefaultValue(this.options.xxx,'1');
			
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>