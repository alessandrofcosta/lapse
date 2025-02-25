const senhasValidas = [
    "e14df2f7940ee091b49f6e383c161c774acf131ce8ae48cb6dde5deb3701ee84",
];


const acesso = localStorage.getItem("acesso");

if (!senhasValidas.includes(acesso)) {
    window.location.href = "../../espertinho.html";
}