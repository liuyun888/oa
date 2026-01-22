<template>
	<section>
		<el-row class="container"> 
			<el-row class="header"> 
				<div class="left">
					<i class="el-icon-user"></i>
				</div>

				<div class="center">
					
					<div class="title">
					<span><font color="grap" style="font-size:18px;">{{counterparty.cpName}}</font>  </span>
					</div>

					<ul class="list"> 
						<li :class="{'liActive':activeName==='tabBase'}" @click="activeName = 'tabBase' " :v-bind="activeName">基本信息</li>
						<li :class="{'liActive':activeName==='tabContractHis'}" @click="activeName = 'tabContractHis' " :v-bind="activeName">历史合同信息</li>
						<li :class="{'liActive':activeName==='tabSignet'}" @click="activeName = 'tabSignet' " :v-bind="activeName">印章信息</li>
						<li :class="{'liActive':activeName==='tabLog'}" @click="activeName = 'tabLog' " :v-bind="activeName">变更日志</li>
					</ul>
				</div>

				<div class="right">
					<div class="btn2"> 
						<el-button @click="clickTab1Save" v-if="activeName==='tabBase'" type="primary" size="small" >保存</el-button>
						<el-button @click="handleCancel" size="small" >关闭</el-button>
					</div>
				</div>
			</el-row> 
			<el-row class="content">
				<!--客户基本信息 -->
				<div v-if="activeName === 'tabBase'">
                     <counterparty-edit ref="tabBaseRef" :counterparty="counterparty" :visible="activeName === 'tabBase'" @submit="afterEditSubmit"></counterparty-edit>
				</div>

				<div v-if="activeName === 'tabContractHis'">
					<contract-card-mng :cp-id="counterparty.cpId"></contract-card-mng>
				</div>

				<div v-if="activeName === 'tabSignet'">
				</div>

				<div v-if="activeName === 'tabLog'">
				</div>
				
			</el-row>

		
		</el-row>
	</section>
</template>



<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
    import { mapGetters } from 'vuex'
    import CounterpartyEdit from './CounterpartyEdit';//修改界面 
    import ContractCardMng from '../contractCard/ContractCardMng';//修改界面
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['counterparty','visible'],
		watch: {
		  
		  'counterparty': {
				handler(newval, old) {
					this.detailForm = newval;
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
				
				//编辑界面数据  Customer crm_customer
				detailForm: {
					customerId:'',customerName:'',customerCode:'',customerEngName:'',address:'',addressGps:'',zipCode:'',country:'',province:'',provinceCode:'',city:'',cityCode:'',district:'',districtCode:'',language:'',phone:'',fax:'',email:'',website:'',introduction:'',customerStatus:'',customerStatusName:'',customerType:'',customerTypeName:'',description:'',descriptionName:'',size:'',sizeName:'',source:'',sourceName:'',sectorId:'',sectorName:'',managerUserId:'',managerUserName:'',agentId:'',agentName:'',parentId:'',parentName:'',customerDocId:'',customerDocName:'',customerIntroductiondocId:'',customerIntroductiondocName:'',seclevel:'',evaluation:'',rating:'',portalStatus:'',creditAmount:'',creditTime:'',bankName:'',accountName:'',accounts:'',totalContractAmount:'',isAttention:'',createTime:'',createUserId:'',createUserName:'',updateTime:'',updateUserId:'',updateUserName:'',lastContactTime:'',branchId:''
				},

				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				activeName: 'tabBase',

				//是否展示全部
				isShowAll: false,

				//客户相关联系人数据
				contacterData: [],

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="detailFormVisible=false" 监听
			handleCancel:function(){
				this.activeName = 'tabBase';
				this.$emit('cancel');
			},
		
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			handleClick() {

			},

		
		    //获取客户修改回调数据
			getCustomerEditSubmit(data) {
				this.detailForm = data;
			},

			initData() {

            },
            

            afterEditSubmit() {

            },

            clickTab1Save() {
                this.$refs.tabBaseRef.editSubmit();          
            },


			/**end 在上面加自定义方法**/
		},//end method
		components: {
            'counterparty-edit':CounterpartyEdit,
			ContractCardMng,

		},

		mounted() {
			this.detailForm = Object.assign(this.detailForm, this.counterparty);  
        }
        

	}

</script>

<style scoped>

.container {
}

ul {
    margin: 0;
    padding: 0;
}

ul li {
    margin: 0;
    padding: 0;
    list-style: none;
}

.header {
   position: fixed;
   top:0px;
   left: 0px;
   width: 100%;
   height: 70px;
   background-color: white;
   border-bottom: 1px solid rgb(241, 241, 241);
   z-index: 999;
}

.header .left {
   height: 100%;
   width: 50px;
   margin-left: 20px;
   float: left;
}

.header .left i {
   width: 100%;
   text-align: center;
   line-height: 70px;
   font-size: 34px;
}

.header .center {
   float: left;
   height: 100%;
   margin-left: 10px;
}

.header .center .title {
   margin-top: 17px;
}

.header .center .list {
   position: absolute;
   bottom: 0px;
}

.header .center .list:hover {
	cursor: pointer;
}

.header .center .list li {
   display: inline-block;
   margin-right: 40px;
   font-size: 12px;
   height: 20px;
}

.header .right {
   float: right;
   margin-right: 20px;
   height: 100%;
}

.header .right .btn2 {
   line-height: 100px;
}

.liActive {
	border-bottom: 2px solid rgb(45, 183, 245);
}

.content {
	position: absolute; 
	width: 100%; 
	top:20px;
	overflow-y: auto; 
}

</style>

<style>
div::-webkit-scrollbar{
  width:10px;
  height:10px;
}
div::-webkit-scrollbar-track{
  background: rgb(239, 239, 239);
  border-radius:2px;
}
div::-webkit-scrollbar-thumb{
  background: #bfbfbf;
  border-radius:10px;
}
div::-webkit-scrollbar-thumb:hover{
  background: #333;
}
div::-webkit-scrollbar-corner{
  background: #179a16;
}

</style>