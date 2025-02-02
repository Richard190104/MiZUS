
function makeButton(text){
    var button1 = document.createElement("button");
    button1.classList.add("mainButtons");
    button1.innerHTML = text;
    return button1;
} 

const firebaseConfig = {
    apiKey: "AIzaSyCnfjx3EtL5fl54JEOU-FEp3MWRsN90B18",
    authDomain: "zuska2.firebaseapp.com",
    databaseURL: "https://zuska2-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "zuska2",
    storageBucket: "zuska2.firebasestorage.app",
    messagingSenderId: "796100543979",
    appId: "1:796100543979:web:482cba4c96c674938905ae",
    measurementId: "G-345H2VG7D1"
  };
  
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  const dbRef3 = database.ref('/');
  
  async function LoadPersons() {
    try {
      const snapshot = await dbRef3.once('value');
      const data = snapshot.val();
      const dataArray = JSON.parse(JSON.stringify(data));
      return dataArray; 
    } catch (error) {
      console.error('Error fetching the database:', error);
      return []; 
    }
  }

  (async () => {
    
    const dataArray = await LoadPersons();
    if (dataArray != null){
        dataArray.forEach(person => {
        try{
          if (person.name != "None"){
            createBlock(person);
          }
        }
        catch(err){

        }
        }); 
    }
    addPerson();
  })();

  const dbRef = firebase.database().ref('/');

  async function addOrderedData(newData) {
    try {
      const snapshot = await dbRef.once('value');
      const currentData = snapshot.val() || [];
  
      const indexes = Object.keys(currentData).map(Number); // Convert keys to numbers
      const nextIndex = indexes.length > 0 ? Math.max(...indexes) + 1 : 0;
  
      await dbRef.child(nextIndex).set(newData);
  
    } catch (error) {
      console.error('Error adding ordered data:', error);
    }
  }
  function createForm() {
  
      const form = document.createElement('form');
      form.id = 'dynamicForm';
      const fields = [
        { label: 'Meno', type: 'text', name: 'name' },
        { label: 'Deň', type: 'text', name: 'day' },
        { label: 'Čas', type: 'time', name: 'time' },
        { label: 'Trvanie', type: 'number', name: 'duration' }
      ];
  
      fields.forEach(field => {
        const label = document.createElement('label');
        label.textContent = `${field.label}: `;
        label.setAttribute('for', field.name);
  
        const input = document.createElement('input');
        input.type = field.type;
        input.name = field.name;
        input.id = field.name;
  
        form.appendChild(label);
        form.appendChild(input);
  
        form.appendChild(document.createElement('br'));
      });
  
      const submitButton = document.createElement('button');
      submitButton.type = 'submit';
      submitButton.textContent = 'Submit';
      submitButton.classList.add("mainButtons")
  
      form.appendChild(submitButton);
  
      form.addEventListener('submit', (event) => {
        event.preventDefault(); 
        const formData = new FormData(form);
        addOrderedData({
          name: formData.get('name'),
          day: formData.get('day'),
          time: formData.get('time'),
          duration: formData.get('duration')
        });
        document.querySelector(".detail").innerHTML = "Žiak pridaný";
      });
      return form;
    }

  function addPerson(){
    var button = makeButton("+");
    var data = document.querySelector(".list");
    button.style.width = "50px";
    if (data != null){
        data.appendChild(button);
    }
    
    button.addEventListener("click", () => {
        var form = createForm();
        var detail = document.querySelector(".detail");
        detail.innerHTML = "";
        form.classList.add("form")
        detail.appendChild(form)
        document.getElementById("detail").scrollIntoView({ behavior: "smooth" });
    });  

  }

  async function removePersonByName(nameToDelete) {
    try {
      const snapshot = await dbRef.once('value'); // Fetch all data
      const data = snapshot.val();
  
      // Iterate over the database to find the node with the matching name
      for (let key in data) {
        if (data[key].name === nameToDelete) {
          await dbRef.child(key).remove(); // Delete the matching node
          console.log(`Person ${nameToDelete} removed successfully`);
          document.querySelector(".detail").innerHTML = `Žiak ${nameToDelete} bol vymazaný`;
          return; // Exit after deletion
        }
      }
  
      console.log(`No person found with name: ${nameToDelete}`);
      document.querySelector(".detail").innerHTML = `Žiak ${nameToDelete} nebol nájdený`;
    } catch (error) {
      console.error("Error removing person:", error);
    }
  }
  
  
  

  function LoadDetail(person){
    var circle = document.createElement("div");
    circle.classList.add("circle");
    var detail = document.querySelector(".detail");
    detail.innerHTML = "";
    var name = document.createElement("h3");
    var day = document.createElement("h4");
    var time = document.createElement("h4");
    var duration = document.createElement("h4");
    name.innerHTML = person.name;
    day.innerHTML = "Hodiny: " + person.day;
    time.innerHTML = "Čas: " + person.time;
    duration.innerHTML = "Trvanie: " + person.duration;
    circle.style.width = "100px";
    circle.style.height = "100px";
    circle.style.margin = "0";
    var x = document.createElement("h2");
    x.innerHTML = "Vymazať";
    x.classList.add("x");
    x.addEventListener("click", () => {
      if (confirm(`Naozaj chcete vymazať ${person.name}?`)) {
        removePersonByName(person.name); // Pass the name to delete
      }
    });
    
    detail.appendChild(circle);
    detail.appendChild(name)
    detail.appendChild(day)
    detail.appendChild(time)
    detail.appendChild(duration)
    detail.appendChild(x);
    
  }


  function createBlock(person){
    var block = document.createElement("div");
    var data = document.querySelector(".list");
    var circle = document.createElement("div");
    var p = document.createElement("p");
    p.innerHTML = person.name;
    p.style.backgroundColor = "rgba(160, 160, 160, 0)";
    circle.classList.add("circle");
    block.classList.add("block");
    
    if (data != null){
        data.appendChild(block);
    }
    
    block.appendChild(circle);
    block.appendChild(p);
    circle.addEventListener("click", () => {
        LoadDetail(person);
        document.getElementById("detail").scrollIntoView({ behavior: "smooth" });
    });
    
  }

