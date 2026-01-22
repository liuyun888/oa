<template>
  <section> 
    <om-appliance-require-mng :query-scene="'my'"></om-appliance-require-mng>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
import config from "@/common/config"; //全局公共库
import OmApplianceRequireMng from './OmApplianceRequireMng'
import { mapGetters } from "vuex";

export default {
  props: [],
  computed: {
    ...mapGetters(["userInfo"]),
  },
  watch: {
   
  },
  data() {
    return {
      
    };
  }, //end data
  methods: { 
  }, //end methods
  components: { 
    OmApplianceRequireMng,
    //在下面添加其它组件
  },
  mounted() {
     
  },
};
</script>

<style scoped>
 
</style>
