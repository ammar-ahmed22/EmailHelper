const getParams = () => {
    if (window.getSelection){
        const sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount){
            const range = sel.getRangeAt(0);
            const params = [];
            let curr = range.startContainer;
            while(curr.nextSibling){
                params.push(curr.nextSibling.textContent);
                curr = curr.nextSibling;
            }

            return params;
        }
    }
    
}

const insertParams = (params, text) => {
    if (params.length === 0){
        return text;
    }

    const regex = /{{param\d}}/g
    const matches = text.match(regex);

    if (matches.length === 0){
        return text;
    }

    let updated = text;
    for (let i = 0; i < matches.length; i++){
        updated = updated.replace(matches[i], params[i])
    }

    return updated;

}
 
const insertTextAtCaret = (text, params) => {
    if (window.getSelection){
        const sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount){
            const range = sel.getRangeAt(0);
            range.deleteContents();
            const node = text === '\n' ? document.createElement('br') : document.createTextNode(text);
            range.insertNode(node);
            range.setStartAfter(node);
            sel.removeAllRanges();
            sel.addRange(range);
            
            
        }
    }
}


chrome.runtime.onMessage.addListener((req, sender, res) => {
    console.log(sender.tab ? "from a content script: " + sender.tab.url : "from the extension");

    if (req.message === "email"){

        const email = req.data.split("\n")

        //email = email.join("\n\n");
        const params = getParams();
        for (let i = 0; i < email.length; i++){
            console.log(email);
            // const updated = insertParams(email[i]);
            // insertTextAtCaret(email[i], params);
        }


        res({message: `email successfully inserted!`})
    }

    if (req.message === "command"){
        for (let i = 0; i < req.data.length; i++){
            insertTextAtCaret(req.data[i])
        }

        res({ message: "Signature inserted!!"})
    }
})

//const email = "Hey Ammar,\n\nThanks for reaching out. I will gladly assist you with this issue.\n\nYou are sexy.\n\nFor any further inquiries, please feel free to reach out anytime.\n\nBest regards,\n\nAmmar\nFragranceBuy"





console.log("Success!");