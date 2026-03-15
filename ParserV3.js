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
    let nestLevel = 0 

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

    root.forEach(node => {
        let currentValue = node.value
        inlineItems.forEach(i => {
            let startPatternPos = currentValue.indexOf(i.pattern)
            let closingPatternPos = currentValue.indexOf(i.pattern, startPatternPos + i.pattern.length)
            let patternValue = currentValue.substring(startPatternPos, closingPatternPos)

            let patternValueMinusPattern =  patternValue.replace(i.pattern, "")
            let currentValueStart = currentValue.substring(0, startPatternPos)
            let currentValueSubstring = currentValue.substring(closingPatternPos, Infinity)
            let currentValueRemainder = currentValueSubstring.replace(patternValue, "").replace(i.pattern, "")
            
            if (startPatternPos === -1) 
                {return}
            
            let childObject = {
                type: i.type,
                value: patternValueMinusPattern,
                nestLevel: nestLevel + 1,
                children: [] 
            }
            currentObject.children.push(childObject)
            currentObject.value = currentValueStart
            childObject.value = currentValueRemainder

        
        })
    })
    console.log(JSON.stringify(root, null, 2))
    return JSON.stringify(root, null, 2)
}