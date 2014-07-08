conf = 
  size: 5
  colors: [ "#69D2E7", "#A7DBD8", "#E0E4CC", "#F38630" ]
  nb_levels: 100


class GameControls 
  constructor: (canvas) -> 
    @x = 
      start: null
      end: null
    @swipe = ""

    canvas.addEventListener 'touchstart', @touch_start
    canvas.addEventListener 'touchend', @touch_end
    canvas.addEventListener 'touchmove' ,@touch_move
    document.ontouchmove = (e) -> e.preventDefault()

  touch_start: (e) => @x.start = e.touches[0].clientX

  touch_move: (e) => @x.end = e.touches[0].clientX
  
  touch_end:  (e) => 
    @swipe = if @x.end > @x.start then "right" else "left"
    @gesture(@swipe)
 
  gesture: () -> 



class Game
  constructor: (@colors, @size, @nb_levels, @controls)->
    @level_index = 1
    @score = 0
    @build_levels()
    @controls.gesture = @gesture
    @hidden = false

  gesture: (type) => 
    @score += 1 if (type is "right" and @levels[@level_index].join("") is @levels[@level_index - 1].join("")) or
                   (type is "left"  and @levels[@level_index].join("") isnt @levels[@level_index - 1].join(""))
    @level_index++

    @hidden = true
    setTimeout () => 
      @hidden = false
    , 500


  level: () -> @levels[@level_index]

  draw: (canvas, ctx) => 
    canvas.width = canvas.width
    if not @hidden
      for i in [0...@size]
        for j in [0...@size]
          width = canvas.width * 0.8 / @size
          color = @level()[i * 3 + j ]
          ctx.fillStyle = @level()[i * 3 + j ]
          ctx.fillRect(i * width, j * width, width, width)

    ctx.font="20px Verdana";
    ctx.fillStyle = "black"
    ctx.fillText(@score,550,100)

  build_levels: ->
    @levels = []
    @levels[0] = [0...@size * @size].map () => 
      @colors[parseInt(Math.random() * @colors.length, 10)]

    for i in [1...@nb_levels]
      @levels[i] = (j for j in @levels[i - 1])

      indice = parseInt(Math.random() * @size * @size, 10)
      if Math.random() > 0.5
        @levels[i][indice] = @colors[parseInt(Math.random() * @colors.length, 10)]
    




canvas = document.getElementById "canvas"
ctx    = canvas.getContext "2d"

controls = new GameControls(canvas)
game = new Game conf.colors, conf.size, conf.nb_levels, controls


game_loop = () ->
  game.draw(canvas, ctx)
  requestAnimationFrame game_loop
game_loop()
    
