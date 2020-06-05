class AnimationVertex
{
    constructor (id)
    {
        this.id = id;
        this.texCoord = vec2.createZero();
        this.position = vec2.createZero();
    }

    compareId(id)
    {
        return (this.id == id);
    }
}