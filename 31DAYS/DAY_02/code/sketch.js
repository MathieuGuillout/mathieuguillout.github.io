(function() {
  var Instrument, InstrumentPicker, Metronome, Note, Sequence, Sequencer, canvas, configuration, p, sketch;

  configuration = {
    sequencer_intervals: [4, 8, 16, 32, 64],
    interval_radius: 65,
    radius: 30,
    size: 800,
    tempo: 70,
    instruments: [
      {
        color: 0xDDF57373
      }, {
        color: 0xDDF5AE73
      }, {
        color: 0xDD459393
      }, {
        color: 0xDD5CC45C
      }
    ]
  };

  Instrument = (function() {
    function Instrument(color, num) {
      this.color = color;
      this.num = num;
      this.radius = 80;
      this.x = 40;
      this.y = (this.num + 1) * 100;
      this.selected = false;
    }

    Instrument.prototype.draw = function(processing) {
      processing.stroke(this.selected ? 0 : this.color);
      processing.fill(this.color);
      return processing.ellipse(this.x, this.y, this.radius, this.radius);
    };

    Instrument.prototype.tap = function(x, y) {
      if (Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2)) < this.radius / 2) {
        this.selected = !this.selected;
        return true;
      } else {
        return false;
      }
    };

    Instrument.prototype.unselect = function() {
      return this.selected = false;
    };

    return Instrument;

  })();

  InstrumentPicker = (function() {
    function InstrumentPicker(config) {
      var i, _i, _ref;
      this.selected_instrument = null;
      this.instruments = [];
      for (i = _i = 0, _ref = config.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.instruments.push(new Instrument(config[i].color, i));
      }
    }

    InstrumentPicker.prototype.draw = function(processing) {
      var instrument, _i, _len, _ref, _results;
      _ref = this.instruments;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        instrument = _ref[_i];
        _results.push(instrument.draw(processing));
      }
      return _results;
    };

    InstrumentPicker.prototype.tap = function(x, y) {
      var instrument, other_instrument, _i, _j, _len, _len1, _ref, _ref1, _results;
      _ref = this.instruments;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        instrument = _ref[_i];
        if (instrument.tap(x, y)) {
          this.selected_instrument = instrument;
          _ref1 = this.instruments;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            other_instrument = _ref1[_j];
            if (other_instrument.num !== instrument.num) {
              other_instrument.unselect();
            }
          }
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return InstrumentPicker;

  })();

  Note = (function() {
    function Note(note, x, y) {
      this.note = note;
      this.x = x;
      this.y = y;
      this.radius = configuration.radius;
      this.color = 0;
    }

    Note.prototype.draw = function(processing, metronome, selected) {
      processing.noFill();
      processing.stroke(0);
      if (this.note === 1) {
        processing.fill(this.color);
      }
      if (selected) {
        processing.fill(100);
      }
      return processing.ellipse(this.x, this.y, this.radius, this.radius);
    };

    Note.prototype.tap = function(x, y, instrument) {
      if (instrument && Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2)) < this.radius / 2) {
        this.note = this.note === 1 ? 0 : 1;
        return this.color = instrument.color;
      }
    };

    return Note;

  })();

  Sequence = (function() {
    function Sequence(interval, radius) {
      var angle, i, x, y, _i, _ref;
      this.interval = interval;
      this.radius = radius;
      this.notes = [];
      for (i = _i = 0, _ref = this.interval; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        angle = i * (2 * Math.PI / this.interval);
        x = 50 + (configuration.size / 2) + Math.cos(angle) * (this.radius + 1) * configuration.interval_radius;
        y = (configuration.size / 2) + Math.sin(angle) * (this.radius + 1) * configuration.interval_radius;
        this.notes.push(new Note(0, x, y));
      }
    }

    Sequence.prototype.draw = function(processing, metronome) {
      var i, note, selected, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.notes.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        note = this.notes[i];
        selected = metronome.slice === i * (metronome.max_interval / this.interval);
        _results.push(note.draw(processing, metronome, selected));
      }
      return _results;
    };

    Sequence.prototype.tap = function(x, y, instrument) {
      var note, _i, _len, _ref, _results;
      _ref = this.notes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        note = _ref[_i];
        _results.push(note.tap(x, y, instrument));
      }
      return _results;
    };

    return Sequence;

  })();

  Sequencer = (function() {
    function Sequencer(intervals) {
      var interval, radius, _i, _ref;
      this.intervals = intervals;
      this.sequences = [];
      for (radius = _i = 0, _ref = this.intervals.length; 0 <= _ref ? _i <= _ref : _i >= _ref; radius = 0 <= _ref ? ++_i : --_i) {
        interval = this.intervals[radius];
        this.sequences.push(new Sequence(interval, radius));
      }
    }

    Sequencer.prototype.draw = function(processing, metronome) {
      var sequence, _i, _len, _ref, _results;
      _ref = this.sequences;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sequence = _ref[_i];
        _results.push(sequence.draw(processing, metronome));
      }
      return _results;
    };

    Sequencer.prototype.tap = function(x, y, instrument) {
      var sequence, _i, _len, _ref, _results;
      _ref = this.sequences;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sequence = _ref[_i];
        _results.push(sequence.tap(x, y, instrument));
      }
      return _results;
    };

    return Sequencer;

  })();

  Metronome = (function() {
    function Metronome(tempo) {
      this.tempo = tempo;
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
    processing.setup = (function(_this) {
      return function() {
        _this.metronome = new Metronome(configuration.tempo);
        _this.sequencer = new Sequencer(configuration.sequencer_intervals);
        _this.instrument_picker = new InstrumentPicker(configuration.instruments);
        return _this.metronome.start();
      };
    })(this);
    processing.draw = (function(_this) {
      return function() {
        processing.background(255);
        _this.sequencer.draw(processing, _this.metronome);
        return _this.instrument_picker.draw(processing);
      };
    })(this);
    return processing.mousePressed = (function(_this) {
      return function() {
        var x, y, _ref;
        _ref = [processing.mouseX, processing.mouseY], x = _ref[0], y = _ref[1];
        _this.instrument_picker.tap(x, y);
        return _this.sequencer.tap(x, y, _this.instrument_picker.selected_instrument);
      };
    })(this);
  };

  canvas = document.getElementById("canvas");

  p = new Processing(canvas, sketch);

  p.size(configuration.size, configuration.size);

}).call(this);
