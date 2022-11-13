
        var  firebaseConfig = {
        apiKey: "AIzaSyAlyKAt0Eg57cb8GZDalCaEwIALPWPAEds",
        authDomain: "painel-loguin.firebaseapp.com",
        projectId: "painel-loguin",
        storageBucket: "painel-loguin.appspot.com",
        messagingSenderId: "24549930727",
        appId: "1:24549930727:web:98a17c160e55172c4bd442"
      };
        firebase.initializeApp(firebaseConfig);

        const storage = firebase.storage();
      const db = firebase.firestore()
        const auth = firebase.auth();




       
let caixa = []
let currentUser = {}

function getUser() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser.uid = user.uid
      readcaixa()
      let userLabel = document.getElementById("navbarDropdown")
      userLabel.innerHTML = user.email
   
    }
  })
}







function createDelButton(task) {
  const newButton = document.createElement("button")
  newButton.setAttribute("class", "btn btn-primary")
  newButton.appendChild(document.createTextNode("Excluir"))
  newButton.setAttribute("onclick", `deleteTask("${task.id}")`)
  return newButton
}

function rendercaixa() {
  let itemList = document.getElementById("itemList")
  itemList.innerHTML = ""
  for (let task of caixa) {
    const newItem = document.createElement("li")
    newItem.setAttribute(
      "class",
      "list-group-item d-flex justify-content-between",
    )
    newItem.appendChild(document.createTextNode(task.descricao))
    newItem.appendChild(createDelButton(task))
    itemList.appendChild(newItem)
  }
}

async function readcaixa() {
  caixa = []
  const logcaixa = await db
    .collection("caixa")
    .where("owner", "==", currentUser.uid)
    .get()
  for (doc of logcaixa.docs) {
    caixa.push({
      id: doc.id,
      descricao: doc.data().descricao,
    })
  }
  rendercaixa()
}

async function addTask() {
  const itemList = document.getElementById("itemList")
  const newItem = document.createElement("li")
  newItem.setAttribute("class", "list-group-item")
  newItem.appendChild(document.createTextNode("Adicionando na nuvem..."))
  itemList.appendChild(newItem)

  const descricao = document.getElementById("newItem").value
  await db.collection("caixa").add({
    descricao: descricao,
    owner: currentUser.uid,
  })


  
  readcaixa()
}

async function deleteTask(id) {
  await db.collection("caixa").doc(id).delete()
  readcaixa()
}

window.onload = function () {
  getUser()
}
