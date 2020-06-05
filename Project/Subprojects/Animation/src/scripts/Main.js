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

        this.keypressed_up = false;
        this.keypressed_down = false;
        this.keypressed_right = false;
        this.keypressed_left = false;
        this.keypressed_jump = false;

        this.gl = gl;

        this.layers = [];

        requestAnimationFrame(this.render.bind(this));
    }

    render(now)
    {
        now *= 0.001;
        const deltaTime = now - this.then;
        this.then = now;
        
        if (this.keypressed_up)
        {
            
        }
        if (this.keypressed_down)
        {
            
        }
        if (this.keypressed_right)
        {
            
        }
        if (this.keypressed_left)
        {
            
        }
        if (this.keypressed_jump)
        {
            
        }
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
        else if (e.keyCode == 32)
        {
            if (!this.keypressed_jump)
            {
                this.start_jump = 0.0;
            }
            this.keypressed_jump = true;
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
        else if (e.keyCode == 32)
        {
            this.keypressed_jump = false;
        }
    }
}