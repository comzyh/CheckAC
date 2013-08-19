// JavaScript Document
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
function POJ_res(){
	r=this;
	if (r.readyState == 4) { // 4 = "loaded"
		if (r.status == 200) {
			// 200 = OK
			str = r.responseText;
			strs = str.match(/p\(\d{4}\)/g);
			$("#POJ_AC_Number").text(strs.length);
			$("#POJ_AC").val("");
			for (i = 0; i < strs.length; i++) {
				document.getElementById("POJ_AC").value += strs[i].match(/\d{4}/)[0] + " "; //	  	table.insertBefore(div)
			}
			Save_AC("POJ",$("#txt_POJ_ID").val());
			var myDate = new Date();
			Info( "POJ于"+	myDate.toLocaleTimeString() + "刷新","alert-success");
			$("#POJ_line").addClass("success");
			calc_sum();
		} else 
			Info("从POJ读取信息失败,可能是网络故障","alert-error");
	}
	else if (r.readyState == 3)
		Info("正在解析响应内容","alert-info");
	else if (r.readyState == 1)
		Info("正在发送请求","alert-info");
}
function Refresh_POJbyID() {
	txtID = $("#txt_POJ_ID").val();
	loadXMLDoc("http://poj.org/userstatus?user_id=" + txtID,POJ_res);
}
//-----ZOJ-----
function ZOJ_res2(){
	r=this;
	if (r.readyState == 4) { // 4 = "loaded"
		if (r.status == 200) {
			// 200 = OK
			str = r.responseText;
			strs = str.match(/\d{4}\">\d{4}/g);
			$("#ZOJ_AC_Number").text(strs.length);
			$("#ZOJ_AC").val("");
			ZOJ_AC="";
			for (i = 0; i < strs.length; i++)
				ZOJ_AC+=strs[i].match(/\d{4}/)[0] + " ";
			$("#ZOJ_AC").val(ZOJ_AC);
			Save_AC("ZOJ",$("#txt_ZOJ_ID").val());
			var myDate = new Date();
			Info( "ZOJ于"+	myDate.toLocaleTimeString() + "刷新","alert-success");
			$("#ZOJ_line").addClass("success");
			calc_sum();
		} else 
			Info("从POJ读取信息失败,可能是网络故障","alert-error");
	}
	else if (this.readyState == 3)
		Info("正在解析响应内容","alert-info");
	else if (this.readyState == 1)
		Info("正在发送请求","alert-info");
}
function ZOJ_res1(){
	r=this;
	if (r.readyState == 4) { // 4 = "loaded"
		if (r.status == 200) {
			// 200 = OK
			str = r.responseText;
			ID_Code = str.match(/userId=\d+/);
			ID_Code=ID_Code[0].match(/\d+/);
			Info(ID_Code,"alert-success");
			loadXMLDoc("http://acm.zju.edu.cn/onlinejudge/showUserStatus.do?userId="+ ID_Code,ZOJ_res2);
		} else 
			Info("从POJ读取信息失败,可能是网络故障","alert-error");
	}
	else if (this.readyState == 3)
		Info("正在解析响应内容","alert-info");
	else if (this.readyState == 1)
		Info("正在发送请求","alert-info");
}
function Refresh_ZOJbyID()
{
	txtID = $("#txt_ZOJ_ID").val();
	loadXMLDoc("http://acm.zju.edu.cn/onlinejudge/showRuns.do?contestId=1&handle="+ txtID,ZOJ_res1);
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
function addline(PID,Comment,edit)
{
	var newRow = "<tr><td class=\"Problem\"><span class=\"ToDo_PID\">PID</span></td><td class=\"Comment\"><span class=\"ToDo_Comment\">Comment</span></td></tr>";
    var line=$(newRow);
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
	text="";
	for (var i=0;i<lines.length;i++)
	{
		text+=$(lines[i]).find(".ToDo_PID").text();
		text+=";";
		text+=$(lines[i]).find(".ToDo_Comment").text();
		text+="\n";
	}
	localStorage["ToDO_List"]=text;
}
function Load_ToDoList()
{
	text=localStorage["ToDO_List"];
	if(text==null)
		return;
	$("#TestAera").val(text);
	lines=text.split("\n");
	for (var i=0;i<lines.length-1;i++)
	{
		sp=lines[i].split(";");
		addline(sp[0],sp[1]);
	}

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
	localStorage["POJ_Agency"] =$("#POJ_Agency").val();
	Save_ToDoList();
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
	if (localStorage["Default_OJ"]!=null)
		Info("设置成功加载","alert-success");
	calc_sum();
}
//Event
$("#but_refresh_POJ").click(Refresh_POJbyID);
$("#but_refresh_ZOJ").click(Refresh_ZOJbyID);
$("#but_refresh_All").click(function(){Refresh_POJbyID();Refresh_ZOJbyID();});
document.getElementById("txt_POJ_ID").onkeypress = function(e){if(e.keyCode == 13){Refresh_POJbyID(); } };
document.getElementById("txt_ZOJ_ID").onkeypress = function(e){if(e.keyCode == 13){Refresh_ZOJbyID(); } };
$("#but_save_setting").click(Save_Settings);
$("#but_load_setting").click(Load_Settings);
$("#btn_add_line").click(new_Todo_item);
$("#Modal_Save").click(function(){Save_Todo_item()});
Load_Settings();
$('.tool_tip').tooltip();
$(".versionNumber").text(chrome.app.getDetails().version);