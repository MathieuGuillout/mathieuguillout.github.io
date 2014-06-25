(function() {
  var canvas, colors, max_weight, notes, p, size, sketch, tones;

  size = 800;

  max_weight = 80;

  colors = [0xDDF57373, 0xDDF5AE73, 0xDD459393, 0xDD5CC45C, 0xDD8F0D0D, 0xDDB56726, 0xDD176C6C, 0xDD1F911F, 0xDDD34747, 0xDDD38647, 0xDD2B7E7E, 0xDD39A939];

  notes = {};

  tones = {};

  sketch = function(processing) {
    var play, play_file;
    play_file = function(file) {
      return MIDI.Player.loadFile(file, function() {
        MIDI.Player.start();
        return MIDI.Player.addListener(function(data) {
          var i, my_note, steps, _i, _name, _results;
          if (notes[_name = data.note] == null) {
            notes[_name] = 0;
          }
          if (data.message = 144) {
            notes[data.note] += 10;
          }
          my_note = data.note;
          steps = 81;
          _results = [];
          for (i = _i = 1; 1 <= steps ? _i < steps : _i > steps; i = 1 <= steps ? ++_i : --_i) {
            _results.push((function(my_note, i) {
              return setTimeout(function() {
                if (notes[my_note] > 0) {
                  return notes[my_note] -= 0.125;
                }
              }, 30 * i);
            })(my_note, i));
          }
          return _results;
        });
      });
    };
    play = function(file) {
      return MIDI.loadPlugin({
        soundfontUrl: "./libs/MIDI.js/soundfont/",
        instrument: "acoustic_grand_piano",
        callback: function() {
          return play_file(file);
        }
      });
    };
    processing.setup = function() {
      return play("data/988-aria.mid");
    };
    return processing.draw = function() {
      var color, note, notee, octave, val, _results;
      processing.background(255);
      _results = [];
      for (note in notes) {
        val = notes[note];
        if (val > 0) {
          octave = parseInt(note / 12);
          notee = note % 12;
          processing.noStroke();
          color = colors[notee % colors.length];
          processing.fill(color);
          _results.push(processing.ellipse((notee + 1) * 60, (octave - 2) * 100, 5 * val, 5 * val));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
  };

  canvas = document.getElementById("canvas");

  p = new Processing(canvas, sketch);

  p.size(size, size);

}).call(this);
