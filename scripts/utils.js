
export const DB_HOST = "https://project-g9rw0.vercel.app";//"http://localhost:4000";
export const BACKEND_HOST ="https://code-buddy-backend-main.vercel.app";// "http://localhost:4030";
export const AI_HOST = "https://taha454-codebuddyai.hf.space";
export const app_provider = "huggingface";

export function SETHFToken() {
  Swal.fire({
    title: 'Hugging Face Token',
    input: 'text',
    inputLabel: '  لكى تتمكن من استخدام البرنامج يجب عليك انشاء حساب هاججنج فيس وانشاء توكين - هذا يمكننا من جعل الخدمة مجانية   ',
    inputPlaceholder: '',
    showCancelButton: true,
    confirmButtonText: 'حفظ',
    cancelButtonText: 'إلغاء',
    inputValidator: (value) => {
      if (!value) {
        return 'لازم تدخل نص!';
      }
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      const userInput = result.value;

      // save it for 30 day 
      let db_answer = await update_db(userInput);

      if (db_answer != {}) {
        Swal.fire({
          icon: 'success',
          title: 'تم الحفظ!',
          text: `تم حفظ التوكين: "${userInput}"`,
          timer: 2000,
          showConfirmButton: false
        });

      }
    }
  });
}

function save_as_cookie(keys,userInput,days=30) {
  try {
    Cookies.set(keys, userInput, { expires: days });
    return true;
  } catch (error) {
    console.log("ERROR IN SAVE AS COOKIE: " + error);
    return false;
  }
}

async function update_db(userInput) {

  try {
    const user_jwt = window.current_token;
    const user_id = window.current_uid; 
    
    const response = await fetch(DB_HOST + "/tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user_jwt}`,

      },
      body: JSON.stringify({
        uid: user_id,
        provider: app_provider,
        token: userInput
      }),
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("ERROR" + error);
    return {};
  }


}

