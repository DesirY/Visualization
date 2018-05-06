function Food(x, y, radius)
{
    //没有在页面上加载这个文件浪费了多少时间
    this.id = Food.uid();
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.energy = radius;
    this.live = true;
    this.time = 0;
    this.colorlist = ["#63A69F", "#F0E0AF", "#F1836A", "#C92D28"];
    this.color = this.colorlist[parseInt(Math.random()*4)]
}
(function () {
    var id = 0;
    Food.uid = function()
    {
        return id++;
    }
})();

Food.prototype = {
    getX: function () {
        return this.x;
    },
    getY: function () {
        return this.y;
    },
    getLive: function () {
        return this.live;
    },
    getRadius: function () {
        return this.radius;
    },
    getId: function() {
        return this.id;
    },

    draw: function (ctx) {
        this.time++;
        if(this.time > 100){
            this.radius = 0;
            this.live = false;
        }
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = 0.15;//颜色进行调整
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
        ctx.fill();
        //ctx.stroke();
    },
    eaten: function (butterfly, ctx){
        if(this.energy > 0){
            this.energy -= 3;
            butterfly.setmateYear();
        }
        else{
            this.live = false;
            this.radius = 0;
        }
    }
}