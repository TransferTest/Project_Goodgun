class GameObject
{
    constructor ()
    {
        this.position = vec4.createZero();
        this.rotation = 0.0;
        this.scale = [1.0, 1.0, 1.0, 1.0];
        this.renderobj = null;
        this.depth = 0.0;
    }
    setRenderObject (rndobj)
    {
        this.renderobj = rndobj;
    }
    setPosition(pos)
    {
        this.position = pos;
    }
    setRotation(rot)
    {
        this.rotation = rot;
    }
    setScale(scl)
    {
        this.scale = scl;
    }
    setDepth(d)
    {
        this.depth = d;
    }
    setRenderObjectUrl(gl, programInfo, url)
    {
        const rnd = new RenderObject(gl, programInfo);
        const texture = RenderObject.loadTexture(gl, url);
        rnd.bindTexture(texture);
        this.renderobj = rnd;
    }
    render (cam, transform, scale, rotation, depth)
    {
        const d = depth + this.depth;
        const rndobj = this.renderobj;
        const rndtransform = cam.globalCoord2ScreenCoord(vec4.smul(vec4.sub(vec4.add(transform, this.position), cam.getPosition()), cam.getDepth() / d));
        rndobj.render(
            rndtransform,
            cam.globalCoord2ScreenCoord(vec4.mul(scale, this.scale)),
            rotation + this.rotation
        );
    }
}