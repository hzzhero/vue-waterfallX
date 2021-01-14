<template>
  <div class="about">
    <WaterFallX  
    v-if="reFresh"
    :imgsArr="imgsArr"
    :width="width"
    :height="height"
    :maxCols="maxCols"
    :gap="gap"
    />
  </div>
</template>

<script>
import WaterFallX from '@/components/WaterFallX'
import axios from 'axios'
import $ from 'jquery'
export default {
  components:{
    WaterFallX
  },
  data(){
    return {
      imgsArr:[],
      width: 1000,
      height: 800,
      maxCols: 8,
      gap: 16,
      imgWidth: 230,
      reFresh: true,
    }
  },
  methods:{
    getData(){
      axios.get('/static/mock/data.json')
        .then(res => {
          debugger
          this.imgsArr = res.data;
        })
    }
  },
  created(){
    this.getData();
  },
  mounted(){
    this.width = $('.about').width();
    this.height = $('.about').height() ;
    window.onresize = ()=>{
      this.width = $('.about').width();
      this.height = $('.about').height() ;
      this.reFresh = false;
      this.$nextTick(()=>{
        this.reFresh = true;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.about{
  width: 100%;
  height: 800px;
  border: 1px solid blue;
  display: flex;
  justify-content: center;
  .vue-waterfall-easy-container{
    width: 100%;
  }
}
</style>


