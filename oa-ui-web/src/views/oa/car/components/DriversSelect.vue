<template>
	<section class="page-container border padding">
		<el-row class="page-header">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchCarDrivers">查询</el-button>
		</el-row>
		<el-row class="page-main padding-top"> 
			<!--列表 CarDriver car_driver-->
			<el-table :data="carDrivers" @sort-change="sortChange" highlight-current-row v-loading="load.list" border 
			@selection-change="selsChange"
			style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable type="index" width="40"></el-table-column>
				<el-table-column prop="driverUsername" label="司机姓名" width="100" ></el-table-column>
				<el-table-column prop="driverPhoneno" label="司机电话" width="120" ></el-table-column>
				<el-table-column prop="driverCardNum" label="驾驶证号码" width="120" ></el-table-column>
				<el-table-column prop="driverCardImageUrl" label="驾驶证照片" width="140" >
					<template slot-scope="scope">            
						<el-popover
							placement="top-start"
							title=""
							trigger="hover">
							<img style="width: 400px; height: auto" :src="baseImageUrl + scope.row.driverCardImageUrl"/>
							<img style="width: 120px; height: 80px" slot="reference" :src="baseImageUrl + scope.row.driverCardImageUrl" :alt="baseImageUrl + scope.row.driverCardImageUrl" >
						</el-popover>  
                 	</template>
				</el-table-column>
				<el-table-column prop="driverStatus" label="驾驶证状态" width="80" ></el-table-column>
				<el-table-column prop="driverAge" label="驾驶年龄" width="60" ></el-table-column>
				<el-table-column prop="driverSex" label="司机性别" width="50" ></el-table-column>
				<el-table-column prop="driverActYear" label="司机驾龄" width="60" ></el-table-column>
				<el-table-column prop="driverCardType" label="驾驶证类型" width="60" ></el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		</el-row>
        <el-row>
            <el-col :span="24" :offset="8"> 
                <el-button @click.native="handleCancel">取消</el-button>  
               <el-button v-loading="load.confirm" type="primary" :disabled="this.sels.length===0 || load.confirm==true" @click.native="handleConfirm">提交</el-button>   
            </el-col>
		</el-row>	
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { listCarDriver } from '@/api/oa/car/carDriver';
	import { mapGetters } from 'vuex'
	import config from '@/common/config'
	
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
				carDrivers: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, confirm: false },//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				/**begin 自定义属性请在下面加 请加备注**/
                baseImageUrl: config.getArcFileUploadBasePath() + '/',	
                currentObject: null
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getCarDrivers();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getCarDrivers();
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
				this.getCarDrivers();
			},
			searchCarDrivers(){
				 this.pageInfo.count=true; 
				 this.getCarDrivers();
			},
			//获取列表 CarDriver car_driver
			getCarDrivers() {
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
				listCarDriver(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.carDrivers = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},
			ValueCurrentChange: function(val){
                //console.log(val)
                this.currentObject = val
				//this.$emit("getSelectVal",val);
			},
			/**begin 自定义函数请在下面加**/
             //取消按钮点击 父组件监听@cancel="xxxVisible=false" 监听
			handleCancel: function(){
				this.$emit('cancel');
			},
			//选择行carRouteTpl
			selsChange: function (sels) {
				this.sels = sels
			}, 
            //确定按钮点击 父组件监听@getSelectVal="xxxVisible=false" 监听
            handleConfirm: function(){
				if(this.sels.length < 1){
					this.$message({ message: "请选择一位司机!", type: 'error' });
					return;
				}
				if(this.sels.length!=1){
					this.$message({ message: "最多只能选择一位司机", type: 'error' });
					return;
				}
                this.$emit("getSelectDriverVal", this.sels[0]);
            }
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getCarDrivers();
        	}); 
		}
	}

</script>

<style scoped>

</style>