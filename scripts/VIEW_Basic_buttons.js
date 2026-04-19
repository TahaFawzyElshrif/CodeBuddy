function AddDefaultQuestion(questionElement) {
    const chatInput = document.getElementById('chat_input');
    chatInput.value = questionElement.innerText;

    const middle_main_box = document.getElementById("middle_main_box");
    middle_main_box.innerHTML = '';
}