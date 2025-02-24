const senhasValidas = [
    "eba6fd0e1aec9c8bda8e4b8f7e4e540bf0bdd03a1e95217a2f096ac66a7fa1ae",
];


const acesso = localStorage.getItem("acesso");

if (!senhasValidas.includes(acesso)) {
    window.location.href = "../../espertinho.html";
}