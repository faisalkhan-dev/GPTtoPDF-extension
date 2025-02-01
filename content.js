function generatePDF(chatText) {
    import("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js")
        .then((jsPDF) => {
            const { jsPDF: JsPDF } = jsPDF;
            const doc = new JsPDF();
            let splitText = doc.splitTextToSize(chatText, 180);
            doc.text(splitText, 10, 10);
            doc.save("ChatGPT_Conversation.pdf");
            console.log("PDF Saved Successfully!");
        })
        .catch((error) => {
            console.error("Error loading jsPDF:", error);
            alert("Failed to load jsPDF. Check console (F12).");
        });
}
