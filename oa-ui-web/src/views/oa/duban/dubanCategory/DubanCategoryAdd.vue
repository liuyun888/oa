<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item style="display:none" label="主键" prop="id">
					<el-input v-model="addForm.id" placeholder="主键" ></el-input>
				</el-form-item> 
				<el-form-item label="分类名称" prop="name">
					<el-input v-model="addForm.name" placeholder="分类名称" ></el-input>
				</el-form-item> 
				<el-form-item label="状态" prop="status">
					<!-- <el-input v-model="addForm.status" placeholder="状态1启用0禁用" ></el-input> -->
					<el-radio-group v-model="addForm.status">
						<el-radio-button label="1">启用</el-radio-button>
						<el-radio-button label="0">禁用</el-radio-button>
					</el-radio-group>
				</el-form-item> 
				<el-form-item style="display:none" label="归属机构" prop="branchId">
					<el-input v-model="addForm.branchId" placeholder="归属机构" ></el-input>
				</el-form-item> 
				<el-form-item label="备注说明" prop="remark">
					<el-input v-model="addForm.remark" placeholder="备注说明" ></el-input>
				</el-form-item> 
				<el-form-item style="display:none" label="新增时间" prop="createTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.createTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item>
					<el-col > 
						<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>  
            <el-button @click.native="handleCancel">取消</el-button>
          </el-col>
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addDubanCategory } from '@/api/oa/duban/dubanCategory';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['dubanCategory','visible'],
		watch: {
	      'dubanCategory':function( dubanCategory ) {
			this.addForm = dubanCategory;
			this.addForm.status = '1'
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					name: [
						{ required: true, message: '分类名称不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 duban_category
				addForm: {
					id:'',name:'',status: "1",branchId:'',remark:'',createTime:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交DubanCategory duban_category 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addDubanCategory(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'duban-category-edit':DubanCategoryEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.dubanCategory);  
			this.addForm.status = '1'
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>