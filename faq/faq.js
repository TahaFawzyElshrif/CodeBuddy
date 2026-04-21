async function loadQuestions() {
  try {
    const response = await fetch("faq/questions.json");
    const data = await response.json();
    for (const item of data) {
      document.getElementById("middle_main_box").innerHTML += `
        <div class="faq_item">
          <h3>${item.Question}</h3>
          <p>${item.Answer}</p>
        </div>
      `;
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

loadQuestions();