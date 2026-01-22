<template>
	 <asset-mng-mng :query-scene="'my'"></asset-mng-mng>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库
	import  AssetMngMng from './Index';//新增修改界面
	import { mapGetters } from 'vuex'
  	import ProcinstParamesExecutionSet from "@/views/mdp/workflow/ru/procinstParames/ProcinstParamesExecutionSet"; // 流程参数加载

	import {
		listAssigneeToAnyTasks
	} from "@/api/mdp/workflow/ru/task";

	import {
		listProcinst
	} from "@/api/mdp/workflow/hi/procinst";

	export default {
	    name:'MyAssetMngMng',
		components: {
		    AssetMngMng,
		},
		props:['visible'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchAssetMngs()
                }
            }
		},
		data() {
			return {

			}
		},//end data
		methods: {


		},//end methods
		mounted() {

		}
	}

</script>

<style scoped>
</style>
