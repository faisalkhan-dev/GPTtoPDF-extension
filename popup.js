document.getElementById("savePdf").addEventListener("click", () => {
    console.log("Save as PDF button clicked");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || tabs.length === 0) {
            console.error("No active tab found.");
            alert("No active tab found.");
            return;
        }

        console.log("Active tab found:", tabs[0].url);

        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: extractChatGPTConversation
        }, (result) => {
            if (chrome.runtime.lastError) {
                console.error("Error executing script:", chrome.runtime.lastError.message);
                alert("Error fetching conversation. Check console.");
                return;
            }

            if (!result || !result[0] || !result[0].result) {
                console.error("No conversation found.");
                alert("No conversation found. Open ChatGPT first.");
                return;
            }

            console.log("Extracted conversation:", result[0].result);
            generatePDF(result[0].result);
        });
    });
});

function extractChatGPTConversation() {
    console.log("Extracting ChatGPT conversation...");
    let messages = document.querySelectorAll('.text-base');
    let conversation = "";
    messages.forEach(msg => {
        conversation += msg.innerText + "\n\n";
    });
    return conversation;
}

function generatePDF(chatText) {
    console.log("Generating PDF...");
    
    // Load jsPDF locally
    let script = document.createElement("script");
    script.src = chrome.runtime.getURL("jspdf.umd.min.js");
    script.onload = function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let splitText = doc.splitTextToSize(chatText, 180);
        doc.text(splitText, 10, 10);
        doc.save("ChatGPT_Conversation.pdf");
        console.log("PDF saved successfully!");
    };
    document.body.appendChild(script);
}
