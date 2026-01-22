<template>
    <div class="continer">
        <div class="menu">

            <div @click="gotoPage('1')" class="box">
                <div class="content" style="background-color: rgba(103, 114, 229, 1);">
                    <div class="left">
                        <img src="./report.png">
                    </div>
                    <span>合同分析</span>
                </div>
            </div>

            <div @click="gotoPage('2')" class="box">
                <div class="content" style="background-color: rgba(147, 186, 248, 1);">
                    <div class="left">
                        <img src="./report.png">
                    </div>
                    <span>应收报表分析</span>
                </div>
            </div>

            <div @click="gotoPage('3')" class="box">
                <div class="content" style="background-color: rgba(102, 200, 163, 1);">
                    <div class="left">
                        <img src="./report.png">
                    </div>
                    <span>应付报表分析</span>
                </div>
            </div>

            <div @click="gotoPage('4')" class="box">
                <div class="content" style="background-color: rgba(134, 210, 244, 1);">
                    <div class="left">
                        <img src="./report.png">
                    </div>
                    <span>相对方报表</span>
                </div>
            </div>

            <div @click="gotoPage('5')" class="box">
                <div class="content" style="background-color: rgba(237, 170, 248, 1);">
                    <div class="left">
                        <img src="./report.png">
                    </div>
                    <span>合同效率分析</span>
                </div>
            </div>

            <div @click="gotoPage('6')" class="box">
                <div class="content" style="background-color: rgba(253, 188, 114, 1)">
                    <div class="left">
                        <img src="./report.png">
                    </div>
                    <span>风险分析</span>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import util from '@/common/js/util';//全局公共库
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters([
            'userInfo'
        ])
    },
    props: [],
    data() {
        return {


        }

    },

    methods: {

        gotoPage(type) {

            switch(type) {
                case '1' :
                    this.$router.push({name: '合同分析'})
                break;
            }



        },


    },

    components: {

    },

    created() {

    }
    
}

</script>

<style scoped>

.continer {
    width: 100%;
	height: 100%;
	padding: 0 20px 0 20px;
}

.menu{
    width: 70%;
    display:flex;
    flex-wrap: wrap;
    margin: 0 auto;
    margin-top: 80px;
}

.menu .box{
    width: calc(calc(100% / 2) - 50px);
    margin:5px;
    margin-bottom: 50px;
    height:100px;
    box-sizing: border-box;
    border-radius: 4px;
    position: relative;
}

.menu .box:hover {
    cursor: pointer;
}

.menu .box:active{
	opacity: 0.5;
}


.menu .box .content{
    height: 100%;
    line-height: 100px;
}

.menu .box .content .left {
    width: 68px;
	height: 68px;
    margin-top: 12px;
    margin-left: 12px;
	color: rgba(80, 80, 80, 1);
	background-color: #fff;
	border-radius: 34px;
	font-size: 14px;
	text-align: center;
    float: left;
}


.menu .box .content .left img {
    margin-top: 19px;
}

.menu .box .content span {
    margin-left: 15px;
    font-size: 14px;
    color: #fff;
    border: 500;
}













</style>