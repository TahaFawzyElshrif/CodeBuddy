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

 
}



// Helper
export function changeButtonToLoading() {
    const submitButton = document.getElementById('submit_button');
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
        
        </span>
    `;
}
export function changeButtonToDefault() {
    const submitButton = document.getElementById('submit_button');
    submitButton.disabled = false;
    submitButton.innerHTML = ' <i class="bi bi-send"></i>';
}
function send_widget_message(msg, chat_ai, middle_main_box, is_error, is_final_response_ai = false) {// chat_ai: true if the message is from the AI, false if it's from the user. is_error: true if the message is an error message, false otherwise.
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
            setPDFDownloadButton(middle_main_box, cleanHTML);
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


function setPDFDownloadButton(middle_main_box, text) {
    middle_main_box.innerHTML += `
        <br>
        <br>
        <div style="position: relative;">
            
            <!-- your message content here -->

            <button id="PDF"
            class="btn btn-light shadow-sm rounded-circle p-1"
            style="
                position: absolute;
                bottom: 6px;
                left: 6px;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
                background-color: #523437;
                color: white;
                border: none;
            ">
            <i class="bi bi-file-earmark-pdf text-danger" style="font-size: 14px;"></i>
            </button>

        </div>
    `;
    const btn = document.getElementById("PDF");

    btn.addEventListener("mouseenter", () => {
    btn.style.transform = "scale(1.1)";
    btn.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
    });

    btn.addEventListener("mouseleave", () => {
    btn.style.transform = "scale(1)";
    btn.style.boxShadow = "0 1px 4px rgba(0,0,0,0.1)";
    });

    btn.addEventListener("click", function (event) {
        downloadMarkdownAsPDF(text);
        console.log("PDF Downloaded");

    });
}

function downloadMarkdownAsPDF(markdownText, fileName = "conversation.pdf") {
    // 1) Convert Markdown → HTML
    marked.setOptions({
        breaks: true
    });
    const htmlContent = marked.parse(markdownText);

    // 2) Create temporary container
    const element = document.createElement("div");
    element.innerHTML = htmlContent;

    // preserve markdown spacing + line breaks
    element.style.padding = "20px";
    element.style.fontFamily = "Tahoma, Arial, sans-serif";
    element.style.direction = "rtl";
    element.style.textAlign = "right";

    // important fix for spacing issues
    element.style.whiteSpace = "pre-wrap";
    element.style.lineHeight = "1.8";

    // Optional: improve readability for Arabic
    element.style.lineHeight = "1.8";

    document.body.appendChild(element);

    // 4) PDF options
    const opt = {
        margin: 0.5,
        filename: fileName,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true
        },
        jsPDF: {
            unit: "in",
            format: "a4",
            orientation: "portrait"
        }
    };

    html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
            document.body.removeChild(element);
        });
}