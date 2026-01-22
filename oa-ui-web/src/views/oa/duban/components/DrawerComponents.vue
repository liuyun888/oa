<template>
	<section>
		<!-- <el-row>
			<span>全部类型</span>
			<el-input  size="small" v-model="filters.key" style="width: 50%;" placeholder="模糊查询"></el-input> 
			<el-button size="small" type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchDubanCategorys">查询</el-button>
		</el-row> -->
		<el-row> 
              <!-- <div v-for="(item,index) in dubanCategorys" :key="index"><el-button type="text" >{{item.name}}</el-button></div> -->
            <el-tree :data="treeData" :highlight-current='true' :props="defaultProps" :default-expand-all="true"  @node-click="handleNodeClick"></el-tree>
		</el-row>
	</section>
      
  
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { listDubanCategory } from '@/api/oa/duban/dubanCategory';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
        },
        watch: {
            "dubanCategorys":function(val) {
                if( !this.isNull(this.treeData)){
					this.treeData[0].children = this.dubanCategorys
                }
            }
        },
		data() {
			return {
				filters: {
					key: ''
				},
				dubanCategorys: [],//查询结果
				
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				/**begin 自定义属性请在下面加 请加备注**/
				treeData: [{
                    name: '默认分类',
                    children: []
                }],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			searchDubanCategorys(){
				 
				 this.getDubanCategorys();
			},
			//获取列表 DubanCategory duban_category
			getDubanCategorys() {
				let params = {
					branchId: this.userInfo.branchId
				};
				
				if(this.filters.key!==""){
					params.key=this.filters.key
				}else{
					
				}
				this.load.list = true;
				listDubanCategory(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.dubanCategorys = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//选择行dubanCategory
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			isNull(data) {
				if(data === null || data === '' || data === undefined) {
					return true;
				}
				return false;
            },
			handleNodeClick(data) {
                this.$emit("selectCategory",data.id)
            }	
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getDubanCategorys();
        	}); 
		}
	}

</script>

<style scoped>

</style>