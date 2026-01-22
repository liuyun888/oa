<template>
	<section>
		 <el-row class="page-container border pediting">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="用品" prop="applianceId">
					<el-button type="text" @click="openSelectAppliance" >选择用品</el-button>
					<el-tag v-if="editForm.applianceName != ''" style="margin-left:20px;" v-text="editForm.applianceName"></el-tag>
				</el-form-item>
				<!--
				<el-form-item label="用品id" prop="applianceId">
					<el-input v-model="editForm.applianceId" placeholder="用品id" ></el-input>
				</el-form-item>
				<el-form-item label="用品名称" prop="applianceName">
					<el-input v-model="editForm.applianceName" placeholder="用品名称" ></el-input>
				</el-form-item>  -->
				<el-form-item label="规格" prop="standard">
					<el-input v-model="editForm.standard" placeholder="规格" ></el-input>
				</el-form-item>
				<el-form-item label="单位" prop="unit">
					<el-input :disabled="true" v-model="unit" placeholder="单位"></el-input>
				</el-form-item>
				<el-form-item label="单价" prop="price">
					<el-input v-model="editForm.price" placeholder="单价"></el-input>
				</el-form-item>
				<el-form-item label="采购数量" prop="num">
					<el-input-number v-model="editForm.num" :min="0" :max="20000"></el-input-number>
				</el-form-item>
				<el-form-item label="金额" prop="totalPrice">
					<el-input :disabled="true" v-model="totalPrice" placeholder="金额"></el-input>
				</el-form-item>
				<el-form-item label="总库存量" prop="stock">
					<el-input :disabled="true" v-model="totalNum"></el-input>
				</el-form-item> 
				<el-form-item label="供应商" prop="supplierId">
					<el-button type="text" @click="openSelectSupplier" >选择供应商</el-button>
					<el-tag v-if="editForm.supplierName != ''" style="margin-left:20px;" v-text="editForm.supplierName"></el-tag>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input type="textarea" :rows="3" v-model="editForm.remark" placeholder="备注" ></el-input>
				</el-form-item>

				<el-form-item>
					<el-col :span="24" :offset="8">
						<el-button @click.native="handleCancel">取消</el-button>
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true||editForm.bizFlowState=='1'||editForm.bizFLowState=='2'">提交</el-button>
					</el-col>
				</el-form-item>
			</el-form>

			<el-dialog title="选择用品" append-to-body :visible.sync="selectApplianceVisible"  width="70%"  :close-on-click-modal="false">
				<appliance-components @onSelectAppliance="onSelectAppliance" @cancel="selectApplianceVisible=false" ></appliance-components>
			</el-dialog>
			<!-- <el-dialog title="选择供应商" :append-to-body='true' :visible.sync="selectSupplierVisible"  width="70%"  :close-on-click-modal="false">
				<supplier-components :append-to-body='true' :visible='true'  @cancel="selectSupplierVisible=false" ></supplier-components>
			</el-dialog> -->
			<supplier-components :append-to-body="true" :visible="selectSupplierVisible" @row-click="onSelectSupplier"></supplier-components>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editOmAppliancePurchase } from '@/api/oa/om/omAppliancePurchase';
	import { mapGetters } from 'vuex'
	import omApplianceComponents from '../components/OmApplianceComponents';
	import supplierComponents from '../../erp/pur/components/SupplierComponents';
  import config from '@/common/config'

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo'
			]),
			totalPrice(){
				return this.editForm.price * this.editForm.num
			},
			totalNum(){
				return parseInt(this.oldNum) + parseInt(this.editForm.num)
			},

		},
		props:['omAppliancePurchase','visible','appliance'],
		watch: {
	      'omAppliancePurchase':function( omAppliancePurchase ) {
	        	this.editForm = omAppliancePurchase;
		  },
		  'appliance': function( omAppliance ){
			  this.onSelectAppliance(omAppliance);
		  },
	      'visible':function(visible) {
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
		  },

	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, add: false, del: false, edit: false },//查询中...
				editFormRules: {
					applianceId: [
						{ required: true, message: '办公用品不能为空', trigger: 'change' }
					],
					price: [
						{ 	type: 'number',trigger: 'change',required: false,message: '最高单价必须为数字值',
								transform(value) {
									if(value){
										return Number(value);
									}
								},
						}
					],
					supplierId: [
						{ required: true, message: '供应商不能为空', trigger: 'change' }
					],
				},
				//新增界面数据 om_appliance_purchase
				editForm: {
					id:'',applianceId:'',applianceName:'',standard:'',price:'',num:'',totalPrice:'',stock:'',userid:'',username:'',createTime:'',remark:'',supplierId:'',supplierName:'',branchId:'',isStorage:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				selectApplianceVisible: false,
				selectSupplierVisible: false,
				oldNum:0,
				unit:'', //单位
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交OmAppliancePurchase om_appliance_purchase 父组件监听@submit="afterAddSubmit"
			editSubmit: function () {

				this.$refs.editForm.validate((valid) => {
          if(this.editForm.num<=0||this.editForm.num==null||this.editForm==''){
            this.$message.error("购买数量必须大于0");
            return;
          }
					if (valid) {
						this.$confirm('确认提交审核吗？', '提示', {}).then(() => {
							this.load.edit=true
							this.editForm.branchId = this.userInfo.branchId
							this.editForm.stock = this.totalNum
							this.editForm.userid = this.userInfo.userid
							this.editForm.username = this.userInfo.username
							this.editForm.totalPrice = this.totalPrice
							this.editForm.isStorage = '0'
							let params = Object.assign({}, this.editForm);
							editOmAppliancePurchase(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
                  this.sendToProcessApprova(res.data.data,"om_appliance_purchase_approva");
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.edit=false);
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
				this.oldNum = value.stock
				this.selectApplianceVisible = false
				this.editForm.applianceId = value.id
				this.editForm.applianceName = value.name
				this.editForm.standard = value.standard
				this.editForm.price = value.price
				this.unit = value.unit
			},
			openSelectSupplier(){
				this.selectSupplierVisible = true
			},
			onSelectSupplier(value){
				// console.log(value)
				this.selectSupplierVisible = false
				this.editForm.supplierId = value.cpId
				this.editForm.supplierName = value.cpName
			},
      sendToProcessApprova:function(row,bizKey){
        let extVars={omAppliancePurchaseId:row.id}
        let jsonExtVars=JSON.stringify(extVars);

        var currDomain=window.location.protocol+"//"+window.location.host;
        var fullPath=this.$route.fullPath;
        var bizUrl=currDomain+'/'+process.env.CONTEXT+'/'+process.env.VERSION+'/#'+fullPath+'?extVars='+jsonExtVars

        var titleNames=row.username
        var mainTitle=''
        var mainContext=''
        if(bizKey=='om_appliance_purchase_approva'){
          mainTitle='关于【'+titleNames+"申购办公用品-"+row.applianceName+"】的审批"
          mainContext=mainTitle+',申购备注：'+row.remark+",申购数量："+row.num;
        }else{
          this.$message.error("暂不支持的业务审批");
          return;
        }

        let params={
          mainContext:mainContext,
          mainTitle:mainTitle,
          bizKey:bizKey,
          bizUrl:bizUrl,
          restUrl:config.getOaBasePath()+"/om/omAppliancePurchase/processApprova",
          //restUrl:"http://localhost:7078"+"/om/omAppliancePurchase/processApprova",
          extVars:extVars,
          flowVars:{
            subscribeTaskEvent:'TASK_COMPLETED,TASK_CREATED',
            branchId:row.branchId,
            omAppliancePurchaseId:row.id,
            applianceId:row.applianceId,
            num:row.num,
            omAppliancePurchase:row
          },
        }
        let jsonParmas=encodeURIComponent(JSON.stringify(params));//对方要 decodeURIComponent
        this.$router.push({path:'/mdp/workflow/re/procdef/ProcdefListForBizStart',query:{params:jsonParmas}});
      },
			/**end 在上面加自定义方法**/

		},//end method
		components: {
			'appliance-components':omApplianceComponents,
			'supplier-components':supplierComponents,
		    //在下面添加其它组件 'om-appliance-purchase-edit':OmAppliancePurchaseEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.omAppliancePurchase);
			if(this.appliance != null){
				this.onSelectAppliance(this.appliance);
			}

			/**在下面写其它函数***/

		}//end mounted
	}

</script>

<style scoped>

</style>
