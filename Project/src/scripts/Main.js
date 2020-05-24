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
                gl_Position = uRotationMatrix * uScaleMatrix * (uTransformVector + aVertexPosition);
                vTextureCoord = aTextureCoord;
            }
        `;

        const fsSource = `
            varying highp vec2 vTextureCoord;
            uniform sampler2D uSampler;
            void main() {
                gl_FragColor = texture2D(uSampler, vTextureCoord);
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
        console.log(canvas.width);
        cam.setSkyBox('src/textures/skybox.png');
        this.cam = cam;

        const layers = [];
        const layer_00 = new Layer();
        layers.push(layer_00);

        const mapobj = new GameObject();
        mapobj.setRenderObjectUrl(gl, programInfo, 'src/textures/map.png');
        mapobj.setScale([960.0, 640.0, 1.0, 1.0]);
        layer_00.addObject(mapobj);
        

        this.gl = gl;
        this.programInfo = programInfo;
        this.layers = layers;
        this.then = 0;

        requestAnimationFrame(this.render.bind(this));
    }

    render(now)
    {
        now *= 0.001;
        const deltaTime = now - this.then;
        this.then = now;

        this.drawScene(this.gl, deltaTime);

        requestAnimationFrame(this.render.bind(this));
    }

    drawScene(gl, deltaTime)
    {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.depthFunc(gl.LEQUAL);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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
}