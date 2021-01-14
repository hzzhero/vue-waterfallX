/*** 
 * @Author: hezhizhen
 * @Date: 2020-12-2 14:50:13
 * @LastEditTime: 2020-12-2 14:50:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cestc-aiware\web-datalableplat\src\views\dataLabel\label\Shape.js
*/
import { SVG } from '@svgdotjs/svg.js';
class Shape{
    /**
     * 
     * @param {
     *      svgDom
     *      labelingId
     *      scaleX
     *      scaleY
     *      ox
     *      oy
     *      rotate
     *      shapeType
     *      text
     *      color
     *      fill
     *      shape
     *      width
     *      height
     *      x
     *      y
     * } option 
     */
    constructor(option){
        this.svgDom = option.svgDom?option.svgDom:'svgDom';
        this.visible = true;//默认显示
        this.labelingId = option.labelingId;//那一个标注对象上的
        this.scaleX = option.scaleX;//创建时的缩放比例
        this.scaleY = option.scaleY;
        this.ox = option.ox;//创建时图片原来的（0，0）被移到的x y位置
        this.oy = option.oy;
        this.rotate = option.rotate;//创建时旋转的角度

        this.shapeType = '';
        this.text = option.text;
        this.hideText = option.hideText;//默认显示
        this.color = option.color;
        this.fill = option.fill;
        this.shape = null;//当前svg绘图对象
        this.drawText = null;//当前文字
        this.textBackground = null;//当前文字背景
        this.selected = option.selected;

        //以下是计算出来的值，在endDraw方法中要计算一下
        this.originX = 0;
        this.originY = 0;
        this.originWidth = 0 ;
        this.originHeight = 0;

    }

    //标文字，可能因为图形不一样，位置不一样，默认表在x,y
    buildText(){
        // this.drawText = SVG.Text().text().tspan(this.text).fill(this.color);
    }

    //获取最终标注的json数据
    getJson(){

    }

    //改变图形
    resize(option){

    }

    //完成图形
    endDraw(option){

    }

    //endDraw override
    endDraw2(){
        this.endDraw({
            width: this.originWidth * this.scaleX ,
            height: this.originHeight * this.scaleY,
            color: this.color
        });
    }

    //清除图形
    clear(){
        this.drawText.clear();
        this.shape.remove();
        this.textBackground.remove();
        this.hideResizePoints();
    }

    //计算数据
    caculateData(){

    }
    //show
    show(){
        this.visible = true;
        this.selected = false;//去掉选中
        this.shape.show();
        this.drawText.show();
        this.textBackground.show();
    }
    hide(){
        this.visible = false;
        this.shape.hide();
        this.drawText.hide();
        this.textBackground.hide();
        this.hideResizePoints();
    }
    //回显一个图形
    init(){}
    //注册拖动事件
    registerDragEvent(){
        const that = this;
        this.shape.draggable().on('dragmove.shape', e => {
            e.preventDefault();
            if(that.selected){
                const { handler, box } = e.detail
            
                handler.move(box.x , box.y );

                that.x = box.x;
                that.y = box.y;
                that.buildText();
                that.caculateData();
                that.showResizePoints();
            }
        })
    }

    /**
     * 选中标注特征时，显示几个特征点，
     * 并给这几个点注册事件，
     * 处理编辑大小的逻辑
     */
    showResizePoints(){

    }

    /**
     * 隐藏或删除resize的点
     */
    hideResizePoints(){

    }

    /**
     * 外部改变选中状态时需要做的处理，如显示隐藏resize点
     * @param {*} selected 
     */
    changeSelected(selected){
        this.selected = selected;
        if(selected){
            this.showResizePoints();
        }else{
            this.hideResizePoints();
        }
    }

}

/**
 * 圆形
 */
class Ellipse extends Shape{
    constructor(option){
        super(option);
        this.shapeType = 'ELLIPSE';
        this.originWidth = option.originWidth;
        this.originHeight = option.originHeight;
        this.originX = option.originX;
        this.originY = option.originY;
        this.width = option.width;//椭圆长轴
        this.height = option.height;//椭圆短轴
        this.x = option.x;//左上角点坐标x,y
        this.y = option.y;
        if(option.redraw){
            this.x = this.originX * this.scaleX + this.ox;
            this.y = this.originY * this.scaleY + this.oy;
        }
        this.shape = SVG().addTo('#'+this.svgDom).css('position','absolute')
                .ellipse(this.width,this.height)
                .move(this.x,this.y)
                .fill(this.fill)
                .stroke({
                    width: 1,
                    color: this.color,
                    dasharray:'4,2'
                });
        if(option.redraw){
            this.endDraw2();
        }
    }

    /**
     * 改变图形
     * @param {*} option 
     */
    resize(option){
        this.width = option.width;
        this.height = option.height;
        this.shape.size(this.width,this.height).move(this.x,this.y);
    }

    //完成图形
    endDraw(option){
        this.resize(option);
        this.color = option.color;
        this.shape.stroke({
                        width: 1,
                        color: this.color,
                        dasharray:'1,0'
                    });
        this.buildText();
        this.caculateData();

        //拖动位置
        // this.registerDragEvent();
    }

    buildText(){
        if(this.hideText) return;
        this.drawText && this.drawText.clear();
        this.textBackground && this.textBackground.remove();
        this.textBackground = SVG().addTo('#'+this.svgDom)
                .rect(45,20).move(this.x + this.width/2 - 20 ,this.y-20).fill(this.color);
        this.drawText = SVG().addTo('#'+this.svgDom)
                .text(this.text).attr('font-size','12px').fill('rgba(255,255,255)').move(this.x + this.width/2 -20,this.y-20);
        let textRect = this.drawText.bbox(); 
        this.textBackground.size(textRect.width+5,textRect.height).radius(2);
    }

    caculateData(){
        this.originX = (this.x - this.ox)/this.scaleX;
        this.originY = (this.y - this.oy)/this.scaleY;
        this.originWidth = this.width / this.scaleX ;
        this.originHeight = this.height / this.scaleY;
    }


}

/**
 * 矩形
 */
class Rect extends Shape{
    constructor(option){
        super(option);
        this.shapeType = 'RECTANGLE';
        this.originWidth = option.originWidth;
        this.originHeight = option.originHeight;
        this.originX = option.originX;
        this.originY = option.originY;
        this.width = option.width;
        this.height = option.height;
        this.x = option.x;//左上角点坐标x,y
        this.y = option.y;
        if(option.redraw){
            this.x = this.originX * this.scaleX + this.ox;
            this.y = this.originY * this.scaleY + this.oy;
        }
        this.shape = SVG().addTo('#'+this.svgDom).css('position','absolute')
                .rect(this.width,this.height)
                .fill(this.fill)
                .move(this.x,this.y)
                .stroke({
                    width: 1,
                    color: this.color,
                    dasharray:'4,2'
                });
        if(option.redraw){
            this.endDraw2();
        }

    }

    /**
     * 改变图形
     * @param {*} option 
     */
    resize(option){
        this.width = option.width;
        this.height = option.height;
        let w = this.width;
        let h = this.height;
        let x = this.x;
        let y = this.y;
        if(this.width < 0){
            w = Math.abs(this.width);
            x = x+this.width;
            this.shape.x(x);
        }
        if(this.height < 0){
            h = Math.abs(this.height);
            y = y+this.height;
            this.shape.y(y)
        }
        this.shape.size(w,h);
        if(option.isEndDraw){
            this.width = w;
            this.height = h;
            this.x = x;
            this.y = y;
        }
    }

    //完成图形
    endDraw(option){
        option.isEndDraw = true;
        this.resize(option);
        this.color = option.color;
        this.shape.stroke({
                        color: option.color,
                        dasharray:'1,0'
                    });
        this.buildText();
        this.caculateData();

        // this.registerDragEvent();
    }
    buildText(){
        if(this.hideText) return;
        this.drawText && this.drawText.clear();
        this.textBackground && this.textBackground.remove();
        this.textBackground = SVG().addTo('#'+this.svgDom)
                .rect(40,22).move(this.x-1,this.y-19).fill(this.color);
        this.drawText = SVG().addTo('#'+this.svgDom)
        .text(this.text).fill('rgba(255,255,255)').move(this.x,this.y-20);
        this.drawText.font({ size: 12});
        let textRect = this.drawText.bbox(); 
        this.textBackground.size(textRect.width+5,textRect.height).radius(2);
    }

    caculateData(){
        this.originX = (this.x - this.ox)/this.scaleX;
        this.originY = (this.y - this.oy)/this.scaleY;
        this.originWidth = this.width / this.scaleX ;
        this.originHeight = this.height / this.scaleY;
    }

    /**
     * 矩形设置6个resize点,并注册拖拽事件
     */
    showResizePoints(){
        const that = this;
        this.hideResizePoints();
        let draw = SVG().addTo('#'+this.svgDom);
        let radius = 8;
        // this.p1 = draw.circle(radius).fill(this.color).move(this.x - radius/2, this.y- radius/2);
        // this.p2 = draw.circle(radius).fill(this.color).move(this.x + this.width/2 - radius/2, this.y- radius/2);
        // this.p3 = draw.circle(radius).fill(this.color).move(this.x + this.width- radius/2, this.y- radius/2);
        // this.p4 = draw.circle(radius).fill(this.color).move(this.x- radius/2, this.y + this.height- radius/2);
        // this.p5 = draw.circle(radius).fill(this.color).move(this.x + this.width/2- radius/2, this.y + this.height- radius/2);
        // this.p6 = draw.circle(radius).fill(this.color).move(this.x + this.width- radius/2, this.y + this.height- radius/2);
        // this.p1.draggable().on('dragmove.point', e => {
        //     e.preventDefault();
        //         const { handler, box } = e.detail
            
        //         handler.move(box.cx , box.cy );
        //         that.width = that.width + box.cx - this.cx ;
        //         that.height = that.height + box.cy - this.cy ;
        //         that.x = box.x;
        //         that.y = box.y;
        //         that.shape.move(box.cx + 4,box.cy + 4);
        //         that.endDraw({
        //             ...this
        //         })
        //         that.buildText();
        //         that.caculateData();
        //         that.showResizePoints();
        // });
    }
    hideResizePoints(){
        for(let i=1;i<=6;i++){
            this['p'+i] && this['p'+i].remove();
        }
    }
}

/**
 * 多边形
 */
class Polygon extends Shape{
    constructor(option){

    }
}

/**
 * 折线
 */
class Polyline extends Shape{
    constructor(option){

    }
}

/**
 * 点
 */
class Point extends Shape {
    constructor(option){
        super(option);
    }
}

function createShape(option){
    let draw = null;
    switch (option.shapeType) {
        case 'RECTANGLE':  
            draw = new Rect(option);
            break;
        case 'ELLIPSE':
            draw = new Ellipse(option);
            break;
      }
      return draw;
}

export {
    Shape,
    Ellipse,
    Rect,
    Polygon,
    Polyline,
    createShape
}