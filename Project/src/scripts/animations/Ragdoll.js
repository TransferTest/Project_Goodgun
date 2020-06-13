class Ragdoll
{
    constructor (gl, programInfo)
    {
        this.gl = gl;
        this.programInfo = programInfo;

        const MAX_SPINE_SIZE = 128;
        const MAX_VERTEX_SIZE = 512;
        this.texture = null;
        this.positions = [];
        this.texcoord = [];
        this.indices = [];
        this.vertices = [];
        this.spines = [];
        this.root_spine = null;
        this.faces = []
        this.buffers = this.initBuffers(gl);

        this.spine_id_bitmap = bitmap.create(MAX_SPINE_SIZE, true);
        this.vertex_id_bitmap = bitmap.create(MAX_VERTEX_SIZE, true);
        this.vertex_table = this.initVTable(MAX_VERTEX_SIZE);

        const weight_table = new table(MAX_VERTEX_SIZE, MAX_SPINE_SIZE, 0.0);
        this.weight_table = weight_table;
    }
    updateVertexPositions()
    {
        
    }
    getWeightTable()
    {
        return this.weight_table;
    }
    initVTable(n)
    {
        const ret = [];
        for (let i = 0; i < n; i++)
        {
            ret.push(-1);
        }
        return ret;
    }
    addFace (ids)
    {
        this.faces.push(...ids);
        this.indices.push(this.vertex_table[ids[0]]);
        this.indices.push(this.vertex_table[ids[1]]);
        this.indices.push(this.vertex_table[ids[2]]);
    }
    addSpine()
    {
        const newId = bitmap.pickAndSet(this.spine_id_bitmap);
        if (newId < 0)
        {
            return newId;
        }
        const newSpine = new Spine(newId);

        this.spines.push(newSpine);
        if (this.root_spine === null)
        {
            this.root_spine = newSpine;
        }

        return newId;
    }
    findSpine(id)
    {
        for (let i = 0; i < this.spines.length; i++)
        {
            const s = this.spines[i];
            if (s.compareId(id))
            {
                return s;
            }
        }
        return null;
    }
    removeSpine(id)
    {
        for (let i = 0; i < this.spines.length; i++)
        {
            const target = this.spines[i];
            if (target.compareId(id))
            {
                this.spines.splice(i, 1);
                target.remove();
                return;
            }
        }
    }
    setSpineParent(childId, parentId)
    {
        const child = this.findSpine(childId);
        const parent = this.findSpine(parentId);
        child.setParent(parent);
    }
    getNextVertexPositionOffset ()
    {
        return this.positions.length;
    }
    addVertex()
    {
        const newId = bitmap.pickAndSet(this.vertex_id_bitmap);
        if (newId < 0)
        {
            return newId;
        }
        const newVertex = new AnimationVertex(newId, this.getNextVertexPositionOffset(), this.getNextVertexPositionOffset(), this.positions, this.texcoord);
        this.positions.push(0.0);
        this.positions.push(0.0);
        this.texcoord.push(0.0);
        this.texcoord.push(0.0);

        this.vertices.push(newVertex);
        this.vertex_table[newId] = this.vertices.length - 1;
        

        return newId;
    }
    findVertex(id)
    {
        /*for (let i = 0; i < this.vertices.length; i++)
        {
            const v = this.vertices[i];
            if (v.compareId(id))
            {
                return v;
            }
        }
        return null;*/
        return this.vertices[this.vertex_table[id]];
    }
    removeVertex(id)
    {
        for (let i = 0; i < this.vertices.length; i++)
        {
            const v = this.vertices[i];
            if (v.compareId(id))
            {
                this.vertices.splice(i, 1);
                return v;
            }
        }
    }
    setVertexPosition(id, pos)
    {
        const target = this.findVertex(id);
        target.setPosition(pos);
    }
    setVertexTextureCoordinates(id, texcoord)
    {
        const target = this.findVertex(id);
        target.setTextureCoordinates(texcoord);
    }
    getPositions ()
    {
        const vertices = this.vertices;
        const ret = [];

        for (let i = 0; i < vertices.length; i++)
        {
            const v = vertices[i];
            ret.push(...v.getPosition());
        }
        return ret;
    }
    getTextureCoordinates ()
    {
        const vertices = this.vertices;
        const ret = [];

        for (let i = 0; i < vertices.length; i++)
        {
            const v = vertices[i];
            ret.push(...v.getTextureCoordinate());
        }
        return ret;
    }

    rebuildBuffers()
    {
        console.log("rebuilding buffers");
        this.buffers = this.initBuffers(this.gl);
    }

    initBuffers(gl)
    {
        console.log(this.indices);
        const positions = this.positions;

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        const textureCoordinates = this.texcoord;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        const ind = this.indices;
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ind), gl.STATIC_DRAW);

        return {
            position: positionBuffer,
            textureCoord: textureCoordBuffer,
            indices: indexBuffer,
        };
    }
    updateBuffers ()
    {
        const gl = this.gl;
        const positions = this.positions;
        const textureCoordinates = this.texcoord;
        const indices = this.indices;
        const buffers = this.buffers;
        const positionBuffer = buffers.position;
        const textureCoordBuffer = buffers.textureCoord;
        const indexBuffer = buffers.indices;

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    }

    render (transform, scale, rotation)
    {
        if (this.texture === null)
        {
            console.log("No texture!!!");
            return;
        }
        this.updateBuffers();
        const gl = this.gl;
        const programInfo = this.programInfo;
        const buffers = this.buffers;
        const texture = this.texture;
        

        const transformVector = transform;
        const scaleMatrix = mat4.createScale(scale);
        const rotationMatrix = mat4.createRotation(rotation);

        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;

            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        }

        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;

            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
            gl.vertexAttribPointer(
                programInfo.attribLocations.textureCoord,
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

        gl.useProgram(programInfo.program);

        gl.uniform4fv(
            programInfo.uniformLocations.transformVector,
            transformVector
        );
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.scaleMatrix,
            false,
            scaleMatrix
        );
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.rotationMatrix,
            false,
            rotationMatrix
        );

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

        {
            const vertexCount = this.indices.length;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }

    setTexture (gl, url)
    {
        console.log("load function called with : " + url);
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        const image = new Image();
        image.onload = function() {
            console.log("image loaded");
            function isPowerOf2(value) {
                return (value & (value - 1)) == 0;
            }
            
            gl.bindTexture(gl.TEXTURE_2D, texture);

            const level = 0;
            const internalFormat = gl.RGBA;
            const srcFormat = gl.RGBA;
            const srcType = gl.UNSIGNED_BYTE;

            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                        srcFormat, srcType, image);

            // WebGL1 has different requirements for power of 2 images
            // vs non power of 2 images so check if the image is a
            // power of 2 in both dimensions.
            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                // Yes, it's a power of 2. Generate mips.
                gl.generateMipmap(gl.TEXTURE_2D);
            }
            else {
                // No, it's not a power of 2. Turn off mips and set
                // wrapping to clamp to edge
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
        };
        image.src = url;

        this.texture = texture;

        return texture;
    }
}