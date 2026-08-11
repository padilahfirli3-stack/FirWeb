document.addEventListener("DOMContentLoaded", () => {
    // 1. Mengatur Status Login di index.html
    const userStatusSection = document.getElementById("user-status-section");
    const loggedUser = localStorage.getItem("firweb_logged_in");

    if (userStatusSection) {
        if (loggedUser) {
            userStatusSection.innerHTML = `
                <div class="user-profile">
                    <span>Halo, <b>${loggedUser}</b>! 👋</span>
                    <button class="logout-btn" id="logout-btn">Keluar</button>
                </div>
            `;
            
            document.getElementById("logout-btn").addEventListener("click", () => {
                localStorage.removeItem("firweb_logged_in");
                window.location.reload();
            });
        } else {
            userStatusSection.innerHTML = `
                <div style="text-align: right; margin-bottom: 20px;">
                    <a href="login.html" class="btn" style="background-color: #10b981; padding: 6px 14px;">Sign In / Sign Up</a>
                </div>
            `;
        }
    }

    // 2. Mengatur Form Login / Sign Up di login.html
    const authForm = document.getElementById("auth-form");
    const toggleModeBtn = document.getElementById("toggle-mode");
    const formTitle = document.getElementById("form-title");
    const submitBtn = document.getElementById("submit-btn");
    const toggleText = document.getElementById("toggle-text");
    
    let isSignUp = false;

    if (toggleModeBtn) {
        toggleModeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            isSignUp = !isSignUp;
            if (isSignUp) {
                formTitle.textContent = "Sign Up (Daftar Baru)";
                submitBtn.textContent = "Daftar Sekarang";
                toggleText.textContent = "Sudah punya akun?";
                toggleModeBtn.textContent = "Masuk (Sign In)";
            } else {
                formTitle.textContent = "Sign In";
                submitBtn.textContent = "Masuk";
                toggleText.textContent = "Belum punya akun?";
                toggleModeBtn.textContent = "Daftar (Sign Up)";
            }
        });
    }

    if (authForm) {
        authForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById("username").value;

            localStorage.setItem("firweb_logged_in", usernameInput);
            alert(isSignUp ? "Pendaftaran berhasil! Selamat datang." : "Berhasil masuk!");
            window.location.href = "index.html";
        });
    }
});
