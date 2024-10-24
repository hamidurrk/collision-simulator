import React, { useEffect } from 'react';
const Matter = require('matter-js');

const PhysicsPage = ({ worldWidth, worldHeight }) => {
  const logos = [
    '/skills/python.svg',
    '/skills/cpp.svg',
    '/skills/typescript.svg',
    '/skills/javascript.svg',
    '/skills/next.svg',
    '/skills/react.svg',
    '/skills/gsap.svg',
    '/skills/arduino.svg',
    '/skills/etherium.svg',
    '/skills/selenium.svg',
    '/skills/firebase.svg',
    '/skills/photoshop.svg',
    '/skills/premiere.svg',
    '/skills/fusion.svg',
  ]
  useEffect(() => {
    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    };
  
    const loadLogos = async () => {
      return await Promise.all(logos.map(logo => loadImage(logo)));
    };
  
    loadLogos().then(loadedLogos => {
    const Example = {};

    Example.timescale = function() {
      var Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Body = Matter.Body,
          Events = Matter.Events,
          Composite = Matter.Composite,
          Composites = Matter.Composites,
          Common = Matter.Common,
          MouseConstraint = Matter.MouseConstraint,
          Mouse = Matter.Mouse,
          Bodies = Matter.Bodies;

      var engine = Engine.create(),
          world = engine.world;
      // var worldWidth = 400;
      // var worldHeight = 600;
      var wallThickness = 30;

      var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
          width: worldWidth,
          height: worldHeight,
          showAngleIndicator: false,
          wireframes: false,
          background: '#000000'
        }
      });

      Render.run(render);

      var runner = Runner.create();
      Runner.run(runner, engine);

      Composite.add(world, [
        Bodies.rectangle(worldWidth/2, 0, worldWidth, wallThickness, { isStatic: true , render: {fillStyle: '#000000'}}),
        Bodies.rectangle(worldWidth/2, worldHeight, worldWidth, wallThickness, { isStatic: true , render: {fillStyle: '#000000'}}),
        Bodies.rectangle(worldWidth, worldHeight/2, wallThickness, worldHeight, { isStatic: true , render: {fillStyle: '#000000'}}),
        Bodies.rectangle(0, worldHeight/2, wallThickness, worldHeight, { isStatic: true , render: {fillStyle: '#000000'}}),
        Bodies.rectangle(0, worldHeight-(worldHeight/10), wallThickness+(worldWidth*0.8), (worldHeight/10)+wallThickness, { isStatic: true , render: {fillStyle: '#000000'}})
      ]);

      var explosion = function(engine, delta) {
        var timeScale = (1000 / 60) / delta;
        var bodies = Composite.allBodies(engine.world);

        for (var i = 0; i < bodies.length; i++) {
          var body = bodies[i];

          if (!body.isStatic && body.position.y >= worldHeight/2) {
            var forceMagnitude = (0.05 * body.mass) * timeScale;
            Body.applyForce(body, body.position, {
              x: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]), 
              y: -forceMagnitude + Common.random() * -forceMagnitude
            });
          }
        }
      };

      var timeScaleTarget = 1,
          lastTime = Common.now();

      Events.on(engine, 'afterUpdate', function(event) {
        var timeScale = (event.delta || (1000 / 60)) / 1000;

        engine.timing.timeScale += (timeScaleTarget - engine.timing.timeScale) * 10 * timeScale;

        if (Common.now() - lastTime >= 2000) {
          if (timeScaleTarget < 1) {
            timeScaleTarget = 1;
          } else {
            timeScaleTarget = 0;
          }

          explosion(engine, event.delta);

          lastTime = Common.now();
        }
      });

      var bodyOptions = {
        frictionAir: 0, 
        friction: 0.0001,
        restitution: 0.8
      };

      Composite.add(world, Composites.stack(worldWidth/5, worldHeight/10, worldWidth/80, loadedLogos.length, Common.random(10, 15), Common.random(10, 15), function(x, y) {
        if (loadedLogos.length === 0) return; 

        var logo = new Image();
        logo = loadedLogos.shift();
        return Bodies.rectangle(x, y, worldHeight/10, worldHeight/10, {
          frictionAir: 0, 
          friction: 0.0001,
          restitution: 0.8,
          render: {
            sprite: {
              texture: logo.src,
              xScale: (worldHeight/10)/logo.width,
              yScale: (worldHeight/10)/logo.width
            }
          }
        });
      }));

      var mouse = Mouse.create(render.canvas),
          mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
              stiffness: 0.5,
              render: {
                visible: false
              }
            }
          });

      Composite.add(world, mouseConstraint);

      render.mouse = mouse;
      Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: worldWidth, y: worldHeight }
      });

      return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function() {
          Matter.Render.stop(render);
          Matter.Runner.stop(runner);
        }
      };
    };

    Example.timescale.title = 'Time Scaling';
    Example.timescale.for = '>=0.14.2';

    Example.timescale();
    });
  }, []);

  return (
    <>
      <div>
        <div id="scene-container"></div>
      </div>
    </>
  );
};

export default PhysicsPage;
