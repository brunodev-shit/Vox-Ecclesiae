// Vox Ecclesiae — Bíblia
// Acordeão com animação de altura + busca de livros em tempo real

document.addEventListener("DOMContentLoaded", () => {
  const grupos = document.querySelectorAll(".grupo");

  // ---------- Acordeão suave (anima abrir/fechar dos <details>) ----------
  grupos.forEach((grupo) => {
    const summary = grupo.querySelector("summary");
    const lista = grupo.querySelector(".livros");

    // embrulha a lista para poder animar a altura sem afetar o layout do <details>
    const wrapper = document.createElement("div");
    wrapper.className = "grupo__conteudo";
    grupo.insertBefore(wrapper, lista);
    wrapper.appendChild(lista);

    summary.addEventListener("click", (evento) => {
      evento.preventDefault();

      const estaAberto = grupo.hasAttribute("open");

      if (estaAberto) {
        // fechar com animação
        wrapper.style.height = wrapper.scrollHeight + "px";
        requestAnimationFrame(() => {
          wrapper.style.height = "0px";
        });
        wrapper.addEventListener(
          "transitionend",
          () => {
            grupo.removeAttribute("open");
          },
          { once: true }
        );
      } else {
        // abrir com animação
        grupo.setAttribute("open", "");
        wrapper.style.height = "0px";
        requestAnimationFrame(() => {
          wrapper.style.height = wrapper.scrollHeight + "px";
        });
        wrapper.addEventListener(
          "transitionend",
          () => {
            wrapper.style.height = "auto";
          },
          { once: true }
        );
      }
    });
  });

  // ---------- Busca de livros ---------- 
  const campoBusca = document.getElementById("buscaLivro");
  const avisoVazio = document.getElementById("buscaVazio");
  const todosOsLivros = document.querySelectorAll(".livros li");

  const normalizar = (texto) =>
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // remove acentos

  campoBusca.addEventListener("input", () => {
    const termo = normalizar(campoBusca.value.trim());
    let algumVisivel = false;

    todosOsLivros.forEach((item) => {
      const nomeOriginal = item.textContent.replace("em breve", "").trim();
      const nomeNormalizado = normalizar(nomeOriginal);
      const corresponde = termo === "" || nomeNormalizado.includes(termo);

      item.classList.toggle("oculto", !corresponde);

      const grupo = item.closest(".grupo");
      if (corresponde && termo !== "") {
        algumVisivel = true;
        // abre automaticamente o grupo que contém o resultado
        if (!grupo.hasAttribute("open")) {
          grupo.querySelector("summary").click();
        }
      }
      if (corresponde) algumVisivel = true;
    });

    avisoVazio.hidden = termo === "" || algumVisivel;
  });
});