<template>
	<section class="page-container border padding">
		<el-row class="page-header">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchCarExpenseDetailTpls">查询</el-button>
		</el-row>
		<el-row class="page-main padding-top"> 
			<!--列表 CarExpenseDetailTpl car_expense_detail_tpl-->
			<el-table :data="carExpenseDetailTpls" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable type="index" width="40"></el-table-column>
				<el-table-column prop="id" label="主键" min-width="80" ></el-table-column>
				<el-table-column prop="itemId" label="费用项目编号" min-width="80" ></el-table-column>
				<el-table-column prop="itemName" label="费用项目" min-width="80" ></el-table-column>
				<el-table-column prop="feeAmount" label="费用" min-width="80" ></el-table-column>
				<el-table-column prop="feeRemark" label="费用说明" min-width="80" ></el-table-column>
				<el-table-column prop="branchId" label="归属机构" min-width="80" ></el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		</el-row>
		<el-row>
            <el-col :span="24" :offset="8"> 
                <el-button @click.native="handleCancel">取消</el-button>  
                <el-button  v-loading="load.confirm" @click="handleConfirm" :disabled="this.sels.length===0 || load.confirm==true" type="primary">提交</el-button>  
            </el-col>
		</el-row>	
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { listCarExpenseDetailTpl } from '@/api/oa/car/carExpenseDetailTpl';
	import { mapGetters } from 'vuex'
	
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
				carExpenseDetailTpls: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
			
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getCarExpenseDetailTpls();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getCarExpenseDetailTpls();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				var dir='asc';
				if(obj.order=='ascending'){
					dir='asc'
				}else{
					dir='desc';
				}
				if(obj.prop=='xxx'){
					this.pageInfo.orderFields=['xxx'];
					this.pageInfo.orderDirs=[dir];
				}
				this.getCarExpenseDetailTpls();
			},
			searchCarExpenseDetailTpls(){
				 this.pageInfo.count=true; 
				 this.getCarExpenseDetailTpls();
			},
			//获取列表 CarExpenseDetailTpl car_expense_detail_tpl
			getCarExpenseDetailTpls() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){ 
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key!==""){
					params.key=this.filters.key
				}else{
					//params.xxx=xxxxx
				}
				this.load.list = true;
				listCarExpenseDetailTpl(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.carExpenseDetailTpls = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//选择行carExpenseDetailTpl
			selsChange: function (sels) {
                //console.log(sels)
				this.sels = sels;
			}, 
			//确定
			handleConfirm: function () {
				this.$confirm('确认选中消费吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.$emit("getSelecExpensetVal", this.sels);
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			//取消按钮点击 父组件监听@cancel="xxxVisible=false" 监听
			handleCancel: function(){
				this.$emit('cancel');
            },
            //确定按钮点击 父组件监听@getSelectVal="xxxVisible=false" 监听
            // handleConfirm: function(){
            //     this.$emit("getSelectDriverVal", this.sels);
            // }
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getCarExpenseDetailTpls();
        	}); 
		}
	}

</script>

<style scoped>
</style>