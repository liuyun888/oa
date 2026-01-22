<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="汽车编号" prop="carId">
					<el-input v-model="addForm.carId" placeholder="汽车编号" ></el-input>
				</el-form-item> 
				<el-form-item label="司机编号" prop="driverId">
					<el-input v-model="addForm.driverId" placeholder="司机编号" ></el-input>
				</el-form-item> 
				<el-form-item label="主键" prop="id">
					<el-input v-model="addForm.id" placeholder="主键" ></el-input>
				</el-form-item> 
				<el-form-item label="开始时间" prop="startTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.startTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="结束时间" prop="endTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.endTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="状态0启用1禁用" prop="status">
					<el-input v-model="addForm.status" placeholder="状态0启用1禁用" ></el-input>
				</el-form-item> 
				<el-form-item label="新增时间" prop="createTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.createTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="申请编号" prop="requireId">
					<el-input v-model="addForm.requireId" placeholder="申请编号" ></el-input>
				</el-form-item> 
				<el-form-item label="还车时间" prop="giveBackTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.giveBackTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="是否已还车0否1是" prop="giveBacked">
					<el-input v-model="addForm.giveBacked" placeholder="是否已还车0否1是" ></el-input>
				</el-form-item> 
				<el-form-item label="还车用户编号" prop="giveBackUserid">
					<el-input v-model="addForm.giveBackUserid" placeholder="还车用户编号" ></el-input>
				</el-form-item> 
				<el-form-item label="还车人姓名" prop="giveBackUsername">
					<el-input v-model="addForm.giveBackUsername" placeholder="还车人姓名" ></el-input>
				</el-form-item> 
				<el-form-item label="还车说明" prop="giveBackRemark">
					<el-input v-model="addForm.giveBackRemark" placeholder="还车说明" ></el-input>
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
	import { addCarRequireCarDriver } from '@/api/oa/car/carRequireCarDriver';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['carRequireCarDriver','visible'],
		watch: {
	      'carRequireCarDriver':function( carRequireCarDriver ) {
	        this.addForm = carRequireCarDriver;
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
						//{ required: true, message: '主键不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 car_require_car_driver
				addForm: {
					carId:'',driverId:'',id:'',startTime:'',endTime:'',status:'',createTime:'',requireId:'',giveBackTime:'',giveBacked:'',giveBackUserid:'',giveBackUsername:'',giveBackRemark:''
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
			//新增提交CarRequireCarDriver car_require_car_driver 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addCarRequireCarDriver(params).then((res) => {
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
		    //在下面添加其它组件 'car-require-car-driver-edit':CarRequireCarDriverEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.carRequireCarDriver);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>