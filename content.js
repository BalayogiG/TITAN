console.log("running");

window.addEventListener("mouseup",mouseUpped);

function mouseUpped(){
    let selectedText = window.getSelection().toString();
    console.log(selectedText);
    if (selectedText.length > 0){
        let message = {
            text: selectedText
        };
        chrome.runtime.sendMessage(message);
    }
}
