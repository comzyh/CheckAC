//插入页面元素页面
var poj_ac;
var zoj_ac;
table = document.getElementsByTagName("a");
function exist(ac_list,id)
{
	var b=0,e=ac_list.length;
	while (b<e)
	{
		k=Math.floor((b+e)/2);
		if (ac_list[k]<id)
			b=k+1;
		else if (ac_list[k]>id)
			e=k-1;
		else
			return ac_list[k]==id;

	}
	return ac_list[b]==id;
}
function AC_response(response)
{
	poj_ac=response.POJ_AC_list.match(/\d{4}/g);
    zoj_ac=response.ZOJ_AC_list.match(/\d{4}/g);
	for (i=0;i<table.length;i++)
	{
		if (table[i].href.endsWith("#") || table[i].href.indexOf("Submit") != -1 || table[i].href.indexOf("submit") != -1)
			continue;
		poj_id = table[i].href.match(/\/Problem\/Pku\/\d{4}|\/problem\?id=\d{4}/);//POJ
		zoj_id = table[i].href.match(/\/Problem\/Zju\/\d{4}|\/onlinejudge\/showProblem.do\?problemCode=\d{4}/);//ZOJ
        if (zoj_id==null && table[i].href.match(/\/onlinejudge\/showProblem.do\?problemId=\d+/)!=null)
            zoj_id=table[i].innerHTML.match(/\d{4}/);
		if (poj_id ==null && zoj_id==null)
			continue;
        div = document.createElement("img");
		if ((poj_id!=null && exist(poj_ac,poj_id[0].match(/\d{4}/)[0]))||(zoj_id!=null && exist(zoj_ac,zoj_id[0].match(/\d{4}/)[0])))
			div.src=chrome.extension.getURL("images/check.png");
		else
			div.src=chrome.extension.getURL("images/nocheck.png");
        table[i].parentElement.insertBefore(div,table[i]);
	}
}
chrome.extension.sendRequest({type:"All_AC_list"},AC_response);


