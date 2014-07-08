(function() {
  var Game, GameControls, canvas, conf, controls, ctx, game, game_loop,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  conf = {
    size: 5,
    colors: ["#69D2E7", "#A7DBD8", "#E0E4CC", "#F38630"],
    nb_levels: 100
  };

  GameControls = (function() {
    function GameControls(canvas) {
      this.touch_end = __bind(this.touch_end, this);
      this.touch_move = __bind(this.touch_move, this);
      this.touch_start = __bind(this.touch_start, this);
      this.x = {
        start: null,
        end: null
      };
      this.swipe = "";
      canvas.addEventListener('touchstart', this.touch_start);
      canvas.addEventListener('touchend', this.touch_end);
      canvas.addEventListener('touchmove', this.touch_move);
      document.ontouchmove = function(e) {
        return e.preventDefault();
      };
    }

    GameControls.prototype.touch_start = function(e) {
      return this.x.start = e.touches[0].clientX;
    };

    GameControls.prototype.touch_move = function(e) {
      return this.x.end = e.touches[0].clientX;
    };

    GameControls.prototype.touch_end = function(e) {
      this.swipe = this.x.end > this.x.start ? "right" : "left";
      return this.gesture(this.swipe);
    };

    GameControls.prototype.gesture = function() {};

    return GameControls;

  })();

  Game = (function() {
    function Game(colors, size, nb_levels, controls) {
      this.colors = colors;
      this.size = size;
      this.nb_levels = nb_levels;
      this.controls = controls;
      this.draw = __bind(this.draw, this);
      this.gesture = __bind(this.gesture, this);
      this.level_index = 1;
      this.score = 0;
      this.build_levels();
      this.controls.gesture = this.gesture;
      this.hidden = false;
    }

    Game.prototype.gesture = function(type) {
      if ((type === "right" && this.levels[this.level_index].join("") === this.levels[this.level_index - 1].join("")) || (type === "left" && this.levels[this.level_index].join("") !== this.levels[this.level_index - 1].join(""))) {
        this.score += 1;
      }
      this.level_index++;
      this.hidden = true;
      return setTimeout((function(_this) {
        return function() {
          return _this.hidden = false;
        };
      })(this), 500);
    };

    Game.prototype.level = function() {
      return this.levels[this.level_index];
    };

    Game.prototype.draw = function(canvas, ctx) {
      var color, i, j, width, _i, _j, _ref, _ref1;
      canvas.width = canvas.width;
      if (!this.hidden) {
        for (i = _i = 0, _ref = this.size; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          for (j = _j = 0, _ref1 = this.size; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
            width = canvas.width * 0.8 / this.size;
            color = this.level()[i * 3 + j];
            ctx.fillStyle = this.level()[i * 3 + j];
            ctx.fillRect(i * width, j * width, width, width);
          }
        }
      }
      ctx.font = "20px Verdana";
      ctx.fillStyle = "black";
      return ctx.fillText(this.score, 550, 100);
    };

    Game.prototype.build_levels = function() {
      var i, indice, j, _i, _j, _ref, _ref1, _results, _results1;
      this.levels = [];
      this.levels[0] = (function() {
        _results = [];
        for (var _i = 0, _ref = this.size * this.size; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map((function(_this) {
        return function() {
          return _this.colors[parseInt(Math.random() * _this.colors.length, 10)];
        };
      })(this));
      _results1 = [];
      for (i = _j = 1, _ref1 = this.nb_levels; 1 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 1 <= _ref1 ? ++_j : --_j) {
        this.levels[i] = (function() {
          var _k, _len, _ref2, _results2;
          _ref2 = this.levels[i - 1];
          _results2 = [];
          for (_k = 0, _len = _ref2.length; _k < _len; _k++) {
            j = _ref2[_k];
            _results2.push(j);
          }
          return _results2;
        }).call(this);
        indice = parseInt(Math.random() * this.size * this.size, 10);
        if (Math.random() > 0.5) {
          _results1.push(this.levels[i][indice] = this.colors[parseInt(Math.random() * this.colors.length, 10)]);
        } else {
          _results1.push(void 0);
        }
      }
      return _results1;
    };

    return Game;

  })();

  canvas = document.getElementById("canvas");

  ctx = canvas.getContext("2d");

  controls = new GameControls(canvas);

  game = new Game(conf.colors, conf.size, conf.nb_levels, controls);

  game_loop = function() {
    game.draw(canvas, ctx);
    return requestAnimationFrame(game_loop);
  };

  game_loop();

}).call(this);
