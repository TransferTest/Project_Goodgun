class Layer
{
    constructor ()
    {
        this.position = vec4.createZero();
        this.rotation = 0.0;
        this.scale = [1.0, 1.0, 1.0, 1.0];
        this.objects = [];
    }
    addObject(obj)
    {
        this.objects.push(obj);
    }
    render(cam)
    {
        const objects = this.objects;
        const position = this.position;
        const rotation = this.rotation;
        const scale = this.scale;

        for (let i = 0; i < objects.length; i++)
        {
            objects[i].render(cam, position, scale, rotation);
        }
    }
}