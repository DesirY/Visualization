function ButterFly(x, y, c, size, year)
{
    this.id = ButterFly.uid();
    this.location = [x, y];
    this.color = c;
    this.size = size;
    this.year = year;
    this.force = [0, 0];
    this.delta_t = 0.05;
    this.count = 10;//记录蝴蝶被重画的次数
    this.random = parseInt(Math.random() * 3) + 1;
    this.mateYear = 1;//理论的交配年纪是1
    this.eat_food_id = [];//每个食物只能吃一次存放食物的id
}

//对蝴蝶编号
(function () {
    var id = 0;
    ButterFly.uid = function()
    {
        return id++;
    }
})();

ButterFly.prototype = {
    //设置颜色
    setcolor: function (c) {
        this.color = c;
    },//注意格式问题，原型函数之间要加上","

    //取得颜色
    getcolor: function () {
        return this.color;
    },

    //设置大小
    setSize: function (size) {
        this.size = size;
    },

    //取得大小
    getSize: function () {
        return this.size;
    },

    //设置年龄
    setyear: function (year) {
        this.year = year;
    },

    //取得年龄
    getyear: function () {
        return this.year;
    },

    //获得理论交配年纪
    getmateYear: function(){
        return this.mateYear;
    },

    //修改理论交配年纪吃一次食物可以多活一年
    setmateYear: function(){
       this.mateYear += 0.1;
    },

    //设置力
    setForce:function (force) {
        this.force = force;
    },

    //获得蝴蝶的编号
    getId:function () {
        return this.id;
    },

    //取得力
    getForce:function () {
        return this.force;
    },

    //设置位置
    setLocation:function (location) {
        this.location = location;
    },

    //获得吃过的食物编号
    get_eat_food_id:function () {
        return this.eat_food_id;
    },

    //添加食物的编号
    set_eat_food_id: function (food_id) {
        this.eat_food_id.push(food_id);
    },

    //状态一，正常状态
    stateOne:function (ctx, location, size) {
        size = size/2;
        ctx.beginPath();
        ctx.ellipse(location[0]+size*Math.sin(60 * Math.PI/180), location[1]-size*Math.cos(60 * Math.PI/180), size*2/3, size, 60 * Math.PI/180, 0, 2 * Math.PI);
        ctx.fill();
        ctx.ellipse(location[0]-size*Math.sin(60 * Math.PI/180), location[1]-size*Math.cos(60 * Math.PI/180), size*2/3, size, 300*Math.PI/180, 0, 2*Math.PI);
        ctx.fill();
        ctx.ellipse(location[0]+size*5/6*Math.sin(30 * Math.PI/180), location[1]+size*5/6*Math.cos(30 * Math.PI/180), size/2, size*5/6, 150*Math.PI/180, 0, 2*Math.PI);
        ctx.fill();
        ctx.ellipse(location[0]-size*5/6*Math.sin(30 * Math.PI/180), location[1]+size*5/6*Math.cos(30 * Math.PI/180), size/2, size*5/6, 210*Math.PI/180, 0, 2*Math.PI);
        ctx.fill();
    },

    //状态二  左偏移
    stateTwo:function (ctx, location, size) {
        size = size/2;
        ctx.beginPath();
        ctx.ellipse(location[0]+ size *Math.sin(30 * Math.PI/180), location[1]-size*Math.cos(30 * Math.PI/180), size*2/3, size, 30 * Math.PI/180, 0, 2 * Math.PI);
        ctx.fill();
        ctx.ellipse(location[0]-size*Math.sin(90 * Math.PI/180), location[1]-size*Math.cos(90 * Math.PI/180), size*2/3, size, 270*Math.PI/180, 0, 2*Math.PI);
        ctx.fill();
        ctx.ellipse(location[0]+size*5/6*Math.sin(60 * Math.PI/180), location[1]+size*5/6*Math.cos(60 * Math.PI/180), size/2, size*5/6, 120*Math.PI/180, 0, 2*Math.PI);
        ctx.fill();
        ctx.ellipse(location[0]-size*5/6*Math.sin(0 * Math.PI/180), location[1]+size*5/6*Math.cos(0 * Math.PI/180), size/2, size*5/6, 180*Math.PI/180, 0, 2*Math.PI);
        ctx.fill();
    },

    //状态三， 右偏移
    stateThree:function (ctx, location, size) {
        size = size/2;
        ctx.beginPath();
        ctx.ellipse(location[0]+size*Math.sin(90 * Math.PI/180), location[1]-size*Math.cos(90 * Math.PI/180), size*2/3, size, 90 * Math.PI/180, 0, 2 * Math.PI);
        ctx.fill();
        ctx.ellipse(location[0]-size*Math.sin(30 * Math.PI/180), location[1]-size*Math.cos(30 * Math.PI/180), size*2/3, size, 330*Math.PI/180, 0, 2*Math.PI);
        ctx.fill();
        ctx.ellipse(location[0]+ size*5/6*Math.sin(0 * Math.PI/180), location[1]+ size*5/6*Math.cos(0 * Math.PI/180), size/2, size*5/6, 180*Math.PI/180, 0, 2*Math.PI);
        ctx.fill();
        ctx.ellipse(location[0]- size*5/6*Math.sin(60 * Math.PI/180), location[1]+ size*5/6*Math.cos(60 * Math.PI/180), size/2, size*5/6, 240*Math.PI/180, 0, 2*Math.PI);
        ctx.fill();
    },

    //状态四， 半偏移
    stateFour: function(ctx, location, size){
        size = size/2;
        ctx.beginPath();
        //ctx.rotate(Math.PI/6);
        ctx.ellipse(location[0]+size*5/6*Math.sin(30 * Math.PI/180), location[1]-size*5/6*Math.cos(30 * Math.PI/180), size/3, size*5/6, 30 * Math.PI/180, 0, 2 * Math.PI);
        ctx.fill();
        ctx.ellipse(location[0]-size*Math.sin(40 * Math.PI/180), location[1]-size*Math.cos(40 * Math.PI/180), size*2/3, size, 320*Math.PI/180, 0, 2*Math.PI);
        ctx.fill();
        ctx.ellipse(location[0]+size*2/3*Math.sin(-10 * Math.PI/180), location[1]+size*2/3*Math.cos(-10 * Math.PI/180), size/30*8, size*2/3, 190*Math.PI/180, 0, 2*Math.PI);
        ctx.fill();
        ctx.ellipse(location[0]-size*5/6*Math.sin(50 * Math.PI/180), location[1]+size*5/6*Math.cos(50 * Math.PI/180), size/2, size*5/6, 230*Math.PI/180, 0, 2*Math.PI);
        ctx.fill();
    },

    //状态五，另一个半偏移
    stateFive: function (ctx, location, size) {
        size = size/2;
        ctx.beginPath();
        ctx.ellipse(location[0]-size*5/6*Math.sin(10 * Math.PI/180), location[1]-size*5/6*Math.cos(10 * Math.PI/180), size/3, size*5/6, 350*Math.PI/180, 0, 2*Math.PI);
        ctx.fill();
        ctx.ellipse(location[0]+size*Math.sin(60 * Math.PI/180), location[1]-size*Math.cos(60 * Math.PI/180), size*2/3, size, 60 * Math.PI/180, 0, 2 * Math.PI);
        ctx.fill();
        ctx.ellipse(location[0]-size*2/3*Math.sin(10 * Math.PI/180), location[1]+size*2/3*Math.cos(10 * Math.PI/180), size/3, size*2/3, 190*Math.PI/180, 0, 2*Math.PI);
        ctx.fill();
        ctx.ellipse(location[0]+size*5/6*Math.sin(30 * Math.PI/180), location[1]+size*5/6*Math.cos(30 * Math.PI/180), size/2, size*5/6, 150*Math.PI/180, 0, 2*Math.PI);
        ctx.fill();
    },

    //状态六：合翅
    stateSix:function(ctx, location, size){
        size = size/2;
        ctx.beginPath();
        ctx.ellipse(location[0]+size*Math.sin(0 * Math.PI/180), location[1]-size*Math.cos(0 * Math.PI/180), size*2/3, size, 0 * Math.PI/180, 0, 2 * Math.PI);
        ctx.fill();
        ctx.ellipse(location[0]+size*2/3*Math.sin(70 * Math.PI/180)-size/30, location[1]-size*2/3*Math.cos(70 * Math.PI/180)-size/30, size*12/30, size*2/3, 70*Math.PI/180, 0, 2*Math.PI);
        ctx.fill();
    },

    //取得位置
    getLocation:function () {
        return this.location;
    },

    draw: function (ctx)//这里的canvas属性是一个鱼一个canvas吗？不太懂
    {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = this.opacity;//颜色进行调整
        //var random = parseInt(Math.random() * 3) + 1;
        if(this.count == 10) {
            this.random = parseInt(Math.random() * 6) + 1;
        }
        this.count = this.count %10 +1;
        //alert(random);
        switch (this.random) {
            case 1:
                this.stateOne(ctx, this, location, this.size);
                break;
            case 3:
                this.stateThree(ctx, this.location, this.size);
                break;
            case 2:
                this.stateTwo(ctx, this.location, this.size);
                break;
            case 4:
                this.stateFour(ctx, this.location, this.size);
                break;
            case 5:
                this.stateFive(ctx, this.location, this.size);
                break;
            case 6:
                this.stateSix(ctx, this.location, this.size);
                break;

        }
        ctx.stroke();
        ctx.fill();
    },

    update: function(width, height)
    {
        var par;
        var l_x = this.location[0],
            l_y = this.location[1];
        //更新位置
        //躲避边缘
        if(l_x <= 50)
        {
            if(l_x < -30){
                this.force[0] = -this.force[0];
            }
            else{
                this.force[0] += Math.random()*1.5*Math.abs(this.force[0]);
            }
        }
        if(l_x >= width-30)
        {
            if(l_x >= width+20){
                this.force[0] = -this.force[0];
            }else {
                this.force[0] -= Math.random()*1.5*Math.abs(this.force[0]);
            }
        }
        if(l_y <= 50)
        {
            if(l_y < -30)
            {
                this.force[1] = -this.force[1];
            }
            else {
                this.force[1] += Math.random()*1.5*Math.abs(this.force[1]);
            }
        }
        if(l_y >= height-50)
        {
            if(l_y > height+30){
                this.force[1] = -this.force[1];
            }else {
                this.force[1] -= Math.random()*1.5*Math.abs(this.force[1]);
            }
        }

        var dx = this.delta_t * this.force[0];
        var dy = this.delta_t * this.force[1];
        var distance = dx*dx+dy*dy;
        while(distance > 80)
        {
            dx = dx/2;
            dy = dy/2;
            distance = dx*dx+dy*dy;
        }

        this.location = [this.location[0]+dx, this.location[1]+dy];
        this.force = [0, 0];
        this.year += 0.1;
        this.opacity = this.year;
    }
}