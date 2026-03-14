const inputBox = document.getElementById("testArea");
const outputDiv = document.getElementById("testDiv");
let root = []

const startingItems = [
    { pattern: "### ",   type: "h3" },
    { pattern: "## ",    type: "h2" },
    { pattern: "# ",     type: "h1" },
    { pattern: "> ",     type: "blockquote" },
    { pattern: "- ",    type: "ul" },
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
            console.log(block)
            if (block.startsWith(patterns.pattern)) {
                currentObject = {
                    type: patterns.type,
                    value: block,
                    nestLevel: 0,
                    children: []
                }
                
            } else {
                    currentObject = {
                    type: "p",
                    value: splitStringArray,
                    nestLevel: 0,
                    children: []
                } 
            }
        })
    
    })
    root.push(currentObject)
    console.log(currentObject.type)
    return splitStringArray
}