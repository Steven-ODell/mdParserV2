import { renderer } from "./RendererV3.js";
import { inlineParser } from "./InlineParserV3.js";

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
    { pattern:/^\-\-\-/, type: "hr"},
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
