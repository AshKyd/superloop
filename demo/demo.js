window.onload = function(){
    var stage = new PIXI.Stage(0x66FF99);
 
    // create a renderer instance.
    var renderer = PIXI.autoDetectRenderer(400, 300);
 
    // add the renderer view element to the DOM
    document.body.appendChild(renderer.view);


    var texture = PIXI.Texture.fromImage("bunny.png");
    // create a new Sprite using the texture
    var bunny = new PIXI.Sprite(texture);
 
    // center the sprites anchor point
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;
 
    // move the sprite t the center of the screen
    bunny.position.x = 200;
    bunny.position.y = 150;

    stage.addChild(bunny);

    var superloop = new SuperLoop();

    superloop.ontick = function(gameTime){
        // Calculate the position of the bunny based on game time rather than
        // frames rendered
        var fullLoop = (Math.PI*2);
        bunny.rotation = (gameTime/300)%fullLoop;
    }

    superloop.onrender = function(){
        renderer.render(stage);
    }

    superloop.start();
}