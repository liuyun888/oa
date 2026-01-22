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
		 
		<!--编辑界面 MatterInspectItem 检查项目--> 
			<el-form :model="editForm" size="small" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="id" prop="id">
					<el-input v-model="editForm.id" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="序号" prop="orderNumber">
					<el-input v-model="editForm.orderNumber" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="检查项目名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="事项基本信息id" prop="infoId">
					<el-input v-model="editForm.infoId" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="云用户机构编号" prop="branchId">
					<el-input v-model="editForm.branchId" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item>
					<el-col :span="24" size="small">
						<el-col :span="4" :offset="16"> 
							<el-button @click.native="handleCancel">取消</el-button> 
						</el-col>
						<el-col :span="4"> 
							<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>  
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
	import { editMatterInspectItem } from '../../../../api/oa/matter/matterInspectItem';
	
	export default {
		props:['matterInspectItem','visible'],
		watch: {
	      'matterInspectItem':function( matterInspectItem ) {
	        this.editForm = matterInspectItem;
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
				editLoading: false,
				editFormRules: {
					id: [
						//{ required: true, message: 'id', trigger: 'change' }
					]
				},
				//编辑界面数据  MatterInspectItem 检查项目
				editForm: {
					id:'',orderNumber:'',name:'',infoId:'',branchId:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//编辑提交MatterInspectItem 检查项目父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true; 
							let params = Object.assign({}, this.editForm); 
							editMatterInspectItem(params).then((res) => {
								this.editLoading = false; 
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.editLoading = false;
							});
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'matter-inspect-item-edit':MatterInspectItemEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.matterInspectItem);
			//加载下拉列表 如有需要去掉注释
			/**
			let optionsParams={code:'all',fieldNames:['sex']};
			selectCacheOptions(optionsParams).then(res=>{
				this.options=res.data.data;
			}); 
			**/
			//给下拉列表初始化默认值
			//this.editForm.xxx=getDefaultValue(this.options.xxx,'1');
			
			/**在下面写其它函数***/
		}
	}

</script>

<style scoped>

</style>