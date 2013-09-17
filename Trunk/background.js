//消息响应
function RequestHandle(request, sender, sendResponse) {
	console.log(sender.tab ?
		"from a content script:" + sender.tab.url :
		"from the extension");
	My_POJ_ID=localStorage["My_POJ_ID"];
	My_ZOJ_ID=localStorage["My_ZOJ_ID"];
	if (request.type == "POJ_AC_list")
	{
		sendResponse({POJ_AC_list:localStorage["POJ_"+My_POJ_ID+"_AC"]});
	}
	else if (request.type == "ZOJ_AC_list")
	{
		sendResponse({ZOJ_AC_list:localStorage["ZOJ_"+My_ZOJ_ID+"_AC"]});
	}
	else if (request.type == "All_AC_list")
		sendResponse({ZOJ_AC_list:localStorage["ZOJ_"+My_ZOJ_ID+"_AC"],
					  POJ_AC_list:localStorage["POJ_"+My_POJ_ID+"_AC"]
					});
	else
		sendResponse({}); // snub them.
 }
function My_POJ_AC()
{
	My_POJ_ID=localStorage["My_POJ_ID"];
	return localStorage["POJ_"+My_POJ_ID+"_AC"];
}
function My_ZOJ_AC()
{
	My_ZOJ_ID=localStorage["My_ZOJ_ID"];
	return localStorage["ZOJ_"+My_ZOJ_ID+"_AC"];
}
//刷新AC题目
function loadXMLDoc(url,delegate) {
	var xmlhttp = new XMLHttpRequest();
	if (xmlhttp != null) {
		xmlhttp.onreadystatechange =function(){delegate(xmlhttp)};
		xmlhttp.open("GET", url, true);
		xmlhttp.send(null);
	} else {
		alert("你的浏览器不支持XMLHttpRequest");
	}
}
function POJ_res(xmlhttp,ID,delegate){
	r=xmlhttp;
	if (r.readyState == 4) { // 4 = "loaded"
		if (r.status == 200) {
			// 200 = OK
			str = r.responseText;
			strs = str.match(/p\(\d{4}\)/g);
			for (var i=0;i<strs.length;i++)
				strs[i]=strs[i].match(/\d{4}/)[0];
			localStorage["POJ_" + ID + "_AC"] = strs;
			delegate(4);
		} else 
			delegate(-1,r.status);
	}
	else delegate(r.readyState);
}
function Refresh_POJbyID(ID,delegate) {
	loadXMLDoc("http://poj.org/userstatus?user_id=" + ID,function(xhr){
        POJ_res(xhr,ID,delegate);
        });
}
//-----ZOJ-----
function ZOJ_res2(xhr,ID,delegate){
	r=xhr;
	if (r.readyState == 4) { // 4 = "loaded"
		if (r.status == 200) {
			// 200 = OK
			str = r.responseText;
			strs = str.match(/\d{4}\">\d{4}/g);
			for (i = 0; i < strs.length; i++)
				strs[i]=strs[i].match(/\d{4}/)[0];
			localStorage["ZOJ_" + ID + "_AC"] = strs;
			delegate(4);
		} else 
			delegate(-1,r.status);
	}
	else delegate(r.readyState);
}
function ZOJ_res1(xhr,ID,delegate){
	r=xhr;
	if (r.readyState == 4) {
		if (r.status == 200) {
			str = r.responseText;
			ID_Code = str.match(/userId=\d+/);
			ID_Code=ID_Code[0].match(/\d+/);
			delegate(4)	
			loadXMLDoc("http://acm.zju.edu.cn/onlinejudge/showUserStatus.do?userId="+ ID_Code,function(xhr){
                ZOJ_res2(xhr,ID,delegate);
            });
		} else 
			delegate(-1,r.status);
	}
	else delegate(r.readyState);
}
function Refresh_ZOJbyID(ID,delegate)
{
	loadXMLDoc("http://acm.zju.edu.cn/onlinejudge/showRuns.do?contestId=1&handle="+ ID,function(xhr){
        ZOJ_res1(xhr,ID,delegate);
        });
}
//RecentContest
function RefreshRecentContests(delegate)
{
    loadXMLDoc("http://contests.acmicpc.info/contests.json",function(xhr){
        RecentContestsResponse(xhr,delegate);
    });
}
function RecentContestsResponse(xhr,delegate)
{
    console.log(xhr.readyState,status);
    if (xhr.readyState == 4) {
        if (xhr.status == 200) {
            localStorage["RecentContests"] = xhr.responseText;
            delegate(4);
        } else
            delegate(-1,xhr.status);
    }
    else delegate(xhr.readyState);
}
//监听
chrome.extension.onRequest.addListener(RequestHandle);