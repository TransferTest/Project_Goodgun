/*
* A vertex of a ragdoll
*/

class AnimationVertex
{
    /*
    * id: vertex id.
    * pos_offset: start point of the position of the vertex in the 'positions' array
    * tex_offset: start pont of the texture coordinate of the vertex in the 'texcoord' array
    * positions: pointer for the positions array in ragdoll
    * texcoord: pointer for the texture coordinates array in ragdoll
    */
    constructor (id, pos_offset, tex_offset, positions, texcoord)
    {
        this.id = id;
        this.tex_offset = tex_offset;
        this.texcoord = texcoord;
        this.pos_offset = pos_offset;
        this.positions = positions;
        this.a_position = vec2.createZero();
    }

    /*
     * returns the id of the vertex
     * id is assigned when the vertex object created, and never changes until the vertex is deleted
     */
    getId()
    {
        return this.id;
    }
    /*
     * check id
     */
    compareId(id)
    {
        return (this.id == id);
    }
    /*
     * set new texture coordinates
     * puts the given values in the texture coordinates array of the ragdoll, directly
     */
    setTextureCoordinates (newCoord)
    {
        if (newCoord.length != 2)
        {
            console.log("Error");
            return;
        }
        this.texcoord[this.tex_offset] = newCoord[0];
        this.texcoord[this.tex_offset + 1] = newCoord[1];
    }
    /*
     * returns copy of its texture coordinates
     */
    getTextureCoordinates ()
    {
        const ret = [0, 0];
        ret[0] = this.texcoord[this.tex_offset];
        ret[1] = this.texcoord[this.tex_offset + 1];

        return ret;
    }
    /*
     * set new position
     * puts the given values in the positions array of the ragdoll, directly
     */
    setPosition (newPos)
    {
        if (newPos.length != 2)
        {
            console.log("Error");
            return;
        }
        this.positions[this.pos_offset] = newPos[0];
        this.positions[this.pos_offset + 1] = newPos[1];
    }
    /*
     * returns copy of its position
     */
    getPosition ()
    {
        const ret = [0, 0];
        ret[0] = this.positions[this.pos_offset];
        ret[1] = this.positions[this.pos_offset + 1];

        return ret;
    }
    /*
     * sets its A-pose position
     */
    setAPosition(newAPos)
    {
        this.a_position = vec2.copy(newAPos);
    }
    /*
     * returns its A-pose position
     */
    getAPosition()
    {
        return this.a_position;
    }
    /*
     * calculate and update its current position with all spines in the ragdoll and weight table
     * should call it after spine transform propagation
     * (i.e. spines' transform should be updated first)
     */
    calculatePosition(ragdoll, weight_table)
    {
        const num_columns = weight_table.getColumnNumber();
        const newPos = vec2.createZero();
        const vertex_id = this.getId();

        for (let i = 0; i < num_columns; i++)
        {
            const weight = weight_table.getAt(vertex_id, i);
            if (weight == 0.0)
            {
                continue;
            }
            const spine = ragdoll.findSpine(i);
            if (spine === null)
            {
                continue;
            }
            const local_position = this.calculateLocalPosition(spine);
            const weighted_local_position = vec2.smul(local_position, weight);

            newPos[0] += weighted_local_position[0];
            newPos[1] += weighted_local_position[1];
        }
        this.setPosition(newPos);
    }
    /*
     * calculate and return its local position with given spine
     * the spine's transform should be updated first
     */
    calculateLocalPosition(spine)
    {
        const local_translation = spine.getLocalTranslation(this.getAPosition());
        const spine_transform = spine.getTransform();
        const spine_rotation = spine.getRotation();
        const spine_rotation_matrix = mat2.createRotation(spine_rotation);

        return vec2.add(spine_transform, vec2.mmul(spine_rotation_matrix, local_translation));
    }
}