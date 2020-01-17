let obj = {};

[{bg:'red',id:'a'},{bg:'a',id:'b'},{bg:'d',id:'c'},].map((item)=>{
    obj[item.id] = item;
})

var id = 'a';
console.log(obj[id].bg)
