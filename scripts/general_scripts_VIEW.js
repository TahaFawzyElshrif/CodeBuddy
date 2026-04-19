// Import
import { getAIresponse,SET_UPDATE_HFToken } from "./general_script_controller.js";
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
function send_widget_message(msg, chat_ai, middle_main_box, is_error) {
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
    } else {
        var dir_box = "justify-content: center;";
        middle_main_box.innerHTML += `<div class="msg_row" style="${dir_box};">
                    <div class="msg_box" style="background-color: #e6585844;">
                        ${msg}
                    </div>
                </div>`;
    }


}

