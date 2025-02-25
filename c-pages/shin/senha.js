document.addEventListener("DOMContentLoaded", function() {
    const senhasValidas = [
        "5152cc21067154b896fa141c722693c01a0a71e777b36b563413a48cedac7183"
    ];

    const acesso = localStorage.getItem("acesso");

    if (!senhasValidas.includes(acesso)) {
        window.location.replace("../../espertinho.html");

    } else {
        document.body.style.display = "block";
    }
});
