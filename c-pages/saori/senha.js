const senhasValidas = [
    "75ab4003f1edfdf6fd43b0eaa5801fab1dab2ebb4572098e8dc89b7758c3c0a4",
];


const acesso = localStorage.getItem("acesso");

if (!senhasValidas.includes(acesso)) {
    window.location.href = "../../espertinho.html";
}