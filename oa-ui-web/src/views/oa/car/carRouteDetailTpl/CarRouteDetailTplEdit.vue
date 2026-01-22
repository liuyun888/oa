<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item style="display:none" label="主键" prop="id">
					<el-input v-model="editForm.id" placeholder="主键"></el-input>
				</el-form-item> 
				<el-form-item label="出发地址" prop="fromAddress">
					<el-input v-model="editForm.fromAddress" placeholder="出发地址"></el-input>
				</el-form-item> 
				<el-form-item label="目的地址" prop="destAddress">
					<el-input v-model="editForm.destAddress" placeholder="目的地址"></el-input>
					
				</el-form-item> 
				<el-form-item label="出发地址定位" prop="fromAddressGps">
					<!-- <el-input v-model="editForm.fromAddressGps" placeholder="出发地址定位"></el-input> -->
					<el-button type="text" @click="showEditLocation('editForm.fromAddressGps')">出发地址定位</el-button>
					<el-tag style="margin-left:20px"  v-if="editForm.fromAddressGps != ''" v-text='"经纬度坐标: " + editForm.fromAddressGps'></el-tag>
				</el-form-item> 
				<el-form-item label="目的地址定位" prop="destAddressGps">
					<!-- <el-input v-model="editForm.destAddressGps" placeholder="目的地址定位"></el-input> -->
					<el-button type="text"  @click="showEditLocation('editForm.destAddressGps')">目的地址定位</el-button>
					<el-tag style="margin-left:20px"  v-if="editForm.destAddressGps != ''" v-text='"经纬度坐标: " + editForm.destAddressGps'></el-tag>
				</el-form-item> 
				<el-form-item label="是否打卡" prop="isSignIn">
					<el-checkbox v-model="signChecked">是</el-checkbox>
				</el-form-item> 
				<el-form-item label="序号" prop="seqNum">
					<el-input-number v-model="editForm.seqNum" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="线路名称" prop="detailName">
					<el-input v-model="editForm.detailName" placeholder="线路名称"></el-input>
				</el-form-item> 
				<el-form-item label="距离米" prop="distance">
					<el-input v-model="editForm.distance" placeholder="距离米"></el-input>
				</el-form-item> 
				<!-- <el-form-item label="路线编号" prop="routeId">
					
					<el-select v-model="editForm.routeId" placeholder="请选择">
						<el-option
						v-for="item in carRouteTpls"
						:key="item.id"
						:label="item.routeName"
						:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>  -->
				<el-form-item> 
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>  
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
		<!--地址定位组件-->
		<el-dialog append-to-body
			title="请选择地址"
			:visible.sync="selectlocationVisible"
			width="60%"
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
	import { editCarRouteDetailTpl } from '@/api/oa/car/carRouteDetailTpl';
	import { mapGetters } from 'vuex'
	import locationSelect from '../components/locationSelect'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['carRouteDetailTpl','visible'],
		watch: {
	      'carRouteDetailTpl':function( carRouteDetailTpl ) {
	        this.editForm = carRouteDetailTpl;
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
				//编辑界面数据  CarRouteDetailTpl car_route_detail_tpl
				editForm: {
					id:'',fromAddress:'',destAddress:'',fromAddressGps:'',destAddressGps:'',isSignIn:'',seqNum:'',detailName:'',distance:'',routeId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				carRouteTpls:[],
				signChecked: '',
				selectlocationVisible : false,
				attrName: '',//代表接受值的名称
				value: '',  //传去选择地址的值
				addrName: '', //传去选择地址的名
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交CarRouteDetailTpl car_route_detail_tpl父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							this.signChecked ? this.editForm.isSignIn = 1 : this.editForm.isSignIn = 0
							let params = Object.assign({}, this.editForm); 
							editCarRouteDetailTpl(params).then((res) => {
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
			// getCarRouteTpls() {
			// 	let params = {
			// 		hasDetail: '1'
			// 	};
			// 	listCarRouteTpl(params).then((res) => {
			// 		var tips=res.data.tips;
			// 		if(tips.isOk){ 
			// 			this.carRouteTpls = res.data.data;
			// 		}else{
			// 			this.$message({ message: tips.msg, type: 'error' });
			// 		} 
			// 		this.load.list = false;
			// 	}).catch( );
			// },	
			
			//编辑地址
			showEditLocation: function(attrName) {
					if(attrName == 'editForm.fromAddressGps' ){
					this.value = this.editForm.fromAddressGps 
					this.addrName = this.editForm.fromAddress 
				}else{
					this.value = this.editForm.destAddressGps
					this.addrName = this.editForm.destAddress
				}
				
				this.attrName = attrName
				this.selectlocationVisible = true;
			},
			getPisotion(val,addrName,attrName){
				if(attrName == 'editForm.fromAddressGps' ){
					this.editForm.fromAddressGps = val
					this.editForm.fromAddress  = addrName
				}else{
					this.editForm.destAddressGps = val
					this.editForm.destAddress  = addrName
				}
				this.selectlocationVisible=false
			}	
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
			//在下面添加其它组件 'car-route-detail-tpl-edit':CarRouteDetailTplEdit
			'location-select': locationSelect
		},
		beforeCreate(){
			window._bd_share_main="";
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.carRouteDetailTpl); 
			//this.getCarRouteTpls(); 
			this.editForm.isSignIn == 1 ? this.signChecked = true : this.signChecked = false
		}
	}

</script>

<style scoped>

</style>