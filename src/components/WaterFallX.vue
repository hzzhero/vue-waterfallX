<template>
  <div class="content-container">
    <vue-waterfall-easy 
    :width="width"
    :height="height"
    :imgsArr="imgsArr" 
    :maxCols="maxCols"
    :imgWidth="imgWidth"
    :gap="gap"
    :cardAnimationClass="''"
    @scrollReachBottom="getData" 
    @click="clickFn" 
    @preloaded="preloaded">
      <div class="img-info"  slot-scope="props" :index="props.index">
        <!-- <p class="some-info">picture index: {{props.index}}</p>
        <p class="some-info">{{props.value.info}}</p>
        <p v-if="props.index%2==0" class="some-info">{{props.value.info}}</p> -->
        <span class="label-span" v-for="(item,i) in imgsArr[props.index].labelList" :key="i">{{item.text}}</span>
      </div>
    </vue-waterfall-easy>
  </div>
</template>

<script>
import vueWaterfallEasy from 'vue-waterfall-easy'
import $ from 'jquery'
import {Shape,
    Ellipse,
    Rect,
    Polygon,
    Polyline,
    createShape} from  './Shape'
export default {
  components: {
    vueWaterfallEasy
  },
  props:{
    width: { // 容器宽度
      type: Number
    },
    height: { // 容器高度
      type: [Number, String]
    },
    reachBottomDistance: { // 滚动触底距离，触发加载新图片
      type: Number, // selector
      default: 20  // 默认在最低那一列到底时触发
    },
    loadingDotCount: { // loading 点数
      type: Number,
      default: 3
    },
    loadingDotStyle: {
      type: Object,
    },
    gap: { // .img-box 间距
      type: Number,
      default: 20
    },
    mobileGap: {
      type: Number,
      default: 8
    },
    maxCols: {
      type: Number,
      default: 6
    },
    imgsArr: {
      type: Array,
      required: true,
    },
    srcKey: {
      type: String,
      default: 'src'
    },
    hrefKey: {
      type: String,
      default: 'href'
    },
    isRouterLink: {
      type: Boolean,
      default: false
    },
    linkRange: { // card | img | custom 自定义通过slot自定义链接范围
      type: String,
      default: 'card'
    },
    loadingTimeOut: { // 预加载事件小于500毫秒就不显示加载动画，增加用户体验
      type: Number,
      default: 500
    },
    cardAnimationClass: {
      type: [String],
      default: 'default-card-animation'
    },
    enablePullDownEvent: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      imgWidth: 100,
    }
  },
  methods: {
    getData(p) {
      this.$emit('scrollReachBottom',p)
    },
    clickFn(event, { index, value }) {
      event.preventDefault()
      if (event.target.tagName.toLowerCase() == 'img') {
        console.log('img clicked',index, value)
      }
      this.$emit('click',{
        event,
        index,
        value
      });
    },
    preloaded(){
      setTimeout(()=>{
        this.getAllImgDom();
      },200);
    },
    getAllImgDom(){
      let boxs = $('.img-box');
      boxs.css('display','flex');
      //遍历分别添加标注信息
      boxs.each((i,ele)=>{
        //当前是第几个
        let idx = $(ele).find('.img-info').attr('index');
        let obj = this.imgsArr[idx];
        let alink = $(ele).find('.img-wraper');
        this.generateLabels2(obj,alink,$(ele));
      });
    },
    generateLabels(obj,alink,box){
      if(!obj || !obj.labelList || obj.labelList.length<1)  return;
      let width = alink.width();
      let height = alink.height();
      let img = alink.find('img');
      let nwidth = img[0].naturalWidth;
      let nheight = img[0].naturalHeight;
      obj.labelList.forEach(element => {
        let scaleX = width/1.0/nwidth;
        let scaleY = height/1.0/nheight;
        let left = scaleX*element.originX;
        let top = scaleY*element.originY;
        let $dom = $(`<div style="position:absolute;
        left:${left}px;
        top: ${top}px;
        border: 1px solid ${element.color};
        width: ${element.width*scaleX}px;
        height: ${element.height*scaleY}px; "></div>`);
        alink.append($dom);
      });

    },
    /**
     * 复用标注的方法回显,这样可以保证只要标注实现了的工具，都可以回显。
     */
    generateLabels2(obj,alink,box){
      if(!obj || !obj.labelList || obj.labelList.length<1)  return;
      box.attr('id',`svg-${obj.tpId}`);
      let width = alink.width();
      let height = alink.height();
      let img = alink.find('img');
      let nwidth = img[0].naturalWidth;
      let nheight = img[0].naturalHeight;
      obj.labelList.forEach(element => {
        let scaleX = width/1.0/nwidth;
        let scaleY = height/1.0/nheight;
        let left = scaleX*element.originX;
        let top = scaleY*element.originY;
        let option = {
          shapeType: element.shapeType?element.shapeType:'RECTANGLE',
          svgDom: `svg-${obj.tpId}`,
          redraw: true,
          visible: true,
          scaleX,
          scaleY,
          ox: 0,
          oy: 0,
          width: nwidth,
          height: nheight,
          originWidth: element.width,
          originHeight: element.height,
          originX: element.originX,
          originY:element.originY,
          color: element.color,
          fill: 'rgba(0,0,0,0)',
          hideText: true,
        }
        let shape = createShape(option);
        shape.shape.css({
            float: 'left',
            position: 'absolute'
        })
      });
    }

  },
  created() {
    console.log(this.width);
    this.imgWidth = (this.width - 48 - (this.maxCols -1)* this.gap)/this.maxCols;
  },
  mounted(){

  }
}
</script>

<style lang="scss" scoped>
.content-container{
  width: 100%;
  // border: 1px solid red;
  .img-info{
    padding: 2px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .label-span{
      padding: 8px 8px;
      line-height: 14px;
      background-color: rgba($color: gray, $alpha: 0.3);
      border-radius: 2px;
      margin: 0 2px;
      display:inline-block;
      text-decoration-color:none !important;
    }

  }
}
.img-box{
  display: flex !important;
  .img-wraper{
    .svg-contaner{
      position:absolute;
      left: 0;
      top: 0;
    }
  }
}

</style>