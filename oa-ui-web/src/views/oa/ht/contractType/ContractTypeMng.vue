<template>
	<section>
		<div class="contianer">

			<div class="header">
				<div class="fixed">
					<span v-if="load.list === false">全部类型:</span>
					<ul>
						<li @click="clickTop(item, index)" :class="{'active' : position === index}" v-for="(item,index) in contractTypes" :key="item.index"><a>{{item.typeName}}</a></li>
					</ul>
				</div>
			</div>

			<ul class="nav" v-loading="load.list">
				<div v-for="(item) in contractTypes" :key="item.typeId" class="row">
					<h1>
						<i></i>
						{{item.typeName}}
					</h1>
					<ul class="menu">
						<li @click="gotohtPage(child)" @mouseenter="mouseover(child)" @mouseleave="mouseLeave(child)" v-for="(child) in item.children" :key="child.typeId">
							<div class="text">
								<h2>{{child.typeName}}</h2>
								<h3>{{child.typeDesc}}</h3>
								<div v-if="isShowPlus === child.typeId" class="plus">
									<i class="el-icon-plus"></i>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</ul>
		</div>

		<div class="tempDialog">
			<el-dialog :visible.sync="contractTemplateXs1Visible" :fullscreen="true" :close-on-click-modal="false">
				<contract-template-xs1 @submit="contractTemplateXs1Visible=false" @cancel="contractTemplateXs1Visible=false" :contractType="currentItem" :visible="contractTemplateXs1Visible"></contract-template-xs1>
			</el-dialog>

			<el-dialog :visible.sync="contractTemplateCg1Visible" :fullscreen="true" :close-on-click-modal="false">
				<contract-template-cg1 @submit="contractTemplateCg1Visible=false" @cancel="contractTemplateCg1Visible=false" :contractType="currentItem" :visible="contractTemplateCg1Visible"></contract-template-cg1>
			</el-dialog>


			<el-dialog :visible.sync="contractTemplateProject1Visible" :fullscreen="true" :close-on-click-modal="false">
				<contract-template-project1 @submit="contractTemplateProject1Visible=false" @cancel="contractTemplateProject1Visible=false" :contractType="currentItem" :visible="contractTemplateProject1Visible"></contract-template-project1>
			</el-dialog>
		</div>

		



		
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listContractType } from '@/api/oa/ht/contractType';
	import { mapGetters } from 'vuex';
	import ContractTemplateXs1 from '../contractDraftTemplate/ContractTemplateXs1';
	import ContractTemplateCg1 from '../contractDraftTemplate/ContractTemplateCg1';
	import ContractTemplateProject1 from '../contractDraftTemplate/ContractTemplateProject1';


	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		data() {
			return {
				filters: {
					key: ''
				},
				contractTypes: [],//查询结果
				contractParent: [],
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				/**begin 自定义属性请在下面加 请加备注**/
				position: 0,
				isShowPlus: '',
				currentItem: '',
				//销售产品合同流程模板显示
				contractTemplateXs1Visible: false,
				/**end 自定义属性请在上面加 请加备注**/
				contractTemplateCg1Visible: false, 
				/**工程类施工合同**/
				contractTemplateProject1Visible: false,

			}
		},//end data
		methods: { 
		
			//获取列表 ContractType ht_contract_type
			getContractTypes() {
				let params = {
				};
				this.load.list = true;
				listContractType(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.contractTypes = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			/**begin 自定义函数请在下面加**/
			clickTop(data, index) {
				this.position = index;
				this.animateScroll(data, index);
			},

			animateScroll(data, position) {
				let btn = document.getElementsByClassName("row");
				let height = 0;
				for (let index = 0; index < btn.length; index++) {
					if(index <= position) {
						height += btn[index].clientHeight;
					}
				}
				if(position === 0) height= 0;
				// document.documentElement.scrollTop = height;
				window.scrollTo({ 
					top: height - 60, 
					behavior: "smooth" 
				});
			},

			//鼠标移动事件
			mouseover(item) {
				this.isShowPlus = item.typeId;
			},

			//鼠标移出事件
			mouseLeave(item) {
				this.isShowPlus = '';
			},

			//跳转合同页面
			gotohtPage(item) {
				this.currentItem = item;
				switch(item.typeName) {
					case '产品销售合同' :
						this.contractTemplateXs1Visible = true;
					break;
					case '第三方产品采购合同' :
						this.contractTemplateCg1Visible = true;
					break;
					case '工程施工合同' :
						this.contractTemplateProject1Visible = true;
					break;
					default:
						if(item.typeParentId=='1'){
							this.contractTemplateXs1Visible = true;
						}else{
							this.contractTemplateCg1Visible = true;
						}
				}
			},

			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
			//在下面添加其它组件
			'contract-template-xs1': ContractTemplateXs1,
			'contract-template-cg1' : ContractTemplateCg1,
			ContractTemplateProject1

		},
		mounted() { 
			
			//开启右键菜单
			this.$nextTick(() => {
				this.getContractTypes();
        	});
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

.contianer{
	width: 100%;
	height: 100%;
	padding: 0 20px 0 20px;
}


.contianer .header {
	width: 100%;
	height: 60px;
	border-bottom: 1px solid rgb(241, 241, 241);
	position: sticky;
    top: 0px;
	z-index: 999;
	background: #fff;
}


.contianer .header span {
	font-size: 14px;
	line-height: 60px;
	float: left;
	margin-left: 20px;
}

.contianer .header ul {
	height: 100%;
	margin-left: 20px;
	float: left;
	font-size: 12px;
}

.contianer .header ul li {
	height: 35px;
    display: inline-block;
    padding: 10px 15px;
    border: 1px solid rgb(241, 241, 241);
    margin: 12px 4px;
	border-radius: 3px;
}

.contianer .header ul li:hover {
	cursor: pointer;
}

.contianer .header ul .active {
	border: 1px solid #409EFF;
	color: #409EFF
}

.contianer .nav div:nth-child(2n) {
	background: #fcfcfe;
}

.contianer .nav {
	width: 100%;
	height: 100%;
	padding: 15px;
	padding-bottom: 580px;
}

.contianer .nav .row {
	width: 100%;
	border-bottom: 1px solid rgb(241, 241, 241);
	padding: 12px;
}

.contianer .nav .row h1{
	font-size: 14px;
	font-weight: normal;
}

.contianer .nav .row h1 i{
	height: 100%;
	border-left: 2px solid #409EFF;
	margin-right: 10px;
}


.contianer .menu li h2 {
	font-size: 14px;
	font-weight: normal;
}

.contianer .menu li h3 {
	font-size: 12px;
	font-weight: normal;
	color: #666;
}

.contianer .nav .row ul {
	width: 100%;
	display: flex;
	flex-wrap: wrap-reverse;
	padding: 8px;
}


.contianer .menu li {
	width: 20%;
	border-right: 1px solid rgb(241, 241, 241);
	border-radius: 6px;
	padding: 10px 0 10px 0;
	transition: background-color 0.5s linear 0s;
}


.contianer .menu li:hover {
	background-color: #409EFF;
	cursor: pointer;
	color: #ffffff;
	box-shadow:10px 10px 0px rgba(0,0,0,0.2);
}

.contianer .menu li:active{
	opacity: 0.5;
}

.contianer .menu .text {
	margin-left: 20px;
	position: relative;
}

.contianer .menu .text .plus {
	position: absolute;
	font-size: 20px;
	right: 12px;
	bottom: 8px;
}

</style>


<style>
.tempDialog .el-dialog {
	width: 100%;
	height: 100%;
	-webkit-box-shadow: none !important;
	margin-top: 0 !important;
	position: relative;
	margin: 0 auto 0px;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	padding: 0;
	margin: 0;
}

.tempDialog .el-dialog__header {
	padding: 0;
	margin: 0;
	height: 0px;
}

.tempDialog .el-dialog__body {
	padding: 0;
	margin: 0;
	height: 100%;
}
</style>