// JavaScript Document
BGP=chrome.extension.getBackgroundPage();//
function getQueryStr(str){
    var rs = new RegExp("(^|)"+str+"=([^\&|#]*)(\&|$|#)","gi").exec(window.location.href), tmp;
    if (rs)return rs[2];
    return "";
}
//信息提示
function Info(msg,cls)
{
	$("#alert_infobar").removeClass("alert-info alert-error alert-success");
	$("#alert_infobar").addClass(cls);
	$("#info-bar").text(msg);	
}
function calc_sum()
{
	var sum=0;
	POJ=$("#POJ_AC_Number").text();
	ZOJ=$("#ZOJ_AC_Number").text();
	if (ZOJ!="")sum+=parseInt(ZOJ);
	if (POJ!="")sum+=parseInt(POJ);
	$("#Sum_AC_Number").text(sum);
}
function loadXMLDoc(url,delegate) {
	var xmlhttp = new XMLHttpRequest();
	if (xmlhttp != null) {
		//document.getElementById("refresh_status").innerHTML="正在从POJ获取AC题目";
		Info("正在从POJ获取AC题目","alert-info");
		xmlhttp.onreadystatechange = delegate;
		xmlhttp.open("GET", url, true);
		xmlhttp.send(null);
	} else {
		alert("你的浏览器不支持XMLHttpRequest");
	}
}
function POJ_res(status,addition){
	switch(status)
	{
		case -1:
			if (addition!=null)
				addition="(HTTP "+ addition + ")";
			Info("从POJ读取信息失败,可能是网络故障"+addition,"alert-error");break;
		case 1:
			Info("正在发送请求","alert-info");break;
		case 3:
			Info("正在解析响应内容","alert-info");break;
		case 4:
			Load_AC("POJ",$("#txt_POJ_ID").val());
			var myDate = new Date();
			Info( "POJ于"+	myDate.toLocaleTimeString() + "刷新","alert-success");
			$("#POJ_line").addClass("success");
			calc_sum();
			break;
	}
}
function Refresh_POJbyID() {
	txtID = $("#txt_POJ_ID").val();
	BGP.Refresh_POJbyID(txtID,POJ_res);
}
//-----ZOJ-----
function ZOJ_res(status,addition){
	switch(status)
	{
		case -1:
			if (addition!=null)
				addition="(HTTP "+ addition + ")";
			Info("从ZOJ读取信息失败,可能是网络故障"+addition,"alert-error");break;
		case 1:
			Info("正在发送请求","alert-info");break;
		case 3:
			Info("正在解析响应内容","alert-info");break;
		case 4:
			Load_AC("ZOJ",$("#txt_ZOJ_ID").val());
			var myDate = new Date();
			Info( "ZOJ于"+	myDate.toLocaleTimeString() + "刷新","alert-success");
			$("#ZOJ_line").addClass("success");
			calc_sum();
			break;
	}
}
function Refresh_ZOJbyID()
{
	txtID = $("#txt_ZOJ_ID").val();
	BGP.Refresh_ZOJbyID(txtID,ZOJ_res);
}
//-----Settings------
function Select_by_Text(id,text)
{
	var count=$(id+" option").length;
	for (var i=0;i<count;i++)
		if ($(id).get(0).options[i].text==text)
		{
			$(id).get(0).options[i].selected =true;
			break;
		}
}
function Save_AC(OJ,ID)
{
	strs =$("#"+OJ+"_AC").val().match(/\d{4}/g);
	if (strs==null)
		localStorage[OJ+"_" + ID + "_AC"] ="";
	else
	{
		strs.sort();
		i=1;j=1;
		while (j<strs.length)
		{
			while (j<strs.length && strs[j]==strs[j-1])j++;
			if (j>=strs.length)break;
			strs[i++]=strs[j++];
		}
		while (strs.length>i)strs.pop();
		localStorage[OJ+"_" + ID + "_AC"] = strs;
	}
}
function Load_AC(OJ,ID)
{
	if (localStorage[OJ+"_" + ID + "_AC"]==null)
		return ;
	strs = localStorage[OJ+"_" + ID + "_AC"].match(/\d{4}/g);
	if (strs==null)
		return ;
	$("#"+OJ+"_AC").val("");
	AC="";
	for (i = 0; i < strs.length; i++)
		AC += strs[i] + " "; 
	$("#"+OJ+"_AC").val(AC);
	$("#"+OJ+"_AC_Number").text(strs.length);
}
//ToDo List
var ToDoLine
function Remove_Todo_item()
{
	$(this).parent().parent().parent().remove();
}
function ToDo_table_edit_aera()
{
    var iconedit=$("<i></i>").addClass("icon-edit")              ;
    var textedit=$("<span></span>").text("编辑")
    var a1=$("<a></a>").append(iconedit).append(textedit).attr("href","#").addClass("a_edit");
    var icondel=$("<i></i>").addClass("icon-remove")              ;
    var texdel=$("<span></span>").text("删除")
    var a2=$("<a></a>").append(icondel).append(texdel).attr("href","#").addClass("a_delete");
    var div=$("<div></div>").addClass("pull-right edit-group").append(a1).append(a2);
    return div;
}
function Edit_Todo_item(line)
{
	ToDoLine=line;
	PID=ToDoLine.find(".ToDo_PID").text();
    Comment=ToDoLine.find(".ToDo_Comment").text();
	$("#Modal_title").text("编辑项目");
	$("#Modal_PID").val(PID);
    $("#Modal_Comment").val(Comment);
	$("#Modal_Save").unbind('click');
	$("#Modal_Save").click(function(){Save_Todo_item()});
	$("#Edit_ToDolist_item").modal('show');
}
function Todo_table_edit_click()
{
	Edit_Todo_item($(this).parent().parent().parent());
}
function Save_Todo_item()
{
	PID=$("#Modal_PID").val();
	Comment=$("#Modal_Comment").val();
	ToDoLine.find(".ToDo_PID").text(PID)
	Comment=ToDoLine.find(".ToDo_Comment").text(Comment);
	$("#Edit_ToDolist_item").modal('hide');
}
function new_Todo_item()
{
	$("#Modal_title").text("添加项目");
	$("#Modal_PID").val("");
    $("#Modal_Comment").val("");
	$("#Modal_Save").unbind('click');
	$("#Modal_Save").click(
		function(){
			PID=$("#Modal_PID").val();
			Comment=$("#Modal_Comment").val();
			addline(PID,Comment);
			$("#Edit_ToDolist_item").modal('hide');
		}
	)
	$("#Edit_ToDolist_item").modal('show');
}
function addline(PID,Comment,Finished)
{
	var newRow = "<tr><td class=\"Problem\"><span class=\"ToDo_PID\">PID</span></td><td class=\"Comment\"><span class=\"ToDo_Comment\">Comment</span></td></tr>";
    var line=$(newRow);
    if(Finished)
        line.addClass("ToDo_Finished");
	if (typeof(PID)=="string")
		line.find(".ToDo_PID").text(PID);
	if (typeof(Comment)=="string")
		line.find(".ToDo_Comment").text(Comment);
    $(line).find(".Problem").append(ToDo_table_edit_aera());
	$("#table_ToDo tbody").append(line);
	$(line).find(".a_delete").click(Remove_Todo_item);
	$(line).find(".a_edit").click(Todo_table_edit_click);
	return line;
}
function Save_ToDoList()
{
	var lines=$("#table_ToDo tbody tr");
	var list =new Array();
	for (var i=0;i<lines.length;i++)
	{
		var item=new Object;
		item.PID=$(lines[i]).find(".ToDo_PID").text();
		item.Comment=$(lines[i]).find(".ToDo_Comment").text();
		list.push(item);
	}
	localStorage["ToDO_List"]=JSON.stringify(list);
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
			addline(list[i].PID,list[i].Comment,list[i].Finish);
	}
	catch(err)//版本兼容性,支持1.0.2 之前版本
	{
		lines=text.split("\n");
		for (var i=0;i<lines.length-1;i++)
		{
			sp=lines[i].split(";");
			addline(sp[0],sp[1]);
		}
	}
}
//Follow
function  Add_Foloow_line(Name,POJ_ID,ZOJ_ID)
{
    line=$("<tr></tr>");
    _name=$("<td></td>");
    __name=$("<span></span>").addClass("Follow_Name").text(Name);
    _name.append(__name);
    butgroup=$("<div class='pull-right edit-group'></div> ");
    butref=$("<a href='#'><i class='icon-refresh'></i><span>刷新</span></a>");
    butdel=$("<a href='#'><i class='icon-remove'></i><span>删除</span></a>");
    butref.click(function(){
        RefreshFollow(POJ_ID,ZOJ_ID);
    });
    butdel.click(function(){
       $(this).parent().parent().parent().remove();
    });
    butgroup.append(butref,butdel);
    _name.append(butgroup);
    pojid=$("<td></td>").addClass("Follow_POJ_ID").text(POJ_ID);
    pojac=$("<td></td>").addClass("Follow_POJ_AC");
    zojid=$("<td></td>").addClass("Follow_ZOJ_ID").text(ZOJ_ID);
    zojac=$("<td></td>").addClass("Follow_ZOJ_AC");
    line.append(_name,pojid,pojac,zojid,zojac);
    $("#table_Follow tbody").append(line);
    Follow_Ref_Res("POJ",POJ_ID);
    Follow_Ref_Res("ZOJ",ZOJ_ID);
}
function RefreshFollow(POJ_ID,ZOJ_ID)
{
    if (POJ_ID!="")
    BGP.Refresh_POJbyID(POJ_ID,function(state,status)
    {
        if (state==4)
            Follow_Ref_Res("POJ",POJ_ID,"success");
        if (state==-1)
            console.log(status);
    });
    if (ZOJ_ID!="")
    BGP.Refresh_ZOJbyID(ZOJ_ID,function(state,status)
    {
        if (state==4)
            Follow_Ref_Res("ZOJ",ZOJ_ID,"success");
       if (state==-1)
            console.log(status);
    });
}
function Load_Follow()
{
    text=localStorage["Follow"];
    if(text==null)
        return;
    list=JSON.parse(text);
    for (var i=0;i<list.length;i++)
        Add_Foloow_line(list[i].Name,list[i].POJ_ID,list[i].ZOJ_ID);
}
function Save_Follow()
{
	var lines=$("#table_Follow tbody tr");
	var list =new Array();
	for (var i=0;i<lines.length;i++)
	{
		var item=new Object;
		item.Name=$(lines[i]).find(".Follow_Name").text();
		item.POJ_ID=$(lines[i]).find(".Follow_POJ_ID").text();
		item.ZOJ_ID=$(lines[i]).find(".Follow_ZOJ_ID").text();
		list.push(item);
	}
	localStorage["Follow"]=JSON.stringify(list);
}
function New_Follow()
{
    if ($("#Add_Follow_Name").val()=="")return ;
    Name=$("#Add_Follow_Name").val();$("#Add_Follow_Name").val("");
    POJ_ID=$("#Add_Follow_POJ_ID").val();$("#Add_Follow_POJ_ID").val("");
    ZOJ_ID=$("#Add_Follow_ZOJ_ID").val();$("#Add_Follow_ZOJ_ID").val("");
    Add_Foloow_line(Name,POJ_ID,ZOJ_ID);
    Save_Follow();
}
function Follow_Ref_Res(OJ,ID,style_class)
{
   IDs=$(".Follow_"+OJ+"_ID");
   str=localStorage[OJ+"_" + ID + "_AC"];
   if (str==null)return;
   strs = str.match(/\d{4}/g);
   if (strs==null)return;
   if (style_class==null)style_class="";
   for(i=0;i<IDs.length;i++)
        if($(IDs[i]).text().toLowerCase()==ID.toLowerCase())
            $(IDs[i]).parent().find(".Follow_"+OJ+"_AC").text(strs.length).addClass(style_class);
}
function Follow_RefAll()
{
    var lines=$("#table_Follow tbody tr");
    var list =new Array();
    for (var i=0;i<lines.length;i++)
        RefreshFollow(POJ_ID=$(lines[i]).find(".Follow_POJ_ID").text(),$(lines[i]).find(".Follow_ZOJ_ID").text());
}
//RecentContest
function LoadRecentContests()
{
    $("#table_RecentContests tbody tr").remove();
    text=localStorage["RecentContests"];
    if (text==null)return ;
    list=JSON.parse(text);
    for (var i=0;i<list.length;i++)
        AddRecentContest(list[i]);
}
function AddRecentContest(contest)
{
    var line=$("<tr></tr>");
    var oj=$("<td></td>").text(contest.oj);
    var name=$("<a></a>").text(contest.name);
    name.attr({
        "href":contest.link,
        "target":"_blank"
    });
    name=$("<td></td>").append(name);
    var starttime=$("<td></td>").text(contest.start_time);
    var week=$("<td></td>").text(contest.week);
    var access=$("<td></td>").text(contest.access);
    line.append(oj,name,starttime,week,access);
    $("#table_RecentContests tbody").append(line);
}
function RefreshRecentContests()
{
    BGP.RefreshRecentContests(function(status,addition){
        if (status==4)
        {
            LoadRecentContests();
            Info("最近比赛刷新完成 --"+ new Date().toLocaleTimeString(),"alert-success");
        }
        if (status==-1)
            Info("最近比赛刷新失败("+addition+")","alert-error");
    });
}
//Settings
function Save_Settings() {
	My_POJ_ID=$("#txt_POJ_ID").val();
	My_ZOJ_ID=$("#txt_ZOJ_ID").val();
	localStorage["My_POJ_ID"] =My_POJ_ID;
	localStorage["My_ZOJ_ID"] =My_ZOJ_ID;
	Save_AC("POJ",My_POJ_ID);
	Save_AC("ZOJ",My_ZOJ_ID);
	localStorage["Default_OJ"] =$("#default_OJ").val();
	localStorage["POJ_Agency"] =$("#POJ_Agency").val();
	localStorage["ZOJ_Agency"] =$("#ZOJ_Agency").val();
	Save_ToDoList();
	Save_Follow();
	Info("设置成功保存","alert-success");
}
function Load_Settings() {
	My_POJ_ID=localStorage["My_POJ_ID"];
	My_ZOJ_ID=localStorage["My_ZOJ_ID"];
	//
	$("#txt_POJ_ID").val(My_POJ_ID);
	$("#txt_ZOJ_ID").val(My_ZOJ_ID);
	Load_AC("POJ",My_POJ_ID);
	Load_AC("ZOJ",My_ZOJ_ID);
	Select_by_Text("#default_OJ",localStorage["Default_OJ"]);
	Select_by_Text("#POJ_Agency",localStorage["POJ_Agency"]);
	Select_by_Text("#ZOJ_Agency",localStorage["ZOJ_Agency"]);
	Load_ToDoList();
	Load_Follow();
    LoadRecentContests();
	if (localStorage["Default_OJ"]!=null)
		Info("设置成功加载","alert-success");
	calc_sum();
}
//Event
$("#but_refresh_POJ").click(Refresh_POJbyID);
$("#but_refresh_ZOJ").click(Refresh_ZOJbyID);
$("#but_refresh_All").click(function(){Refresh_POJbyID();Refresh_ZOJbyID();});
$("#Add_Follow_Add").click(New_Follow);
$("#Follow_RefAll").click(Follow_RefAll);
$("#RefreshRecentContests").click(RefreshRecentContests);
document.getElementById("txt_POJ_ID").onkeypress = function(e){if(e.keyCode == 13){Refresh_POJbyID(); } };
document.getElementById("txt_ZOJ_ID").onkeypress = function(e){if(e.keyCode == 13){Refresh_ZOJbyID(); } };
$("#but_save_setting").click(Save_Settings);
$("#but_load_setting").click(Load_Settings);
$("#btn_add_line").click(new_Todo_item);
$("#Modal_Save").click(function(){Save_Todo_item()});
Load_Settings();
$('.tool_tip').tooltip();
$(".versionNumber").text(chrome.app.getDetails().version);
$('a[href=#tab_'+getQueryStr("tab")+']').tab('show');