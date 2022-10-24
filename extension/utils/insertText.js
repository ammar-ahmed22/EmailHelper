
const getParameters = () => {
    if (window.getSelection){
        const sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount){
            const range = sel.getRangeAt(0);
            return range.startContainer.textContent.split(",");
        }
    }
    
}

const insertParams = (params, text) => {
    if (params.length === 0){
        return text;
    }

    const regex = /{{param\d}}/g
    const matches = text.match(regex);

    if (!matches){
        return text;
    }

    let updated = text;
    for (let i = 0; i < matches.length; i++){
        const match = matches[i];
        const paramIdx = parseInt(match.charAt(match.length - 3)) - 1;
        updated = updated.replace(match, params[paramIdx]);
    }

    return updated;

}
 
const insertTextAtCaret = (node) => {
    if (window.getSelection){
        const sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount){
            const range = sel.getRangeAt(0);
            range.deleteContents();
        
            range.insertNode(node);
    
            range.setStartAfter(node);
            sel.removeAllRanges();
            sel.addRange(range);
            
            
        }
    }
}

const generateCaretNode = (text) => {
    if (text.includes('\n')){
        text = text.replace("\n", "<br />")
    }

    const node = document.createElement("div");
    node.innerHTML = text;

    return node;
}

chrome.runtime.onMessage.addListener((req, sender, res) => {
    console.log(sender.tab ? "from a content script: " + sender.tab.url : "from the extension");

    if (req.message === "email"){

        const email = req.data.split("{{NEW_LINE}}")

        
        const params = getParameters();
        
        for (let i = 0; i < email.length; i++){
            email[i] = insertParams(params, email[i])
            
            
            if (email[i].includes('\n')){
                email[i] = email[i].replace("\n", "<br />")
            }

            const node = document.createElement("div");
            node.innerHTML = email[i];
            const lineBreak = document.createElement("br");

            insertTextAtCaret(node);
            insertTextAtCaret(lineBreak);
            
        }


        res({message: `email successfully inserted!`})
    }

    if (req.message === "command"){
        const lines = req.data.split("\n\n");

        for (let i = 0; i < lines.length; i++){
            insertTextAtCaret(generateCaretNode(lines[i]));
            const lineBreak = document.createElement("br");
            insertTextAtCaret(lineBreak);
        }

        res({ message: "Signature inserted!!"})
    }
})

//const email = "Hey Ammar,\n\nThanks for reaching out. I will gladly assist you with this issue.\n\nYou are sexy.\n\nFor any further inquiries, please feel free to reach out anytime.\n\nBest regards,\n\nAmmar\nFragranceBuy"





console.log("Success!");