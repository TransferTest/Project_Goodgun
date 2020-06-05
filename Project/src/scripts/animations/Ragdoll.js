class Ragdoll
{
    constructor (gl)
    {
        const MAX_SPINE_SIZE = 128;
        const MAX_VERTEX_SIZE = 512;
        this.texture = null;
        this.vertices = [];
        this.spines = [];
        this.faces = []
        this.buffer = this.initBuffers(gl);
        this.gl = gl;

        this.spine_id_bitmap = bitmap.create(MAX_SPINE_SIZE, true);
        this.vertex_id_bitmap = bitmap.create(MAX_VERTEX_SIZE, true);
    }
    addFace (ids)
    {
        this.faces.push(...ids);
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
    addVertex()
    {
        const newId = bitmap.pickAndSet(this.vertex_id_bitmap);
        if (newId < 0)
        {
            return newId;
        }
        const newVertex = new AnimationVertex(newId);

        this.vertices.push(newVertex);

        return newId;
    }
    findVertex(id)
    {
        for (let i = 0; i < this.vertices.length; i++)
        {
            const v = this.vertices[i];
            if (v.compareId(id))
            {
                return v;
            }
        }
        return null;
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

    initBuffers(gl)
    {
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