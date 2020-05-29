class Main
{
    constructor ()
    {
        const vsSource = `
            attribute vec4 aVertexPosition;
            attribute vec2 aTextureCoord;

            uniform vec4 uTransformVector;
            uniform mat4 uScaleMatrix;
            uniform mat4 uRotationMatrix;
            

            varying highp vec2 vTextureCoord;
            void main() {
                gl_Position = uTransformVector + (uRotationMatrix * uScaleMatrix * aVertexPosition);
                vTextureCoord = aTextureCoord;
            }
        `;

        const fsSource = `
            varying highp vec2 vTextureCoord;
            uniform sampler2D uSampler;

            void main() {
                gl_FragColor = vec4(texture2D(uSampler, vTextureCoord).rgb, texture2D(uSampler, vTextureCoord).a);
            }
        `;

        console.log("Successfully loaded main function");
        const canvas = document.querySelector("#glcanvas");
        const gl = canvas.getContext("webgl");

        if (gl === null)
        {
            alert("Error");
            return;
        }

        const shaderProgram = this.initShaderProgram(gl, vsSource, fsSource);

        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
                textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
            },
            uniformLocations: {
                transformVector: gl.getUniformLocation(shaderProgram, 'uTransformVector'),
                scaleMatrix: gl.getUniformLocation(shaderProgram, 'uScaleMatrix'),
                rotationMatrix: gl.getUniformLocation(shaderProgram, 'uRotationMatrix'),
                uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
            },
        };
        const cam = new Camera(gl, programInfo);
        cam.setScreenWidth(canvas.width);
        cam.setScreenHeight(canvas.height);
        cam.setSkyBox('src/textures/skybox.png');
        cam.setPosition([-2480.0, -1260.0, 0.0, 0.0]);
        cam.setBound([-2480.0, 2480.0, -1520.0, 1260.0]);
        this.cam = cam;

        const layers = [];
        const layer_00 = new Layer();
        layer_00.setDepth(1.0);
        const mapobj = new GameObject();
        mapobj.setRenderObjectUrl(gl, programInfo, 'src/textures/map.png');
        mapobj.setScale([3840.0, 2560.0, 1.0, 1.0]);
        layer_00.addObject(mapobj);

        const layer_01 = new Layer();
        layer_01.setDepth(5.0);
        const backobj_1 = new GameObject();
        backobj_1.setRenderObjectUrl(gl, programInfo, 'src/textures/background_01.png');
        backobj_1.setScale([1440.0, 960.0, 1.0, 1.0]);
        layer_01.addObject(backobj_1);

        const layer_02 = new Layer();
        layer_02.setDepth(10.0);
        const backobj_2 = new GameObject();
        backobj_2.setRenderObjectUrl(gl, programInfo, 'src/textures/background_02.png');
        backobj_2.setScale([1440.0, 960.0, 1.0, 1.0]);
        layer_02.addObject(backobj_2);

        layers.push(layer_02);
        layers.push(layer_01);
        layers.push(layer_00);

        const player = new Transform();
        player.setRenderObjectUrl(gl, programInfo, 'src/textures/yee.png');
        player.setScale([40.0, 60.0, 1.0, 1.0]);
        player.setPosition([-2480.0, -1260.0, 0.0, 0.0]);
        layer_00.addObject(player);
        cam.setFollow(player);
        

        this.gl = gl;
        this.programInfo = programInfo;
        this.layers = layers;
        this.player = player;
        this.then = 0;

        window.addEventListener('keydown', this.keyDownHandler.bind(this), false);
        window.addEventListener('keyup', this.keyUpHandler.bind(this), false);
        this.keypressed_up = false;
        this.keypressed_down = false;
        this.keypressed_right = false;
        this.keypressed_left = false;

        requestAnimationFrame(this.render.bind(this));
    }

    render(now)
    {
        now *= 0.001;
        const deltaTime = now - this.then;
        this.then = now;

        const v = 300.0;
        const velocity = vec4.createZero();
        if (this.keypressed_up)
        {
            velocity[1] += v;
        }
        if (this.keypressed_down)
        {
            velocity[1] += -v;
        }
        if (this.keypressed_right)
        {
            velocity[0] += v;
        }
        if (this.keypressed_left)
        {
            velocity[0] += -v;
        }

        this.player.setVelocity(velocity);
        this.player.update(deltaTime);
        this.drawScene(this.gl);

        requestAnimationFrame(this.render.bind(this));
    }

    drawScene(gl)
    {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.cam.updatePosition();
        this.cam.renderSky();
        for (let i = 0; i < this.layers.length; i++)
        {
            this.layers[i].render(this.cam);
        }
    }

    initShaderProgram(gl, vsSource, fsSource) {
        const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        return shaderProgram;
    }

    loadShader(gl, type, source) {
        const shader = gl.createShader(type);

        gl.shaderSource(shader, source);

        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    keyDownHandler(e)
    {
        if (e.keyCode == 87)
        {
            this.keypressed_up = true;
        }
        else if (e.keyCode == 83)
        {
            this.keypressed_down = true;
        }
        else if (e.keyCode == 68)
        {
            this.keypressed_right = true;
        }
        else if (e.keyCode == 65)
        {
            this.keypressed_left = true;
        }
    }
    keyUpHandler(e)
    {
        if (e.keyCode == 87)
        {
            this.keypressed_up = false;
        }
        else if (e.keyCode == 83)
        {
            this.keypressed_down = false;
        }
        else if (e.keyCode == 68)
        {
            this.keypressed_right = false;
        }
        else if (e.keyCode == 65)
        {
            this.keypressed_left = false;
        }
    }
}