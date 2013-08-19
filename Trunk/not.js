// 注意：没有必要调用 webkitNotifications.checkPermission()。
// 声明了 notifications 权限的扩展程序总是允许创建通知。

// 创建一个简单的文本通知：
var notification = webkitNotifications.createNotification(
  'Ac.png',  // 图标 URL，可以是相对路径
  '桌面通知Demo！',  // 通知标题
  '你AC了一道大大大水题'  // 通知正文文本
);

// 或者创建 HTML 通知：
//var notification = webkitNotifications.createHTMLNotification(
//  'notification.html'  // HTML 的 URL，可以是相对路径
//);

// 然后显示通知。
notification.show();
