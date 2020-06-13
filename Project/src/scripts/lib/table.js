class table
{
    constructor(num_rows, num_columns, init_value)
    {
        const table = [];
        const size = num_rows * num_columns;
        for (let i = 0; i < size; i++)
        {
            table.push(init_value);
        }

        this.num_rows = num_rows;
        this.num_columns = num_columns;
        this.table = table;
    }
    getAt(row, col)
    {
        return this.table[row * this.num_columns + col];
    }
    setAt(row, col, value)
    {
        this.table[row * this.num_columns + col] = value;
    }

    normalize()
    {
        for (let i = 0; i < this.num_rows; i++)
        {
            this.normalizeRow(i);
        }
    }
    normalizeRow(n)
    {
        if (n >= this.num_rows)
        {
            console.log("Error at normalizeRow() : Index out of bounds");
            return;
        }
        var sum = 0.0;
        for (let i = 0; i < this.num_columns; i++)
        {
            sum += this.getAt(n, i);
        }
        if (sum == 0.0)
        {
            console.log("Error at normalizeRow() : Divide by zero");
            return;
        }
        for (let i = 0; i < this.num_columns; i++)
        {
            const newVal = this.getAt(n, i) / sum;
            this.setAt(n, i, newVal);
        }
    }
    fillRow(n, val)
    {
        if (n >= this.num_rows)
        {
            console.log("Error at fillRow() : Index out of bounds");
            return;
        }
        for (let i = 0; i < this.num_columns; i++)
        {
            this.setAt(n, i, val);
        }
    }
    fillColumn(n, val)
    {
        if (n >= this.num_columns)
        {
            console.log("Error at fillColumn() : Index out of bounds");
            return;
        }
        for (let i = 0; i < this.num_rows; i++)
        {
            this.setAt(i, n, val);
        }
    }
}