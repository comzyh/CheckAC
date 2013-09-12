var POJ_AC_list;
var ZOJ_AC_list;
var OJ;
var Save_Add_Todo_down=0;
function open_oj(agency)
{
	Pid=$("#input_Pid").val().match(/\d{4}/);
	if (Pid==null)
		return ;
	var pre="";
	var arr=new Array("No","NJUST","Submit","Submit_NJUST");
	a=0;
	if (OJ=="POJ")
	{
		if (agency=="Default")
			agency=localStorage["POJ_Agency"];
		for (var i=0;i<4;i++)
			if (agency==arr[i])
				a=i;
		switch(a)
		{
			case 0:pre='http://poj.org/problem?id=';break;
			case 1:pre='http://icpc.njust.edu.cn/Pku/';break;
			case 2:pre='http://poj.org/submit?problem_id=';break;
			case 3:pre='http://icpc.njust.edu.cn/Pku/Submit/';break;
		}	
	}
	else
	{
		if (agency=="Default")
			agency=localStorage["POJ_Agency"];
		for (var i=0;i<4;i++)
			if (agency==arr[i])
				a=i;
		switch(a)
		{
			case 0:pre='http://acm.zju.edu.cn/onlinejudge/showProblem.do?problemCode=';break;
			case 1:pre='http://icpc.njust.edu.cn/Zju/';break;
			case 2:pre='http://acm.zju.edu.cn/onlinejudge/submit.do?problemId=';break;
			case 3:pre='http://icpc.njust.edu.cn/Zju/Submit/';break;
		}	
	}
	console.log(pre,Pid);
	chrome.tabs.create({
		url:pre+Pid
	});	
	self.close();
}
function check_Accepted()
{
	My_POJ_ID=localStorage["My_POJ_ID"];
	My_ZOJ_ID=localStorage["My_ZOJ_ID"];
	if (POJ_AC_list==null)
		POJ_AC_list=localStorage["POJ_"+My_POJ_ID+"_AC"].split(",");
	if (ZOJ_AC_list==null)
		ZOJ_AC_list=localStorage["ZOJ_"+My_ZOJ_ID+"_AC"].split(",");
	input=document.getElementById("input_Pid");
	str=input.value.match(/\d{4}/);
	OJ=input.value.match(/POJ|ZOJ/i);
	if (OJ==null)
		OJ=localStorage["Default_OJ"];
	else
		OJ=OJ[0].toUpperCase();
	var AC_list;
	if (OJ=="POJ")
		AC_list=POJ_AC_list;
	else
		AC_list=ZOJ_AC_list;
	$("#div_PID").removeClass("error success");
	//$("#input_Pid").css({"background-color":"#FFF"});
	$("#input_Pid").removeClass("txt-fail txt-success");
	if (str!=null)
	{
		ac=0;
		for (i=0;i<AC_list.length;i++)
			if (AC_list[i]==str[0])
				ac=1;
		if (ac)
		{
			//$("#input_Pid").css({"background-color":"#6F9"});
			//input.style.backgroundColor="#6F9";
			$("#div_PID").addClass("success");
			$("#input_Pid").addClass("txt-success");
			
		}
		else
		{
			//$("#input_Pid").css({"background-color":"#F99"});
			//input.style.backgroundColor="#F99";
			$("#div_PID").addClass("error");
			$("#input_Pid").addClass("txt-fail");
		}
	}
}
//Todo List
function Add_Todo(PID,Comment,Finished,InsertTop)
{
	var line=$("<li></li>");
    line.addClass("task");
    if (Finished)
        line.addClass("ToDoList-Finished");
    //<i class="icon-info-sign tool_tip" data-toggle="tooltip" data-placement="bottom" data-container="#div_PID" title="" data-original-title="输入题号后,背景变为绿色表示AC,红色表示尚未AC,按回车进入相应题目" style="opacity: 1;"></i>
    var div=$("<div></div>");
    div.addClass("PID");
    var span=$("<span></span>");
    span.addClass("tool_tip");
    span.attr({
            "data-toggle":"tooltip",
            "data-placement":"bottom",
            "data-container":"body",
            "data-original-title":Comment
            });
    span.text(PID);
    span.tooltip();
    div.append(span);
    div.click(function(){
        $("#input_Pid").val(PID);
        check_Accepted();
        $("#input_Pid").focus();
    });
    var i=$("<i></i>");
    i.addClass("icon-ok");
    i.click(function()
    {
       $(i).parent().toggleClass("ToDoList-Finished");
       Save_ToDoList();
    });
    line.prepend(i);
    line.append(div);
    if(InsertTop)
        $("#ToDo_List").prepend(line);
    else
        $("#ToDo_List").append(line);
}
function Add_new_Todo()
{
    $("#Add_item").css({"display":"block","opacity":1});
    $("#Add_PID").focus();
}
function Save_Add_Todo()
{
    Save_Add_Todo_down=1;
    PID=$("#Add_PID").val();
    Comment=$("#Add_Comment").val();
    if (PID!="")
    {
        Add_Todo(PID,Comment,0,1);
        Save_ToDoList();
    }
    $("#Add_item").css("display","none");
    $("#Add_PID").val("");
    $("#Add_Comment").val("");
    Save_Add_Todo_down=0;
}
function Add_LostFocus()
{
    if (!$("#Add_PID,#Add_Comment,#Save_Add_Todo").is(":focus") && !Save_Add_Todo_down)
    {
        $("#Add_item").fadeTo(250,0);
        setTimeout(function(){$("#Add_item").css("display","none");},250);
    }
}
function Load_ToDoList()
{
	text=localStorage["ToDO_List"];
	if(text==null)
		return;
	try
	{
   		list=JSON.parse(text);
		for (var i=0;i<list.length;i++)
			Add_Todo(list[i].PID,list[i].Comment,list[i].Finish);
	}
	catch(err)//版本兼容性,支持1.0.2 之前版本
	{
		lines=text.split("\n");
		for (var i=0;i<lines.length-1;i++)
		{
			sp=lines[i].split(";");
			Add_Todo(sp[0],sp[1]);
		}
	}
}
function Save_ToDoList()
{
    var lines=$(".task");
    var list =new Array();
    for (var i=0;i<lines.length;i++)
    {
        var item=new Object;
        item.PID=$(lines[i]).find("span").text();
        item.Comment=$(lines[i]).find("span").attr("data-original-title");
        if ($(lines[i]).hasClass("ToDoList-Finished"))
            item.Finish=1;
        else
            item.Finish=0;
        list.push(item);
    }
    localStorage["ToDO_List"]=JSON.stringify(list);

}
//Settings
function openOptions() {
	url="options.html";
	url=chrome.extension.getURL(url);
	chrome.tabs.create({
                url:url              
            });
	window.close();
}
//input_PID
$('.input_with_icon input').focus(function (){$(this).parent().find("i").fadeTo("fast",0.3)});
$('.input_with_icon input').blur(function (){$(this).parent().find("i").fadeTo("fast",1.0)});
//Add new Todo
$("#add_todo").click(Add_new_Todo);
$("#Add_PID,#Add_Comment").blur(function(){setTimeout(Add_LostFocus,5);});
$("#Save_Add_Todo").click(Save_Add_Todo);
$("#orginal_OJ").click(function(){open_oj("No")});
$("#njust_agency_oj").click(function(){open_oj("NJUST")});
$("#Submit").click(function(){open_oj("Submit")});
$("#Submit_NJUST").click(function(){open_oj("Submit_NJUST")});
$("#Options").click(openOptions);
$("#but_Enter").click(function(){open_oj("Default")});
//document.getElementById("input_Pid").submit=open_oj;
document.getElementById("input_Pid").onkeypress = function(e){if(e.keyCode == 13){open_oj("Default");} };
document.getElementById("input_Pid").oninput=check_Accepted;
Load_ToDoList();
$('.tool_tip').tooltip();
//$('.tool_tip').append("XXX");
$("#input_Pid").focus();
//Trunk