<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="汽车编号" prop="carId">
					<el-button type="text" @click="selectCarFormVisible = true">选择车辆</el-button>
					<el-tag style="margin-left: 50px;" v-if="editForm.carId != ''" v-text='"已选择: " + editForm.carName'></el-tag>
				</el-form-item> 
				<el-form-item label="司机编号" prop="driverId">
					<el-button type="text" @click="selectDriverFormVisible = true">选择司机</el-button>
					<el-tag style="margin-left: 50px;" v-if="editForm.driverId != ''" v-text='"已选择: " + editForm.driverUsername'></el-tag>
				</el-form-item> 
				<el-form-item style="display:none" label="主键" prop="id">
					<el-input v-model="editForm.id" placeholder="主键"></el-input>
				</el-form-item> 
				<el-form-item label="开始时间" prop="startTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.startTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="结束时间" prop="endTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.endTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="状态" prop="status">
					<!-- <el-input v-model="editForm.status" placeholder="状态1启用0禁用"></el-input> -->
					 <el-radio-group v-model="editForm.status" size="medium">
						<el-radio-button label="0">禁用</el-radio-button>
						<el-radio-button label="1">启用</el-radio-button>
					</el-radio-group>
				</el-form-item> 
				<el-form-item style="display:none" label="新增时间" prop="createTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.createTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item style="display:none" label="归属机构" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="归属机构"></el-input>
				</el-form-item> 
				<el-form-item> 
					<el-col> 
          <el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>
						<el-button @click.native="handleCancel">取消</el-button>  
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
		<el-dialog append-to-body title="选择车辆" :visible.sync="selectCarFormVisible" width="70%">
		    <cars-select :value='this.editForm.carId' @getSelectVal="onCarSelected" @cancel="cancel"></cars-select>
			<!-- <div slot="footer" class="dialog-footer">
					<el-button @click="selectCarFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="selectCarFormVisible = false">确 定</el-button>
			</div> -->
		 </el-dialog>
		<el-dialog append-to-body title="选择司机" :visible.sync="selectDriverFormVisible" width="60%">
		    <drivers-select :value='this.editForm.driverId' @getSelectDriverVal="onDriverSelected"  @cancel="cancel"></drivers-select>
			<!-- <div slot="footer" class="dialog-footer">
					<el-button @click="selectDriverFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="selectDriverFormVisible = false">确 定</el-button>
			</div> -->
		 </el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editCarCarDriverTpl } from '@/api/oa/car/carCarDriverTpl';
	import { mapGetters } from 'vuex'
	import CarsSelect from "../components/CarsSelect";
	import DriversSelect from "../components/DriversSelect";
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['carCarDriverTpl','visible'],
		watch: {
	      'carCarDriverTpl':function( carCarDriverTpl ) {
	        this.editForm = carCarDriverTpl;
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
					carId: [
						{ required: true, message: '汽车编号不能为空', trigger: 'change' }
					],
					driverId: [
						{ required: true, message: '司机编号不能为空', trigger: 'change' }
					]
				},
				//编辑界面数据  CarCarDriverTpl car_car_driver_tpl
				editForm: {
					carId:'',driverId:'',id:'',startTime:'',endTime:'',status:'',createTime:'',branchId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				selectCarFormVisible: false,
				selectDriverFormVisible: false,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交CarCarDriverTpl car_car_driver_tpl父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editCarCarDriverTpl(params).then((res) => {
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
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			onCarSelected: function(obj) {
				console.log(obj)
				this.editForm.carId = obj.id
				//this.carName = obj.carName
				this.selectCarFormVisible = false
    		},
			//关闭弹出框页面
			cancel(){
				this.selectCarFormVisible = false
				this.selectDriverFormVisible = false
			},
			onDriverSelected: function(obj) {
				console.log(obj)
				this.editForm.driverId = obj.driverId
				//this.driverName = obj.driverUsername
				this.selectDriverFormVisible = false
    		},
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
			//在下面添加其它组件 'car-car-driver-tpl-edit':CarCarDriverTplEdit
			'cars-select' : CarsSelect,
			'drivers-select' : DriversSelect
		},
		created() {
			this.editForm=Object.assign(this.editForm, this.carCarDriverTpl);  
			//this.carName = this.editForm.carId
			//this.driverName = this.editForm.driverId
		}
	}

</script>

<style scoped>

</style>