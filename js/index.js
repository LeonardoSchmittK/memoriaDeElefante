// localstorage para ver se há alguma memória
if (!localStorage.getItem("memorias")) {
  localStorage.setItem("memorias", []);
}

let alreadySavedMemories = localStorage.getItem("memorias");

let arrayMemories = alreadySavedMemories
  ? JSON.parse(alreadySavedMemories)
  : [];

if (arrayMemories.length >= 0) {
}

document.addEventListener("DOMContentLoaded", function () {
  const buttonCreateMemoryEl = document.getElementById("buttonCreateMemory");
  const buttonSaveMemoryEl = document.getElementById("buttonSaveMemory");
  let isOkClipboard = false;
  let memory;
  if (buttonCreateMemoryEl) {
    buttonCreateMemoryEl.addEventListener("click", async function () {
      const text = await navigator.clipboard.readText();
      console.log("COPIADO___>" + text);
      if (
        text
          .trim()
          .split("")
          .every((item) => item == " ")
      ) {
        document.querySelector("#clipboard").innerHTML =
          "Primeiro, selecione um texto.";
        isOkClipboard = false;
      } else {
        memory = text;
        document.querySelector("#clipboard").innerHTML = text;
        isOkClipboard = true;
        document.querySelector(".title").innerHTML = "Texto selecionado!";
        document.querySelector("#confirmationP").innerHTML =
          "<img src='./images/ok.png' alt='ok'/>  Em 3 horas, volte aqui para testar seu aprendizado!";
        document.querySelector("#buttonCreateMemory").innerHTML =
          "Salvar Memória";
        document
          .querySelector("#buttonCreateMemory")
          .classList.add("invisible");
        document
          .querySelector("#buttonSaveMemory")
          .classList.remove("invisible");
      }
    });
  }

  if (buttonSaveMemoryEl) {
    buttonSaveMemoryEl.addEventListener("click", async function () {
      alreadySavedMemories = localStorage.getItem("memorias");

      memoryArray = alreadySavedMemories
        ? JSON.parse(alreadySavedMemories)
        : [];

      const newMemory = { text: memory, date: new Date().getTime() };

      memoryArray.push(newMemory);

      localStorage.setItem("memorias", JSON.stringify(memoryArray));

      const prompt = memory;

      fetch("https://api-ai-seven.vercel.app/gerarQuestoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt }),
      })
        .then((response) => response.json())
        .then((data) => {
          document.getElementById("response").innerHTML = JSON.parse(
            JSON.stringify(data)
          ).text;
        })
        .catch((error) => {
          console.error("Error:", error);
          document.getElementById("response").textContent = `Error: ${error}`;
        });

      document.querySelector(".title").innerHTML = "Memória salva!";
      document
        .querySelectorAll("button")
        .forEach((btn) => btn.classList.add("invisible"));
      document
        .querySelectorAll("p")
        .forEach((p) => p.classList.add("invisible"));
    });
  }
});
