<template>
	<section>
        <div class="line">
            <span>{{text}}</span>
        </div>
	</section>
</template>




<script>
	export default { 
		props:['text'],
		data() {
			return {
			}
		},
		methods: {
        },
        
		components: {  
        },
        
		mounted() {
			
		}
	}

</script>

<style scoped>

.line {
	background: #F7F7F7;
	height:30px;
	margin: 30px 0 30px 0;
}

.line span {
	line-height: 30px;
	margin-left: 15px;
	color: #3c5c4c;
}

.line span::before {
	content: " ";
	border: 2px solid #088;   
	opacity: 0.5;
	margin-right: 5px;
}


</style>