<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="督办字号" prop="id">
					<el-input v-model="addForm.id" placeholder="督办字号" ></el-input>
				</el-form-item> 
				<el-form-item label="事项名称" prop="name">
					<el-input v-model="addForm.name" placeholder="事项名称" ></el-input>
				</el-form-item> 
				<el-form-item label="责任人id" prop="dutyId">
					<el-input v-model="addForm.dutyId" placeholder="责任人id" ></el-input>
				</el-form-item> 
				<el-form-item label="责任人名称" prop="dutyName">
					<el-input v-model="addForm.dutyName" placeholder="责任人名称" ></el-input>
				</el-form-item> 
				<el-form-item label="牵头部门id" prop="betweenDeptid">
					<el-input v-model="addForm.betweenDeptid" placeholder="牵头部门id" ></el-input>
				</el-form-item> 
				<el-form-item label="牵头部门名称" prop="betweenDeptName">
					<el-input v-model="addForm.betweenDeptName" placeholder="牵头部门名称" ></el-input>
				</el-form-item> 
				<el-form-item label="牵头人id||中间人id" prop="betweenId">
					<el-input v-model="addForm.betweenId" placeholder="牵头人id||中间人id" ></el-input>
				</el-form-item> 
				<el-form-item label="牵头人名称" prop="betweenName">
					<el-input v-model="addForm.betweenName" placeholder="牵头人名称" ></el-input>
				</el-form-item> 
				<el-form-item label="归属机构" prop="branchId">
					<el-input v-model="addForm.branchId" placeholder="归属机构" ></el-input>
				</el-form-item> 
				<el-form-item label="计划开始时间" prop="startTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.startTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="计划结束时间" prop="endTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.endTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="主办单位id" prop="hostDeptId">
					<el-input v-model="addForm.hostDeptId" placeholder="主办单位id" ></el-input>
				</el-form-item> 
				<el-form-item label="主办单位" prop="hostDeptName">
					<el-input v-model="addForm.hostDeptName" placeholder="主办单位" ></el-input>
				</el-form-item> 
				<el-form-item label="主办id" prop="hostId">
					<el-input v-model="addForm.hostId" placeholder="主办id" ></el-input>
				</el-form-item> 
				<el-form-item label="主办" prop="hostName">
					<el-input v-model="addForm.hostName" placeholder="主办" ></el-input>
				</el-form-item> 
				<el-form-item label="任务描述" prop="remark">
					<el-input v-model="addForm.remark" placeholder="任务描述" ></el-input>
				</el-form-item> 
				<el-form-item label="状态0已申报1进行中2已完成3已超时" prop="status">
					<el-input v-model="addForm.status" placeholder="状态0已申报1进行中2已完成3已超时" ></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="createTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.createTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item>
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addDubanItem } from '@/api/oa/duban/dubanItem';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['dubanItem','visible'],
		watch: {
	      'dubanItem':function( dubanItem ) {
	        this.addForm = dubanItem;
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
					id: [
						//{ required: true, message: '督办字号不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 duban_item
				addForm: {
					id:'',name:'',dutyId:'',dutyName:'',betweenDeptid:'',betweenDeptName:'',betweenId:'',betweenName:'',branchId:'',startTime:'',endTime:'',hostDeptId:'',hostDeptName:'',hostId:'',hostName:'',remark:'',status:'',createTime:''
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
			//新增提交DubanItem duban_item 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addDubanItem(params).then((res) => {
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
		    //在下面添加其它组件 'duban-item-edit':DubanItemEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.dubanItem);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>