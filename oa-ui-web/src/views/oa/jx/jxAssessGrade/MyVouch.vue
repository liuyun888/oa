<template>
	<section>
		 <jx-assess-grade-mng query-scene="MyVouch"></jx-assess-grade-mng>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表 
	import  JxAssessGradeMng from './JxAssessGradeMng';//新增修改界面
	import { mapGetters } from 'vuex' 
	
	export default {
		name:'MyVouch',
		components: {
		    JxAssessGradeMng,
		}, 
		computed: {
		    ...mapGetters(['userInfo']), 
		},
		watch:{
            
		},
		data() {
			return {
				filters: {
					 
				},
				 
			}
		},//end data
		methods: { 
			 
			/**begin 自定义函数请在下面加**/
			
		},//end methods
		mounted() {
			 
		}
	}

</script>

<style scoped>
</style>