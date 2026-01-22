<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-row>
					<el-col style="display:none"  :span="12">
						<el-form-item label="主键" prop="id">
							<el-input v-model="addForm.id" placeholder="主键" ></el-input>
						</el-form-item> 
					</el-col>
					<el-col :span="12">
						<el-form-item label="出发地址" prop="fromAddress">
							<el-input v-model="addForm.fromAddress" placeholder="出发地址" ></el-input>
						</el-form-item> 
					</el-col>
					<el-col :span="12">
						<el-form-item label="出发地址定位" prop="fromAddressGps">
							<!-- <el-input v-model="addForm.fromAddressGps" placeholder="出发地址定位" ></el-input> -->
							<el-button type="text"  @click="showEditLocation('addForm.fromAddressGps','')">出发地址定位</el-button>
							<el-tag style="margin-left:20px"  v-if="addForm.fromAddress != ''" v-text='"  经纬度坐标:   " + addForm.fromAddress'></el-tag>
						</el-form-item> 
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="目的地址" prop="destAddress">
							<el-input v-model="addForm.destAddress" placeholder="目的地址" ></el-input>
						</el-form-item> 
					</el-col>
					<el-col :span="12">		
						<el-form-item label="目的地址定位" prop="destAddressGps">
							<!-- <el-input v-model="addForm.destAddressGps" placeholder="目的地址定位" ></el-input> -->
							<el-button type="text" @click="showEditLocation('addForm.destAddressGps','')">目的地址定位</el-button>
							<el-tag style="margin-left:20px"  v-if="addForm.destAddress != ''" v-text='"  经纬度坐标:   " + addForm.destAddress'></el-tag>
						</el-form-item> 
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="线路名称" prop="routeName">
							<el-input v-model="addForm.routeName" placeholder="线路名称" ></el-input>
						</el-form-item> 
					</el-col>
					<el-col :span="12">		
						<el-form-item label="是否打卡" prop="isSignIn">
							<el-checkbox v-model="signChecked">是</el-checkbox>
						</el-form-item> 
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="是否有子路线" prop="hasDetail">
							<el-checkbox v-model="childChecked">是</el-checkbox>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="距离米" prop="distance">
							<el-input v-model="addForm.distance" placeholder="距离米"></el-input>
						</el-form-item> 
					</el-col>
				</el-row>
				<el-row>
					
				</el-row>	
				<el-form-item style="display:none" label="归属机构" prop="branchId">
					<el-input v-model="addForm.branchId" placeholder="归属机构" ></el-input>
				</el-form-item> 
				<el-form-item>
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
			<el-row v-if="childChecked" style="margin-left:50px" >
					<el-row>
						<el-tag size="medium">填写子路线信息</el-tag>
					</el-row>
					<el-table :data="carRouteDetailTplsNew" border stripe>
						<el-table-column type="index" width="50">  
						</el-table-column>
						<!-- <el-table-column align="center" label="主键" width="120">
							<template slot-scope="row">
								<el-input  size="small" v-model="carRouteDetailTplsNew[row.$index].id" placeholder="主键"> </el-input>
							</template>
						</el-table-column> -->

						<el-table-column  label="子路线名称" width="220">
							<template slot-scope="row">
								<el-input  size="small" v-model="carRouteDetailTplsNew[row.$index].detailName" placeholder="子路线名称"> </el-input>
							</template>
						</el-table-column>
						
						<el-table-column label="出发地址定位" width="140">
							<template slot-scope="row">
								<el-button v-if="carRouteDetailTplsNew[row.$index].fromAddressGps == ''" type="text" @click="showEditLocation(row.$index + '','0')">出发地址定位</el-button>
								<el-button v-if="carRouteDetailTplsNew[row.$index].fromAddressGps != ''" type="text" @click="showEditLocation(row.$index + '','0')">更换出发地址定位</el-button>								
								<!-- <el-tag  v-if="carRouteDetailTplsNew[row.$index].fromAddressGps != ''" v-text='"  经纬度坐标:   " + carRouteDetailTplsNew[row.$index].fromAddressGps'></el-tag> -->
							</template>	
						</el-table-column> 

						<el-table-column label="出发地址" width="220">
							<template slot-scope="row">
								<el-input  size="small" v-model="carRouteDetailTplsNew[row.$index].fromAddress" placeholder="出发地址"> </el-input>
							</template>
						</el-table-column>

						<el-table-column label="目的地址定位" width="140">
							<template slot-scope="row">
								<el-button v-if="carRouteDetailTplsNew[row.$index].destAddressGps == ''" type="text" @click="showEditLocation(row.$index + '','1')">目的地址定位</el-button>
								<el-button v-if="carRouteDetailTplsNew[row.$index].destAddressGps != ''" type="text" @click="showEditLocation(row.$index + '','1')">更换目的地址定位</el-button>
								<!-- <el-tag  v-if="carRouteDetailTplsNew[row.$index].destAddressGps != ''" v-text='"  经纬度坐标:   " + carRouteDetailTplsNew[row.$index].destAddressGps'></el-tag> -->
							</template>	
						</el-table-column> 

						<el-table-column label="目的地址" width="220" >
							<template slot-scope="row">
								<el-input size="small" v-model="carRouteDetailTplsNew[row.$index].destAddress" placeholder="目的地址"> </el-input>
							</template>
						</el-table-column>
						<el-table-column label="序号" width="80" >	
							<template slot-scope="row">
								<el-input size="small" v-model="carRouteDetailTplsNew[row.$index].seqNum" placeholder="序号"> </el-input>
							</template>
						</el-table-column>
						<el-table-column label="是否打卡" width="80" >
							<template slot-scope="row">
								<el-checkbox  size="small" v-model="carRouteDetailTplsNew[row.$index].isSignIn">是</el-checkbox>
							</template>
						</el-table-column>
						<el-table-column label="距离米" width="100" >	
							<template slot-scope="row">
								<el-input size="small" v-model="carRouteDetailTplsNew[row.$index].distance" placeholder="距离米"> </el-input>
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
		</el-row>
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
			<!-- <div slot="footer" class="dialog-footer">
					<el-button @click="selectlocationVisible = false">取 消</el-button>
					<el-button type="primary" @click="selectlocationVisible = false">确 定</el-button>
			</div> -->
		</el-dialog>
		
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addCarRouteTpl } from '@/api/oa/car/carRouteTpl';
	import { mapGetters } from 'vuex'
	import locationSelect from '../components/locationSelect'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['carRouteTpl','visible'],
		watch: {
	      'carRouteTpl':function( carRouteTpl ) {
	        this.addForm = carRouteTpl;
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
					fromAddress: [
						{ required: true, message: '出发地址不能为空', trigger: 'change' }
					],
					destAddress: [
						{ required: true, message: '出发地址不能为空', trigger: 'change' }
					],
					fromAddressGps: [
						{ required: true, message: '出发地址不能为空', trigger: 'change' }
					],
					destAddressGps: [
						{ required: true, message: '出发地址不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 car_route_tpl
				addForm: {
					id:'',fromAddress:'',destAddress:'',fromAddressGps:'',destAddressGps:'',isSignIn:'',routeName:'',distance:'',hasDetail:'',branchId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				childChecked : false,
				signChecked: true,
				carRouteDetailTplsNew: [],
				selectlocationVisible : false,
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
			//新增提交CarRouteTpl car_route_tpl 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							//console.log(this.signChecked)
							this.signChecked ? this.addForm.isSignIn = 1 : this.addForm.isSignIn = 0
							this.childChecked ? this.addForm.hasDetail = 1 : this.addForm.hasDetail = 0
							let params = Object.assign({}, this.addForm);
							params.carRouteDetailTplsNew = this.carRouteDetailTplsNew

							if(params.hasDetail == '1' && params.carRouteDetailTplsNew.length <= 0){
								this.$message("请输入子路线信息"); 
								this.load.add=false
								return false;
							}

							addCarRouteTpl(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.childChecked = false
									this.signChecked = true
									this.carRouteDetailTplsNew = []
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			routeDetailAddRow(){
				let params = {
					id:'',
					fromAddress:'',
					destAddress:'',
					fromAddressGps:'',
					destAddressGps:'',
					isSignIn:'',
					seqNum: '',
					detailName:'',
					distance:'',
					routeId:''
				}
				this.carRouteDetailTplsNew.push(params);
			},
			routeDetailDelRow(index) {
				this.carRouteDetailTplsNew.splice(index, 1);
			},	
			//展示获取定位的窗口
			showEditLocation: function(attrName,addr) {
				//console.log(attrName + "ssss")
				if(attrName == 'addForm.fromAddressGps' ){
					this.value = this.addForm.fromAddressGps 
					this.addrName = this.addForm.fromAddress 
				}else if(attrName == 'addForm.destAddressGps') {
					this.value = this.addForm.destAddressGps
					this.addrName = this.addForm.destAddress
				}else{
					if(this.carRouteDetailTplsNew.length > 0){
						//console.log(this.carRouteDetailTplsNew)
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
				let index = ''
				if(attrName != ''){
					index = attrName.indexOf(",")
					var attrName01 = attrName.substring(0 ,index)
				}
				
				if(attrName01 == 'addForm.fromAddressGps' ){
					this.addForm.fromAddressGps = val
					this.addForm.fromAddress = addrName
				}else if(attrName01 == 'addForm.destAddressGps') {
					this.addForm.destAddressGps = val
					this.addForm.destAddress = addrName
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
			}
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'car-route-tpl-edit':CarRouteTplEdit
			'location-select': locationSelect
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.carRouteTpl);  
			/**在下面写其它函数***/
		}//end mounted
	}

</script>

<style scoped>
	.childFont{
		font-size: 10px;
	}

</style>