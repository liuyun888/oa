<template>  
		   <el-select clearable :size="size?size:'small'" v-model="typeId" placeholder="请选择合同类型"> 
				<el-option-group
					v-for="group in contractTypesCpd"
					:key="group.typeId"
					:label="group.typeName">
					<el-option
						v-for="item in group.children"
						:key="item.typeId"
						:label="item.typeName"
						:value="item.typeId">
					</el-option>
				</el-option-group>
			</el-select>  
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listContractType } from '@/api/oa/ht/contractType';
	import { mapGetters } from 'vuex'; 


	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ]),
			contractTypesCpd(){
				return this.contractTypes.filter(i=>i.children!=null && i.children.length>0)
			}
		},
		props:['value','size'],
		watch:{
			value(val){
				this.typeId=this.value
			},
			typeId(val){
				this.$emit('input',val)
			}
		},
		data() {
			return {
				filters: {
					key: ''
				},
				typeId:'',
				contractTypes: [],//查询结果
				load:{ list: false, edit: false, del: false, add: false },//查询中...

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
   
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: {  

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
 
</style>