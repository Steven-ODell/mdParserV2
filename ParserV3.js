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

    root.forEach(node => {
        let currentValue = node.value
        node.value = ""


        while (currentValue.length > 0) {
            let earliestPos = Infinity
            let earliestPattern = null

            inlineItems.forEach(i => {
                let idx = currentValue.indexOf(i.pattern)
                if (idx !== -1 && idx < earliestPos) {
                    earliestPos = idx
                    earliestPattern = i
                }
            })

            if (!earliestPattern) {
                if (currentValue.length > 0) {
                    node.children.push({ 
                        type: "inlineText", 
                        value: currentValue, 
                        nestLevel: 1, 
                        children: [] 
                    })
                }
                break
            }            
            let startPatternPos = earliestPos
            let closingPatternPos = currentValue.indexOf(earliestPattern.pattern, startPatternPos + earliestPattern.pattern.length)
            if (closingPatternPos === -1) {
                node.children.push({ 
                    type: "inlineText", 
                    value: currentValue, 
                    nestLevel: 1, 
                    children: [] 
                })
                break
            }

            let patternValue = currentValue.substring(startPatternPos, closingPatternPos)
            let patternValueMinusPattern =  patternValue.replace(earliestPattern.pattern, "")

            let currentValueStart = currentValue.substring(0, startPatternPos)
            let currentValueSubstring = currentValue.substring(closingPatternPos, Infinity)
            let currentValueRemainder = currentValueSubstring.replace(patternValue, "").replace(earliestPattern.pattern, "")
                

            
            let childObject = {
                type: earliestPattern.type,
                value: patternValueMinusPattern,
                nestLevel: 1,
                children: [] 
            }

            if (currentValueStart.length > 0) {
                node.children.push({ 
                    type: "inlineText", 
                    value: currentValueStart, 
                    nestLevel: 1, 
                    children: [] 
                })
            }
            node.children.push(childObject)
            currentValue = currentValueRemainder
        } 
    })
    console.log(JSON.stringify(root, null, 2))
    return JSON.stringify(root, null, 2)
}