<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="主键" prop="id">
					<el-input v-model="addForm.id" placeholder="主键" ></el-input>
				</el-form-item> 
				<el-form-item label="申请用车编号" prop="requireId">
					<!-- <el-input v-model="addForm.requireId" placeholder="申请用车编号" ></el-input> -->
					<el-button type="text"  @click="selectReqireVisible = true">选择用车编号</el-button>
				</el-form-item> 
				<el-form-item label="打卡用户编号" prop="userid">
					<el-input v-model="addForm.userid" placeholder="打卡用户编号" ></el-input>
				</el-form-item> 
				<el-form-item label="打卡司机编号" prop="driverId">
					<el-input v-model="addForm.driverId" placeholder="打卡司机编号" ></el-input>
				</el-form-item> 
				<el-form-item label="车辆编号" prop="carId">
					<el-input v-model="addForm.carId" placeholder="车辆编号" ></el-input>
				</el-form-item> 
				<el-form-item label="打卡位置" prop="address">
					<el-input v-model="addForm.address" placeholder="打卡位置" ></el-input>
				</el-form-item> 
				<el-form-item label="打卡位置gps" prop="addressGps">
					<!-- <el-input v-model="addForm.addressGps" placeholder="打卡位置gps" ></el-input> -->
					<el-button type="text" @click="showEditLocation('addForm.addressGps')">目的地址定位</el-button>
					<el-tag style="margin-left:20px"  v-if="addForm.addressGps != ''" v-text='"  经纬度坐标:   " + addForm.addressGps'></el-tag>
				</el-form-item> 
				<el-form-item label="打卡时间" prop="createTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.createTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="备注说明" prop="remark">
					<el-input v-model="addForm.remark" placeholder="备注说明" ></el-input>
				</el-form-item> 
				<el-form-item label="状态" prop="status">
					<!-- <el-input v-model="addForm.status" placeholder="状态0-装货中-1出发-2途中-3到达-4卸货中-5卸货完成-6回程途中-7还车完成-8维修中-9故障待援-10故障修复完成" ></el-input> -->
					<el-radio-group v-model="addForm.status" size="small">
						<el-radio-button label="0">装货中</el-radio-button>
						<el-radio-button label="1">出发</el-radio-button>
						<el-radio-button label="2">途中</el-radio-button>
						<el-radio-button label="3">到达</el-radio-button>
						<el-radio-button label="4">卸货中</el-radio-button>
						<el-radio-button label="5">卸货完成</el-radio-button>
						<el-radio-button label="6">回程途中</el-radio-button>
						<el-radio-button label="7">还车完成</el-radio-button>
						<el-radio-button label="8">维修中</el-radio-button>
						<el-radio-button label="9">故障待援</el-radio-button>
						<el-radio-button label="10">故障修复完成</el-radio-button>
					</el-radio-group>
				</el-form-item> 
				<el-form-item label="打卡用户名称" prop="username">
					<el-input v-model="addForm.username" placeholder="打卡用户名称" ></el-input>
				</el-form-item> 
				<el-form-item label="打卡人归属机构" prop="branchId">
					<el-input v-model="addForm.branchId" placeholder="打卡人归属机构" ></el-input>
				</el-form-item> 
				<el-form-item>
					<el-col> 
          <el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>
						<el-button @click.native="handleCancel">取消</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
		</el-row>

		<el-dialog append-to-body title="选择申请请求" :visible.sync="selectReqireVisible" width="70%">
		    <require-select @getSelectRequireVal="onRequireSelected" @cancel="selectReqireVisible = !selectReqireVisible"></require-select>
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
	import { addCarDriverSignIn } from '@/api/oa/car/carDriverSignIn';
	import { mapGetters } from 'vuex'
	import requireSelect from '../components/RequireSelect'
	import locationSelect from '../components/locationSelect'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['carDriverSignIn','visible'],
		watch: {
	      'carDriverSignIn':function( carDriverSignIn ) {
	        this.addForm = carDriverSignIn;
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
				//新增界面数据 car_driver_sign_in
				addForm: {
					id:'',userid:'',driverId:'',carId:'',requireId:'',address:'',addressGps:'',createTime:'',remark:'',status:'',username:'',branchId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				selectReqireVisible:  false,
				selectlocationVisible: false,
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
			//新增提交CarDriverSignIn car_driver_sign_in 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addCarDriverSignIn(params).then((res) => {
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
			onRequireSelected(val){
				console.log(val[0])
				this.addForm.userid = val[0].reqUserid
				this.addForm.username = val[0].reqUsername
				this.addForm.requireId = val[0].id
				//this.addForm.driverId = val[0].driverId
				//this.addForm.carId = val[0].carId
				this.addForm.branchId = val[0].reqBranchId
				this.selectReqireVisible = false
			},
			//展示获取定位的窗口
			showEditLocation: function() {

				this.value = this.addForm.addressGps 
				this.addrName = this.addForm.address

				this.attrName = ''
				this.selectlocationVisible = true;
			},
			getPisotion(val,addrName,attrName){
				this.addForm.addressGps = val
				this.addForm.address  = addrName
				
				this.selectlocationVisible=false
			},
			
			
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'car-driver-sign-in-edit':CarDriverSignInEdit
			'require-select': requireSelect,
			'location-select': locationSelect,
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.carDriverSignIn);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>