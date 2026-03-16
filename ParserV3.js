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

inputBox.addEventListener('input', ()  => {
    const rootReadyForRender = blockParser(inputBox.value)
    console.log(rootReadyForRender)
    outputDiv.innerHTML = renderer(rootReadyForRender)
})

const blockParser = (inputString) => {

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
    root  = inlineParser(root)
    console.log(JSON.stringify(root, null, 2))
    return root
}

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

const inlineParser = (inputRoot) => {
    inputRoot.forEach(node => {
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
    return inputRoot
}

const rendererDict = [
    { type:"p", open: "<p>", close: "</p>"},
    { type:"inlineText", open: "", close: ""},
    { type:"h1", open: "<h1>", close: "</h1>"},
    { type:"h2", open: "<h2>", close: "</h2>"},
    { type:"h3", open: "<h3>", close: "</h3>"},
    { type:"blockquote", open: "<blockquote>", close: "</blockquote>"},
    { type:"ul", open: "<ul>", close: "</ul>"},
    { type:"ol", open: "<ol>", close: "</ol>"},
    { type:"code", open: "<code>", close: "</code>"},
    { type:"mark", open: "<mark>", close: "</mark>"},
    { type:"sup", open: "<sup>", close: "</sup>"},
    { type:"sub", open: "<sub>", close: "</sub>"},
    { type: "del", open: "<del>", close: "</del>"},
    { type:"em", open: "<em>", close: "</em>"},
    { type:"strong", open: "<strong>", close: "</strong>"},
    { type:"strongEm", open: "<strong><em>", close: "</em></strong>"},
]

const renderer = (inputRoot) => {
    
    let finalString = ""

    inputRoot.forEach(node => {
        let blockLabel = rendererDict.find(d => {
            if (d.type === node.type) { return true }
        })
        finalString += blockLabel.open

        let blockChildren = node.children
        if (blockChildren.length > 0) {
            blockChildren.forEach(child => {
            rendererDict.find(d => {
                let dictType = d.type
                    if (child.type === dictType){
                        finalString += d.open + child.value + d.close
                        return true
                    }
                //console.log("ParentType:" + node.type)
                //console.log("ChildType:" + child.type)
                //console.log("Value:" + child.value)                  
                })
            })
        }
        finalString += blockLabel.close
        console.log(finalString)
    })
    return finalString
}