class Transform extends GameObject
{
    constructor ()
    {
        super();

        this.velocity = vec4.createZero();
    }
    translate (v)
    {
        this.position = vec4.add(this.position, v);
    }
    rotate (r)
    {
        this.rotation += r;
    }
    setVelocity (v)
    {
        this.velocity = v;
    }
    getVelocity ()
    {
        return this.velocity;
    }
    accelerate (a)
    {
        this.velocity = vec4.add(this.velocity, a);
    }
    update (dt)
    {
        this.translate(vec4.smul(this.velocity, dt));
    }
}