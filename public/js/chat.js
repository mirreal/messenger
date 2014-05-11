$(function() {
  var socket = io.connect();
  var from = $.cookie('user');
  var to = 'all';

  socket.emit('online', {user: from});
  socket.on('online', function (data) {

    if (data.user != from) {
      var sysMsg = '<div class="sysMsg">系统消息(' + now() + '):' + '用户 <span id="from">' + data.user + '</span> 上线了！</div>';
    } else {
      var sysMsg = '<div class="sysMsg">系统消息(' + now() + '):你已经上线！</div>';
    }
    $("#contents").append(sysMsg + "<br/>");
    updateUsers(data.users);
    updateFromAndTo();
  });

  socket.on('message', function (data) {

    if (data.to == 'all') {
      $("#contents").append('<div><img src="img/vincent.jpg" width="32"> </img>' + data.from + '(' + now() + ')对所有人说：<br/>' + data.msg + '</div><br />');
    }

    if (data.to == from) {
      $("#contents").append('<div class="two">' + data.from + '(' + now() + ')对你说：<br/>' + data.msg + '</div><br />');
    }
  });

  socket.on('offline', function (data) {
    var sysMsg = '<div class="sysMsg">系统消息(' + now() + '):' + '用户<span id="from"> ' + data.user + '</span> 下线了！</div>';
    $("#contents").append(sysMsg + "<br/>");
    updateUsers(data.users);
    if (data.user == to) {
      to = "all";
    }
    updateFromAndTo();
  });

  socket.on('disconnect', function() {
    var sysMsg = '<div class="sysMsg">系统消息: 连接服务器失败！</div>';
    $("#contents").append(sysMsg + "<br/>");
    $("#list").empty();
  });

  socket.on('reconnect', function() {
    var sysMsgMsg = '<div class="sysMsg">系统消息: 重新连接服务器！</div>';
    $("#contents").append(sysMsg + "<br/>");
    socket.emit('online', {user: from});
  });

  function updateUsers(users) {
    $("#list").empty().append('<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-b ui-first-child">Online</li>'
      +'<li title="点击聊天" alt="all" onselectstart="return false" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#room" class="ui-link-inherit">All</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
    
    users.forEach(function(item) {
      $("#list").append('<li alt="' + item + '" title="点击聊天" onselectstart="return false" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c">'
        + '<div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#room" class="ui-link-inherit">'
        + item + '</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
    });

    $("#list > li").click(function() {
      if ($(this).attr('alt') != from) {
        to = $(this).attr('alt');
        updateFromAndTo();
      }
    });
  }

  function updateFromAndTo() {
    $("#from").html(from);
    $("#to").html(to == "all" ? "所有人" : to);
  }

  function now() {
    var date = new Date();
    var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' '
    + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes())
    + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
    return time;
  }

  $("#send").click(function() {
    var msg = $("#messageInput").val();
    if (msg == "") return;
    if (to == "all") {
      $("#contents").append('<div id="cont"><img src="img/vincent.jpg" width="32"> </img>你(' + now() + ')对所有人说：<br/>' + msg + '</div><br />');
    } else {
      $("#contents").append('<div class="two">你(' + now() + ')对 ' + to + ' 说：<br/>' + msg + '</div><br />');
    }
    socket.emit('message', {from: from, to: to, msg: msg});
    $("#cont").focus();
    $("#messageInput").val("").focus();
  });

});
