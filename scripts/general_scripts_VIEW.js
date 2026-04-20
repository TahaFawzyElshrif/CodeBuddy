// Import
import { getAIresponse, SET_UPDATE_HFToken } from "./general_script_controller.js";
/////////////////////
// Main Scripts
////////////////////

// Global Variables 
window.memory = [];
window.last_state = "";

// ON OPEN CODE

/////////////////////
// Module listeners
////////////////////

document.getElementById("submit_button").addEventListener("click", function (event) {
    send();
    document.getElementById("chat_input").value = '';
});

document.getElementById("chat_input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        send();
        document.getElementById("chat_input").value = '';
    }
});

document.getElementById("menu_btn").addEventListener("click", async () => {
    await SET_UPDATE_HFToken();
});


/////////////////////
// Functions 
////////////////////
// Core 
async function send() {


    const middle_main_box = document.getElementById("middle_main_box");
    const chat_input = document.getElementById("chat_input");
    const entered_text = chat_input.value;
    chat_input.value = ""; // clean the textbox

    // remove intial_elements
    if (document.getElementById("intial_elements") !== null) {
        middle_main_box.innerHTML = '';
    }

    send_widget_message(entered_text, false, middle_main_box, false);

    await getAIresponse(entered_text, middle_main_box,document,send_widget_message);

    //test
    //send_widget_message("entered_text", true, middle_main_box, false);

}



// Helper
function send_widget_message(msg, chat_ai, middle_main_box, is_error,is_final_response_ai=false) {// chat_ai: true if the message is from the AI, false if it's from the user. is_error: true if the message is an error message, false otherwise.
    if (!is_error) {
        var dir_box = chat_ai ? "justify-content: flex-start;" : "justify-content: flex-end;";
        var ico_img = chat_ai ? '<i class="bi bi-robot"></i>' : '<i class="bi bi-person"></i>';

        const rawHTML = marked.parse(msg);

        // For (Security)
        const cleanHTML = DOMPurify.sanitize(rawHTML);

        middle_main_box.innerHTML += `<div class="msg_row" style="${dir_box}">
                    <div class="msg_box">
                        ${ico_img}
                        ${cleanHTML}
                    </div>
                </div>`;

        if (is_final_response_ai && chat_ai) {
            setPDFDownloadButton(middle_main_box,cleanHTML);
        }
    } else {
        var dir_box = "justify-content: center;";
        middle_main_box.innerHTML += `<div class="msg_row" style="${dir_box};">
                    <div class="msg_box" style="background-color: #e6585844;">
                        ${msg}
                    </div>
                </div>`;
    }


}


function setPDFDownloadButton(middle_main_box,text) {
    middle_main_box.innerHTML = middle_main_box.innerHTML + `<input type="Button" id = "PDF" value="Download PDF">`
    document.getElementById("PDF").addEventListener("click", function (event) {
        downloadMarkdownAsPDF(text);
        console.log("PDF Downloaded");

    });
}


function downloadMarkdownAsPDF(markdownText, fileName = "conversation.pdf") {
  // 1) Convert Markdown → HTML
  const htmlContent = marked.parse(markdownText);

  // 2) Create temporary container
  const element = document.createElement("div");
  element.innerHTML = htmlContent;

  // Optional: basic styling for PDF
  element.style.padding = "20px";
  element.style.fontFamily = "Arial, sans-serif";

  document.body.appendChild(element);

  // 3) Convert HTML → PDF
  const opt = {
    margin: 0.5,
    filename: fileName,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
  };

  html2pdf()
    .set(opt)
    .from(element)
    .save()
    .then(() => {
      // 4) Cleanup
      document.body.removeChild(element);
    });
}