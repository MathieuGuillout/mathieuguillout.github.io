configuration = 
  size: 
    width: 1500
    height: 600
  hands: [ [2, 60 * 24, 8], [1.5, 60, 4], [1.1, 1, 2 ] ]
  colors: [ 0xDD5CC45C, 0xDDF57373, 0xDDF5AE73, 0xDD459393 ]


class Hand
  constructor: ({ @center, @size, @speed, @width, @color, @start, @reverse }) ->
    @time_init = new Date()

  draw: (processing) ->
    elapsed_time = (new Date() - @time_init) / 1000
    angle = @start + (if @reverse then 1 else -1) * (2 * Math.PI * (elapsed_time % @speed) / @speed)
    target = 
      x: @center.x + Math.cos(angle) * @size 
      y: @center.y - Math.sin(angle) * @size
    
    processing.stroke @color 
    processing.strokeWeight @width 
    processing.line @center.x, @center.y, target.x, target.y


class Clock
  constructor: ({ @center, @size, @speed, @color, @start, @reverse }) -> 
    @hands = []
    configuration.hands.forEach (conf) =>
      @hands.push new Hand
        center: @center
        size:   @size / conf[0]
        speed:  @speed * conf[1]
        width:  conf[2]
        color:  @color
        start:  @start
        reverse: @reverse

  shrink: -> 
    @size -= 0.1 
    @size = 0 if @size < 0

  draw: (processing) -> 
    processing.stroke @color 
    processing.strokeWeight 1
    processing.fill @color, 10
    processing.ellipse @center.x, @center.y, @size * 2, @size * 2

    @hands.forEach (hand) -> hand.draw(processing)
    #@shrink()



clocks = []
sketch = (processing) ->
  
  processing.setup = () =>

  processing.draw = () =>
    processing.background(255)
    clocks.forEach (clock) -> clock.draw(processing)

  add_clock = () ->
    clocks.push new Clock
      center: 
        x: processing.mouseX
        y: processing.mouseY
      size: 25 + Math.random() * 100
      speed: Math.random() * 10
      color: configuration.colors[parseInt(Math.random() * configuration.colors.length)]
      start: Math.random() * Math.PI * 2
      reverse: Math.random() > 0.5

  processing.mouseDragged = add_clock
  processing.mousePressed = add_clock


canvas = document.getElementById "canvas"
p = new Processing(canvas, sketch)
p.size(configuration.size.width, configuration.size.height)
