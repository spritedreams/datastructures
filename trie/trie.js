const trieNode = (letter, children) => {
    let childrenNodes = new Map();
    childrenNodes = children ? children : childrenNodes
    const node = {
        letter : letter,
        children : childrenNodes, 
    }
    return node;
}
const Trie = () => {
    return trieNode(null,null);
}
let t = Trie()
//console.log(t)

const searchTrie = (myTrie, word) => {
    const letters = [...word];
    let path = new Array();
    const check = (n,node) => {
        path = node.has(letters[n]) ? path.concat(letters[n]) : path; //?
        return ( n < letters.length - 1 && node.has(letters[n])) ? check(n+1, node.get(letters[n]).children) : node.has(letters[n]) ;
    }
    console.log(path)
    return {found: check(0,myTrie.children), foundPath: path};
}

const addChild = (myTrie,key,child,path) => {
    path = path || []
    if (path.length > 0 ) {
        let pathStr = 'myTrie.children.get("' + path.join('").children.get("') + '").children';
        eval(pathStr).set(key,child)
    }
    else {
        myTrie.children.set(key,child)
    }
    return myTrie
}

const addWord = (word, myTrie) => {
    if (!word) {return null}
    const path = searchTrie(myTrie,word).foundPath //?
    const letters = [...word].reduce( (prev,cur,i) => {
        return path[i] == cur ? prev : prev.concat(cur)
    },[]); //?

    let newT = letters.reduceRight( (prev, cur) => {
        return prev.letter ? addChild(trieNode(cur,null),prev.letter,prev) : trieNode(cur,null) 
    },Trie())
    addChild(myTrie,newT.letter,newT,path)
    return myTrie
}

t = addWord('cat',t)
//console.log(t)

t = addWord('dog',t)
//console.log(t)

t = addWord('cake',t)
//console.log(t)

t = addWord('catacomb',t)
console.log(t)

let x = searchTrie(t,'catacomb')
console.log(x)
//console.log(t.letter) 
//console.log(t.children.get('c')) 









