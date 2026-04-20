import { SETHFToken, AI_HOST, BACKEND_HOST, DB_HOST } from "./utils.js";

export async function getAIresponse(msg, middle_main_box, document, send_widget_message) {
    const url = BACKEND_HOST + "/Model/post";
    var user_name = window.displayName;
    var user_email = window.current_email;

    console.log("Last State", window.last_state);

    if (!window.memory) {
        window.memory = [];
    }

    window.memory.push(msg);

    document.getElementById('submit_button').disabled = true;

    try {
        const data = {
            prompt: msg,
            user_id: window.current_uid,
            user_jwt: window.current_jwt,
            user_email: user_email,
            user_name: user_name,
            memory: window.memory,
            last_state: window.last_state
        };

        const api_response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const api_response_json = await api_response.json();
        const api_data = api_response_json.answer.data;

        send_widget_message(api_data.answer, true, middle_main_box, false,api_data.all_ok);
        window.memory.push(api_data.answer);
        console.log("Memory ", window.memory);

        window.last_state = JSON.stringify(api_data);
        console.log("State", window.last_state);

        document.getElementById('submit_button').disabled = false;

    } catch (error) {
        document.getElementById('submit_button').disabled = false;
        send_widget_message("عفوا حدث خطأ", true, middle_main_box, true);
        console.error("Error:", error);
    }
}



export async function SET_UPDATE_HFToken() {
    var user_jwt = window.current_jwt;

    try {// Check if token exists even decrypted , here we just want to know if the user has a token or not
        const res = await fetch(DB_HOST + "/tokens/huggingface/" + window.current_uid, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${user_jwt}`,
                "Content-Type": "application/json"
            },
            credentials: "include",
        });



        if (!res.ok) {
            throw new Error("HTTP Error " + res.status);
        }

        const api_response = await res.json();


        const TokenEncrypted = api_response.TokenEncrypted;
        if (TokenEncrypted) {
            Swal.fire({
                title: 'Hugging Face Token',
                text: 'موجدة فعلا توكين ! هل تريد تغييرها؟',
                inputPlaceholder: '',
                showCancelButton: true,
                confirmButtonText: 'ايوة',
                cancelButtonText: 'لا',

            }).then((result) => {
                if (result.isConfirmed) {
                    SETHFToken();
                }
            });

        } else {
            SETHFToken();
        }
    } catch (error) {
        Swal.fire({
            title: 'Auth Error',
            text: 'غير مسجل او حدث خطا',
            inputPlaceholder: '',
            showCancelButton: true,
            confirmButtonText: 'تمام',

        });
        console.error("Error fetching HF token: ", error);
    };
}
