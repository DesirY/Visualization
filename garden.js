$(function()
{
    //蝴蝶种群基本属性
    var POPULATION = 160;
    var PC = 0.8 //繁殖概率
    var PM = 0.008//基因突变概率
    var count = 0;//每50次选择一次
    //力导向算法
    var L = 20  //弹簧的剩余长度
    var K_r = 506000 //斥力系数1060000  5
    var K_s = 8 //弹力系数
    var Range = 105;
    var food_Range = 300;//看到的食物的视野
    var show = false;
    var back = "black";
    var pause = false;

    //画布环境
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext('2d');
    var TimeFn = null;
    $('body').click(function(){
        clearTimeout(TimeFn);
        TimeFn = setTimeout(function(){
            if(show)
            {
                show = false;
                //back = "black";
            }
            else
            {
                show = true;
                //back = "white";
            }
        },300);
    });
    $('body').dblclick(function(){
        clearTimeout(TimeFn);
        alert("PAUSE");
    });


    //花园对象
    garden = {
        width: 0,
        height: 0,
        population: [],
        canvas: ctx,
        food_group: []
    }

    //间隔时间单位是毫秒
    var interval = 100;

    //用户触发事件,后面又一次触发事件不知道为什么，初始化的意思吗？
    $(window).resize(function()
    {
        garden.width = $(window).width();//注意加括号
        garden.height = $(window).height();
        //设置画布属性
        var can = document.getElementById("canvas");
        can.setAttribute("width", garden.width);
        can.setAttribute("height", garden.height);
    }).resize();

    //初始化蝴蝶
    for(var i = 0; i < POPULATION; i++)
    {
        var randomX = Math.random() *(garden.width-1000)+500;
        var randomY = Math.random() * (garden.height-100)+50;
        var randomSize = parseInt(Math.random()*7+8);//后面要转二进制，这里要化成整数啊
        var randomYear = Math.random();
        //随机初始化颜色
        var color = randomHex();
        var butterfly = new ButterFly(randomX, randomY, color, randomSize, randomYear);
        garden.population.push(butterfly);
    }

//随机生成16进制颜色值，类似于#ffffff
    function randomHex()
    {
        var hex = "#"
        for(var i = 0; i < 3; i++ )//循环语句中要加上var，这里要注意
        {
            var seg = (Math.floor(Math.random()*256).toString(16)).toString();
            if(seg.length == 1)
            {
                seg = "0"+ seg;
            }
            hex += seg;
        }
        return hex;
    }

    //十六进制的颜色转换为24位二进制的字符串
    function hex_2(color) {
        var c1 = parseInt(color.substr(1,2), 16).toString(2);
        while(c1.length!=8){
            c1 = "0"+ c1;
        }
        var c2 = parseInt(color.substr(3,2), 16).toString(2);
        while(c2.length!=8){
            c2 = "0"+ c2;
        }
        var c3 = parseInt(color.substr(5,2), 16).toString(2);
        while(c3.length!=8){
            c3 = "0"+ c3;
        }
        return c1+""+c2+c3;
    }

    //颜色的二进制转颜色的十六进制
    function bi_16(binary) {
        var b1 = parseInt(binary.substr(0,8), 2).toString(16);
        while (b1.length != 2){
            b1 = "0"+b1;
        }
        var b2 = parseInt(binary.substr(8,8), 2).toString(16);
        while (b2.length != 2){
            b2 = "0"+b2;
        }
        var b3 = parseInt(binary.substr(16,8), 2).toString(16);
        while (b3.length != 2){
            b3 = "0"+b3;
        }
        return "#"+b1+b2+b3;
    }

//二进制转换为四位数
    function format_binary(num)
    {
        while(num.length != 4)
        {
            num = '0'+ num;
        }
        return num;

    }

//轮盘赌确定下角标的位置
    function selected(randomSum, acc_adapt)
    {
        for(var i = 0;i < acc_adapt.length-1; i++)
        {
            if((randomSum > acc_adapt[i])&&(randomSum <=acc_adapt[i+1]))
            {
                return i+1;
            }
        }
        return 0;
    }

//计算会的之间的的所有的斥力
    function repulsion(b_population) {
        var group_num = b_population.length;
        for(var i = 0; i < group_num-1; i++)
        {
            var butter_one = b_population[i];
            for(var j = 0; j < group_num; j++)
            {
                var butter_two = b_population[j];
                var dx = butter_one.getLocation()[0] - butter_two.getLocation()[0];
                var dy = butter_one.getLocation()[1] - butter_two.getLocation()[1];
                if((dx!=0)&&(dy!=0))
                {
                    var distance = Math.sqrt(dx*dx + dy*dy);
                    //比较两个蝴蝶的大小如果>3那么斥力变大
                    var K_rr = K_r;
                    if(Math.abs(butter_one.getSize()-butter_two.getSize())>5)
                    {
                        K_rr += K_r/15*(15+Math.abs(butter_one.getSize()-butter_two.getSize())-5);
                    }
                    var force = K_rr/(distance*distance);
                    var fx = force * dx / distance;
                    var fy = force * dy / distance;
                    butter_one.setForce([butter_one.getForce()[0]+fx, butter_one.getForce()[1]+fy]);
                    butter_two.setForce([butter_two.getForce()[0]-fx, butter_two.getForce()[1]-fy]);
                }
            }
            //alert("斥力的计算"+butter_one.getForce());
        }

    }

    //计算某个节点之间的邻居节点
    function getNeighbor(node_butter, node_population) {
        var neighbor = [];
        var x = node_butter.getLocation()[0];
        var y = node_butter.getLocation()[1];
        for(var i in node_population)
        {
            var new_node_butter = node_population[i];
            var new_x = new_node_butter.getLocation()[0];
            var new_y = new_node_butter.getLocation()[1];
            var dx = x-new_x;
            var dy = y-new_y;
            var distance = Math.sqrt(dx*dx + dy*dy);
            if(distance < Range)
            {
                neighbor.push(new_node_butter);
            }
        }
        return neighbor;
    }

    //计算邻居节点之间的引力
    function Gravitation(b_population) {
        var num = b_population.length;
        for(var i = 0; i < num; i++)
        {
            var butter = b_population[i];
            var neighbor = getNeighbor(butter, b_population);
            var nei_length = neighbor.length;
            //alert("长度是"+neighbor.length)
            for(var j = 0; j < nei_length; j++)
            {
                var new_butter = neighbor[j];
                //alert("id是"+ butter.id)
                if (butter.getId()<new_butter.getId())
                {
                    if(show){
                        ctx.moveTo(butter.getLocation()[0], butter.getLocation()[1]);
                        ctx.lineTo(new_butter.getLocation()[0], new_butter.getLocation()[1]);
                        ctx.globalAlpha = 0.12;
                        ctx.strokeStyle = "#DFAC41"//"#63A69F";
                        ctx.lineWidth = 0.03;
                        ctx.stroke();
                    }
                    var dx = butter.getLocation()[0] - new_butter.getLocation()[0];
                    var dy = butter.getLocation()[1] - new_butter.getLocation()[1];
                    var distance = Math.sqrt(dx*dx + dy*dy);
                    var force = K_s * (distance-L);
                    var fx = force * dx / distance;
                    var fy = force * dy /distance;
                    butter.setForce([butter.getForce()[0]-fx, butter.getForce()[1]-fy]);
                    new_butter.setForce([new_butter.getForce()[0]+fx, new_butter.getForce()[1]+fy]);
                }

            }
        //alert("引力的计算"+butter.getForce());
        }
    }

    //删除数组中的指定位置元素
    function removenum(dx)
    {
        if(isNaN(dx)||dx>this.length){return false;}
        for(var i=0,n=0;i<this.length;i++)
        {
            if(this[i]!=this[dx])
            {
                this[n++]=this[i]
            }
        }
        this.length-=1
    }

    var loop = function() {
        var adaptability = [];
        var acc_adapt = [];
        var sum = 0;
        var next_group_color = [];

        //原屏幕覆盖
        ctx.globalAlpha = 1;
        ctx.fillStyle = back;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;

        //以一定的概率画食物在200之内生成食物
        if(Math.random()<=0.02)
        {
            var x = parseInt((canvas.width)*Math.random());
            var y = parseInt((canvas.height)*Math.random());
            var radius = parseInt(20*Math.random()+50);
            var food = new Food(x, y, radius);
            garden.food_group.push(food);
        }

        //画食物
        if(garden.food_group.length!=0) {
            for (var i in garden.food_group) {
                var f = garden.food_group[i];
                //alert(f.getLive());
                if (f.getLive()) {
                    f.draw(ctx);
                }
                //else{其实删除才是最好的机制
                //}
            }
        }

        //画蝴蝶
        for (var i in garden.population)
        {
            var butterfly = garden.population[i];
            butterfly.update(canvas.width, canvas.height);
            butterfly.draw(ctx);
        }

        //力导向算法
        repulsion(garden.population);
        Gravitation(garden.population);

        //计算每条鱼吃食物遍历每条鱼的周围食物并找出最近的食物吃掉它
        for(var i in garden.population)
        {
            var eat = 0;
            var min = food_Range;
            var butterfly = garden.population[i];
            if(garden.food_group.length != 0)
            {
                for(var j in garden.food_group)
                {
                    var food = garden.food_group[j];

                    //判断之前是否吃过
                    var ifeat = function () {
                        var id = butterfly.get_eat_food_id();
                        var theid = food.getId();
                        if(id.length!=0)
                        {
                            var len = id.length;
                            for(var m = 0; m < len; m++)
                            {
                                if(id[m]==theid)
                                {
                                    return true;
                                }
                            }
                            return false;
                        }
                        return false;
                    }

                    //只让鱼吃一次
                    if(!ifeat()) {
                        //蝴蝶和食物的距离
                        var dist = Math.sqrt(Math.pow((butterfly.getLocation()[0] - food.getX()), 2) + Math.pow((butterfly.getLocation()[1] - food.getY()), 2)) - food.getRadius();
                        if (dist < 0) {
                            butterfly.set_eat_food_id(food.getId());
                            food.eaten(butterfly, ctx);
                        }
                        //鱼在食物的外面并且在看到的范围内找到最小值
                        else {
                            if(dist <= food_Range) {
                                if (j == 0 || dist < min) {
                                    eat = food;
                                    min = dist;
                                }
                            }
                        }
                    }
                }
            }
            //如果存在里的最近的食物靠近他
            if(eat){
                //alert("nihao"+min);
                var move = (food_Range-min)*0.008;//移动的总距离
                var moveX = move*(eat.getX()-butterfly.getLocation()[0])/(dist+eat.getRadius());
                var moveY = move*eat.getRadius()*(eat.getY()-butterfly.getLocation()[1])/(dist+eat.getRadius());
                butterfly.setLocation([butterfly.getLocation()[0]+moveX, butterfly.getLocation()[1]+moveY]);
            }
        }

        if(count === 15) {
            //计算每个个体的适应度函数
            for (var i in garden.population) {
                //适应的算法要注意差值越大说明适应性越差没用一个大数减去此数得适应性值
                var butterfly = garden.population[i];
                //8947848 16777215
                var fit = (16777215 - Math.abs(parseInt(butterfly.getcolor().substr(1, 6), 16) - 16566286)) / 1000000;//js的除法获得的是小数
                //alert(fit);
                fit = fit + 12 - Math.abs(butterfly.getSize()-12);//大小为10左右的蝴蝶比较适合

                adaptability.push(fit);//字符串的截取与进制的转化
            }

            //计算累积适应度
            for (var i in adaptability) {
                sum += adaptability[i];
                acc_adapt.push(sum);
            }

            //轮盘赌方法复制个体颜色到新的种群中
            for (var i = 0; i < POPULATION; i++) {
                //随机生成一个数0-sum
                var randomSum = Math.random() * sum;//随机函数取不到1
                //复制选中个体的颜色
                next_group_color.push(garden.population[selected(randomSum, acc_adapt)].getcolor());
            }
            //count  = count%50 +1;这句话放在这个位置肯定有问题永远也不会选择
        }
        //如果没有进行选择，下一代的颜色是就是当前种群的颜色
        else
        {
            for(var i in garden.population)
            {
                next_group_color.push(garden.population[i].getcolor());
            }
        }
        count  = count%15 +1;

        //交配
        for(var i = 0; i < parseInt(next_group_color.length/2); i++)
        {
            var len = next_group_color.length;
            //两个个体的下角标
            var indi1 = parseInt(Math.random()*len);
            var indi2 = parseInt(Math.random()*len);
            //两个个体的二进制颜色表示!!!!注意这儿不是标准的24位
            var individual1 = hex_2(next_group_color[indi1]);
            var individual2 = hex_2(next_group_color[indi2]);
            //两个个体的大小二进制表示及二进制补全为4位数
            var indi1_size = format_binary(garden.population[indi1].getSize().toString(2));
            var indi2_size = format_binary(garden.population[indi2].getSize().toString(2));

            //交配的概率
            if ((Math.random() < PC) && (garden.population[indi1].getyear()>garden.population[indi1].getmateYear()) && (garden.population[indi2].getyear()>garden.population[indi2].getmateYear()))
            {
                //染色体交换，确定颜色四个交换点，rgb三个分别交换
                var point = parseInt(Math.random()*8);
                var point1 = parseInt(Math.random()*8)+8;
                var point2 = parseInt(Math.random()*8)+16;
                var temp11 = individual1.toString().substring(point, 8);
                var temp12 = individual2.toString().substring(point, 8);
                var temp21 = individual1.toString().substring(point1, 16);
                var temp22 = individual2.toString().substring(point1, 16);
                var temp31 = individual1.toString().substring(point2, 24);
                var temp32 = individual2.toString().substring(point2, 24);

                //大小交换
                var point_size = parseInt(Math.random()*4);
                var temp1_size = indi1_size.toString().substring(point_size);
                var temp2_size = indi2_size.toString().substring(point_size);

                //替换
                if(individual1.length<23){
                    alert(individual1.length);
                }
                individual1 = individual1.toString().substring(0, point)+temp12+individual1.toString().substring(8, point1)+temp22+individual1.toString().substring(16, point2)+temp32;
                individual2 = individual2.toString().substring(0, point)+temp11+individual1.toString().substring(8, point1)+temp21+individual1.toString().substring(16, point2)+temp31;
                //大小染色体交换
                indi1_size = indi1_size.toString().substring(0, point_size)+temp2_size;
                indi2_size = indi2_size.toString().substring(0, point_size)+temp1_size;
                //年龄置为0
                garden.population[indi1].setyear(0);
                garden.population[indi2].setyear(0);
            }

            //孩子的大小是染色体交换之后的结果
            garden.population[indi1].setSize(parseInt(indi1_size, 2));
            garden.population[indi2].setSize(parseInt(indi2_size, 2));
            //孩子个体放到父母的位置
            //十六进制一定要写这儿，写if里面不行
            individual1 = bi_16(individual1);
            //alert("交换后的新十六进制"+individual1);
            individual2 = bi_16(individual2);
            next_group_color[indi1] = individual1;
            next_group_color[indi2] = individual2;
        }

        //基因突变，颜色和大小突变
        //自己在各种进制以及字符串的相互转换之间很容易混乱
        for(var i in next_group_color)
        {
            //颜色转换为二进制字符串数组
            var binary = hex_2(next_group_color[i]).split("");//这儿一定要处理成数组之后才能赋值
            //alert(binary.length)
            if(Math.random() < PM)
            {
                var script = parseInt(Math.random()* binary.length);//此变量在if之外仍然可以用
                var size_script = parseInt(Math.random()*4);
                var size_binary = format_binary(garden.population[i].getSize().toString(2)).split("");

                //alert("选中的数字是" + binary[script])
                if(binary[script] === '1')
                {
                    binary[script] = '0';
                }
                else
                {
                    binary[script] = '1';
                }

                if(size_binary[size_script] === '1')
                {
                    size_binary[size_script] = '0';
                }
                else
                {
                    size_binary[size_script] = '1';
                }
                //alert("修改后是" + binary[script])
                //突变之后的大小十进制
                size_binary = parseInt(size_binary.join(""), 2);
                //直接修改
                garden.population[i].setSize(size_binary);
            }
            //数组转字符串
            binary = binary.join("");
            //alert("转换之后的字符串是"+binary);
            //二进制转十六进制
            binary = bi_16(binary);
            if(binary.length!=7){
                alert("修改后是16 " + binary);
            }

            //修改蝴蝶的颜色
            next_group_color[i] = binary;
        }

        //更新种群的颜色
        for(var i = 0; i < POPULATION; i++)
        {
            garden.population[i].setcolor(next_group_color[i]);
        }

    }
        setInterval(loop, interval);
});