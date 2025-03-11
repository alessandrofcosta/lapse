document.addEventListener("DOMContentLoaded", function() {
    const senhasValidas = [
        "780a23528c754a504894e9747d7df4fde20e937d3e9e63a86c001eecb0908b46"
    ];

    const acesso = localStorage.getItem("acesso");

    if (!senhasValidas.includes(acesso)) {
        window.location.replace("../../../pages/espertinho.html");

    } else {
        document.body.style.display = "block";
    }
});
