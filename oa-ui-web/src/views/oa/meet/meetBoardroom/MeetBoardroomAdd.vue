<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item style="display:none" label="主键" prop="id">
					<el-input v-model="addForm.id" placeholder="主键" ></el-input>
				</el-form-item> 
				<el-form-item label="会议室名称" prop="name">
					<el-input v-model="addForm.name" placeholder="会议室名称" ></el-input>
				</el-form-item> 
				<!-- <el-form-item label="会议室类型id" prop="typeId">
					<el-input v-model="addForm.typeId" placeholder="会议室类型id" ></el-input>
				</el-form-item>  -->
				<el-form-item label="会议室类型" prop="typeId">
					<!-- <el-input v-model="addForm.typeName" placeholder="会议室类型" ></el-input> -->
					<el-autocomplete
							class="inline-input"
							v-model="addForm.typeName"
							:fetch-suggestions="querySearch"
							placeholder="会议室类型"
							@select="handleSelect"
					></el-autocomplete>
				</el-form-item> 
				<el-form-item label="会议室电话" prop="phone">
					<el-input v-model="addForm.phone" placeholder="会议室电话" ></el-input>
				</el-form-item> 
				<el-form-item label="会议人数" prop="number">
					<el-input-number v-model="addForm.number" :min="0" :max="200"></el-input-number>
				</el-form-item> 

				<el-form-item label="设备">
					<el-button type="text" style="margin-right:5px" @click="deviceFormVisible = true">选择设备</el-button>
					<el-button  type="text" style="margin-right:5px" @click="addForm.devices = []">清除已选</el-button>
					<el-tag style="margin-right:5px" v-for="(item,index) in addForm.devices" :key="index" @close="handleClose(item)" closable> {{item.deviceName}}</el-tag> 
				</el-form-item> 

				<el-form-item label="状态" prop="status">
					<el-radio-group  v-model="addForm.status">
						<el-radio-button label="0">禁用</el-radio-button>
						<el-radio-button label="1">启用</el-radio-button>
					</el-radio-group>
				</el-form-item> 
				<el-form-item label="备注" prop="remark">
					<el-input type="textarea" :rows="4" maxlength="255" v-model="addForm.remark" placeholder="备注" ></el-input>
				</el-form-item> 

				<el-form-item label="附件">
					<upload v-if="fileVisible" :archiveId="addForm.id" :branchId="userInfo.branchId"  @on-change="onChange"></upload>
				</el-form-item> 
				
				<el-form-item style="display:none" label="归属机构" prop="branchId">
					<el-input v-model="addForm.branchId" placeholder="归属机构" ></el-input>
				</el-form-item> 
				<el-form-item>
					<el-col> 
          <el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>
						<el-button @click.native="handleCancel">取消</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
			<!--获取选择设备界面-->
			<el-dialog :append-to-body="true" title="选择设备" :visible.sync="deviceFormVisible"  width="60%"  :close-on-click-modal="false">
				  <meet-device-select @getSelectDevices="getSelectDevices" :visible="deviceFormVisible" @cancel="deviceFormVisible=false"></meet-device-select>
			</el-dialog>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { listMeetCategory } from '@/api/oa/meet/meetCategory';
	import { addMeetBoardroom } from '@/api/oa/meet/meetBoardroom';
	import { mapGetters } from 'vuex'

	import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
	import MeetDeviceSelect from '../components/MeetDeviceSelect';
	import { sn } from "@/common/js/sequence"; //id生成器

	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['meetBoardroom','visible'],
		watch: {
	      'meetBoardroom':function( meetBoardroom ) {
				//this.addForm = meetBoardroom;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
				//从新打开页面时某些数据需要重新加载，可以在这里添加
				this.fileVisible = true
				this.addForm.id = sn()
				console.log(this.addForm.id)
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					name: [
						{ required: true, message: '名称不能为空', trigger: 'change' }
					],
					typeId: [
						{ required: true, message: '分类不能为空', trigger: 'submit' }
					]
				},
				//新增界面数据 meet_boardroom
				addForm: {
					id:'unfinded',name:'',typeId:'',typeName:'',phone:'', number:10, remark:'',status:'1',branchId:'',
					devices:[],
					appendixList:[],
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				//搜索提示出来的数组
				restaurants: [],
				deviceFormVisible: false,
				fileVisible: true,

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交MeetBoardroom meet_boardroom 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				if(this.addForm.phone != ''){
					if(this.addForm.phone.length != 11){
						this.$message("手机号码输入错误")
						return
					}
				}

				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							this.addForm.branchId = this.userInfo.branchId
							let params = Object.assign({}, this.addForm); 
							addMeetBoardroom(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									//this.$refs['addForm'].resetFields();
									let newForm =  {id:'',name:'',typeId:'',typeName:'',phone:'', number:10, remark:'',status:'1',branchId:'',devices:[],appendixList:[] } 
									this.addForm = newForm
									this.fileVisible = false
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			querySearch(queryString, cb) {
				var restaurants = this.restaurants;
				const results = this.restaurants.filter( obj => obj.value.indexOf(queryString) != -1 )
				if(results.length < 0){
					queryString = ''
				}
				cb(results);
			},
			createFilter(queryString) {
				return (restaurant) => {
					return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
				};
			},	
			handleSelect(item) {
				console.log(item);
				this.addForm.typeId = item.id
			},
			//获取列表 MeetCategory meet_category
			getMeetCategorys() {
				let params = {	
				};
				this.load.list = true;
				this.restaurants = []
				listMeetCategory(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						if(res.data.data.length > 0){
							res.data.data.forEach((meetCategory)=>{
								let category = {
									value : meetCategory.name,
									id: meetCategory.id
								}
								this.restaurants.push(category)
							})
						}
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},
			getSelectDevices(sels){
				this.deviceFormVisible = false
				//this.addForm.devices = sels
				if(sels){
					sels.forEach((sel)=>{
						let device = {
							id:'',
							deviceId : sel.id,
							deviceName: sel.name,
							meetBoardroomId:'',
							remark: '',
						}
						if( JSON.stringify(this.addForm.devices).indexOf(JSON.stringify(device)) == -1 ){
							this.addForm.devices.push(device)
						}
					})
				}
			},
			handleClose(value){
				let str = JSON.stringify(value)
				this.addForm.devices.forEach((device)=>{
					if(str == JSON.stringify(device)){
						this.addForm.devices.splice(this.addForm.devices.indexOf(device),1)
					}
				})
				
			},
			onChange : function(file,fileList){
				//this.addForm.driverCardImageUrl = file.url
				console.log(file)
				console.log(fileList)
				let list = []
				if(fileList != null && fileList.length > 0){
					fileList.forEach( (item)=>{
						let fileOne = {
							id: item.id,
							meetBoardroomId:'',
							name: item.name,
							addr: item.url,
							type: item.fileSuffix,
							remark: item.remark,
						}
						list.push(fileOne)
					} )
					this.addForm.appendixList = list
				}
			},
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'meet-boardroom-edit':MeetBoardroomEdit
			'meet-device-select':MeetDeviceSelect,
			'upload': AttachmentUpload,
		},
		mounted() {
			//this.addForm=Object.assign(this.addForm, this.meetBoardroom);  
			/**在下面写其它函数***/
			this.getMeetCategorys();
			this.addForm.id = sn()

		}//end mounted
	}

</script>

<style scoped>

</style>