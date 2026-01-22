<template>
	<section>
        <el-row class="container">
            <el-table
                v-loading="load.list"
                :data="baseData"
                style="width: 100%"
                @row-click="getRow"
                >
                
                <el-table-column
                    type="index"
                    width="50">
                </el-table-column>

                <el-table-column
                    prop="text"
                    label="简称"
                    width="180">
                </el-table-column>
                
                <el-table-column
                    prop="describe"
                    label="描述">
                </el-table-column>

            </el-table>
            <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
        </el-row>
    </section>
</template>

<script>
    import { listCustomerBaseData } from '@/api/oa/crm/customerBaseData';

    export default { 
		computed: {
		},

        props:['type', 'visible'],
		watch: {
	      'visible':function(visible) { 
	      	if(visible==true){
				//从新打开页面时某些数据需要重新加载，可以在这里添加
				this.init();
	      	}
	      } 
	    },

		data() {
			return {
                filters: {
					key: ''
				},
				baseData: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
                load:{ list: false, edit: false, del: false, add: false },//查询中...
                //查询数据类型
                dataType: '',

			}
		},//end data
		
        methods: { 

            handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getData();
            },
            
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getData();
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
				this.getData();
            },
            
            getData() {
                let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
                    count:this.pageInfo.count,
                    type: this.type
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
				}else{
					//params.xxx=xxxxx
				}
                this.load.list = true;
				listCustomerBaseData(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.baseData = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
            },

            init() {
                this.getData();
            },

            getRow(row, column, event) {
                console.log(row, column, event);
                this.$emit('getRowClick', row, this.type);
            }

		},//end methods
		
        components: { 
		},
		
        mounted() { 
            this.init();
		}
	}

</script>

<style scoped>

</style>

