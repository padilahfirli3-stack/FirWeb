* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Impact', 'Segoe UI', sans-serif;
}

body {
    background-color: #555555; /* Warna abu-abu latar belakang */
    color: #ffffff;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
}

/* Tombol Account di Pojok Kanan Atas */
.top-bar {
    display: flex;
    justify-content: flex-end;
    width: 100%;
}

.account-btn {
    background-color: #ffffff;
    color: #000000;
    border: 3px solid #000000;
    padding: 8px 18px;
    font-size: 1.1rem;
    font-weight: bold;
    text-decoration: none;
    box-shadow: 4px 4px 0px #000000;
    border-radius: 4px;
    transition: 0.1s;
}

.account-btn:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px #000000;
}

/* Header Utama */
.main-header {
    text-align: center;
    margin-top: 10px;
}

.main-header h1 {
    font-size: 3rem;
    color: #ffffff;
    text-shadow: 3px 3px 0px #000000;
    letter-spacing: 2px;
}

.main-header p {
    font-size: 1rem;
    margin-top: 5px;
    text-shadow: 1px 1px 0px #000000;
}

/* Kotak Pilihan Game (Minecraft & Roblox) */
.menu-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 450px;
    width: 100%;
    margin: 0 auto;
}

.game-card {
    background-color: #ffffff;
    border: 4px solid #000000;
    border-radius: 8px;
    padding: 25px;
    text-align: center;
    text-decoration: none;
    box-shadow: 6px 6px 0px #000000;
    transition: 0.2s;
}

.game-card:hover {
    transform: translate(-3px, -3px);
    box-shadow: 9px 9px 0px #000000;
}

/* Gaya Teks Judul Game di dalam Kotak */
.game-card h2 {
    font-size: 3.5rem;
    letter-spacing: 2px;
}

.minecraft-text {
    color: #cc0000;
    -webkit-text-stroke: 1.5px #000000;
}

.roblox-text {
    color: #00ccff;
    -webkit-text-stroke: 1.5px #000000;
}

/* Footer & Sosmed */
footer {
    text-align: center;
    margin-bottom: 10px;
}

footer p {
    font-size: 0.9rem;
    margin-bottom: 10px;
    letter-spacing: 1px;
}

.social-icons {
    display: flex;
    justify-content: center;
    gap: 15px;
}

.social-icons a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 45px;
    background-color: #ffffff;
    border: 3px solid #000000;
    border-radius: 8px;
    color: #000000;
    font-weight: bold;
    text-decoration: none;
    box-shadow: 3px 3px 0px #000000;
    font-size: 1.1rem;
}

.social-icons a:hover {
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0px #000000;
}
