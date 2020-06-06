class Ragdoll extends RenderObject
{
    constructor (gl, programInfo)
    {
        super(gl, programInfo);
        this.positions = [];
        this.texcoord = [];
        this.indices = [];
        const MAX_SPINE_SIZE = 128;
        const MAX_VERTEX_SIZE = 512;
        this.texture = null;
        this.vertices = [];
        this.spines = [];
        this.faces = []
        this.rebuildBuffers();

        this.spine_id_bitmap = bitmap.create(MAX_SPINE_SIZE, true);
        this.vertex_id_bitmap = bitmap.create(MAX_VERTEX_SIZE, true);
        this.vertex_table = this.initVTable(MAX_VERTEX_SIZE);
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