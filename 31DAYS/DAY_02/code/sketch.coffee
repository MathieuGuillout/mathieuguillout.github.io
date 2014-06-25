configuration = 
  sequencer_intervals: [ 4, 8, 16, 32, 64 ]
  interval_radius: 60
  radius: 30
  size: 800
  tempo: 70

class Metronome
  constructor: (@tempo) ->
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
    @metronome = new Metronome(configuration.tempo)
    @metronome.start()

  draw_sequencer = (interval, j) =>
    for i in [0..interval]
      angle = i * (2 * Math.PI / interval)
      x = (configuration.size / 2) + Math.cos(angle) * (j + 1) * configuration.interval_radius
      y = (configuration.size / 2) + Math.sin(angle) * (j + 1) * configuration.interval_radius
      processing.noFill()
      processing.stroke(0)
      if @metronome.slice is i * (@metronome.max_interval / interval)
        processing.fill(0)
      processing.ellipse x, y, configuration.radius, configuration.radius


  draw_sequencers = () ->
    draw_sequencer(configuration.sequencer_intervals[i], i) for i in [0..configuration.sequencer_intervals.length]
      

  processing.draw = () ->
    processing.background(255)
    draw_sequencers()


canvas = document.getElementById "canvas"
p = new Processing(canvas, sketch)
p.size(configuration.size, configuration.size)
