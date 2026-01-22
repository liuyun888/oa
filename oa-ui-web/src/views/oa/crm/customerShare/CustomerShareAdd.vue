<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="对象类型" prop="shareType">
					<el-select @change="shareTypeChange" v-model="addForm.shareType" placeholder="请选择">
						<el-option
							v-for="item in shareTypeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item> 

				<el-form-item label="对象">
					<span class="select" @click="showObj"><i class="el-icon-search"></i>请选择</span>
					<el-tag style="margin-right:10px"
						v-for="tag in shareObjs"
						:key="tag.id"
						closable
						@close="closeTag(tag.id)"
						>
						{{tag.name}}
					</el-tag>
				</el-form-item>
				
				<el-form-item label="权限" prop="shareLevel">
					<el-select v-model="addForm.shareLevel" placeholder="请选择">
						<el-option
							v-for="item in shareLevelOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item> 
					
				<el-form-item>
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
		</el-row>

		<el-dialog append-to-body  title="选择部门" width="50%" top="5vh"  :visible.sync="visibleDeptSelect" >
			<dept-tree :defaultExpandAll="true" @node-click="getDeptData"></dept-tree>
        </el-dialog>

        <el-dialog append-to-body  title="人员选择" width="70%" top="5vh" :visible.sync="visibleUserSelect">
            <user-select @confirm="getUserData" ></user-select>
        </el-dialog>

	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addCustomerShare } from '@/api/oa/crm/customerShare';
	import DeptTree from '@/views/mdp/sys/dept/DeptTree';
    import UsersSelect from '@/views/mdp/sys/user/UsersSelect'
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['customerShare','visible', 'customerId'],
		watch: {
		  
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
					shareId: [
						//{ required: true, message: '共享id不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 crm_customer_share
				addForm: {
					shareId:'', customerId:'', shareType:'dept', shareObj:'',shareObjName:'',shareLevel:'',branchId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				shareTypeOptions: [
					{
						label: '部门',
						value: 'dept'
					},
					{
						label: '用户',
						value:  'user'
					},
					{
						label: '角色',
						value: 'role'
					}
				],

				shareLevelOptions: [
					{
						label: '查看',
						value: 'see'
					},
					{
						label: '编辑',
						value:  'edit'
					},
				],

				visibleDeptSelect: false,
				visibleUserSelect: false,
				//分享的对象
				shareObjs: [],




				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交CustomerShare crm_customer_share 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.transferData(this.addForm)); 
							addCustomerShare(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.shareObj = [];
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},

			transferData(data) {
				data.shareObjs = this.shareObjs;
				return data;
			},

			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			getDeptData(data) {
				this.visibleDeptSelect = false;
				let flag = this.shareObjs.some(x => {if(x.id === data.deptid) return true;});
				if(flag) {return};
				this.shareObjs.push ({id: data.deptid,name: data.deptName,});
			},

			getUserData(data) {
				this.visibleUserSelect = false;
				data.forEach(d => {this.shareObjs.push({id: d.userid, name: d.username})});
			},

			//展示相对的组件
			showObj() {
				if('dept' === (this.addForm.shareType)) {
					this.visibleDeptSelect = true;
				}

				if('user' === (this.addForm.shareType)) {
					this.visibleUserSelect = true;
				}
			},

			closeTag(id) {
				this.shareObjs.forEach((p, index) => {
					if(p.id === id) {
						this.shareObjs.splice(index, 1);
					}
				})
			},

			//改变分享类型
			shareTypeChange() {
				this.shareObjs = [];
			},

			
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'customer-share-edit':CustomerShareEdit
			'dept-tree' : DeptTree,
            'user-select' : UsersSelect,
		},
		mounted() {
			this.addForm.customerId = this.customerId;
			console.log(this.customerId);
			console.log(this.addForm);
			// this.addForm=Object.assign(this.addForm, this.customerShare);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

.select {
	color: #409EFF;
}

.select:hover{
	cursor: pointer;
}


</style>