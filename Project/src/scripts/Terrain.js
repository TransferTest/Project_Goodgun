class Terrain
{
    constructor ()
    {
        this.vertices = [];
        this.edges = [];
    }
    addVertex(v)
    {
        this.vertices.push(v);
    }
    addEdge(e)
    {
        this.edges.push(e);
    }
    checkCollision(rectCollider)
    {
        var on_ground = false;
        for (let i = 0; i < this.edges.length; i++)
        {
            if (rectCollider.checkCollision(this.edges[i]))
            {
                on_ground = true;
            }
        }
        if (on_ground)
        {
            const obj = rectCollider.getObject();
            obj.onGround();
        }
        rectCollider.updatePosition();
    }
}