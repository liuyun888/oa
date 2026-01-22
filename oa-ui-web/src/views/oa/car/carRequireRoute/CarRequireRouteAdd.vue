<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="主键" prop="id">
					<el-input v-model="addForm.id" placeholder="主键" ></el-input>
				</el-form-item> 
				<el-form-item label="出发地址" prop="fromAddress">
					<el-input v-model="addForm.fromAddress" placeholder="出发地址" ></el-input>
				</el-form-item> 
				<el-form-item label="目的地址" prop="destAddress">
					<el-input v-model="addForm.destAddress" placeholder="目的地址" ></el-input>
				</el-form-item> 
				<el-form-item label="出发地址定位" prop="fromAddressGps">
					<el-input v-model="addForm.fromAddressGps" placeholder="出发地址定位" ></el-input>
				</el-form-item> 
				<el-form-item label="目的地址定位" prop="destAddressGps">
					<el-input v-model="addForm.destAddressGps" placeholder="目的地址定位" ></el-input>
				</el-form-item> 
				<el-form-item label="是否打卡" prop="isSignIn">
					<el-input v-model="addForm.isSignIn" placeholder="是否打卡" ></el-input>
				</el-form-item> 
				<el-form-item label="序号" prop="seqNum">
					<el-input-number v-model="addForm.seqNum" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="线路名称" prop="detailName">
					<el-input v-model="addForm.detailName" placeholder="线路名称" ></el-input>
				</el-form-item> 
				<el-form-item label="距离米" prop="distance">
					<el-input v-model="addForm.distance" placeholder="距离米"></el-input>
				</el-form-item> 
				<el-form-item label="用车申请编号" prop="requireId">
					<el-input v-model="addForm.requireId" placeholder="用车申请编号" ></el-input>
				</el-form-item> 
				<el-form-item label="是否有子路线" prop="hasDetail">
					<el-input v-model="addForm.hasDetail" placeholder="是否有子路线" ></el-input>
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
	import { addCarRequireRoute } from '@/api/oa/car/carRequireRoute';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['carRequireRoute','visible'],
		watch: {
	      'carRequireRoute':function( carRequireRoute ) {
	        this.addForm = carRequireRoute;
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
				//新增界面数据 car_require_route
				addForm: {
					id:'',fromAddress:'',destAddress:'',fromAddressGps:'',destAddressGps:'',isSignIn:'',seqNum:'',detailName:'',distance:'',requireId:'',hasDetail:''
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
			//新增提交CarRequireRoute car_require_route 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addCarRequireRoute(params).then((res) => {
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
		    //在下面添加其它组件 'car-require-route-edit':CarRequireRouteEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.carRequireRoute);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>