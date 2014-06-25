(function() {
  var Metronome, canvas, configuration, p, sketch;

  configuration = {
    sequencer_intervals: [4, 8, 16, 32, 64],
    interval_radius: 60,
    radius: 30,
    size: 800,
    tempo: 70
  };

  Metronome = (function() {
    function Metronome(tempo) {
      this.tempo = tempo;
      this.max_interval = Math.max.apply(null, configuration.sequencer_intervals);
      this.running = false;
    }

    Metronome.prototype.start = function() {
      this.slice = -1;
      this.running = true;
      return this.beat();
    };

    Metronome.prototype.beat = function() {
      this.slice += 1;
      this.slice = this.slice % this.max_interval;
      return setTimeout((function(_this) {
        return function() {
          if (_this.running) {
            return _this.beat();
          }
        };
      })(this), ((60 / this.tempo) * 1000) / (this.max_interval / 4));
    };

    Metronome.prototype.stop = function() {
      return this.running = false;
    };

    return Metronome;

  })();

  sketch = function(processing) {
    var draw_sequencer, draw_sequencers;
    processing.setup = (function(_this) {
      return function() {
        _this.metronome = new Metronome(configuration.tempo);
        return _this.metronome.start();
      };
    })(this);
    draw_sequencer = (function(_this) {
      return function(interval, j) {
        var angle, i, x, y, _i, _results;
        _results = [];
        for (i = _i = 0; 0 <= interval ? _i <= interval : _i >= interval; i = 0 <= interval ? ++_i : --_i) {
          angle = i * (2 * Math.PI / interval);
          x = (configuration.size / 2) + Math.cos(angle) * (j + 1) * configuration.interval_radius;
          y = (configuration.size / 2) + Math.sin(angle) * (j + 1) * configuration.interval_radius;
          processing.noFill();
          processing.stroke(0);
          if (_this.metronome.slice === i * (_this.metronome.max_interval / interval)) {
            processing.fill(0);
          }
          _results.push(processing.ellipse(x, y, configuration.radius, configuration.radius));
        }
        return _results;
      };
    })(this);
    draw_sequencers = function() {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = configuration.sequencer_intervals.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(draw_sequencer(configuration.sequencer_intervals[i], i));
      }
      return _results;
    };
    return processing.draw = function() {
      processing.background(255);
      return draw_sequencers();
    };
  };

  canvas = document.getElementById("canvas");

  p = new Processing(canvas, sketch);

  p.size(configuration.size, configuration.size);

}).call(this);
