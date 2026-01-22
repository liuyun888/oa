<template>
	<section>
		 <counterparty-mng></counterparty-mng>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库 
	import {
		mapGetters
	} from 'vuex'
	import CounterpartyMng from  '@/views/oa/ht/counterparty/CounterpartyMng.vue'
	export default {
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
		components: {  
			CounterpartyMng,
		},
		mounted() {
			 
		}
	}

</script>

<style scoped>

</style>
