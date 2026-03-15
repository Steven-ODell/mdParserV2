const inputBox = document.getElementById("testArea");
const outputDiv = document.getElementById("testDiv");
let root = []

const startingItems = [
    { pattern: /^\#\#\#\s/,   type: "h3" },
    { pattern: /^\#\#\s/,    type: "h2" },
    { pattern: /^\#\s/,     type: "h1" },
    { pattern: /^\>\s/,     type: "blockquote" },
    { pattern: /^\-\s/ ,    type: "ul" },
    { pattern:/^\d+\.\s/, type: "ol"},
]

const inlineItems = [
    { pattern: "***", type: "strongEm" },
    { pattern: "**",  type: "strong" },
    { pattern: "*",   type: "em" },
    { pattern: "~~",  type: "del" },
    { pattern: "~",   type: "sub" },
    { pattern: "^",   type: "sup" },
    { pattern: "==",  type: "mark" },
    { pattern: "`",   type: "code" }
]

inputBox.addEventListener('input', ()  => {
    outputDiv.innerHTML = mdParse(inputBox.value)
})

const mdParse = (inputString) => {

    let splitStringArray = inputString.split("\n");
    root.length = 0
    let currentObject = {}

    splitStringArray.forEach(block => {
        const matched = startingItems.find(patterns => {
            if (block.match(patterns.pattern)) {
                currentObject = {
                    type: patterns.type,
                    value: block.replace(patterns.pattern, ""),
                    nestLevel: 0,
                    children: []
                }
                root.push(currentObject)
                return true
            }
        })
        if (!matched) {
            currentObject = {
            type: "p",
            value: block,
            nestLevel: 0,
            children: []
            } 
            root.push(currentObject)
        }
    })
    console.log("blocks: ", root)
    
    root.forEach(parentString => {
        let childLoop = true
        currentObject = parentString
        while (childLoop === true) {
            let earliestPosition = Infinity
            let earliestPattern = ""
            inlineItems.forEach(patterns => {
                if ((parentString.value).includes(patterns.pattern)) {
                    let substringValue = (parentString.value).substring(0, (parentString.value).indexOf(patterns.pattern))
                    let patternlessValue = (parentString.value).replace(substringValue, "").replace(patterns.pattern, "")
                    let patternPosition = (parentString.value).indexOf(patterns.pattern)
                    parentString.value = substringValue
                    let childObject = {
                        type: patterns.type,
                        value: patternlessValue,
                        nestLevel: +1,
                        children: [] 
                        }
                    currentObject.children.push(childObject)
                    currentObject = childObject
                    return true
                }
            })
            if (!matched) {
                childLoop = false
            }
        }
})
    console.log(JSON.stringify(root, null, 2))
    return JSON.stringify(root, null, 2)
}