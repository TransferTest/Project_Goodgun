class AnimationVertex
{
    constructor (id)
    {
        this.id = id;
        this.texCoord = vec2.createZero();
        this.position = vec2.createZero();
    }

    getId()
    {
        return this.id;
    }
    compareId(id)
    {
        return (this.id == id);
    }
    setTextureCoordinate (texCoord)
    {
        this.texCoord = texCoord;
    }
    getTextureCoordinates ()
    {
        return this.texCoord;
    }
    setPosition (position)
    {
        this.position = position;
    }
    getPosition ()
    {
        return this.position;
    }
}