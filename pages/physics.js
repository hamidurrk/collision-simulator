import React, { useEffect } from 'react';
import Head from 'next/head';

// Import Matter.js globally without touching the original script
const Matter = require('matter-js');

const PhysicsPage = () => {
  useEffect(() => {
    // Your untouched Matter.js code
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

      // create engine
      var engine = Engine.create(),
          world = engine.world;
      var worldWidth = 400;
      var worldHeight = 600;
      var wallThickness = 50;
      // create renderer
      var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
          width: worldWidth,
          height: worldHeight,
          showAngleIndicator: false,
          wireframes: false
        }
      });

      Render.run(render);

      // create runner
      var runner = Runner.create();
      Runner.run(runner, engine);

      // add bodies
      Composite.add(world, [
        Bodies.rectangle(worldWidth/2, 0, worldWidth, wallThickness, { isStatic: true }),
        Bodies.rectangle(worldWidth/2, worldHeight, worldWidth, wallThickness, { isStatic: true }),
        Bodies.rectangle(worldWidth, worldHeight/2, wallThickness, worldHeight, { isStatic: true }),
        Bodies.rectangle(0, worldHeight/2, wallThickness, worldHeight, { isStatic: true })
      ]);

      var explosion = function(engine, delta) {
        var timeScale = (1000 / 60) / delta;
        var bodies = Composite.allBodies(engine.world);

        for (var i = 0; i < bodies.length; i++) {
          var body = bodies[i];

          if (!body.isStatic && body.position.y >= 500) {
            // scale force for mass and time applied
            var forceMagnitude = (0.05 * body.mass) * timeScale;

            // apply the force over a single update
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

        // tween the timescale for bullet time slow-mo
        engine.timing.timeScale += (timeScaleTarget - engine.timing.timeScale) * 10 * timeScale;

        // every 2 sec (real time)
        if (Common.now() - lastTime >= 2000) {

          // flip the timescale
          if (timeScaleTarget < 1) {
            timeScaleTarget = 1;
          } else {
            timeScaleTarget = 0;
          }

          // create some random forces
          explosion(engine, event.delta);

          // update last time
          lastTime = Common.now();
        }
      });

      var bodyOptions = {
        frictionAir: 0, 
        friction: 0.0001,
        restitution: 0.8
      };

      
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
      Composite.add(world, Composites.stack(worldWidth/5, worldHeight/10, worldWidth/80, logos.length, Common.random(10, 15), Common.random(10, 15), function(x, y) {
        if (logos.length === 0) return; // Stop if no logos are left

      // Pick a logo and remove it from the array
      var logo = new Image();
        logo.src = logos.shift();
        console.log(60/logo.width)
        return Bodies.rectangle(x, y, 60, 60, {
          frictionAir: 0, 
          friction: 0.0001,
          restitution: 0.8,
          render: {
            sprite: {
              texture: logo.src,
              xScale: 60/logo.width,
              yScale: 60/logo.width
            }
          }
        });
      }));

      // add mouse control
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

      // keep the mouse in sync with rendering
      render.mouse = mouse;

      // fit the render viewport to the scene
      Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: worldWidth, y: worldHeight }
      });

      // context for MatterTools.Demo
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
  }, []);

  return (
    <>
      <Head>
        <title>Physics Simulation</title>
      </Head>
      <div>
        <h1>Physics Simulation using Matter.js</h1>
        <div id="scene-container"></div>
      </div>
    </>
  );
};

export default PhysicsPage;
