const BASE_URL = "https://read-mail-code-production.up.railway.app/";

document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
        document
            .querySelectorAll(".tab")
            .forEach((t) => t.classList.remove("active"));
        document
            .querySelectorAll(".tab-content")
            .forEach((c) => c.classList.remove("active"));
        tab.classList.add("active");
        document
            .getElementById(`tab-${tab.dataset.tab}`)
            .classList.add("active");
    });
});

const handleCreateMailTM = async () => {
    const result = document.querySelector(".result_create_email");

    result.classList.add("loading-dots");
    result.innerText = "";

    try {
        const res = await fetch("https://read-mail-code-production.up.railway.app/create-email");
        const data = await res.json();

        if (!!data.email && !!data.password) {
            result.classList.remove("loading-dots");
            result.innerText = `${data.email}|${data.password}`;
        } else {
            result.classList.remove("loading-dots");
            result.innerText = "Error: Invalid data.";
        }
    } catch (err) {
        result.classList.remove("loading-dots");
        result.innerText = "Fetch failed.";
    }
};

async function callAPI(type, options = {}) {
    const input = document.getElementById(`${type}-input`).value.trim();
    const output = document.getElementById(`output-${type}`);
    const spinner = document.getElementById(`spinner-${type}`);
    const parts = input.split("|");

    let url = "";
    output.innerText = "";
    spinner.style.display = "block";

    try {
        switch (type) {
            case "mailtm": {
                const [email, password] = parts;
                url = `${BASE_URL}get-code?email=${email}&password=${password}`;
                break;
            }
            case "privatemail": {
                const [emailUser, emailPass, targetEmail] = parts;
                url = `${BASE_URL}get-private-code?emailUser=${emailUser}&emailPass=${emailPass}&targetEmail=${targetEmail}`;
                break;
            }
            case "tempmail": {
                const [id, key] = parts;
                url = `${BASE_URL}get-code-tempmail?id=${id}&key=${key}`;
                break;
            }
            case "gemmmo": {
                const [email, password] = parts;
                url = `${BASE_URL}get-code-gemmmo?email=${email}&password=${password}`;
                break;
            }
            case "hotmail": {
                const [email, refresh_token, client_id] = parts;
                url = `${BASE_URL}read-hotmail?email=${email}&refresh_token=${refresh_token}&client_id=${client_id}`;
                break;
            }
            case "unlimitmail": {
                const [email, token] = parts;
                url = `${BASE_URL}get_unlimitmail_code?email=${email}&token=${token}`;
                break;
            }
            case "domainmail": {
                const [token, email, account_id] = parts;
                if (options.action === 'get-code') {
                    url = `${BASE_URL}get-domainmail-code?token=${token}&email=${email}&account_id=${account_id}`;
                } else {
                    url = `${BASE_URL}get-link-verify?token=${token}&email=${email}&account_id=${account_id}`;
                }
                break;
            }
            default:
                output.innerText = "Loại không hỗ trợ.";
                output.removeAttribute("data-code");
                spinner.style.display = "none";
                return;
        }

        const res = await fetch(url);
        const data = await res.json();
        const result = data.code || data.token || data.link || "Không có";
        output.innerHTML = `<span style="font-weight: bold; color: red">Kết quả: </span><span style="color: #27ae60;">${result}</span>`;
    } catch (err) {
        output.innerText = `<span style="font-weight: bold; color: red">Kết quả: </span><span style="color: #27ae60;">Lỗi gọi API!</span>`;
    } finally {
        spinner.style.display = "none";
    }
}
