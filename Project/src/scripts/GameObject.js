class GameObject
{
    constructor ()
    {
        this.position = vec4.createZero();
        this.rotation = 0.0;
        this.scale = [1.0, 1.0, 1.0, 1.0];
        this.renderobj = null;
        this.depth = 0.0;
        this.collider = null;
    }
    setCollider (col)
    {
        this.collider = col;
    }
    getCollider()
    {
        return this.collider;
    }
    setRenderObject (rndobj)
    {
        this.renderobj = rndobj;
    }
    setPosition(pos)
    {
        this.position = pos;
    }
    setPositionX(x)
    {
        this.position[0] = x;
    }
    setPositionY(y)
    {
        this.position[1] = y;
    }
    getPosition()
    {
        return this.position;
    }
    setRotation(rot)
    {
        this.rotation = rot;
    }
    getRotation()
    {
        return this.rotation;
    }
    setScale(scl)
    {
        this.scale = scl;
    }
    getScale()
    {
        return this.scale;
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

    setRagdollUrl(gl, programInfo, url)
    {
        const rnd = new Ragdoll(gl, programInfo);
        rnd.setTexture(gl, url);
        this.renderobj = rnd;
    }

    getRenderObject()
    {
        return this.renderobj;
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