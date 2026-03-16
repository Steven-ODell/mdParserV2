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

export { inlineParser}