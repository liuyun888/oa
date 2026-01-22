<template>
	<asset-receive-mng :query-scene="'my'"></asset-receive-mng>
</template>

<script>
	import util from '@/common/js/util';//全局公共库 
	import assetReceiveMng from './assetReceiveMng';
	import { mapGetters } from 'vuex'
  import config from "@/common/config"; //全局公共库

	export default {
		components:{
			assetReceiveMng,
		},
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
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
