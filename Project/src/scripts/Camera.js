class Camera
{
    constructor (gl, programInfo)
    {
        this.gl = gl;
        this.programInfo = programInfo;
        this.screen_width = 1.0;
        this.screen_height = 1.0;
        this.position = vec4.createZero();
        this.rotation = 0.0;
        this.depth = 1.0;
        this.skybox = null;
        this.flash = null;
        this.follow = null;

        this.bound_left = 0.0;
        this.bound_right = 0.0;
        this.bound_top = 0.0;
        this.bound_bottom = 0.0;
    }

    setBound (bnd)
    {
        this.bound_left = bnd[0];
        this.bound_right = bnd[1];
        this.bound_bottom = bnd[2];
        this.bound_top = bnd[3];
    }

    setScreenWidth(w)
    {
        this.screen_width = w;
    }
    setScreenHeight(h)
    {
        this.screen_height = h;
    }
    getDepth()
    {
        return this.depth;
    }
    getPosition()
    {
        return this.position;
    }
    setPosition(pos)
    {
        this.position = pos;
    }
    translate(v)
    {
        this.position = vec4.add(this.position, v);
    }

    screenCoord2GlobalCoord(pos)
    {
        ret = [
            pos[0] * this.screen_width,
            pos[1] * this.screen_height,
            pos[2],
            pos[3],
        ];
        return ret;
    }
    globalCoord2ScreenCoord(pos)
    {
        if (this.screen_width <= 0 || this.screen_height <= 0)
        {
            console.log("screen size is zero!!");
            return pos;
        }
        const ret = [
            pos[0] / this.screen_width,
            pos[1] / this.screen_height,
            pos[2],
            pos[3],
        ];
        return ret;
    }

    setSkyBox (url)
    {
        const sky = new RenderObject(this.gl, this.programInfo);
        const texture = RenderObject.loadTexture(this.gl, url);
        sky.bindTexture(texture);
        this.skybox = sky;
    }
    setFlash (url)
    {
        const flash = new RenderObject(this.gl, this.programInfo);
        const texture = RenderObject.loadTexture(this.gl, url);
        flash.bindTexture(texture);
        this.flash = flash;
    }
    renderLayer(layer)
    {
        layer.render(cam);
    }
    render (obj)
    {
        obj.render([0.0, 0.0, 0.0, 0.0,], [1.0, 1.0, 1.0, 1.0], 0.0);
    }
    renderSky()
    {
        if (this.skybox === null)
        {
            return;
        }
        this.render(this.skybox);
    }
    renderFlash()
    {
        if (this.flash === null)
        {
            return;
        }
        const gl = this.gl;
        gl.blendFunc(gl.ZERO, gl.SRC_COLOR);
        this.render(this.flash);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }
    setFollow(obj)
    {
        this.follow = obj;
    }
    updatePosition ()
    {
        if (this.follow === null)
        {
            return;
        }
        const fpos = this.follow.getPosition();
        const pos = vec4.createZero();
        pos[0] = fpos[0];
        pos[1] = fpos[1];
        pos[2] = fpos[2];
        pos[3] = fpos[3];
        if (pos[0] < this.bound_left)
        {
            pos[0] = this.bound_left;
        }
        if (pos[0] > this.bound_right)
        {
            pos[0] = this.bound_right;
        }
        if (pos[1] > this.bound_top)
        {
            pos[1] = this.bound_top;
        }
        if (pos[1] < this.bound_bottom)
        {
            pos[1] = this.bound_bottom;
        }
        this.setPosition(pos);
    }
}