class GameObject
{
    constructor ()
    {
        this.position = vec4.createZero();
        this.rotation = 0.0;
        this.scale = [1.0, 1.0, 1.0, 1.0];
        this.renderobj = null;
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
    setRenderObjectUrl(gl, programInfo, url)
    {
        const rnd = new RenderObject(gl, programInfo);
        const texture = RenderObject.loadTexture(gl, url);
        rnd.bindTexture(texture);
        this.renderobj = rnd;
    }
    render (cam, transform, scale, rotation)
    {
        const rndobj = this.renderobj;
        rndobj.render(
            cam.globalCoord2ScreenCoord(vec4.add(transform, this.position)),
            cam.globalCoord2ScreenCoord(vec4.mul(scale, this.scale)),
            rotation + this.rotation
        );
    }
}