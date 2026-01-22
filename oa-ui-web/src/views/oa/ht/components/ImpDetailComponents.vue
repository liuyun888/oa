<template>
	<section>
        <div>
            <el-divider content-position="left">下载模板</el-divider>
            
            <div class="main">
                <div class="row">
                    <span class="buZhou">1</span>
                    <span class="msg">下载模板: </span>  <span class="dolName">{{text}}</span>
                </div>

                 <div class="row" style="margin-bottom:32px"> 
                    <span class="buZhou">2</span>
                    <span class="msg">上传Excel: </span>
                    <div  class="imp">
                        <get-excel-data-components @get-excel-data="getExcelData"></get-excel-data-components>
                    </div>
                </div>
            </div>

            <el-divider content-position="left">操作步骤</el-divider>
            
            <div class="main">
                <div class="row">
                    <span class="buZhou">1</span>
                    <span class="msg">先下载模板进行明细内容的填写</span>
                </div>

                <div class="row">
                    <span class="buZhou">2</span>
                    <span class="msg">请通过点击选择文件按钮,选择填写好内容的Excel文件,点击右下角的明细导入按钮</span>
                </div>
            </div>

            <el-divider></el-divider>

            <div class="footer">
                <el-button size="mini" type="primary" @click="impData">明细导入</el-button>
                <el-button size="mini" @click="cancel">取消</el-button>
            </div>



        </div>
	</section>
</template>




<script>
    import GetExcelDataComponents from './GetExcelDataComponents';

	export default { 
		props:['text'],
        
        data() {
			return {
                excelData: [],
			}
        },
        
		methods: {
    
            cancel() {
                this.$emit('cancel');
            },

            getExcelData(data) {
                this.excelData = data;
            },
            

            impData() {
                this.$emit('get-excel-data', this.excelData);
            },


        },
        
		components: {
            'get-excel-data-components' : GetExcelDataComponents,
        },
        
		mounted() {
			
		}
	}

</script>

<style scoped>

.main {
    margin: 10px;
}

.main .row {
    height: 30px;
    margin: 10px 0 10px 0;
    position: relative;
}

.main .row .imp {
    position: absolute;
    top: -4px;
    left: 180px;
    margin-bottom: 15px;
}

.main .buZhou {
    color: #fff;
    display: inline-block;
    width: 20px;
    height: 20px;
    background: #67C23A;
    margin-right: 20px;
    text-align: center;
    line-height: 20px;
    border-radius: 50%;
}

.main .msg {
    margin-right: 80px;
}

.main  .dolName {
    color: #409EFF;
}

.main  .dolName:hover {
    cursor: pointer;
}

.footer {
    float: right;
    padding-bottom: 20px;
}










</style>