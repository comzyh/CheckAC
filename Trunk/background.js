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
chrome.extension.onRequest.addListener(RequestHandle);