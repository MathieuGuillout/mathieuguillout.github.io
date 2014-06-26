configuration = 
  sequencer_intervals: [ 4, 8, 16, 32, 64 ]
  interval_radius: 65
  radius: 30
  size: 800
  tempo: 70
  selected_color: 0x22000000
  instruments: [
    { color: 0xDDF57373 }
    { color: 0xDDF5AE73 }
    { color: 0xDD459393 }
    { color: 0xDD5CC45C }
  ]

class SoundPlayer
  constructor: (@ready_callback) ->
    createjs.Sound.alternateExtensions = ["mp3"]
    createjs.Sound.addEventListener "fileload", (createjs.proxy @sound_loaded, @)
    for i in [1..configuration.instruments.length]
      createjs.Sound.registerSound "data/#{i}.mp3", i 

    @ready = false
    @sounds = 0

  sound_loaded: () ->
    @sounds += 1
    if @sounds is configuration.instruments.length
      @ready_callback() if @ready_callback?
      @ready = true

class Instrument 
  constructor: (@color, @num, @sound_player) ->
    @radius = 80
    @x = 40
    @y = (@num + 1) * 100
    @selected = false

  draw: (processing) ->
    processing.stroke(if @selected then 0 else @color)
    processing.fill(@color)
    processing.ellipse @x, @y, @radius, @radius 

  play: () ->
    console.log "BING"
    createjs.Sound.play(@num)

  tap: (x, y) ->
    if Math.sqrt(Math.pow(@x - x, 2) + Math.pow(@y - y, 2)) < @radius / 2
      @selected = not(@selected)
      true
    else
      false

  unselect: () ->
    @selected = false

class InstrumentPicker
  constructor: (config, @sound_player) ->
    @selected_instrument = null
    @instruments = []
    for i in [0...config.length]
      @instruments.push(new Instrument(config[i].color, i, @sound_player))

  draw: (processing) ->
    instrument.draw(processing) for instrument in @instruments
  
  tap: (x, y) ->
    for instrument in @instruments
      if instrument.tap(x, y)
        @selected_instrument = instrument
        for other_instrument in @instruments
          other_instrument.unselect() if other_instrument.num != instrument.num
        break


class Note
  constructor: (@note, @x, @y, @sound_player) ->
    @radius = configuration.radius
    @color = 0


  draw: (processing, metronome, selected) ->
    processing.noFill()
    processing.stroke(0)
    processing.fill(@color) if @note is 1
    processing.fill(configuration.selected_color) if selected
    r = (if selected then 1.1 else 1) * @radius
    processing.ellipse @x, @y, r, r
    if selected and @instrument
      @instrument.play()


  tap: (x, y, instrument) ->
    if instrument and Math.sqrt(Math.pow(@x - x, 2) + Math.pow(@y - y, 2)) < @radius / 2
      @note = if @note is 1 then 0 else 1
      @color = instrument.color
      @instrument = instrument

class Sequence
  constructor: (@interval, @radius) ->
    @notes = []
    for i in [0...@interval]
      angle = i * (2 * Math.PI / @interval)
      x = 50 + (configuration.size / 2) + Math.cos(angle) * (@radius + 1) * configuration.interval_radius
      y = (configuration.size / 2) + Math.sin(angle) * (@radius + 1) * configuration.interval_radius
      @notes.push new Note(0, x, y, @sound_player)


  draw: (processing, metronome) ->
    for i in [0...@notes.length]
      note = @notes[i]
      selected = metronome.slice is i * (metronome.max_interval / @interval)
      note.draw(processing, metronome, selected)


  tap: (x, y, instrument) ->
    note.tap(x, y, instrument) for note in @notes

class Sequencer 
  constructor: (@intervals) ->
    @sequences = []
    for radius in [0..@intervals.length]
      interval = @intervals[radius]
      @sequences.push new Sequence(interval, radius)

  draw: (processing, metronome) ->
    sequence.draw(processing, metronome) for sequence in @sequences

  tap: (x, y, instrument) ->
    sequence.tap(x, y, instrument) for sequence in @sequences


class Metronome
  constructor: (@tempo) ->
    @tempo = tempo
    @max_interval = Math.max.apply(null, configuration.sequencer_intervals)
    @running = false
  
  start: () ->
    @slice = -1
    @running = true
    @beat()

  beat: () ->
    @slice += 1 
    @slice = @slice % @max_interval
    setTimeout () =>
      @beat() if @running
    , ((60 / @tempo) * 1000) / (@max_interval / 4)

  stop: () ->
    @running = false

sketch = (processing) ->
  
  processing.setup = () =>
    @sound_player = new SoundPlayer()
    @metronome = new Metronome(configuration.tempo)
    @sequencer = new Sequencer(configuration.sequencer_intervals)
    @instrument_picker = new InstrumentPicker(configuration.instruments, @sound_player)
    metro = @metronome
    @sound_player.ready_callback  = () ->
      metro.start()

  processing.draw = () =>
    processing.background(255)
    @sequencer.draw(processing, @metronome)
    @instrument_picker.draw(processing)

  processing.mousePressed = () =>
    [ x, y ] = [ processing.mouseX, processing.mouseY ]
    @instrument_picker.tap(x, y)
    @sequencer.tap(x, y, @instrument_picker.selected_instrument)


canvas = document.getElementById "canvas"
p = new Processing(canvas, sketch)
p.size(configuration.size, configuration.size)
