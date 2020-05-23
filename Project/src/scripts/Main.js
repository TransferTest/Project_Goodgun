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
                //gl_Position = uRotationMatrix * uScaleMatrix * (uTransformVector + aVertexPosition);
                gl_Position = aVertexPosition;
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
                rotationMtrix: gl.getUniformLocation(shaderProgram, 'uRotationMatrix'),
                uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
            },
        };
        const obj = new RenderObject(gl, programInfo);
        const texture = RenderObject.loadTexture(gl, '../textures/skybox.png');
        obj.bindTexture(texture);

        this.gl = gl;
        this.programInfo = programInfo;
        this.obj = obj;
        this.then = 0;

        requestAnimationFrame(this.render.bind(this));
    }

    render(now)
    {
        now *= 0.001;
        const deltaTime = now - this.then;
        this.then = now;

        this.drawScene(this.gl, this.programInfo, this.buffers, this.texture, deltaTime);

        requestAnimationFrame(this.render.bind(this));
    }

    drawScene(gl, programInfo, buffers, texture, deltaTime)
    {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.obj.render([0.0, 0.0, 0.0, 0.0,], [1.0, 1.0, 1.0, 1.0], 0);
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