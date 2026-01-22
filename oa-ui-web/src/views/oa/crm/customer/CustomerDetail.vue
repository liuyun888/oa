<template>
	<section>
		<el-row class="page-container border padding"> 

			<el-row class="header">
				<div class="leftIcon">
					<i class="el-icon-user"></i>
				</div>
				<div class="rightNav">
					<p>相对方管理</p>
					<ul>
						<li :class="{'liActive':activeName==='tab1'}" @click="activeName = 'tab1' " :v-bind="activeName">基本信息</li>
						<li :class="{'liActive':activeName==='tab2'}" @click="activeName = 'tab2' " :v-bind="activeName">客户联系</li>
						<li :class="{'liActive':activeName==='tab3'}" @click="activeName = 'tab3' " :v-bind="activeName">修改记录</li>
						<li :class="{'liActive':activeName==='tab4'}" @click="activeName = 'tab4' " :v-bind="activeName">地址管理</li>
						<li :class="{'liActive':activeName==='tab5'}" @click="activeName = 'tab5' " :v-bind="activeName">商机管理</li>
						<li :class="{'liActive':activeName==='tab6'}" @click="activeName = 'tab6' " :v-bind="activeName">客户价值</li>
						<li :class="{'liActive':activeName==='tab7'}" @click="activeName = 'tab7'" :v-bind="activeName">联系人地图</li>
						<li :class="{'liActive':activeName==='tab8'}" @click="activeName = 'tab8'" :v-bind="activeName">客户共享</li>
					</ul>

					<div class="btn">
						<el-button v-if="activeName==='tab1'" type="primary" size="small" @click="tab1Submit">保存</el-button>
						<el-button v-if="activeName==='tab4'" type="primary" size="small" @click="tab4NewSubmit">新建</el-button>
						<el-button v-if="activeName==='tab4'" type="danger" size="small" @click="tab4DelSubmit">批量删除</el-button>
						<el-button v-if="activeName==='tab5'" type="primary" size="small" @click="tab5NewSubmit">新建</el-button>
						<el-button v-if="activeName==='tab5'" type="danger" size="small" @click="tab5DelSubmit">批量删除</el-button>
						<el-button v-if="activeName==='tab6'" type="primary" size="small" @click="tab6UpdateSubmit">更新</el-button>
						<el-button v-if="activeName==='tab8'" type="primary" size="small" @click="tab8NewSubmit">新建</el-button>
						<el-button v-if="activeName==='tab8'" type="danger" size="small" @click="tab8DelSubmit">批量删除</el-button>
						<el-button type="primary" @click="handleCancel" size="small" >关闭</el-button>
					</div>
 
				</div>
			</el-row>

			<el-row class="content">
				<!--客户基本信息 -->
				<div v-if="activeName === 'tab1'">
					<!-- <customer-edit @getContacter="getContacterData" @submit="getCustomerEditSubmit" ref="tab1Ref" :visible="visible" v-if="editForm.customerId !== '' && editForm.customerId !== null" :customer="editForm"></customer-edit> -->
					<customer-edit @getContacter="getContacterData" @submit="getCustomerEditSubmit" ref="tab1Ref" :visible="visible" :customer="customer"></customer-edit>
				</div>

				<div v-if="activeName === 'tab2'">
					<right-drawer-components :visible="visible" :customerName="editForm.customerName" :customerManagerUserName="editForm.customerManagerUserName" :customerId="editForm.customerId" :isShowAll="isShowAll"></right-drawer-components>
				</div>

				<div v-if="activeName === 'tab3'">
					<customer-opertion-detail :visible="visible" :customer="customer"></customer-opertion-detail>
				</div>

				<div v-if="activeName === 'tab4'">
					<customer-address-detail ref="tab4Ref" :visible="visible" :customerId="editForm.customerId"></customer-address-detail>
				</div>
				
				<div v-if="activeName === 'tab5'">
					<customer-business-tab ref="tab5Ref" :visible="visible" :customer="customer"></customer-business-tab>
				</div>

				<div v-if="activeName === 'tab6'">
					<customer-evaluation-Detail ref="tab6Ref" :visible="visible" :customer="customer"></customer-evaluation-Detail>
				</div>

				<div v-if="activeName === 'tab7'">
					<customer-contacter-map :contacterData="contacterData" :customer="customer" :visible="activeName === 'tab7'"></customer-contacter-map>
				</div>

				<div v-if="activeName === 'tab8'">
					<customer-share-mng  :customerId="editForm.customerId" ref="tab8Ref"></customer-share-mng>
				</div>


			</el-row>

		
		</el-row>
	</section>
</template>



<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editCustomer } from '@/api/oa/crm/customer';
	import { mapGetters } from 'vuex'
	import CustomerEdit from './CustomerEdit';
	import CustomerOpertionDetail from '../customerOpertion/CustomerOpertionDetail';
	import CustomerAddressDetail from '../customerAddress/CustomerAddressDetail';
	import CustomerEvaluationDetail from '../customerEvaluation/CustomerEvaluationDetail';
	import RightDrawerComponents from '../components/RightDrawerComponents';
	import CustomerContacterMap from '../customerContacter/CustomerContacterMap';
	import CustomerBusinessTab from '../customerBusiness/CustomerBusinessTab';
	import CustomerShareMng from '../customerShare/CustomerShareMng';

	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['customer','visible'],
		watch: {
			
		  'customer': {
				handler(newval, old) {
					this.editForm = newval;
				},
				// immediate: true,
		   },
		  
	      'visible':function(visible) { 
	      	if(visible==true){
				//从新打开页面时某些数据需要重新加载，可以在这里添加
				this.$nextTick(() => {
				})
	      	}
	      } 
		},
		
		data() {
			return {
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				
				editFormRules: {
					customerId: [
						//{ required: true, message: '客户id不能为空', trigger: 'change' }
					]
				},
				//编辑界面数据  Customer crm_customer
				editForm: {
					customerId:'',customerName:'',customerCode:'',customerEngName:'',address:'',addressGps:'',zipCode:'',country:'',province:'',provinceCode:'',city:'',cityCode:'',district:'',districtCode:'',language:'',phone:'',fax:'',email:'',website:'',introduction:'',customerStatus:'',customerStatusName:'',customerType:'',customerTypeName:'',description:'',descriptionName:'',size:'',sizeName:'',source:'',sourceName:'',sectorId:'',sectorName:'',managerUserId:'',managerUserName:'',agentId:'',agentName:'',parentId:'',parentName:'',customerDocId:'',customerDocName:'',customerIntroductiondocId:'',customerIntroductiondocName:'',seclevel:'',evaluation:'',rating:'',portalStatus:'',creditAmount:'',creditTime:'',bankName:'',accountName:'',accounts:'',totalContractAmount:'',isAttention:'',createTime:'',createUserId:'',createUserName:'',updateTime:'',updateUserId:'',updateUserName:'',lastContactTime:'',branchId:''
				},

				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				activeName: 'tab1',

				//是否展示全部
				isShowAll: false,

				//客户相关联系人数据
				contacterData: [],

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.activeName = 'tab1';
				this.$emit('cancel');
			},
		
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			handleClick() {

			},

			tab1Submit() {
				this.$refs.tab1Ref.editSubmit();
			},

			tab4NewSubmit() {
				this.$refs.tab4Ref.showAdd();
			},

			tab4DelSubmit() {
				this.$refs.tab4Ref.batchDel();
			},

			tab6UpdateSubmit() {
				this.$refs.tab6Ref.submit();
			},

			tab5NewSubmit() {
				this.$refs.tab5Ref.showAdd();
			},

			tab5DelSubmit() {
				this.$refs.tab5Ref.batchDel();
			},

			tab8NewSubmit() {
				this.$refs.tab8Ref.showAdd();
			},

			tab8DelSubmit() {
				this.$refs.tab8Ref.batchDel();
			},

		    //获取客户修改回调数据
			getCustomerEditSubmit(data) {
				this.editForm = data;
			},

			initData() {
			},

			getContacterData(data) {
				this.contacterData = data;
			},

			/**end 在上面加自定义方法**/
		},//end method
		components: {
		    //在下面添加其它组件 'customer-edit':CustomerEdit
			'customer-edit': CustomerEdit,
			'customer-opertion-detail' : CustomerOpertionDetail,
			'customer-address-detail' : CustomerAddressDetail,
			'customer-evaluation-Detail' : CustomerEvaluationDetail,
			'right-drawer-components' :RightDrawerComponents,
			'customer-contacter-map' : CustomerContacterMap,
			'customer-business-tab' : CustomerBusinessTab,
			'customer-share-mng' : CustomerShareMng,
		},

		mounted() {
			this.editForm = Object.assign(this.editForm, this.customer);  
		}
	}

</script>

<style scoped>

ul {
    margin: 0;
    padding: 0;
}

ul li {
    margin: 0;
    padding: 0;
    list-style: none;
}

.app-container{
	padding: 0;
	margin: 0;
}

.header{
	position: fixed;
	top:0px;
	left: 0px;
	height: 70px;
	width: 100%;
	z-index: 99;
	background-color: rgb(255, 255, 255);
	border: 1px solid rgb(241, 241, 241);
}

.header .leftIcon {
	float: left;
	width: 60px;
	height: 60px;
	margin-left: 30px;
}

.header .leftIcon i {
	font-size: 30px;
	text-align: center;
	line-height: 60px;
}

.header .rightNav p{
	font-size: 14px;
	margin: 7px 0 0 10px;
}

.header .rightNav ul {
	margin-top: 25px;
}

.header .rightNav ul li{
	display:inline-block;
	margin-right: 40px;
	font-size: 12px;
	height: 20px;
}

.header .rightNav ul li:hover {
	cursor: pointer;
}

.header .rightNav .el-tabs__header {
	margin: 0;
}

.rightNav .btn {
	position: absolute;
	right: 40px;
	top: 20px;
}

.content {
	position: absolute; 
	width: 100%;
	top: 70px;
	overflow-y: auto;
}

.liActive {
	border-bottom: 2px solid rgb(45, 183, 245);
}

</style>