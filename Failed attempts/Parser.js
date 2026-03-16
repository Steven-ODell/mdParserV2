const inputBox = document.getElementById("testArea");
const outputBox = document.getElementById("testDiv");

const root = []

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
const startingItems = [
    { pattern: "### ",   type: "h3" },
    { pattern: "## ",    type: "h2" },
    { pattern: "# ",     type: "h1" },
    { pattern: "> ",     type: "blockquote" },
    { pattern: "- ",    type: "ul" },
]

inputBox.addEventListener("input", () =>{
    
    outputBox.innerHTML = tokenizer(inputBox.value, root)
    
})

let currentObject = {}

const tokenizer = (inputString, root) => {
    let finalString = ""
    root.length = 0
    const strippedInput = (inputString.trimStart())
    let lineSplit = inputString.split('\n')
        lineSplit.forEach(k => {
        let valueStart = 0
        let valueFill = k
        
        const matched = startingItems.find(i => {
                if (k.startsWith(i.pattern)||k.match(i.pattern)) {
                    valueFill = k.replace(i.pattern, "")
                    valueStart = k.indexOf(i.pattern)
                    currentObject = {
                        type: i.type,
                        value: valueFill,
                        indentLevel: valueStart,
                        children: []
                    }
                    root.push(currentObject)
                    console.log(currentObject)
                    return true
                } })
            if (!matched) {
                currentObject = {
                    type: "text",
                    value: k,
                    indentLevel: valueStart,
                    children: []
                }
                    root.push(currentObject)
                    console.log(currentObject)
                }
        })       
        root.forEach(node => {
            let nodeValue = node.value
            inlineItems.forEach(n => {
                if (nodeValue.includes(n.pattern)) {
                    let inlineStart = nodeValue.indexOf(n.pattern)
                    let inlineEnd = nodeValue.indexOf(n.pattern, inlineStart + 1)
                    let inlineValue = nodeValue.substring(inlineStart + n.pattern.length, inlineEnd)
                    
                    node.children.push({
                        type: n.type,
                        value: inlineValue,
                        indentLevel: inlineStart,
                        children: [],
                        pattern: n.pattern
                    })
                }
            })
        })
        console.log(JSON.stringify(root, null, 2))
        //renderer
        root.forEach(node => {

            if (node.children.length > 0) {
                node.children.forEach(g => {
                
                if (g.type === "h1"){
                    finalString = finalString.replace(g.pattern + g.value + g.pattern, "<h1>" + g.value + "</h1>")
                } else if (g.type == "h2") {
                    finalString = finalString.replace(g.pattern + g.value + g.pattern, "<h2>" + g.value + "</h2>")
                } else if (g.type === "h3") {
                    finalString = finalString.replace(g.pattern + g.value + g.pattern, "<h3>" + g.value + "</h3>")
                } else if (g.type === "blockquote") {
                    finalString = finalString.replace(g.pattern + g.value + g.pattern, "<blockquote>" + g.value + "</blockquote>")
                } else if (g.type === "ul") {
                    finalString = finalString.replace(g.pattern + g.value + g.pattern, "<ul>" + g.value + "</ul>")
                } else if (g.type === "code") {
                    finalString = finalString.replace(g.pattern + g.value + g.pattern, "<code>" + g.value + "</code>")
                } else if (g.type === "mark") {
                    finalString = finalString.replace(g.pattern + g.value + g.pattern, "<mark>" + g.value + "</mark>")
                } else if (g.type === "strong") {
                    finalString = finalString.replace(g.pattern + g.value + g.pattern, "<strong>" + g.value + "</strong>")
                } else if (g.type === "em") {
                    finalString = finalString.replace(g.pattern + g.value + g.pattern, "<em>" + g.value + "</em>")
                } else if (g.type === "del") {
                    finalString = finalString.replace(g.pattern + g.value + g.pattern, "<del>" + g.value + "</del>")
                } else if (g.type === "sup") {
                    finalString = finalString.replace(g.pattern + g.value + g.pattern, "<sup>" + g.value + "</sup>")
                } else if (g.type === "sub") {
                    finalString = finalString.replace(g.pattern + g.value + g.pattern, "<sub>" + g.value + "</sub>")
                } else if (g.type === "strongem") {
                    finalString = finalString.replace(g.pattern + g.value + g.pattern, "<strong><em>" + g.value + "</em></strong>")
                } else if (g.type === "text") {
                    finalString = finalString.replace(g.pattern + g.value + g.pattern, "<p>" + g.value + "</p>")
                } 
            })
        } else {
                if (node.type === "h1"){
                    finalString += "<h1>" + node.value + "</h1>"
                } else if (node.type == "h2") {
                    finalString +="<h2>" + node.value + "</h2>"
                } else if (node.type === "h3") {
                    finalString += "<h3>" + node.value + "</h3>"
                } else if (node.type === "blockquote") {
                    finalString += "<blockquote>" + node.value + "</blockquote>"
                } else if (node.type === "ul") {
                    finalString += "<ul>" + node.value + "</ul>"
                } else if (node.type === "code") {
                    finalString += "<code>" + node.value + "</code>"
                } else if (node.type === "mark") {
                    finalString += "<mark>" + node.value + "</mark>"
                } else if (node.type === "strong") {
                    finalString += "<strong>" + node.value + "</strong>"
                } else if (node.type === "em") {
                    finalString += "<em>" + node.value + "</em>"
                } else if (node.type === "del") {
                    finalString += "<del>" + node.value + "</del>"
                } else if (node.type === "sup") {
                    finalString += "<sup>" + node.value + "</sup>"
                } else if (node.type === "sub") {
                    finalString += "<sub>" + node.value + "</sub>"
                } else if (node.type === "strongem") {
                    finalString += "<strong><em>" + node.value + "</em></strong>"
                } else if (node.type === "text") {
                    finalString += "<p>" + node.value + "</p>"
                }
        }
        console.log(finalString)
        })

        return finalString
}

const renderer = () => {

}
