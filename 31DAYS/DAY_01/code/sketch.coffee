size = 800
max_weight = 80


colors = [
  0xDDF57373
  0xDDF5AE73
  0xDD459393
  0xDD5CC45C
  0xDD8F0D0D
  0xDDB56726
  0xDD176C6C
  0xDD1F911F
  0xDDD34747
  0xDDD38647
  0xDD2B7E7E
  0xDD39A939
]
notes = {}
tones = {}

sketch = (processing) ->
  
  play_file = (file) ->
    MIDI.Player.loadFile file, () ->
      MIDI.Player.start()

      MIDI.Player.addListener (data) ->
        notes[data.note] ?= 0
        notes[data.note] += 10 if data.message = 144

        my_note = data.note
        steps = 81
        for i in [1...steps]
          do (my_note, i) ->
            setTimeout () ->
              notes[my_note] -= 0.125 if notes[my_note] > 0
            , 30 * i

  play = (file) ->
    MIDI.loadPlugin
      soundfontUrl: "./libs/MIDI.js/soundfont/",
      instrument: "acoustic_grand_piano",
      callback: () ->
        play_file(file)

  processing.setup = () ->
    play("data/988-aria.mid")


  processing.draw = () ->
    processing.background(255)

    for note, val of notes
      if val > 0
        octave = parseInt(note / 12)
        notee = note % 12
        processing.noStroke()
        color = colors[notee % colors.length]
        processing.fill(color)
        processing.ellipse (notee + 1) * 60, (octave - 2) * 100, 5 * val, 5 * val




canvas = document.getElementById "canvas"
p = new Processing(canvas, sketch)
p.size(size, size)
