var CalenderHeader = React.createClass({
	getInitialState: function() {
        return {
            year:this.props.year,
            month:this.props.month
        };
	},
	handleLeftClick:function(){
        var newMonth = parseInt(this.state.month) - 1;
        var year = this.state.year;
        if(newMonth < 1){
            year --;
            newMonth = 12;
        }
        this.state.month = newMonth;
        this.state.year=year;
        this.setState(this.state);
        this.props.updateFilter(year,newMonth);
    },
	handleRightClick:function(){
		var newMonth = parseInt(this.state.month) + 1;
		var year = this.state.year;
		if( newMonth > 12 ){
			year ++;
			newMonth = 1;
		}
		this.state.month = newMonth;
		this.state.year=year;
		this.setState(this.state);
		this.props.updateFilter(year,newMonth);
	},
	render: function() {
		return (
		<div className="headerborder">
			<p style={{"lineHeight": "30px"}}>{this.state.month}月</p>
			<p>{this.state.year}年</p>
			<p className="lefttriangle" onClick={this.handleLeftClick}></p>
			<p className="righttriangle" onClick={this.handleRightClick}></p>
		</div>
		)
	}
});

var CalenderBody = React.createClass({
    /*
     * 因为年月状态从父组件传来,这里不需要初始化状态
     */
    getMonthDays:function(){
        //根据月份获取当前天数
        var year = this.props.year,
            month = this.props.month;
        var temp = new Date(year,month,0);
        return temp.getDate();
    },
    getFirstDayWeek:function(){
        //获取当月第一天是星期几
        var year = this.props.year,
            month = this.props.month;
        var dt = new Date(year+'/'+month+'/1');
        var Weekdays = dt.getDay();
        return Weekdays;
    },
    render:function(){
        var arry1 = [],arry2 = [];
        var getDays = this.getMonthDays(),
            FirstDayWeek = this.getFirstDayWeek(),
            curday = this.props.day ;
        for(var i = 0 ;i < FirstDayWeek; i++ ){
            arry1[i] = i;
        }
        for(var i = 0 ;i < getDays; i++ ){
            arry2[i] = (i+1);
        }

        var node1 = arry1.map(function(item){
            return <li></li> // 这里不能加引号，因为要返回HTML标签，而不是html字符串，
            //这是JSX语法 HTML 语言直接写在 JavaScript 语言之中，不加任何引号。
        })
        var node2 = arry2.map(function(item){
            return (curday == item)?<li style={{"backgroundColor": "#eee"}}>{item}</li>: <li>{item}</li>
        })
        return(
            <div>
                <div className="weekday">
                    <ul>
                        <li>SUN</li>
                        <li>MON</li>
                        <li>TUE</li>
                        <li>WED</li>
                        <li>THU</li>
                        <li>FRI</li>
                        <li>SAT</li>
                    </ul>
                </div>
                <div className="CalendarDay" ref="CalendarDay"><ul>{node1}{node2}</ul></div>
            </div>
        )
    }
});

var CalendarControl = React.createClass({
    formatDate:function (date,fmt, flag) {
        /**
         * 对Date的扩展，将 Date 转化为指定格式的String
         * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
         * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
         * eg:
         * Utils.formatDate(new Date(),'yyyy-MM-dd') ==> 2014-03-02
         * Utils.formatDate(new Date(),'yyyy-MM-dd hh:mm') ==> 2014-03-02 05:04
         * Utils.formatDate(new Date(),'yyyy-MM-dd HH:mm') ==> 2014-03-02 17:04
         * Utils.formatDate(new Date(),'yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
         * Utils.formatDate(new Date(),'yyyy-MM-dd E HH:mm:ss') ==> 2009-03-10 二 20:09:04
         * Utils.formatDate(new Date(),'yyyy-MM-dd EE hh:mm:ss') ==> 2009-03-10 周二 08:09:04
         * Utils.formatDate(new Date(),'yyyy-MM-dd EEE hh:mm:ss') ==> 2009-03-10 星期二 08:09:04
         * Utils.formatDate(new Date(),'yyyy-M-d h:m:s.S') ==> 2006-7-2 8:9:4.18
         */
        if(!date) return;
        var o = {
            "M+" : date.getMonth()+1, //月份
            "d+" : date.getDate(), //日
            "h+" : flag ? date.getHours() : (date.getHours()%12 == 0 ? 12 : date.getHours()%12), //小时
            "H+" : date.getHours(), //小时
            "m+" : date.getMinutes(), //分
            "s+" : date.getSeconds(), //秒
            "q+" : Math.floor((date.getMonth()+3)/3), //季度
            "S" : date.getMilliseconds() //毫秒
        };
        var week = {
            "0" : "\u65e5",
            "1" : "\u4e00",
            "2" : "\u4e8c",
            "3" : "\u4e09",
            "4" : "\u56db",
            "5" : "\u4e94",
            "6" : "\u516d"
        };

        if(/(y+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        }

        if(/(E+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[date.getDay()+""]);
        }
        for(var k in o){
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    },
    getInitialState:function(){
        var newDate =  new Date();
        return {
            year:this.formatDate(newDate,'yyyy'),
            month:parseInt(this.formatDate(newDate,'MM')),
            day:parseInt(this.formatDate(newDate,'dd'))
        };
    },
	handleFilterUpdate: function(filterYear,filterMonth) {
	    this.setState({
	     year: filterYear,
	     month: filterMonth
	    });
	},
	render: function() {
		return(
			<div className="calendarBorder">
				<CalenderHeader
					year = {this.state.year}
					month = {this.state.month}
					updateFilter={this.handleFilterUpdate}   />
				
				<CalenderBody year = {this.state.year}
					month = {this.state.month}
					day = {this.state.day} />
			</div>
			)
	}
});

ReactDOM.render(
	<CalendarControl />,
	document.getElementById('wrap')
	);

