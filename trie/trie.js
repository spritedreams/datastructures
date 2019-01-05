const trieNode = (letter, children, end) => {
    let childrenNodes = new Map();
    childrenNodes = children ? children : childrenNodes
    end = end ? true : false
    const node = {
        letter : letter,
        wordEnd : end,
        children : childrenNodes, 
    }
    return node;
}
const Trie = () => {
    return trieNode(null,null);
}

const searchTrie = (myTrie, word) => {
    if (!word) {return {found : false, foundPath : []}}
    const letters = [...word];
    let path = '';
    let fullWords = []; 
    const check = (n,node) => {
        //path = node.has(letters[n]) ? path.concat(letters[n]) : path; //?
        if (node.has(letters[n])) {
            path += letters[n];
            if (node.get(letters[n]).wordEnd){ fullWords = fullWords.concat(path);} 
        }//?
        return ( n < letters.length - 1 && node.has(letters[n])) ? check(n+1, node.get(letters[n]).children) : node.has(letters[n]) ;
    }
    return {found: check(0,myTrie.children), foundPath: [...path], words: fullWords};
}

const createPathStr = (trieStr,pathArr) => {
    return trieStr + '.children.get("' + pathArr.join('").children.get("') + '")';  

}

const addChild = (myTrie,key,child,path) => {
    path = path || []
    if (path.length > 0 ) {
        eval(createPathStr('myTrie',path)).children.set(key,child)
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
        return prev.letter ? addChild(trieNode(cur,null),prev.letter,prev) : trieNode(cur,null,true) 
    },Trie())
    addChild(myTrie,newT.letter,newT,path)
    return myTrie
}

// get all words in trie, optional prefix (get all words starting with prefix)
const getAllWords = (myTrie,prefix) => {
    prefix = prefix || ''
    let allWords = []
    const getWords = (node,word) => {
        node.forEach( (value, key) => {
            if (value.wordEnd) {
                allWords = allWords.concat(word+key) //?
                if (value.children.size > 0) { getWords(value.children,word+key) }  
            } else { 
                getWords(value.children,word+key)
            }
        })
    }
    if (prefix){
        const {found,foundPath: path, words} = searchTrie(myTrie,prefix) //?
        if (path.length > 0 && found) {
            allWords = allWords.concat(words) //?
            const pathStr = 'myTrie.children.get("' + path.join('").children.get("') + '")'; //?
            myTrie = eval(createPathStr('myTrie',path)) //?
        }
        else {
            return []
        }
    }
    getWords(myTrie.children,prefix) 
    return allWords //? 
}

const addWordList = (myTrie,list) => {
    list.forEach( (word) => addWord(word,myTrie) )
    return myTrie
}

const removeWord = (myTrie,word) => {
    if (!word) {return myTrie}
    const list = getAllWords(myTrie,word) //?
    list.forEach( (e,i) => {
        if (list.length == 1 && e == word){
            myTrie.children.delete(word[0])
            return myTrie
        }
        else{
            if (e == word){
                eval(createPathStr('myTrie',[...e])).wordEnd = false
                if (i == list.length - 1){
                    let prev = list[i-1] //?
                    let end = e.substr(list.length,1) //?
                    eval(createPathStr('myTrie',[...prev])).children.delete(end)
                }
            }
        }
    })
    return myTrie
}

// test
let t = Trie()
t = addWord('cat',t)
t = addWord('dog',t)
t = addWord('cake',t)
t = addWord('dragon',t)
t = addWord('catdragon',t)
t = addWord('catacomb',t)
console.log(t)

let x = searchTrie(t,'catacomb')
console.log(x)

let all = getAllWords(t) //?
let all2 = getAllWords(t,'ca') //?


let l = ['night','bunny','nightmare','a','at','atom','atomic','atoms']
t = addWordList(t,l) //?

searchTrie(t,'atom') //?
//getAllWords(t,'atom') //?

getAllWords(t,'b') //?
let f = removeWord(t,'atom') //?
getAllWords(f,'a') //?
