<template>
	<section>
		
		<el-row class="page-container border padding"> 

			<el-row class="header">
				<div class="leftIcon">
					<i class="el-icon-user"></i>
				</div>

				<div class="rightNav">
					
					<span>{{contacter.contacterName}}</span>

					<ul>
						<li :class="{'liActive':activeName==='tab1'}" @click="activeName = 'tab1' " :v-bind="activeName">联系人信息</li>
						<li :class="{'liActive':activeName==='tab2'}" @click="activeName = 'tab2' " :v-bind="activeName">工作轨迹</li>
					</ul>

					<div class="btn">
						<el-button v-if="activeName==='tab1'" type="primary" size="small" @click="tab1Save">保存</el-button>
						<el-button v-loading="load.del" v-if="activeName==='tab1'" type="danger" size="small" @click="delSubmit">删除</el-button>
						<el-button type="primary" @click="handleCancel" size="small" >关闭</el-button>
					</div>

				</div>

			</el-row>

			<el-row class="content">
				<!--客户基本信息 -->
				<div v-if="activeName === 'tab1'">
					<customer-contacter-edit v-if="contacter.contacterId !== '' && contacter.contacterId !== null" ref="contacterEdit" @submit="editSubmit"  :customerContacter="contacter" :visible="activeName==='tab1'"></customer-contacter-edit>
				</div>

				<div v-if="activeName === 'tab2'">
				</div>
			</el-row>
		
		</el-row>


	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { mapGetters } from 'vuex'
	import CustomerContacterEdit from './CustomerContacterEdit';
	import { delCustomerContacter} from '@/api/oa/crm/customerContacter';
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['contacter','visible', 'source'],

		watch: {
		  
		  'contacter': {
				handler(newval, old) {
					this.detailForm = newval; 
				},
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
				//编辑界面数据  Customer crm_customer
				detailForm: {
					customerId:'',customerName:'',customerCode:'',customerEngName:'',address:'',addressGps:'',zipCode:'',country:'',province:'',provinceCode:'',city:'',cityCode:'',district:'',districtCode:'',language:'',phone:'',fax:'',email:'',website:'',introduction:'',customerStatus:'',customerStatusName:'',customerType:'',customerTypeName:'',description:'',descriptionName:'',size:'',sizeName:'',source:'',sourceName:'',sectorId:'',sectorName:'',managerUserId:'',managerUserName:'',agentId:'',agentName:'',parentId:'',parentName:'',customerDocId:'',customerDocName:'',customerIntroductiondocId:'',customerIntroductiondocName:'',seclevel:'',evaluation:'',rating:'',portalStatus:'',creditAmount:'',creditTime:'',bankName:'',accountName:'',accounts:'',totalContractAmount:'',isAttention:'',createTime:'',createUserId:'',createUserName:'',updateTime:'',updateUserId:'',updateUserName:'',lastContactTime:'',parentId:'',branchId:''
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				activeName: 'tab1',
				//是否展示全部
				isShowAll: false,

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
		
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			handleClick() {
			},

			initData() {
			},

			tab1Save() {
				this.$refs.contacterEdit.editSubmit();
			},

			editSubmit(data) {
				this.theContacter = data;
			},

			delSubmit: function() {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { contacterId: this.contacter.contacterId, customerId: this.contacter.customerId };
					delCustomerContacter(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.$emit('delSubmit');
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},

			/**end 在上面加自定义方法**/
		},//end method
		components: {
		    //在下面添加其它组件 'contacter-edit':CustomerEdit
			'customer-contacter-edit' : CustomerContacterEdit,
		},
		mounted() {
			this.detailForm = Object.assign(this.detailForm, this.contacter);  
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
	position:sticky;
	top:0px;
	height: 70px;
	width: 100%;
	z-index: 99;
	background-color: rgb(255, 255, 255);
	border: 1px solid rgb(241, 241, 241);
}

.header .leftIcon {
	float: left;
	width: 70px;
	height: 100%;
}

.header .leftIcon i {
	font-size: 30px;
	text-align: center;
	line-height: 60px;
	margin-left: 20px;
}

.header .rightNav {
	float: left;
	height: 100%;
}

.header .rightNav span{
	font-size: 14px;
	height: 30px;
	line-height: 30px;
	display: inline-block;
}

.header .rightNav ul {
	margin-top: 15px;
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
	width: 100%;
	height: 100%;
	overflow-y: auto;
}

.liActive {
	border-bottom: 2px solid rgb(45, 183, 245);
}



</style>