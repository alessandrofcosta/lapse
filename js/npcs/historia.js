function renderNPCHistoria() {
    const main = document.querySelector('.js-main-historia');
    const historia = window.NPC_STORIES?.[nomeAcessoNPC];

    if (!main) {
        return;
    }

    if (!historia) {
        main.innerHTML = `
            <h1>História em construção</h1>
            <p>A história de <strong>${npcData[nomeAcessoNPC].info.nome}</strong> ainda não foi cadastrada.</p>
            <p>Adicione o conteúdo em <code>js/npcs/stories.js</code> para publicar sem criar um novo HTML.</p>
        `;
        return;
    }

    document.title = `${npcData[nomeAcessoNPC].info.nome} | História`;
    main.innerHTML = historia;
}

renderNPCHistoria();
