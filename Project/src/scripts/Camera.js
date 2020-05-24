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
        this.zoom = 1.0;
        this.skybox = null;
    }

    setScreenWidth(w)
    {
        this.screen_width = w;
    }
    setScreenHeight(h)
    {
        this.screen_height = h;
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
        this.render(this.skybox);
    }
}