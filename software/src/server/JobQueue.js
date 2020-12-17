
//
// Constructor of the queue
//

export function Queue()
{
    this.elements = [];
}

//
// Interface of the queue
//

Queue.prototype.enqueue = function(e)
{
    this.elements.push(e);
}
Queue.prototype.dequeue = function()
{
    return this.elements.shift();
}
Queue.prototype.isEmpty = function()
{
    return this.elements.length == 0;
}
Queue.prototype.length = function()
{
    return this.elements.length;
}
Queue.prototype.find = function(e)
{
    return this.elements.indexOf(e);
}
Queue.prototype.removeIndex = function(i)
{
    this.elements.splice(i, 1);
}
Queue.prototype.clear = function()
{
    this.elements.splice(0, this.elements.length);
}
