<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="150px" :rules="addFormRules" ref="addForm">
				<el-form-item label="申请用车开始时间" prop="reqStartTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.reqStartTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="申请用车结束时间" prop="reqEndTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.reqEndTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="申请编号" prop="id">
					<el-input v-model="addForm.id" placeholder="申请编号" ></el-input>
				</el-form-item> 
				<!-- <el-form-item label="申请部门编号" prop="reqDeptid">
					<el-input v-model="addForm.reqDeptid" placeholder="申请部门编号" ></el-input>
				</el-form-item> 
				 -->
				<el-form-item label="申请部门名称" prop="reqDeptName">
					<!-- <el-input v-model="addForm.reqDeptName" placeholder="申请部门名称" ></el-input> -->
					<el-button type="text" @click="dialogFormVisible = true">选择部门</el-button>
          			<el-tag style="margin-left: 50px;" v-if="addForm.reqDeptName != ''" v-text='"已选择: " + addForm.reqDeptName' ></el-tag>
				</el-form-item> 
				<!-- <el-form-item label="申请机构号" prop="reqBranchId">
					<el-input v-model="addForm.reqBranchId" placeholder="申请机构号" ></el-input>
				</el-form-item>  -->
				<el-form-item label="申请人编号" prop="reqUserid">
					<!-- <el-input v-model="addForm.reqUserid" placeholder="申请人编号" ></el-input> -->
					<el-button type="text" @click="selectUserFormVisible = true">选择申请人</el-button>
					<el-tag style="margin-left: 40px;" v-if="addForm.reqUserid != ''"  v-text='"已选择: " + addForm.reqUsername'></el-tag>
				</el-form-item> 
				<el-form-item label="司机车辆" prop="reqUserid">
					<el-button type="text" @click="carDriverIsCheck = !carDriverIsCheck">切换</el-button>
					<el-button type="text" v-if="carDriverIsCheck"  @click="selectCarDriverTplsVisible = true">选择车辆和司机</el-button>
					<el-button type="text" v-if="!carDriverIsCheck" @click="selectCarFormVisible = true">选择车辆</el-button>
					<el-button type="text" v-if="!carDriverIsCheck" @click="selectDriverFormVisible = true">选择司机</el-button>

					<div v-if="addForm.carDriverTplId !='' ">
						<el-tag type="info" closable  style="margin-left: 20px;"  v-text='"已选择模板------   " + addForm.carDriverTplName'></el-tag>
					</div>
					<div v-if="addForm.carName != ''" >
						<el-tag type="info" closable  style="margin-left: 20px;" v-text='"已选择汽车------  " + addForm.carName'></el-tag>
					</div>
					<div v-if="addForm.driverName != ''">
						<el-tag type="info"  closable  style="margin-left: 20px;"  v-text='"已选择司机------ " + addForm.driverName'></el-tag>
					</div>
					
				</el-form-item> 

				<el-form-item label="申请费用" prop="reqExpense">
					<template>
						<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
						<div style="margin: 15px 0;"></div>
						<el-checkbox-group v-model="checkedExpenseDetailTpls" @change="handleCheckedTplsChange">
							<el-checkbox v-for="tpl in carExpenseDetailTpls" :label="tpl.id" :key="tpl.id">
								{{tpl.itemName}}
							</el-checkbox>
						</el-checkbox-group>
					</template>
				</el-form-item> 
				
				<el-form-item label="申请人姓名" prop="reqUsername">
					<el-input v-model="addForm.reqUsername" placeholder="申请人姓名" ></el-input>
				</el-form-item> 
				<el-form-item label="申请人电话" prop="reqPhoneno">
					<el-input v-model="addForm.reqPhoneno" placeholder="申请人电话" ></el-input>
				</el-form-item> 
				<el-form-item label="申请事由" prop="reqReason">
					<el-input v-model="addForm.reqReason" placeholder="申请事由" ></el-input>
				</el-form-item> 
				<el-form-item label="申请时间" prop="reqTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.reqTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<!-- <el-form-item label="申请状态" prop="reqStatus">
					<el-input v-model="addForm.reqStatus" placeholder="申请状态" ></el-input>
				</el-form-item> 
				<el-form-item label="审批状态" prop="bizFlowState">
					<el-input v-model="addForm.bizFlowState" placeholder="审批状态" ></el-input>
				</el-form-item>  -->
				<el-form-item label="流程实例编号" prop="bizProcInstId">
					<el-input v-model="addForm.bizProcInstId" placeholder="流程实例编号" ></el-input>
				</el-form-item> 
				<el-form-item label="目的地地址" prop="destAddress">
					<el-input v-model="addForm.destAddress" placeholder="目的地地址" ></el-input>
				</el-form-item> 
				<el-form-item label="目的地定位" prop="destGps">
					<el-input v-model="addForm.destGps" placeholder="目的地定位" ></el-input>
				</el-form-item> 
				<el-form-item label="申请标题" prop="reqTitle">
					<el-input v-model="addForm.reqTitle" placeholder="申请标题" ></el-input>
				</el-form-item> 
				<el-form-item label="是否规划路线" prop="hasRoute">
					<el-input v-model="addForm.hasRoute" placeholder="是否规划路线" ></el-input>
				</el-form-item> 
				<el-form-item label="机构名称" prop="reqBranchName">
					<el-input v-model="addForm.reqBranchName" placeholder="机构名称" ></el-input>
				</el-form-item> 
				<el-form-item>
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
		</el-row>
		<el-dialog append-to-body title="选择部门" :visible.sync="dialogFormVisible" width="60%">
			<dept-tree
				show-root
				default-expand-all
				show-checkbox
				:expand-on-click-node="false"
				@node-click="handleLeftDeptNodeClick"
			></dept-tree>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog append-to-body title="选择申请人" :visible.sync="selectUserFormVisible" width="80%">
		    <users-select @confirm="onUserSelected">
			</users-select>
			<!-- <div slot="footer" class="dialog-footer">
					<el-button @click="selectUserFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="selectUserFormVisible = false">确 定</el-button>
			</div> -->
		 </el-dialog>

		<el-dialog append-to-body title="选择司机车辆" :visible.sync="selectCarDriverTplsVisible" width="80%">
		    <carDriverTpls-Select @confirmTpls="onCarDriverSelected">
			</carDriverTpls-Select>
			<!-- <div slot="footer" class="dialog-footer">
					<el-button @click="selectCarDriverTplsVisible = false">取 消</el-button>
					<el-button type="primary" @click="selectCarDriverTplsVisible = false">确 定</el-button>
			</div> -->
		 </el-dialog>

		<el-dialog append-to-body title="选择车辆" :visible.sync="selectCarFormVisible" width="40%">
		    <cars-select :value='this.addForm.carId' @getSelectVal="onCarSelected"></cars-select>
			<div slot="footer" class="dialog-footer">
					<el-button @click="selectCarFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="selectCarFormVisible = false">确 定</el-button>
			</div>
		 </el-dialog>
		<el-dialog append-to-body title="选择司机" :visible.sync="selectDriverFormVisible" width="40%">
		    <drivers-select :value='this.addForm.driverId' @getSelectDriverVal="onDriverSelected"></drivers-select>
			<div slot="footer" class="dialog-footer">
					<el-button @click="selectDriverFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="selectDriverFormVisible = false">确 定</el-button>
			</div>
		 </el-dialog>

	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addCarRequire } from '@/api/oa/car/carRequire';
	import DeptTree from "@/views/mdp/sys/dept/DeptTree"; //选择部门的
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect"; //选择用户
	import { mapGetters } from 'vuex'
	import CarDriverTplsSelect from "../components/CarDriverTplsSelect"; 
	import CarsSelect from "../components/CarsSelect";
	import DriversSelect from "../components/DriversSelect";
	import { listCarExpenseDetailTpl } from '@/api/oa/car/carExpenseDetailTpl';

	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['carRequire','visible'],
		watch: {
	      'carRequire':function( carRequire ) {
	        this.addForm = carRequire;
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
						//{ required: true, message: '申请编号不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 car_require
				addForm: {
					reqStartTime:'',reqEndTime:'',id:'',reqDeptid:'',reqDeptName:'',reqBranchId:'',reqUserid:'',reqUsername:'',reqPhoneno:'',reqReason:'',reqTime:'',reqStatus:'',bizFlowState:'',bizProcInstId:'',destAddress:'',destGps:'',reqTitle:'',hasRoute:'',reqBranchName:'',
					carDriverTplId:'',carDriverTplName: '',
					carId: '',carName: '',
					driverId: '',driverName: '',
					checkedExpenseDetailTpls: [],

				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				dialogFormVisible: false,
				selectUserFormVisible: false,
				selectCarDriverTplsVisible: false,
				selectCarFormVisible: false,
				selectDriverFormVisible: false,
				carExpenseDetailTpls: [],//查询结果费用
				checkAll: false,
				checkedExpenseDetailTpls: [],
				isIndeterminate: false,

				//判断选择司机模板或者单独选择司机车辆 true为模板，false为单独
				carDriverIsCheck : true,


				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交CarRequire car_require 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addCarRequire(params).then((res) => {
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
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			 //获取选择的部门
			handleLeftDeptNodeClick(data, node, comp) {
				this.addForm.reqDeptName = data.deptName;
				this.addForm.reqDeptid = data.deptid;
				this.dialogFormVisible = false
			},	
			onUserSelected: function(users) {
				console.log(users[0].userid)
				this.addForm.reqUserid = users[0].userid
				this.addForm.reqUsername = users[0].username
				this.selectUserFormVisible = false
    		},
			onCarDriverSelected(data){
				
				this.addForm.carDriverTplName = '汽车名：' + data[0].carName + '-----司机名：' + data[0].driverUsername
				this.addForm.carDriverTplId = data[0].id
				//console.log(this.addForm.carDriverTplId )
				this.selectCarDriverTplsVisible = false
			},
			onCarSelected: function(obj) {
				console.log(obj)
				this.addForm.carId = obj.id
				this.addForm.carName = obj.carName
				//this.carName = obj.carName
				this.selectCarDriverTplsVisible = false

    		},
			onDriverSelected: function(obj) {
				console.log(obj)
				this.addForm.driverId = obj.driverId
				this.addForm.driverName = obj.driverUsername
				this.selectDriverFormVisible = false
    		},
			handleClose(tag) {
				//this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
				console.log(tag)
			  },
			  //获取列表 CarExpenseDetailTpl car_expense_detail_tpl
			getCarExpenseDetailTpls() {
				let params = {
					// pageSize: this.pageInfo.pageSize,
					// pageNum: this.pageInfo.pageNum,
					// total: this.pageInfo.total,
					// count:this.pageInfo.count
				};
				listCarExpenseDetailTpl(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.carExpenseDetailTpls = res.data.data;
						this.carExpenseLength = this.carExpenseDetailTpls.length
						console.log(this.carExpenseDetailTpls)
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
				}).catch(  );
			},
			handleCheckAllChange(val) {
				if(val){
					this.carExpenseDetailTpls.forEach(expend => {
						this.checkedExpenseDetailTpls.push(expend.id)
					})
				}else{
					this.checkedExpenseDetailTpls = []
				}
				// this.checkedExpenseDetailTpls = val ? this.carExpenseDetailTpls : [];
				this.isIndeterminate = false;
				console.log('handleCheckAllChange' + this.checkedExpenseDetailTpls)
			},
			handleCheckedTplsChange(value) {
				let checkedCount = value.length;
				this.checkAll = checkedCount === this.carExpenseDetailTpls.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.carExpenseDetailTpls.length;
				console.log('handleCheckedTplsChange----' + value)
			}

			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'car-require-edit':CarRequireEdit
			"dept-tree": DeptTree,
			"users-select" : UsersSelect,
			'carDriverTpls-Select' : CarDriverTplsSelect,
			'cars-select' : CarsSelect,
			'drivers-select' : DriversSelect
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.carRequire);  
			/**在下面写其它函数***/
			this.getCarExpenseDetailTpls()
		}//end mounted
	}

</script>

<style scoped>

</style>