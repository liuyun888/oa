<template>
	<section>
		<el-row class="page-container border padding">
      
			<!--新增界面 CarRequire car_require--> 
			<el-form :model="addForm"  label-width="150px" :rules="addFormRules" ref="addForm">
				<el-row>
				<el-col :span="12">
						<el-form-item label="申请用车开始时间" prop="reqStartTime">
						<el-date-picker type="date" placeholder="选择日期" v-model="addForm.reqStartTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
					</el-form-item> 
				</el-col>
				<el-col :span="12">
					<el-form-item label="申请用车结束时间" prop="reqEndTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.reqEndTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
					</el-form-item> 
						</el-col>
				</el-row>
				<el-row>
				<el-col :span="12">
					<el-form-item label="申请事由" prop="reqReason">
						<el-input v-model="addForm.reqReason" placeholder="申请事由" ></el-input>
					</el-form-item> 
				</el-col>
				<el-col :span="12">
					<el-form-item label="申请编号" prop="id">
						<el-input :disabled='true' v-model="addForm.id" placeholder="申请编号" ></el-input>
					</el-form-item> 
						</el-col>
				</el-row>

				<el-row>
				<el-col :span="12">
						<el-form-item label="申请部门名称" prop="reqDeptName">
					<!-- <el-input v-model="addForm.reqDeptName" placeholder="申请部门名称" ></el-input> -->
					<el-button type="text" @click="dialogFormVisible = true">选择部门</el-button>
						<el-tag style="margin-left: 50px;" v-if="addForm.reqDeptName != ''" v-text='"已选择: " + addForm.reqDeptName' ></el-tag>
					</el-form-item> 
				</el-col>
				<el-col :span="12">
				<el-form-item label="申请人编号" prop="reqUserid">
					<!-- <el-input v-model="addForm.reqUserid" placeholder="申请人编号" ></el-input> -->
					<el-button type="text" @click="selectUserFormVisible = true">选择申请人</el-button>
					<el-tag style="margin-left: 40px;" v-if="addForm.reqUserid != ''"  v-text='"已选择: " + addForm.reqUsername'></el-tag>
					</el-form-item> 
						</el-col>
				</el-row>

				<el-row>
				<el-col :span="12">
					<el-form-item label="司机车辆" prop="reqUserid">
					<el-button type="text" @click="carDriverIsCheck = !carDriverIsCheck">切换</el-button>
					<el-button type="text" v-if="carDriverIsCheck"  @click="selectCarDriverTplsVisible = true">选择车辆和司机</el-button>
					<el-button type="text" v-if="!carDriverIsCheck" @click="selectCarFormVisible = true">选择车辆</el-button>
					<el-button type="text" v-if="!carDriverIsCheck" @click="selectDriverFormVisible = true">选择司机</el-button>

					<div v-if="addForm.carDriverTplId !='' ">
						<el-tag closable type="info" @close="handleClose(addForm.carDriverTplName,'carDriverTplName')" style="margin-left: 20px;">已选择模板------{{addForm.carDriverTplName}}</el-tag>
					</div>
					<div v-if="addForm.carName != ''" >
						<el-tag closable type="info" @close="handleClose(addForm.carName,'carName')" style="margin-left: 20px;">已选择汽车------{{addForm.carName}}</el-tag>
					</div>
					<div v-if="addForm.driverName != ''">
						<el-tag closable type="info" @close="handleClose(addForm.driverName,'driverName')" style="margin-left: 20px;">已选择司机------{{addForm.driverName}}</el-tag>
					</div>
					</el-form-item> 
				</el-col>
				<el-col :span="12">
					<el-form-item label="申请人姓名" prop="reqUsername">
					<el-input v-model="addForm.reqUsername" placeholder="申请人姓名" ></el-input>
					</el-form-item> 
						</el-col>
				</el-row>

				<el-row>
				<el-col :span="12">
						<el-form-item label="申请人电话" prop="reqPhoneno">
						<el-input v-model="addForm.reqPhoneno" placeholder="申请人电话" ></el-input>
					</el-form-item> 
				</el-col>
				<el-col :span="12">
					<el-form-item label="申请时间" prop="reqTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.reqTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
					</el-form-item> 
						</el-col>
				</el-row>

				<el-row>
				<el-col :span="12">
					<el-form-item label="流程实例编号" prop="bizProcInstId">
					<el-input v-model="addForm.bizProcInstId" placeholder="流程实例编号" ></el-input>
					</el-form-item> 
				</el-col>
				<el-col :span="12">
				<el-form-item label="申请标题" prop="reqTitle">
					<el-input v-model="addForm.reqTitle" placeholder="申请标题" ></el-input>
					</el-form-item> 
						</el-col>
				</el-row>

				<el-row>
				<el-col :span="12">
						<el-form-item label="目的地地址" prop="destAddress">
						<el-input v-model="addForm.destAddress" placeholder="目的地地址" ></el-input>
					</el-form-item> 
				</el-col>
				<el-col :span="12">
					<el-form-item label="目的地定位" prop="destGps">
					<el-input v-model="addForm.destGps" placeholder="目的地定位" ></el-input>
					</el-form-item> 
						</el-col>
				</el-row>

				<el-row>
					<el-col>
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
				</el-col>
				</el-row>
				<el-row style="margin-left:150px">
					<el-table :data="addForm.carExpenseDetailTpls" border stripe>
						<el-table-column type="index" width="50">  
						</el-table-column>
						<el-table-column align="center" label="主键" width="150">
						<template slot-scope="row">
							<el-input v-model="addForm.carExpenseDetailTpls[row.$index].id" placeholder="主键"> </el-input>
						</template>
						</el-table-column>
						<el-table-column align="center" label="费用项目编号" width="150">
						<template slot-scope="row">
							<el-input v-model="addForm.carExpenseDetailTpls[row.$index].itemId" placeholder="费用项目编号"> </el-input>
						</template>
						</el-table-column>
						<el-table-column align="center" label="费用项目" width="200">
						<template slot-scope="row">
							<el-input v-model="addForm.carExpenseDetailTpls[row.$index].itemName" placeholder="费用项目编号"> </el-input>
						</template>
						</el-table-column>
						<el-table-column align="center" label="费用" width="100">
						<template slot-scope="row">
							<el-input v-model="addForm.carExpenseDetailTpls[row.$index].feeAmount" placeholder="费用"> </el-input>
						</template>
						</el-table-column>
						<el-table-column align="center" label="费用说明" width="150">
						<template slot-scope="row">
							<el-input v-model="addForm.carExpenseDetailTpls[row.$index].feeRemark" placeholder="费用说明"> </el-input>
						</template>
						</el-table-column>
						<el-table-column align="center"  width="80">
							<template slot="header">
							<i class="el-icon-circle-plus-outline"  @click="addRow"></i>
							</template>
							
							<template slot-scope="row">
							<i class="el-icon-remove-outline" @click="delRow(row.$index)"></i>
							</template>
						</el-table-column>
					</el-table>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="是否规划路线" prop="hasRoute">
							<el-checkbox v-model="addForm.hasRoute" @click="addForm.hasRoute = !addForm.hasRoute ">是否规划路线</el-checkbox>
						</el-form-item> 
					</el-col>
				</el-row>

				<el-row v-show="addForm.hasRoute" style="margin-left:150px">
					<el-table
						ref="singleTable"
						:data="carRouteTpls"
						tooltip-effect="dark"
						highlight-current-row
						style="width: 100%"
						@row-click="handleCurrentChange"
						>
							<el-table-column type="index" width="60"></el-table-column>
							<el-table-column prop="routeName" label="路线名称" width="200" >
							</el-table-column>
							<el-table-column prop="fromAddress" label="出发地址" width="200" >
							</el-table-column>
							<el-table-column prop="destAddress" label="目的地址" width="200" >
							</el-table-column>
							<el-table-column prop="hasDetail" label="是否有子路线" >
								<template slot-scope="scope">
									<el-tag v-if="scope.row.hasDetail=='1'">是</el-tag>
									<el-tag v-else>否</el-tag>
								</template>
							</el-table-column>
							<el-table-column prop="isSignIn" label="是否打卡" >
								<template slot-scope="scope">
									<el-tag v-if="scope.row.isSignIn=='1'">是</el-tag>
									<el-tag v-else>否</el-tag>
								</template>
							</el-table-column>
					</el-table>
				</el-row>
				
				<el-row v-if="addForm.carRouteTpl.hasDetail == 1 && addForm.hasRoute" style="margin-left:150px">
					<el-row>
						<el-tag size="medium">子路线信息</el-tag>
					</el-row>
					<el-table
						:data="this.carRouteDetailTpls"
						tooltip-effect="dark"
						style="width: 100%"
						>
							<el-table-column type="index" width="60"></el-table-column>
							<el-table-column prop="detailName" label="子路线名称" width="200" >
							</el-table-column>
							<el-table-column prop="fromAddress" label="出发地址" width="200" >
							</el-table-column>
							<el-table-column prop="destAddress" label="目的地址" width="200" >
							</el-table-column>
							<el-table-column prop="seqNum" label="序号" >
							</el-table-column>
							<el-table-column prop="isSignIn" label="是否打卡" >
								<template slot-scope="scope">
									<el-tag v-if="scope.row.isSignIn=='1'">是</el-tag>
									<el-tag v-else>否</el-tag>
								</template>
							</el-table-column>
					</el-table>
				</el-row>
				
				<el-row v-show="!addForm.hasRoute" style="margin-left:150px" >
					<el-row>
						<el-tag size="medium">填写路线信息</el-tag>
					</el-row>
					<el-table :data="this.carRouteTplsNew" border stripe>
						<el-table-column type="index" width="50">  
						</el-table-column>
						<el-table-column align="center" label="主键" width="150">
							<template slot-scope="row">
								<el-input v-model="carRouteTplsNew[row.$index].id" placeholder="主键"> </el-input>
							</template>
						</el-table-column>

						<el-table-column label="路线名称" width="150" >
							<template slot-scope="row">
								<el-input v-model="carRouteTplsNew[row.$index].detailName" placeholder="路线名称"> </el-input>
							</template>
						</el-table-column>
						<el-table-column label="出发地址" width="120" >
							<template slot-scope="row">
								<el-input v-model="carRouteTplsNew[row.$index].fromAddress" placeholder="出发地址"> </el-input>
							</template>
						</el-table-column>
						<el-table-column label="目的地址" width="120" >
							<template slot-scope="row">
								<el-input v-model="carRouteTplsNew[row.$index].destAddress" placeholder="目的地址"> </el-input>
							</template>
						</el-table-column>
						<el-table-column label="距离米" width="120" >
							<template slot-scope="row">
								<el-input v-model="carRouteTplsNew[row.$index].distance" placeholder="距离米"> </el-input>
							</template>
						</el-table-column>
						<el-table-column label="序号" >	
							<template slot-scope="row">
								<el-input v-model="carRouteTplsNew[row.$index].seqNum" placeholder="序号"> </el-input>
							</template>
						</el-table-column>
						<el-table-column label="是否有子路线" >
							<template slot-scope="row">
								<el-checkbox v-model="carRouteTplsNew[row.$index].hasDetail">是</el-checkbox>
							</template>
							<!-- <template slot-scope="row">
								<el-input v-model="carRouteTplsNew[row.$index].hasDetail" placeholder="是否有子路线"> </el-input>
							</template> -->
						</el-table-column>
						<el-table-column label="是否打卡" >
							
							<template slot-scope="row">
								<el-checkbox v-model="carRouteTplsNew[row.$index].isSignIn">是</el-checkbox>
							</template>
						</el-table-column>

						<el-table-column align="center"  width="80">
							<template slot="header">
								<i class="el-icon-circle-plus-outline"  @click="routeAddRow"></i>
							</template>
							<template slot-scope="row">
							<i class="el-icon-remove-outline" @click="routeDelRow(row.$index)"></i>
							</template>
						</el-table-column>
					</el-table>
				</el-row>
				
				<el-row  v-if="this.carRouteTplsNew.length != 0 && this.carRouteTplsNew[0].hasDetail && !addForm.hasRoute" style="margin-left:150px" >
					<el-row>
						<el-tag size="medium">填写子路线信息</el-tag>
					</el-row>
					<el-table :data="this.carRouteDetailTplsNew" border stripe>
						<el-table-column type="index" width="50">  
						</el-table-column>
						<el-table-column align="center" label="主键" width="120">
							<template slot-scope="row">
								<el-input v-model="carRouteDetailTplsNew[row.$index].id" placeholder="主键"> </el-input>
							</template>
						</el-table-column>

						<el-table-column label="子路线名称" width="170" >
							<template slot-scope="row">
								<el-input v-model="carRouteDetailTplsNew[row.$index].detailName" placeholder="子路线名称"> </el-input>
							</template>
						</el-table-column>
						<el-table-column label="出发地址" width="150" >
							<template slot-scope="row">
								<el-input v-model="carRouteDetailTplsNew[row.$index].fromAddress" placeholder="出发地址"> </el-input>
							</template>
						</el-table-column>
						<el-table-column label="目的地址" width="150" >
							<template slot-scope="row">
								<el-input v-model="carRouteDetailTplsNew[row.$index].destAddress" placeholder="目的地址"> </el-input>
							</template>
						</el-table-column>
						<el-table-column label="序号" >	
							<template slot-scope="row">
								<el-input v-model="carRouteDetailTplsNew[row.$index].seqNum" placeholder="序号"> </el-input>
							</template>
						</el-table-column>
						<el-table-column label="是否打卡" >
							<template slot-scope="row">
								<el-checkbox v-model="carRouteDetailTplsNew[row.$index].isSignIn">是</el-checkbox>
							</template>
						</el-table-column>
						<el-table-column label="距离米" >	
							<template slot-scope="row">
								<el-input v-model="carRouteDetailTplsNew[row.$index].distance" placeholder="距离米"> </el-input>
							</template>
						</el-table-column>

						<el-table-column align="center"  width="80">
							<template slot="header">
								<i class="el-icon-circle-plus-outline"  @click="routeDetailAddRow"></i>
							</template>
							<template slot-scope="row">
							<i class="el-icon-remove-outline" @click="routeDetailDelRow(row.$index)"></i>
							</template>
						</el-table-column>
					</el-table>
				</el-row>


        		<el-form-item style="display:none" label="机构名称" prop="reqBranchName">
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

		<el-dialog append-to-body title="选择车辆" :visible.sync="selectCarFormVisible" width="70%">
		    <cars-select :value='this.addForm.carId' @getSelectVal="onCarSelected" @cancel="cancel"></cars-select>
			<!-- <div slot="footer" class="dialog-footer">
					<el-button @click="selectCarFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="selectCarFormVisible = false">确 定</el-button>
			</div> -->
		 </el-dialog>
		<el-dialog append-to-body title="选择司机" :visible.sync="selectDriverFormVisible" width="60%">
		    <drivers-select :value='this.addForm.driverId' @getSelectDriverVal="onDriverSelected" @cancel="cancel"></drivers-select>
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
	import { editCarRequire , getMessageById } from '@/api/oa/car/carRequire';
	import DeptTree from "@/views/mdp/sys/dept/DeptTree"; //选择部门的
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect"; //选择用户
	import { mapGetters } from 'vuex'
	import CarDriverTplsSelect from "../components/CarDriverTplsSelect"; 
	import CarsSelect from "../components/CarsSelect";
	import DriversSelect from "../components/DriversSelect";
	import { listCarExpenseDetailTpl } from '@/api/oa/car/carExpenseDetailTpl';
	import { listCarRouteTpl } from '@/api/oa/car/carRouteTpl';
	import { listCarRouteDetailTpl } from '@/api/oa/car/carRouteDetailTpl';

	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['carRequire','visible'],
		watch: {
	      'carRequire':function( carRequire ) {
			this.addForm = Object.assign(this.addForm, carRequire);  
			this.checkedExpenseDetailTpls = ''
			this.isIndeterminate = false
			this.checkAll = false
			this.carDriverIsCheck = true

			this.addForm.carDriverTplId = ''
			this.addForm.carDriverTplName = ''
			this.addForm.carId = ''
			this.addForm.carName = ''
			this.addForm.driverId = ''
			this.addForm.driverName = ''
			this.addForm.hasRoute = true
			this.addForm.carRouteTpl = ''
			this.carRouteTplsNew = []
			this.carRouteDetailTplsNew = []
			
			this.getRequireMessages(carRequire.id)
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
					reqStartTime:'',reqEndTime:'',id:'',reqDeptid:'',reqDeptName:'',reqBranchId:'',reqUserid:'',reqUsername:'',reqPhoneno:'',reqReason:'',reqTime:'',reqStatus:'',bizFlowState:'',bizProcInstId:'',destAddress:'',destGps:'',reqTitle:'',hasRoute:true,reqBranchName:'',
					carDriverTplId:'',carDriverTplName: '',
					carId: '',carName: '',
					driverId: '',driverName: '',
          			checkedExpenseDetailTpls: [],
					carExpenseDetailTpls: [],
					carRouteTpl:'',
					carRouteTplsNew: '',
					carRouteDetailTplsNew: [],
				},
        		/**begin 在下面加自定义属性,记得补上面的一个逗号**/
        		expenseDetailTpl: {
					id:'',itemId:'',itemName:'',feeAmount:'',feeRemark:''
				},
				requireCarRoute: {
					id:'',fromAddress:'',destAddress:'',fromAddressGps:'',destAddressGps:'',isSignIn:'',seqNum:'',detailName:'',distance:'',requireId:'',hasDetail:''
				},
				requireCarRouteDetail:{
					id:'',fromAddress:'',destAddress:'',fromAddressGps:'',destAddressGps:'',isSignIn:'',seqNum:'',detailName:'',distance:'',routeId:''
				},
				dialogFormVisible: false,
				selectUserFormVisible: false,
				selectCarDriverTplsVisible: false,
				selectCarFormVisible: false,
				selectDriverFormVisible: false,

				carExpenseDetailTpls: [],//查询结果费用
				checkAll: false,
				checkedExpenseDetailTpls: [],
				isIndeterminate: false,
				//路线选择框
				multipleSelection: [],

				//线路列表
				carRouteTpls: [],
				carRouteDetailTpls:[],

				//自己新建
				carRouteTplsNew: [],
				carRouteDetailTplsNew:[],
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

							this.addForm.carRouteTplsNew = this.carRouteTplsNew
							this.addForm.carRouteDetailTplsNew = this.carRouteDetailTplsNew
							this.addForm.reqBranchId = this.userInfo.branchId
							this.addForm.reqBranchName = this.userInfo.branchName
							this.addForm.checkedExpenseDetailTpls = this.checkedExpenseDetailTpls

							let params = Object.assign({}, this.addForm); 
							editCarRequire(params).then((res) => {
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
				//this.addForm.reqPhoneno = users[0].
				console.log(users[0])
				this.selectUserFormVisible = false
    		},
			onCarDriverSelected(data){
				this.addForm.carDriverTplName = '汽车名：' + data[0].carName + '-----司机名：' + data[0].driverUsername
				this.addForm.carDriverTplId = data[0].id
				//console.log(this.addForm.carDriverTplId )
				this.selectCarDriverTplsVisible = false
			},
			onCarSelected: function(obj) {
				//console.log(obj)
				this.addForm.carId = obj.id
				this.addForm.carName = obj.carName
				this.selectCarFormVisible = false

    		},
			onDriverSelected: function(obj) {
				//console.log(obj)
				this.addForm.driverId = obj.driverId
				this.addForm.driverName = obj.driverUsername
				this.selectDriverFormVisible = false
    		},
			//关闭弹出框页面
			cancel(){
				this.selectCarFormVisible = false
				this.selectDriverFormVisible = false
			},
			handleClose(tag,attrName) {
				//this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
				//console.log(tag)
				console.log(attrName)
				if(attrName == 'carName'){
					this.addForm.carName = ''
					this.addForm.carId = ''
				}
				if(attrName == 'driverName'){
					this.addForm.driverName = ''
					this.addForm.driverId = ''
				}
				if(attrName == 'carDriverTplName'){
					this.addForm.carDriverTplName = ''
					this.addForm.carDriverTplId = ''
				}
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
				}).catch( ()=>{
				} );
			},
			handleCheckAllChange(val) {
				if(val){
					this.carExpenseDetailTpls.forEach(expend => {
						if(this.checkedExpenseDetailTpls.indexOf(expend.id)){
							this.checkedExpenseDetailTpls.push(expend.id)
						}
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
      		},
      		//费用添加一行
			addRow() {
				let params = {
					id:'',
					itemId:'',
					itemName:'',
					feeAmount:'',
					feeRemark:'',
				}
				this.addForm.carExpenseDetailTpls.push(params);
			},
			delRow(index) {
				this.addForm.carExpenseDetailTpls.splice(index, 1);
			},
			routeAddRow(){
				if(this.carRouteTplsNew == null  || this.carRouteTplsNew.length < 1 ){
					let params = {
						id:'',
						fromAddress:'',
						destAddress:'',
						fromAddressGps:'',
						destAddressGps:'',
						isSignIn:'',
						seqNum:'',
						detailName:'',
						distance:'',
						requireId:'',
						hasDetail:''
					}
					this.carRouteTplsNew.push(params);
				}else{
					this.$alert('最多只能选择一条路线');
				}
				
			},
			routeDelRow(index) {
				this.carRouteTplsNew.splice(index, 1);
			},
			routeDetailAddRow(){
				let params = {
					id:'',
					fromAddress:'',
					destAddress:'',
					fromAddressGps:'',
					destAddressGps:'',
					isSignIn:'',
					seqNum:'',
					detailName:'',
					distance:'',
					routeId:''
				}
				this.carRouteDetailTplsNew.push(params);
			},
			routeDetailDelRow(index) {
				this.carRouteDetailTplsNew.splice(index, 1);
			},
			handleCurrentChange(val) {
				this.addForm.carRouteTpl = val;
				if(this.addForm.carRouteTpl.hasDetail == 1){
					this.getCarRouteDetailTpls()
				}
				console.log(val)
			},
			//获取列表 CarRouteTpl car_route_tpl
			getCarRouteTpls() {
				let params = {
					// pageSize: this.pageInfo.pageSize,
					// pageNum: this.pageInfo.pageNum,
					// total: this.pageInfo.total,
					// count:this.pageInfo.count
				};
				listCarRouteTpl(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						// this.pageInfo.total = res.data.total;
						// this.pageInfo.count=false;
						this.carRouteTpls = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
				}).catch( () => {
				});
			},
			//根据id获取申请用车的信息
			getRequireMessages(id){
				
				let params = {
					id: id
				}
				getMessageById(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						// this.pageInfo.total = res.data.total;
						// this.pageInfo.count=false;
						if(res.data.data.checkedExpenseDetailTpls.length > 0){
							//console.log("checkedExpenseDetailTpls    " + res.data.data.checkedExpenseDetailTpls)
							 
							//把已选择的费用选上
							let checkedCount = res.data.data.checkedExpenseDetailTpls.length;
							this.checkAll = checkedCount == this.carExpenseDetailTpls.length ? true : false;
							this.isIndeterminate = checkedCount > 0 && checkedCount < this.carExpenseDetailTpls.length ? true : false;
							this.checkedExpenseDetailTpls = res.data.data.checkedExpenseDetailTpls
						}

						if(res.data.data.carExpenseDetailTpls.length > 0)
							this.addForm.carExpenseDetailTpls = res.data.data.carExpenseDetailTpls
						
						if(res.data.data.carDriverTplId != null && res.data.data.carDriverTplId.length > 5) {
							this.carDriverIsCheck = true
							//console.log("carDriverTplIdcarDriverTplIdcarDriverTplIdcarDriverTplId")
							this.addForm.carDriverTplId = res.data.data.carDriverTplId
							this.addForm.carDriverTplName = res.data.data.carDriverTplName
							//判断选择司机模板或者单独选择司机车辆 true为模板，false为单独
						} else {
							//console.log("carIdcarIdcarIdcarId怎么出不来")
							this.carDriverIsCheck = false
							this.addForm.carId = res.data.data.carId
							this.addForm.carName = res.data.data.carName
							this.addForm.driverId = res.data.data.driverId
							this.addForm.driverName = res.data.data.driverName
						}

						if(res.data.data.hasRoute == '1'){
							//console.log(res.data.data.carRouteTpl)
							this.addForm.hasRoute = true
							this.addForm.carRouteTpl = res.data.data.carRouteTpl
							//this.setCurrent(res.data.data.carRouteTpl)
							this.handleCurrentChange(res.data.data.carRouteTpl)
						}else{
							console.log("222222222222222222222222")
							this.addForm.hasRoute = false
							//自己新建
							this.carRouteTplsNew = res.data.data.carRouteTplsNew
							this.carRouteTplsNew[0].hasDetail = this.carRouteTplsNew[0].hasDetail == '1' ? true : false		
							this.carRouteTplsNew[0].isSignIn = this.carRouteTplsNew[0].isSignIn == '1'  ? true : false
							console.log(this.carRouteTplsNew[0].hasDetail + "-----------------")

							if(this.carRouteTplsNew[0].hasDetail){
								this.carRouteDetailTplsNew = res.data.data.carRouteDetailTplsNew
								this.carRouteDetailTplsNew.forEach((item,index)=>{
									//console.log("indexindexindex" + index)
									this.carRouteDetailTplsNew[index].isSignIn = this.carRouteDetailTplsNew[index].isSignIn == '1' ? true : false
								})
							}
						}

						//线路列表
						//this.carRouteTpls: [],
						//this.carRouteDetailTpls:[],
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
				}).catch( () => {
				});
			},

			//获取列表 CarRouteDetailTpl car_route_detail_tpl
			getCarRouteDetailTpls() {
				let params = {
					routeId: this.addForm.carRouteTpl.id
				};
				listCarRouteDetailTpl(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.carRouteDetailTpls = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
						window.reload();
					} 
				}).catch( () =>{
					window.reload();
				} );
			},
			setCurrent(row) {
				console.log(row)
				this.$refs.singleTable.setCurrentRow(row);
			},

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
			this.getCarRouteTpls()

			//获取其他信息
			this.getRequireMessages(this.addForm.id)
			//this.getCarRouteDetailTpls()
		}//end mounted
	}

</script>

<style scoped>

</style>