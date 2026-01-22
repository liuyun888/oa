<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item style="display:none" label="主键" prop="id">
					<el-input  v-model="editForm.id" placeholder="主键"></el-input>
				</el-form-item> 
				<el-form-item label="会议室名称" prop="name">
					<el-input v-model="editForm.name" placeholder="会议室名称"></el-input>
				</el-form-item> 
				<el-form-item style="display:none" label="会议室类型id" prop="typeId">
					<el-input v-model="editForm.typeId" placeholder="会议室类型id"></el-input>
				</el-form-item> 
				<el-form-item label="会议室类型" prop="typeName">
					<el-autocomplete
							class="inline-input"
							v-model="editForm.typeName"
							:fetch-suggestions="querySearch"
							placeholder="会议室类型"
							@select="handleSelect"
					></el-autocomplete>
				</el-form-item> 
				<el-form-item label="会议室电话" prop="phone">
					<el-input v-model="editForm.phone" placeholder="会议室电话"></el-input>
				</el-form-item> 
				<el-form-item label="会议人数" prop="number">
					<el-input-number v-model="editForm.number" :min="0" :max="200"></el-input-number>
				</el-form-item> 

				<el-form-item label="设备">
					<el-button type="text" style="margin-right:5px" @click="deviceFormVisible = true">选择设备</el-button>
					<el-button  type="text" style="margin-right:5px" @click="editForm.devices = []">清除已选</el-button>
					<el-tag style="margin-right:5px" v-for="(item,index) in editForm.devices" :key="index" @close="handleClose(item)" closable> {{item.deviceName}}</el-tag> 
				</el-form-item> 

				<el-form-item label="状态" prop="status">
					<el-radio-group  v-model="editForm.status">
						<el-radio-button label="0">禁用</el-radio-button>
						<el-radio-button label="1">启用</el-radio-button>
					</el-radio-group>
				</el-form-item> 
				<el-form-item label="备注" prop="remark">
					<el-input type="textarea" :rows="4" maxlength="255" v-model="editForm.remark" placeholder="备注" ></el-input>
				</el-form-item> 
				
				<el-form-item label="附件">
					<upload  :archiveId="editForm.id" :branchId="userInfo.branchId"  @on-change="onChange"></upload>
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
	import { getMeetBoardroom,editMeetBoardroom } from '@/api/oa/meet/meetBoardroom';
	import { mapGetters } from 'vuex'

	import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
	import MeetDeviceSelect from '../components/MeetDeviceSelect';
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['meetBoardroom','visible'],
		watch: {
	      'meetBoardroom':function( meetBoardroom ) {
			this.editForm=Object.assign(this.editForm, this.meetBoardroom);
			this.fileVisible = true
			this.getMeetBoardroom()
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
					name: [
						{ required: true, message: '主键不能为空', trigger: 'change' }
					]
				},
				//编辑界面数据  MeetBoardroom meet_boardroom
				editForm: {
					id:'unfinded',name:'',typeId:'',typeName:'',phone:'',number:'',remark:'',status:'',branchId:'',
					devices:[],
					appendixList:[],
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				restaurants: [],
				deviceFormVisible: false,
				fileVisible: true,

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				//this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交MeetBoardroom meet_boardroom父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editMeetBoardroom(params).then((res) => {
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
				this.editForm.typeId = item.id
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
				if(sels){
					sels.forEach((sel)=>{
						let device = {
							id:'',
							deviceId : sel.id,
							deviceName: sel.name,
							meetBoardroomId:'',
							remark: '',
						}
						let newdevices = this.editForm.devices.filter( obj => obj.deviceId == device.deviceId ) 
						//console.log(newdevices)
						if( newdevices != null && newdevices.length == 0){
							this.editForm.devices.push(device)
						}
						
					})
				}
			},
			handleClose(value){
				let str = JSON.stringify(value)
				this.editForm.devices.forEach((device)=>{
					if(str == JSON.stringify(device)){
						this.editForm.devices.splice(this.editForm.devices.indexOf(device),1)
					}
				})
				
			},
			onChange : function(file,fileList){
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
					this.editForm.appendixList = list
				}
			},	

			//获取列表 MeetBoardroom meet_boardroom
			getMeetBoardroom() {
				let params = {
					id: this.editForm.id
				};
				this.editForm.devices = []
				this.editForm.appendixList = []
				getMeetBoardroom(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						//this.meetBoardrooms = res.data.data;
//						console.log(res.data.data)
						this.editForm.devices = res.data.data.devices
						this.editForm.appendixList = res.data.data.appendixList
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
				}).catch( err => this.load.list = false );
			},
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
			//在下面添加其它组件 'meet-boardroom-edit':MeetBoardroomEdit
			'meet-device-select':MeetDeviceSelect,
			'upload': AttachmentUpload,
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.meetBoardroom);
			this.fileVisible = true
			this.getMeetBoardroom()  
		}
	}

</script>

<style scoped>

</style>