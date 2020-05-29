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
        rectCollider.updatePosition();
    }
}