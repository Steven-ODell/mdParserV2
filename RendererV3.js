
const rendererDict = [
    { type:"hr", open: "<hr>", close: ""},
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
    { type:"li", open: "<li>", close: "</li>"},
]

const renderer = (inputRoot) => {
    
    let finalString = "" 

    inputRoot.forEach(node => {

        let blockLabel = rendererDict.find(d => { 
            if (d.type === node.type) { return true }
        })
        // Find header type and add opener for the HTML block
        finalString += blockLabel.open

        let blockChildren = node.children
        if (blockChildren.length > 0) { // If there are children then go through them find type then attach appropriate HTML blocks around value and add that to the string
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
        finalString += blockLabel.close // Add HTML block closer
        console.log(finalString)
    })
    return finalString
}

export { renderer }