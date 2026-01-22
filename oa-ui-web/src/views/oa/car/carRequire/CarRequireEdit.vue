<template>
	<section>
		<el-row class="page-container border padding">
      
			<!--新增界面 CarRequire car_require--> 
			<el-form :model="addForm"  label-width="150px" :rules="addFormRules" ref="addForm">

				<el-row>
					<el-col :span="12">
						<el-form-item label="申请标题" prop="reqTitle">
							<el-input v-model="addForm.reqTitle" placeholder="申请标题" ></el-input>
						</el-form-item> 
					</el-col>
					<el-col :span="12">
						<el-form-item label="申请编号" prop="id">
							<el-input :disabled="true" v-model="addForm.id" placeholder="申请编号" ></el-input>
						</el-form-item> 
					</el-col>
				</el-row>
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
						<el-tag type="info" @close="handleClose('addForm.carDriverTplName')" closable  style="margin-left: 20px;">已选择模板------{{addForm.carDriverTplName}}</el-tag>
					</div>
					<div v-if="addForm.carName != ''" >
						<el-tag type="info" @close="handleClose('addForm.carName')" closable  style="margin-left: 20px;">已选择汽车------{{addForm.carName}}</el-tag>
					</div>
					<div v-if="addForm.driverName != ''">
						<el-tag type="info" @close="handleClose('addForm.driverName')" closable  style="margin-left: 20px;">已选择司机------{{addForm.driverName}}</el-tag>
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
					<el-col style="display:none" :span="12">
						<el-form-item label="申请时间" prop="reqTime">
							<el-date-picker type="date" placeholder="选择日期" v-model="addForm.reqTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
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
						<!-- <el-input v-model="addForm.destGps" placeholder="目的地定位" ></el-input> -->
						<el-button type="text" @click="showEditLocation('addForm.destGps')">目的地址定位</el-button>
						<el-tag style="margin-left:20px"  v-if="addForm.destGps != ''" v-text='"  经纬度坐标:   " + addForm.destGps'></el-tag>
					</el-form-item> 
				</el-col>
				</el-row>

				<el-row>
					<el-col>
						<el-form-item label="申请费用" prop="reqExpense">
						<el-button type="text"  @click="selectExpenseFormVisible = true">选择费用模板</el-button>
						<!-- <template>
							<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
								<div style="margin: 15px 0;"></div>
								<el-checkbox-group v-model="checkedExpenseDetailTpls" @change="handleCheckedTplsChange">
									<el-checkbox v-for="tpl in carExpenseDetailTpls" :label="tpl.id" :key="tpl.id">
									{{tpl.itemName}}
								</el-checkbox>
							</el-checkbox-group>
						</template> -->
					</el-form-item> 
				</el-col>
				</el-row>
				<el-row style="margin-left:150px">
					<el-table :data="addForm.carExpenseDetailTpls" border >
						<el-table-column type="index" width="50">  
						</el-table-column>
						<el-table-column align="center" label="主键" width="150">
						<template slot-scope="row">
							<el-input :disabled=true v-model="addForm.carExpenseDetailTpls[row.$index].id" placeholder="主键"> </el-input>
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
						<el-table-column align="center" label="费用" width="120">
						<template slot-scope="row">
							<el-input v-model="addForm.carExpenseDetailTpls[row.$index].feeAmount" placeholder="费用"> </el-input>
						</template>
						</el-table-column>
						<el-table-column align="center" label="费用说明" width="200">
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
							<el-checkbox v-model="addForm.hasRoute" @click=" addForm.hasRoute = !addForm.hasRoute ">是否规划路线</el-checkbox>
						</el-form-item> 
					</el-col>
				</el-row>

				<el-row v-show="addForm.hasRoute" style="margin-left:150px">
					<el-button type="text"  @click="selectRouteTplsVisible = true">选择规划路线</el-button>
					<div v-if="addForm.carRouteTpl !=null  && addForm.carRouteTpl != '' ">
						<el-tag type="info" closable  style="margin-left: 20px;"  v-text='"已选择路线模板------   " + addForm.carRouteTpl.routeName'></el-tag>
					</div>
				</el-row>
				
				<el-row v-show="!addForm.hasRoute" style="margin-left:150px" >
					<el-row>
						<el-tag size="medium">填写路线信息</el-tag>
					</el-row>
					<el-table :data="this.carRouteTplsNew" border stripe>
						<el-table-column type="index" width="50">  
						</el-table-column>
						<!-- <el-table-column align="center" label="主键" width="150">
							<template slot-scope="row">
								<el-input v-model="carRouteTplsNew[row.$index].id" placeholder="主键"> </el-input>
							</template>
						</el-table-column> -->

						<el-table-column label="路线名称" min-width="220">
							<template slot-scope="row">
								<el-input v-model="carRouteTplsNew[row.$index].detailName" placeholder="路线名称"> </el-input>
							</template>
						</el-table-column>
						<el-table-column label="出发地址定位" width="140">
							<template slot-scope="row">
								<el-button type="text" v-if="carRouteTplsNew[row.$index].fromAddressGps == ''" @click="showEditLocation('carRouteTplsNew' ,'0')">出发地址定位</el-button>
								<el-button type="text" v-if="carRouteTplsNew[row.$index].fromAddressGps != ''" @click="showEditLocation('carRouteTplsNew' ,'0')">更改出发地址定位</el-button>
								<!-- <el-tag style="margin-left:20px"  v-if="carRouteTplsNew[row.$index].fromAddressGps != ''" v-text='"已定位"'></el-tag> -->
								<!-- <el-tag style="margin-left:20px"  v-if="carRouteTplsNew[row.$index].fromAddressGps != ''" v-text='"  经纬度坐标:   " + carRouteTplsNew[row.$index].fromAddressGps'></el-tag> -->
							</template>	
						</el-table-column> 
						<el-table-column label="出发地址" min-width="220" >
							<template slot-scope="row">
								<el-input v-model="carRouteTplsNew[row.$index].fromAddress" placeholder="出发地址"> </el-input>
							</template>
						</el-table-column>
						<el-table-column label="目的地址定位" width="140">
							<template slot-scope="row">
								<el-button type="text"  v-if="carRouteTplsNew[row.$index].destAddressGps == ''" @click="showEditLocation('carRouteTplsNew', '1')">目的地址定位</el-button>
								<el-button type="text"  v-if="carRouteTplsNew[row.$index].destAddressGps != ''" @click="showEditLocation('carRouteTplsNew', '1')">更改目的地址定位</el-button>
								<!-- <el-tag style="margin-left:20px"  v-if="carRouteTplsNew[row.$index].destAddressGps != ''" v-text='"已定位"'></el-tag> -->
								<!-- <el-tag style="margin-left:20px"  v-if="carRouteTplsNew[row.$index].destAddressGps != ''" v-text='"  经纬度坐标:   " + carRouteTplsNew[row.$index].destAddressGps'></el-tag> -->
							</template>	
						</el-table-column> 
						<el-table-column label="目的地址" min-width="220" >
							<template slot-scope="row">
								<el-input v-model="carRouteTplsNew[row.$index].destAddress" placeholder="目的地址"> </el-input>
							</template>
						</el-table-column>
					
						<el-table-column label="距离米" width="10" >
							<template slot-scope="row">
								<el-input v-model="carRouteTplsNew[row.$index].distance" placeholder="距离米"> </el-input>
							</template>
						</el-table-column>
						<el-table-column width="100" label="80">	
							<template slot-scope="row">
								<el-input v-model="carRouteTplsNew[row.$index].seqNum" placeholder="序号"> </el-input>
							</template>
						</el-table-column>
						<el-table-column width="80" label="是否有子路线">
							<template slot-scope="row">
								<el-checkbox v-model="carRouteTplsNew[row.$index].hasDetail">是</el-checkbox>
							</template>
						</el-table-column>
						<el-table-column width="80" label="是否打卡">
							<template slot-scope="row">
								<el-checkbox v-model="carRouteTplsNew[row.$index].isSignIn">是</el-checkbox>
							</template>
						</el-table-column>

						<el-table-column align="center"  width="70" fixed="right">
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
						<!-- <el-table-column align="center" label="主键" width="120">
							<template slot-scope="row">
								<el-input v-model="carRouteDetailTplsNew[row.$index].id" placeholder="主键"> </el-input>
							</template>
						</el-table-column> -->

						<el-table-column label="子路线名称" min-width="220">
							<template slot-scope="row">
								<el-input v-model="carRouteDetailTplsNew[row.$index].detailName" placeholder="子路线名称"> </el-input>
							</template>
						</el-table-column>
						<el-table-column label="出发地址定位" width="140">
							<template slot-scope="row">
								<el-button type="text" v-if="carRouteDetailTplsNew[row.$index].fromAddressGps == ''" @click="showEditLocation(row.$index + '','0')">出发地址定位</el-button>
								<el-button type="text" v-if="carRouteDetailTplsNew[row.$index].fromAddressGps != ''" @click="showEditLocation(row.$index + '','0')">更改出发地址定位</el-button>
								<!-- <el-tag style="margin-left:20px"  v-if="carRouteDetailTplsNew[row.$index].fromAddressGps != ''" v-text='"已定位"'></el-tag> -->
								<!-- <el-tag style="margin-left:20px"  v-if="carRouteDetailTplsNew[row.$index].fromAddressGps != ''" v-text='"  经纬度坐标:   " + carRouteDetailTplsNew[row.$index].fromAddressGps'></el-tag> -->
							</template>	
						</el-table-column> 
						<el-table-column label="出发地址" min-width="220">
							<template slot-scope="row">
								<el-input v-model="carRouteDetailTplsNew[row.$index].fromAddress" placeholder="出发地址"> </el-input>
							</template>
						</el-table-column>
						<el-table-column label="目的地址定位" width="140">
							<template slot-scope="row">
								<el-button type="text" v-if="carRouteDetailTplsNew[row.$index].destAddressGps == ''" @click="showEditLocation(row.$index + '','1')">目的地址定位</el-button>
								<el-button type="text" v-if="carRouteDetailTplsNew[row.$index].destAddressGps != ''"@click="showEditLocation(row.$index + '','1')">更改目的地址定位</el-button>
								<!-- <el-tag style="margin-left:20px"  v-if="carRouteDetailTplsNew[row.$index].destAddressGps != ''" v-text='"已定位"'></el-tag> -->
								<!-- <el-tag style="margin-left:20px"  v-if="carRouteDetailTplsNew[row.$index].destAddressGps != ''" v-text='"  经纬度坐标:   " + carRouteDetailTplsNew[row.$index].destAddressGps'></el-tag> -->
							</template>	
						</el-table-column> 
						<el-table-column label="目的地址" min-width="220">
							<template slot-scope="row">
								<el-input v-model="carRouteDetailTplsNew[row.$index].destAddress" placeholder="目的地址"> </el-input>
							</template>
						</el-table-column>
						<el-table-column label="序号" width="80">	
							<template slot-scope="row">
								<el-input v-model="carRouteDetailTplsNew[row.$index].seqNum" placeholder="序号"> </el-input>
							</template>
						</el-table-column>
						<el-table-column label="是否打卡" width="80">
							<template slot-scope="row">
								<el-checkbox v-model="carRouteDetailTplsNew[row.$index].isSignIn">是</el-checkbox>
							</template>
						</el-table-column>
						<el-table-column label="距离米" width="100">	
							<template slot-scope="row">
								<el-input v-model="carRouteDetailTplsNew[row.$index].distance" placeholder="距离米"> </el-input>
							</template>
						</el-table-column>
						<el-table-column align="center" width="70" fixed="right">
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

				<el-row>
							<!-- <el-col :span="12">
								<el-form-item label="流程实例编号" prop="bizProcInstId">
								<el-input v-model="addForm.bizProcInstId" placeholder="流程实例编号" ></el-input>
								</el-form-item> 
							</el-col> -->
							<br/>
							<el-col :span="24">
								<el-form-item label="申请事由" prop="reqReason">
									<el-input type="textarea" maxlength="255"
										show-word-limit 
										v-model="addForm.reqReason" placeholder="申请事由" ></el-input>
								</el-form-item> 
							</el-col>
						</el-row>

				<el-form-item>
					<el-col :span="16" :offset="8"> 
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
		 </el-dialog>

		<el-dialog append-to-body title="选择司机车辆" :visible.sync="selectCarDriverTplsVisible" width="80%">
		    <carDriverTpls-Select @confirmTpls="onCarDriverSelected">
			</carDriverTpls-Select>
		 </el-dialog>

		<el-dialog append-to-body title="选择车辆" :visible.sync="selectCarFormVisible" width="70%">
		    <cars-select :value='this.addForm.carId' @getSelectVal="onCarSelected" @cancel="cancel"></cars-select>
		 </el-dialog>
		<el-dialog append-to-body title="选择司机" :visible.sync="selectDriverFormVisible" width="60%">
		    <drivers-select :value='this.addForm.driverId' @getSelectDriverVal="onDriverSelected" @cancel="cancel"></drivers-select>
		 </el-dialog>

		<el-dialog append-to-body title="选择费用模板" :visible.sync="selectExpenseFormVisible" width="70%">
		    <expenses-select @getSelecExpensetVal="onExpenseSelected" @cancel="cancel"></expenses-select>
		 </el-dialog>

		<el-dialog append-to-body title="选择规划路线" :visible.sync="selectRouteTplsVisible" width="70%">
		    <routeTpls-select @getSelectRouteVal="onRouteTplSelected" @cancel="cancel"></routeTpls-select>
		 </el-dialog>

		<!--地址定位组件-->
		<el-dialog append-to-body
			title="请选择地址"
			:visible.sync="selectlocationVisible"
			width="60%"
			top="20px"
			:close-on-click-modal="false"
			>
			<location-select
				v-if="selectlocationVisible"
				@cancel="selectlocationVisible=false"
				@getPoi="getPisotion"
				:attrName=attrName
				:value=value
				:addrName=addrName
			>
			</location-select>
		</el-dialog>

	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { editCarRequire,getMessageById } from '@/api/oa/car/carRequire';
	import DeptTree from "@/views/mdp/sys/dept/DeptTree"; //选择部门的
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect"; //选择用户
	import { mapGetters } from 'vuex'
	import CarDriverTplsSelect from "../components/CarDriverTplsSelect"; 
	import CarsSelect from "../components/CarsSelect";
	import DriversSelect from "../components/DriversSelect";
	import ExpensesSelect from "../components/ExpensesSelect";
	import RouteTplsSelect from "../components/RouteTplsSelect";
	import locationSelect from '../components/locationSelect'

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
		
			this.addForm.carDriverTplId = ''
			this.addForm.carDriverTplName = ''
			this.addForm.carId = ''
			this.addForm.carName = ''
			this.addForm.driverId = ''
			this.addForm.driverName = ''
			this.addForm.hasRoute = true
			this.addForm.carRouteTpl = null
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
					reqStartTime: [
						{ required: true, message: '开始用车时间不能为空', trigger: 'change' },
					],
					reqEndTime: [
						{ required: true, message: '用车结束时间不能为空', trigger: 'change' },
					],
					reqUsername: [
						{ required: true, message: '申请人姓名不能为空', trigger: 'change' },
					],
					reqPhoneno: [
						{ required: true, message: '手机号不能为空', trigger: 'change' },
						{ validator: this.checkPhone, trigger: 'change' }
					],
				},
				//新增界面数据 car_require
				addForm: {
					reqStartTime:'',reqEndTime:'',id:'',reqDeptid:'',reqDeptName:'',reqBranchId:'',reqUserid:'',reqUsername:'',reqPhoneno:'',reqReason:'',reqTime:'',reqStatus:'',bizFlowState:'',bizProcInstId:'',destAddress:'',destGps:'',reqTitle:'',hasRoute:true,reqBranchName:'',
					carDriverTplId:'',carDriverTplName: '',
					carId: '',carName: '',
					driverId: '',driverName: '',
					carExpenseDetailTpls: [],
					carRouteTpl:null, 
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
				selectExpenseFormVisible: false,
				selectRouteTplsVisible: false,

				carExpenseDetailTpls: [],//查询结果费用
				checkAll: false,
				//checkedExpenseDetailTpls: [],
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

				selectlocationVisible: false,//选择地址展示
				attrName: '',///代表接受值的名字
				value: '',  //传去选择地址的值
				addrName: '', //传去选择地址的名


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
			onExpenseSelected(vals){
				vals.forEach((val)=>{
					let params = {
						id:'',
						itemId: val.itemId,
						itemName: val.itemName,
						feeAmount: val.feeAmount,
						feeRemark: val.feeRemark,
						isTpl: val.id,
					}
					this.addForm.carExpenseDetailTpls.push(params);
				})
				this.selectExpenseFormVisible = false
			},
			onRouteTplSelected(val){
				//console.log(val)
				this.addForm.carRouteTpl = val[0]
				this.selectRouteTplsVisible = false
			},
			//关闭弹出框页面
			cancel(){
				this.selectCarFormVisible = false
				this.selectDriverFormVisible = false
				this.selectExpenseFormVisible = false
				this.selectRouteTplsVisible = false
			},
      		//费用添加一行
			addRow() {
				let params = {
					id:'',
					itemId:'',
					itemName:'',
					feeAmount:'',
					feeRemark:'',
					isTpl:'',
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

			//根据id获取申请用车的信息
			getRequireMessages(id){
				
				let params = {
					id: id
				}
				getMessageById(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 

						if(res.data.data.carExpenseDetailTpls.length > 0)
							this.addForm.carExpenseDetailTpls = res.data.data.carExpenseDetailTpls
						
						if(res.data.data.carDriverTplId != null && res.data.data.carDriverTplId.length > 5) {
							this.carDriverIsCheck = true
							
							this.addForm.carDriverTplId = res.data.data.carDriverTplId
							this.addForm.carDriverTplName = res.data.data.carDriverTplName
							//判断选择司机模板或者单独选择司机车辆 true为模板，false为单独
						} else {
							this.carDriverIsCheck = false
							this.addForm.carId = res.data.data.carId
							this.addForm.carName = res.data.data.carName
							this.addForm.driverId = res.data.data.driverId
							this.addForm.driverName = res.data.data.driverName
						}

						if(res.data.data.hasRoute == '1'){
							this.addForm.hasRoute = true
							this.addForm.carRouteTpl = res.data.data.carRouteTpl
						}else{
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
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
				}).catch( () => {
				});
			},
			
			//展示获取定位的窗口
			showEditLocation: function(attrName,addr) {
				if(attrName == 'addForm.destGps' ){
					this.value = this.addForm.destGps 
					this.addrName = this.addForm.destAddress 
				}else if(attrName == 'carRouteTplsNew'){
					if(this.carRouteTplsNew.length > 0){
						if(addr == '0'){
							this.value = this.carRouteTplsNew[0].fromAddressGps
							this.addrName = this.carRouteTplsNew[0].fromAddress	
						}else{
							this.value = this.carRouteTplsNew[0].destAddressGps
							this.addrName = this.carRouteTplsNew[0].destAddress	
						}
					}else{
						this.$message('error'); 
					}
				}else{
					if(this.carRouteDetailTplsNew.length > 0){
						if(addr == '0' ){
							this.value = this.carRouteDetailTplsNew[attrName].fromAddressGps
							this.addrName = this.carRouteDetailTplsNew[attrName].fromAddress
						}else {
							this.value = this.carRouteDetailTplsNew[attrName].destAddressGps
							this.addrName = this.carRouteDetailTplsNew[attrName].destAddress
						}
					}else{
						this.$message('error'); 
					}
				}
				this.attrName = attrName + ',' + addr
				this.selectlocationVisible = true;
			},
			getPisotion(val,addrName,attrName){
				// console.log( val + "---------val")
				// console.log( attrName + "-----------addrName")
				// console.log( addrName + "-----------attrName")

				let index = attrName.indexOf(",")
				let attrName01 = attrName.substring(0 ,index)

				if(attrName01 == 'addForm.destGps' ){
					this.addForm.destGps = val
					this.addForm.destAddress  = addrName
				}else if(attrName01 == 'carRouteTplsNew') {
					let attrName02 = attrName.substring(index+1 ,attrName.length)
					if(this.carRouteTplsNew.length > 0){
						if(attrName02 == '0'){
							this.carRouteTplsNew[0].fromAddressGps = val
							this.carRouteTplsNew[0].fromAddress	= addrName
						}else{
							this.carRouteTplsNew[0].destAddressGps = val
							this.carRouteTplsNew[0].destAddress	= addrName
						}
					}else{
						this.$message('error'); 
					}	
				}else{
					let attrName02 = attrName.substring(index+1 ,attrName.length)
					if(this.carRouteDetailTplsNew.length > 0){
						if(attrName02 == '0' ){
							this.carRouteDetailTplsNew[attrName01].fromAddressGps = val
							this.carRouteDetailTplsNew[attrName01].fromAddress = addrName
						}else {
							this.carRouteDetailTplsNew[attrName01].destAddressGps =  val
							this.carRouteDetailTplsNew[attrName01].destAddress = addrName
						}
					}else{
						this.$message('error'); 
					}
				}
				this.selectlocationVisible=false
			},
			checkPhone: function(rule, value, callback){
				if (!value) {
					return callback(new Error('手机号不能为空'));
				} else {
					const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
					console.log(reg.test(value));
					if (reg.test(value)) {
						callback();
					} else {
						return callback(new Error('请输入正确的手机号'));
					}
				}
			},
			handleClose(attr){
				if('addForm.carDriverTplName' == attr){
					this.addForm.carDriverTplName = ''
					this.addForm.carDriverTplId = ''
				}else if("addForm.carName" == attr){
					this.addForm.carName = ''
					this.addForm.carId = ''
				}else{
					this.addForm.driverName = ''
					this.addForm.driverId = ''
				}
			},
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'car-require-edit':CarRequireEdit
			"dept-tree": DeptTree,
			"users-select" : UsersSelect,
			'carDriverTpls-Select' : CarDriverTplsSelect,
			'cars-select' : CarsSelect,
			'drivers-select' : DriversSelect,
			'location-select': locationSelect,
			'expenses-select': ExpensesSelect,
			'routeTpls-select':RouteTplsSelect,
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.carRequire);  
			//获取其他信息
			this.getRequireMessages(this.addForm.id)
		}//end mounted
	}

</script>

<style scoped>

</style>