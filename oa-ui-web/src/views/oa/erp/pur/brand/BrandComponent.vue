<template>
	<section class="page-container border padding">
		<el-row class="page-header">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchBrands">查询</el-button>
		</el-row>
		<el-row class="page-main padding-top"> 
			<!--列表 Brand pur_brand-->
			<el-table :data="brands"  @sort-change="sortChange" highlight-current-row v-loading="load.list" border @current-change="selsChange"  style="width: 100%;">
				<el-table-column sortable type="index" width="40"></el-table-column>
				<el-table-column prop="brandName" label="品牌名称" min-width="80" ></el-table-column>
				<el-table-column prop="firstLetter" label="首字母" min-width="80" ></el-table-column>
				<el-table-column prop="factoryStatus" label="是否为品牌制作商" min-width="80" >
					<template slot-scope="scope">
						<span>{{scope.row.factoryStatus === '0' ? '否' : '是'}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="logo" label="品牌logo" min-width="80">
					<template slot-scope="scope">      
						<el-popover
							placement="top-start"
							title=""
							trigger="hover">
							<img style="width: 400px; height: auto" :src="baseImageUrl + scope.row.logo"/>
							<img style="width: 150px; height: 100px" slot="reference" :src="baseImageUrl + scope.row.logo" :alt="baseImageUrl + scope.row.logo" >
						</el-popover>             
                 	</template>
				</el-table-column>
				
				<el-table-column prop="brandStory" label="品牌故事" min-width="80" ></el-table-column>
				
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
			
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listBrand  } from '@/api/oa/erp/pur/brand';
	import { mapGetters } from 'vuex';
	import config from '@/common/config'
	
	export default {

		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},

		props:['visible'],

		watch: {
			'visible' :function(visible) { 
				if(visible==true){
					//从新打开页面时某些数据需要重新加载，可以在这里添加
					this.getBrands();
				}
	     	 } 
		},

		data() {
			return {
				filters: {
					key: ''
				},
				brands: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: "",//列表选中数据
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				/**begin 自定义属性请在下面加 请加备注**/
				baseImageUrl: config.getArcFileUploadBasePath() + '/',		
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getBrands();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getBrands();
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
				this.getBrands();
			},
			searchBrands(){
				 this.pageInfo.count=true; 
				 this.getBrands();
			},
			//获取列表 Brand pur_brand
			getBrands() {
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
					//params.xxx=this.filters.key
					params.brandName = this.filters.key;
				}else{
					//params.xxx=xxxxx
				}
				this.load.list = true;
				listBrand(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.brands = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			
			//选择行brand
			selsChange: function (sels) {
				this.sels = sels;
				this.$emit("selectBrand",this.sels);
				
			}, 
			/**begin 自定义函数请在下面加**/
			

				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		   
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getBrands();
        	}); 
		}
	}

</script>

<style scoped>

</style>