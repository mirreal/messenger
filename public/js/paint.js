$(function() {
  var canvas = $("#canvas");
  var ctx = canvas.get(0).getContext('2d');

  var touchdown, size, color;
  var last = {};

  touchdown = false;
  size = $("#size").val();
  color = $("#color").val().toLowerCase();

  drawGrid(ctx, "lightgrey", 10, 10);

  $("body").touchmove(function(e) {
    e.preventDefault();
  });
  canvas.touchstart(function(e) {
    touchdown = false;
    clearLast();
  });
  canvas.touchmove(function(e) {
    //if (!touchdown && !e.targetTouches) return;

    var x = e.originalEvent.targetTouches[0].clientX;
    var y = e.originalEvent.targetTouches[0].clientY;
    var bbox = canvas.get(0).getBoundingClientRect();

    x -= bbox.left * (canvas.get(0).width  / bbox.width);
    y -= bbox.top  * (canvas.get(0).height / bbox.height);
    x = parseInt(x)
    y = parseInt(y)

    move(x, y);
  });

  $(window).mouseup(function(e) {
    touchdown = false;
    clearLast();
  });
    
  $(window).mousedown(function(e) {
    touchdown = true;
  });

  canvas.mousemove(function(e) {

    if (!touchdown && !e.targetTouches) return;

    var bbox = canvas.get(0).getBoundingClientRect();
    var x = e.clientX - bbox.left * (canvas.get(0).width  / bbox.width);
    var y = e.clientY - bbox.top  * (canvas.get(0).height / bbox.height);

    move(x, y);
  });

  $("#size").change(function(e) {
    size = $("#size").val();
    touchdown = false;
  })

  $("#color").change(function(e) {
    color = $("#color").val().toLowerCase();
    touchdown = false;
  })
  
  $("#clear").click(function(e) {
    clearScreen();
    socket.emit('clear');
    touchdown = false;
    clearLast();
  })
  
  var socket = new io.connect();

  socket.on('paint', paint);

  function paint(data) {
    drawLine(data.circle, data.sessionId);
    sessionId = data.sessionId;
  }

  socket.on('start', function(data) {
    data.history.forEach(paint);
  });

  socket.on('reset', reset)

  function reset() {
    delete last[sessionId];
  }

  socket.on('clear', clearScreen);

  function clearScreen() {
    drawGrid(ctx, "lightgrey", 10, 10);
  }

  function clearLast() {
    delete last['me'];
    socket.emit('reset');
  }

  function move(x, y) {

    circle = {
      x: x,
      y: y,
      color: color,
      size: size,
      sessionId: 'session'
    };
    
    drawLine(circle);
    socket.emit('paint', circle);
  };
    
  function drawLine(circle, sessionId) {
    sessionId = sessionId || 'me';

    ctx.strokeStyle = circle.color;
    ctx.fillStyle = circle.color;
    ctx.lineWidth = circle.size;
    ctx.lineCap = 'round';

    ctx.beginPath()
    
    if (last[sessionId]) {
      ctx.moveTo(last[sessionId].x, last[sessionId].y);
      ctx.lineTo(circle.x, circle.y);
      ctx.stroke();
    } else {
    
      ctx.moveTo(circle.x, circle.y);
      ctx.arc(circle.x, circle.y, circle.size / 2, 0,  Math.PI*2, true);
      ctx.fill();
    }
    ctx.closePath();

    last[sessionId] = circle;
  }

  function drawGrid(ctx, color, stepx, stepy) {
    var width = canvas.get(0).width;
    var height = canvas.get(0).height;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;

    for (var i = stepx + 0.5; i < width; i += stepx) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
      ctx.closePath();
    }
    
    for (var i = stepy + 0.5; i < height; i += stepy) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
      ctx.closePath();
    }
    ctx.restore();
  }

});
