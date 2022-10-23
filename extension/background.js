import API from "./utils/api.js"

const devAPI = new API("http://localhost:5000/api/v1")

const createContextMenus = (apiResp, location=null) => {
  if (apiResp){
    location && console.log("Location:", location);;
    console.log("Emails loaded!");
    const { data } = apiResp;

    data.forEach( template => {
      // ID is the email so that it can be accessed without making another api call
      chrome.contextMenus.create({ title: template.title, contexts: ["editable"], id: template.email.join("\n\n")})
    });

    console.log("Sucessfully added context menus!");
  }
}

// The onClicked callback function.
const onClickHandler = async (info, tab) => {
    
    if (info.menuItemId == "loademails") {

        console.log("Loading emails...");
        const apiResp = await devAPI.get("/emails");

        createContextMenus(apiResp, "onClick")
        
    } else {

      console.log(info);
      
      const email = info.menuItemId

      chrome.tabs.executeScript(tab.id, {file: "./utils/insertText.js"})
      
      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
          chrome.tabs.sendMessage(tabs[0].id, {message: "email", data: email}, res => {
              console.log(res.message);
          })
      })

    }
  };
  
  chrome.contextMenus.onClicked.addListener(onClickHandler);
  
  // Set up context menu tree at install time.
  chrome.runtime.onInstalled.addListener(async () => {
    
    // Create content editable context item
    chrome.contextMenus.create({title: "Load Emails", contexts: ["editable"], id: "loademails"});

    //TODO: Make API call to get emails available on install and create contextMenus
    console.log("Loading emails...");
    const apiResp = await devAPI.get("/emails");

    createContextMenus(apiResp, "onInstall");

    
  });


chrome.commands.onCommand.addListener( (command, tab) => {
  console.log("Command:", command);

  chrome.tabs.executeScript(tab.id, {file: "./utils/insertText.js"})

  const signatures = {
    "best-regards": "For any further inquiries, please feel free to reach out anytime.\n\nHave a wonderful day!\n\nBest regards,\n\nAmmar\nFragranceBuy",
    "kindly-advise": "Kindly advise,\n\nAmmar\nFragranceBuy"
  }
      
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, {message: "command", data: signatures[command]}, res => {
          console.log(res.message);
      })
  })
})