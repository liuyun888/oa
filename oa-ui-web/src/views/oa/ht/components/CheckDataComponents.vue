<template>
	<section>
        <div class="check">
            
            <!-- <div style="animation: fade-in; animation-duration:2s;" v-for="(item) in props" :key="item.index" >
                <span >{{item.text}}</span>
                <i :class="item.icon === undefined  ? 'el-icon-success' : item.icon"></i>
            </div> -->

            <div v-for="(item) in props" :key="item.index">
                <div v-if="item.text === '是否采用标准合同范本'" class="div1">
                    <span>是否采用标准合同范本</span>
                    <i :class="item.icon === undefined  ? 'el-icon-success' : item.icon"></i>
                </div>

                <div v-if="item.text === '产品价格是否低于公司限价'" class="div2">
                    <span>产品价格是否低于公司限价</span>
                    <i :class="item.icon === undefined  ? 'el-icon-success' : item.icon"></i>
                </div>

                <div v-if="item.text === '首付款金额不能低于30%'" class="div3">
                    <span>首付款金额不能低于30%</span>
                    <i :class="item.icon === undefined  ? 'el-icon-success' : item.icon"></i>
                </div>
                
                <div v-if="item.text === '质保金金额不能超过10%'" class="div4">
                    <span>质保金金额不能超过10%</span>
                    <i :class="item.icon === undefined  ? 'el-icon-success' : item.icon"></i>
                </div>

                <div v-if="item.text === '开发人天不得超过总人天的30%'" class="div5">
                    <span>开发人天不得超过总人天的30%</span>
                    <i :class="item.icon === undefined  ? 'el-icon-success' : item.icon"></i>
                </div>

            </div>
        </div>


	</section>
</template>




<script>
	export default { 
		props:['props'],
		data() {
			return {
                
			}
		},
		methods: {
        },
        
		components: {
        },
        
		created() {
            // //添加class
            // if(this.props.length !== 0) {
            //     this.props.forEach((item,index) => {
            //         // item.style = "{font-size: 30px; animation: fade-in; animation-duration: " + index + "s}";
            //          item.style = {
            //             animation: 'fade-in',
            //             animationDuration: index + 's',
            //             fontSize: '30px'
            //          };
            //     });
            // }
            // this.load = false;
            // console.log(this.props, "this.props");
        }




	}

</script>

<style scoped>

.content {
    position: relative;
}

.content div:nth-child(2n) {
    background: #dadcde;
}

.div1, .div2, .div3, .div4, .div5 {
    height: 40px;
    width: 100%;
}

.el-icon-success {
    color: #67C23A;
}

.el-icon-question {
    color: #E6A23C;
}

.el-icon-error {
    color: #F56C6C;
}

span {
    line-height: 40px;
    margin-left: 10px;
}

i {
    float: right;
    margin: 14px 20px 0 0;
}

.div1 {
    animation: fade-in1;/*动画名称*/  
    animation-duration: 1s;/*动画持续时间*/  
}

.div2 {
    animation: fade-in2;/*动画名称*/  
    animation-duration: 2.5s;/*动画持续时间*/  
}

.div3 {
    animation: fade-in3;/*动画名称*/  
    animation-duration: 3.5s;/*动画持续时间*/  
}

.div4 {
    animation: fade-in4;/*动画名称*/  
    animation-duration: 4.5s;/*动画持续时间*/  
}

.div5 {
    animation: fade-in5;/*动画名称*/  
    animation-duration: 6s;/*动画持续时间*/  
}


@keyframes fade-in {  
    0% {opacity: 0; }/*初始状态 透明度为0*/  
    40% {opacity: 0;}/*过渡状态 透明度为0*/  
    100% {opacity: 1;}/*结束状态 透明度为1*/  
}

@keyframes fade-in2 {  
    0% {opacity: 0; }/*初始状态 透明度为0*/  
    40% {opacity: 0;}/*过渡状态 透明度为0*/  
    100% {opacity: 1;}/*结束状态 透明度为1*/  
} 

@keyframes fade-in3 {  
    0% {opacity: 0;}/*初始状态 透明度为0*/  
    40% {opacity: 0;}/*过渡状态 透明度为0*/  
    100% {opacity: 1;}/*结束状态 透明度为1*/  
} 

@keyframes fade-in4 {  
    0% {opacity: 0;}/*初始状态 透明度为0*/  
    40% {opacity: 0;}/*过渡状态 透明度为0*/  
    100% {opacity: 1;}/*结束状态 透明度为1*/  
} 

@keyframes fade-in5 {  
    0% {opacity: 0;}/*初始状态 透明度为0*/  
    40% {opacity: 0;}/*过渡状态 透明度为0*/  
    100% {opacity: 1;}/*结束状态 透明度为1*/  
} 


</style>