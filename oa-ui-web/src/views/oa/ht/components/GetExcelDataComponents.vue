<template>
	<section>
        <div>
            <el-upload
                ref="uploadFile"
                :action="uploadApi"
                :on-change="readExcel"
                :on-remove="clearFileList"
                :on-success="handleSuccess"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                :limit="1"
                :auto-upload="false"
                >
                <el-button size="mini" type="primary">点击上传</el-button>
            </el-upload>
        </div>
	</section>
</template>


<script>

import XLSX from "xlsx";
const REGULAR = {
  EXCEL: /(.*)\.(xls|xlsx|XLS|XLSX)$/
};

	export default { 
		props:[],
        
        data() {
			return {
                fileList: [],
                uploadApi: '',
                excelData: [],
                result: [],
                load: {
                    up: false,
                }
			}
        },
        
		methods: {
            
           readExcel(file, fileList) {
                if (!REGULAR.EXCEL.test(file.name)) {
                    alert("选择的文件格式错误!");
                    return this.clearFileList();
                }
                let fileReader = new FileReader();
                fileReader.readAsBinaryString(file.raw);
                fileReader.onload = ev => {
                    try {
                    let data = ev.target.result,
                        header = [],
                        workbook = XLSX.read(data, { type: "binary" });
                    this.result = [];
                    
                    workbook.SheetNames.forEach((w, index) => {
                       this.result.push(XLSX.utils.sheet_to_json(workbook.Sheets[w]))
                    })
                    this.$emit('get-excel-data', this.result);
                    } catch (e) {
                        alert("解析EXCEL文件失败" + JSON.stringify(e));
                        console.log(e);
                    }
                };
            },

            clearFileList() {

            },

            handleSuccess() {

            },

            handleExceed() {

            },

            hex(num) {
                let arr = [];
                while (num > 0) {
                    let remain = num % 26;
                    num = parseInt(num / 26);
                    if (remain === 0) {
                    remain = 26;
                    num--;
                    }
                    arr.push(String.fromCharCode(remain + 64));
                }
                return arr.reverse().join("");
            },
          
        },
        
		components: {

        },
        
		mounted() {}
        
	}

</script>

<style scoped>
</style>