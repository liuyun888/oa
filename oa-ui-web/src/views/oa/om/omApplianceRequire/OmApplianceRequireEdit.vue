<template>
	<section>
		 <el-row class="page-container border padding">
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm"> 
				<el-form-item label="申请人" prop="username">
					{{editForm.username}}
				</el-form-item>
				<el-form-item label="申请部门" prop="deptName">
					{{editForm.deptName}}
				</el-form-item>
				<el-form-item label="用品" prop="applianceId">
					
					<el-button type="text" @click="openSelectAppliance" >选择用品</el-button>
					<el-tag v-if="editForm.applianceName != ''" style="margin-left:20px;" v-text="editForm.applianceName"></el-tag>
					<font color="red" v-if="editForm.applianceName != ''">规格:{{editForm.standard}}</font>
					&nbsp;<font color="red" v-if="editForm.applianceName != ''">当前库存:{{editForm.stock}}</font>
					
				</el-form-item>
				<el-form-item label="规格" prop="standard">
					<el-input :disabled="true" v-model="editForm.standard" placeholder="规格"></el-input>
				</el-form-item>
				<el-form-item label="使用数量" prop="num">
					<el-input-number v-model="editForm.num" :min="0" @change="changNum" :max="parseInt(editForm.stock)"></el-input-number>
				</el-form-item>
				<el-form-item label="当前库存" prop="stock">
					<el-input-number :disabled="true" v-model="editForm.stock" :min="0"></el-input-number>
				</el-form-item>
				<el-form-item label="使用类型" prop="useType">
					<el-radio-group v-model="editForm.useType">
						<el-radio label="0">个人使用</el-radio>
						<el-radio label="1">部门使用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="领取方式" prop="receiveType">
					<el-radio-group v-model="editForm.receiveType">
						<el-radio label="0">自取</el-radio>
						<el-radio label="1">快递</el-radio>
						<el-radio label="2">他人代领</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-if="editForm.receiveType == '2'" label="" prop="remark">
					<el-input v-model="editForm.receiveName" placeholder="领取人名字" ></el-input>
				</el-form-item>
				<el-form-item label="领用日期" prop="useTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.useTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
				<el-form-item label="说明" prop="remark">
					<el-input type="textarea" :rows="3" maxlength="255" v-model="editForm.remark" placeholder="说明" ></el-input>
				</el-form-item>

				<el-form-item>
					<el-col :span="24" :offset="8">
						<el-button @click.native="handleCancel">取消</el-button>
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">保存</el-button>
					</el-col>
				</el-form-item>
			</el-form>
			<el-dialog title="选择用品" append-to-body :visible.sync="selectApplianceVisible"  width="70%"  :close-on-click-modal="false">
				<appliance-components @onSelectAppliance="onSelectAppliance" @cancel="selectApplianceVisible=false" ></appliance-components>
			</el-dialog>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editOmApplianceRequire } from '@/api/oa/om/omApplianceRequire';
	import { mapGetters } from 'vuex'
	import omApplianceComponents from '../components/OmApplianceComponents';

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['omApplianceRequire','visible'],
		watch: {
	      'omApplianceRequire':function( omApplianceRequire ) {
	        this.editForm = omApplianceRequire;
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
					id: [
						//{ required: true, message: '申请单号不能为空', trigger: 'change' }
					]
				},
				//编辑界面数据  OmApplianceRequire om_appliance_require
				editForm: {
					id:'',applianceId:'',applianceName:'',standard:'',num:'',stock:'',remark:'',useType:'',receiveType:'',useTime:'',createTime:'',status:'',branchId:'',receiveName:'',userid:'',username:'',
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				selectApplianceVisible: false,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交OmApplianceRequire om_appliance_require父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							editOmApplianceRequire(params).then((res) => {
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

			openSelectAppliance(){
				this.selectApplianceVisible = true
			},
			onSelectAppliance(value){
				//console.log(value)
				this.selectApplianceVisible = false
				this.editForm.applianceId = value.id
				this.editForm.applianceName = value.name
				this.editForm.stock = value.stock
				this.editForm.standard = value.standard
			},

			//检测输入要使用的数量是否要大于库存量
			changNum(value){
				if(this.editForm.stock < value){
					this.$message({ message: '库存不够,请减少数量', type: 'error' });
					// this.addForm.num = this.addForm.stock
				}

			},


			/**end 在上面加自定义方法**/
		},//end method
		components: {
			//在下面添加其它组件 'om-appliance-require-edit':OmApplianceRequireEdit
			'appliance-components':omApplianceComponents,
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.omApplianceRequire);
		}
	}

</script>

<style scoped>

</style>
