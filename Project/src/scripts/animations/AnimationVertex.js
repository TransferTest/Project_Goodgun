class AnimationVertex
{
    constructor (id, pos_offset, tex_offset, positions, texcoord)
    {
        this.id = id;
        this.tex_offset = tex_offset;
        this.texcoord = texcoord;
        this.pos_offset = pos_offset;
        this.positions = positions;
    }

    getId()
    {
        return this.id;
    }
    compareId(id)
    {
        return (this.id == id);
    }
    setTextureCoordinates (newCoord)
    {
        if (newCoord.length != 2)
        {
            console.log("Error");
            return;
        }
        this.texcoord[this.tex_offset] = newCoord[0];
        this.texcoord[this.tex_offset + 1] = newCoord[1];
    }
    getTextureCoordinates ()
    {
        const ret = [0, 0];
        ret[0] = this.texcoord[this.tex_offset];
        ret[1] = this.texcoord[this.tex_offset + 1];

        return ret;
    }
    setPosition (newPos)
    {
        if (newPos.length != 2)
        {
            console.log("Error");
            return;
        }
        this.positions[this.pos_offset] = newPos[0];
        this.positions[this.pos_offset + 1] = newPos[1];
    }
    getPosition ()
    {
        const ret = [0, 0];
        ret[0] = this.positions[this.pos_offset];
        ret[1] = this.positions[this.pos_offset + 1];

        return ret;
    }
}