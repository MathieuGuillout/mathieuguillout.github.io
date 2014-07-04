(function() {
  var Clock, Hand, canvas, clocks, configuration, p, sketch;

  configuration = {
    size: {
      width: 1500,
      height: 600
    },
    hands: [[2, 60 * 24, 8], [1.5, 60, 4], [1.1, 1, 2]],
    colors: [0xDD5CC45C, 0xDDF57373, 0xDDF5AE73, 0xDD459393]
  };

  Hand = (function() {
    function Hand(_arg) {
      this.center = _arg.center, this.size = _arg.size, this.speed = _arg.speed, this.width = _arg.width, this.color = _arg.color, this.start = _arg.start, this.reverse = _arg.reverse;
      this.time_init = new Date();
    }

    Hand.prototype.draw = function(processing) {
      var angle, elapsed_time, target;
      elapsed_time = (new Date() - this.time_init) / 1000;
      angle = this.start + (this.reverse ? 1 : -1) * (2 * Math.PI * (elapsed_time % this.speed) / this.speed);
      target = {
        x: this.center.x + Math.cos(angle) * this.size,
        y: this.center.y - Math.sin(angle) * this.size
      };
      processing.stroke(this.color);
      processing.strokeWeight(this.width);
      return processing.line(this.center.x, this.center.y, target.x, target.y);
    };

    return Hand;

  })();

  Clock = (function() {
    function Clock(_arg) {
      this.center = _arg.center, this.size = _arg.size, this.speed = _arg.speed, this.color = _arg.color, this.start = _arg.start, this.reverse = _arg.reverse;
      this.hands = [];
      configuration.hands.forEach((function(_this) {
        return function(conf) {
          return _this.hands.push(new Hand({
            center: _this.center,
            size: _this.size / conf[0],
            speed: _this.speed * conf[1],
            width: conf[2],
            color: _this.color,
            start: _this.start,
            reverse: _this.reverse
          }));
        };
      })(this));
    }

    Clock.prototype.shrink = function() {
      this.size -= 0.1;
      if (this.size < 0) {
        return this.size = 0;
      }
    };

    Clock.prototype.draw = function(processing) {
      processing.stroke(this.color);
      processing.strokeWeight(1);
      processing.fill(this.color, 10);
      processing.ellipse(this.center.x, this.center.y, this.size * 2, this.size * 2);
      return this.hands.forEach(function(hand) {
        return hand.draw(processing);
      });
    };

    return Clock;

  })();

  clocks = [];

  sketch = function(processing) {
    var add_clock;
    processing.setup = (function(_this) {
      return function() {};
    })(this);
    processing.draw = (function(_this) {
      return function() {
        processing.background(255);
        return clocks.forEach(function(clock) {
          return clock.draw(processing);
        });
      };
    })(this);
    add_clock = function() {
      return clocks.push(new Clock({
        center: {
          x: processing.mouseX,
          y: processing.mouseY
        },
        size: 25 + Math.random() * 100,
        speed: Math.random() * 10,
        color: configuration.colors[parseInt(Math.random() * configuration.colors.length)],
        start: Math.random() * Math.PI * 2,
        reverse: Math.random() > 0.5
      }));
    };
    processing.mouseDragged = add_clock;
    return processing.mousePressed = add_clock;
  };

  canvas = document.getElementById("canvas");

  p = new Processing(canvas, sketch);

  p.size(configuration.size.width, configuration.size.height);

}).call(this);
