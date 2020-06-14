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

        const layers = [];
        const layer_00 = new Layer();
        layer_00.setDepth(1.0);
        layers.push(layer_00);
        
        const player = new Transform();
        player.setRagdollUrl(gl, programInfo, 'src/textures/yee.png');
        player.setScale([60.0, 60.0, 1.0, 1.0]);
        player.setPosition([-2480.0, -1260.0, 0.0, 0.0]);
        layer_00.addObject(player);
        cam.setFollow(player);

        this.player = player;

        const ragdoll = player.getRenderObject();
        this.functionA(ragdoll);

        this.layers = layers;

        this.then = 0.0;

        window.addEventListener('keydown', this.keyDownHandler.bind(this), false);
        window.addEventListener('keyup', this.keyUpHandler.bind(this), false);
        requestAnimationFrame(this.render.bind(this));
    }
    //initiallize vertices and spines of the sample ragdoll
    functionA(ragdoll)
    {
        console.log("functionA called");
        //add vertices
        const v1 = ragdoll.addVertex();
        ragdoll.setVertexPosition(v1, [-1.0, -1.0]);
        ragdoll.setVertexTextureCoordinates(v1, [0.0, 1.0]);

        const v2 = ragdoll.addVertex();
        ragdoll.setVertexPosition(v2, [1.0, -1.0]);
        ragdoll.setVertexTextureCoordinates(v2, [1.0, 1.0]);

        const v3 = ragdoll.addVertex();
        ragdoll.setVertexPosition(v3, [-1.0, 0.0]);
        ragdoll.setVertexTextureCoordinates(v3, [0.0, 0.5]);

        const v4 = ragdoll.addVertex();
        ragdoll.setVertexPosition(v4, [1.0, 0.0]);
        ragdoll.setVertexTextureCoordinates(v4, [1.0, 0.5]);

        const v5 = ragdoll.addVertex();
        ragdoll.setVertexPosition(v5, [-1.0, 1.0]);
        ragdoll.setVertexTextureCoordinates(v5, [0.0, 0.0]);

        const v6 = ragdoll.addVertex();
        ragdoll.setVertexPosition(v6, [1.0, 1.0]);
        ragdoll.setVertexTextureCoordinates(v6, [1.0, 0.0]);

        //add faces
        ragdoll.addFace([v1, v2, v4]);
        ragdoll.addFace([v1, v3, v4]);
        ragdoll.addFace([v3, v4, v6]);
        ragdoll.addFace([v3, v5, v6]);
        
        ragdoll.rebuildBuffers();

        //init spines
        const s1 = ragdoll.addSpine();
        const s2 = ragdoll.addSpine();

        ragdoll.setSpineParent(s2, s1);

        const spine_1 = ragdoll.findSpine(s1);
        const spine_2 = ragdoll.findSpine(s2);

        spine_1.setRootPosition([0.0, -1.0]);
        spine_2.setRootPosition([0.0, 0.0]);

        spine_1.initJointTransform();
        spine_2.initJointTransform();

        //init weight table
        const table = ragdoll.getWeightTable();
        table.setAt(v1, s1, 1.0);
        table.setAt(v2, s1, 1.0);
        table.setAt(v3, s1, 0.5);
        table.setAt(v4, s1, 0.5);
        table.setAt(v5, s1, 0.0);
        table.setAt(v6, s1, 0.0);
        table.setAt(v1, s2, 0.0);
        table.setAt(v2, s2, 0.0);
        table.setAt(v3, s2, 0.5);
        table.setAt(v4, s2, 0.5);
        table.setAt(v5, s2, 1.0);
        table.setAt(v6, s2, 1.0);
    }
    //animate sample ragdoll
    functionB(ragdoll, dt)
    {
        const s1 = ragdoll.findSpine(0);
        const s2 = ragdoll.findSpine(1);

        const previous_rotation = s2.getJointRotation();
        if (this.keypressed_right && (!this.keypressed_left))
        {
            s2.setJointRotation(previous_rotation - 3.14 * dt / 4);
        }
        else if (this.keypressed_left && (!this.keypressed_right))
        {
            s2.setJointRotation(previous_rotation + 3.14 * dt / 4);
        }
        else
        {
            s2.setJointRotation(previous_rotation);
        }
        ragdoll.updateSpineTransform();
        ragdoll.updateVertexPositions();
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
        this.functionB(this.player.getRenderObject(), deltaTime);
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