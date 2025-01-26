
const today = new Date();
var month = today.getMonth() + 1;
var currentMonth;
const months = {
  "1": "január",
  "2": "február",
  "3": "marec",
  "4": "apríl",
  "5": "máj",
  "6": "jún",
  "7": "júl",
  "8": "august",
  "9": "september",
  "10": "október",
  "11": "november",
  "12": "december"
};

const firebaseConfig2 = {
    apiKey: "AIzaSyBrV61BioZrBJ9DhtvGC8AJO-F95gRDb3I",
    authDomain: "zuska-d6e19.firebaseapp.com",
    databaseURL: "https://zuska-d6e19-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "zuska-d6e19",
    storageBucket: "zuska-d6e19.firebasestorage.app",
    messagingSenderId: "503379932665",
    appId: "1:503379932665:web:202e0b62bc2c1dd0f27928",
    measurementId: "G-ELR3CN2FD7"
  };
  

  const secondApp = firebase.apps.find(app => app.name === "SecondApp")
  ? firebase.app("SecondApp")
  : firebase.initializeApp(firebaseConfig2, "SecondApp");


  const database2 = secondApp.database();
  const dbRef2 = database2.ref('/');
  
  async function LoadHistory() {
    try {
      const snapshot = await dbRef2.once('value');
      const data = snapshot.val();
  
      const dataArray = JSON.parse(JSON.stringify(data));
  
      return dataArray; 

    } catch (error) {
      console.error('Error fetching the database:', error);
      return []; 
    }
  }
  
  (async () => {
    const dataArray = await LoadHistory();
    dataArray.forEach((month, index) => {
        const element = document.createElement("button");
        const container = document.querySelector(".history");
        element.classList.add("mainButtons");
        
          container.appendChild(element);
          element.innerHTML = months[index+1];

          if (today.getMonth() >= index){
            element.addEventListener("click", () =>  {
            displayMonth(index,dataArray)
            currentMonth = index;
            document.getElementById("detail").scrollIntoView({ behavior: "smooth" });
            document.querySelector(".section").appendChild(button);

            
            })
         }
         if (today.getMonth() == index){
          element.style.backgroundColor = "green";
         }
          
          if (today.getMonth() < index){
            element.style.backgroundColor = "gray ";
            element.style.cursor = "not-allowed";
            
           }
      });
      
  })();


  async function removeSpecificEntry(month, day, entryIndex) {
    console.log(month,day,entryIndex)
    try {

      const entryRef = dbRef2.child(`${month}/${day}/${entryIndex}`);

      await entryRef.remove(); 
  
      console.log(`Entry ${entryIndex} for month ${month}, day ${day} removed successfully`);
      
    } catch (error) {
      console.error("Error removing entry:", error);
    }
  }
  

function displayClass(person, key, c){
    var div = document.createElement("div");
    div.classList.add("classDeatil")
    var x = document.createElement("h5");
    x.innerHTML = "Vymazať";
    x.classList.add("x");
    x.addEventListener("click",() => {
      console.log("ahoj")
      removeSpecificEntry(currentMonth, +key, c);
    })
    console.log(person)
    var arr = ["name","start","end"];
    for(var i = 0; i < 3; i++){
        var stat = document.createElement("p");
        stat.style.fontSize = "Small";
        stat.innerHTML = arr[i] + ": " + person[arr[i]];
        div.appendChild(stat);
    }
    div.appendChild(x);
    return div;
}

function displayMonth(index,dataArray){
    document.querySelector(".monthDetail").innerHTML = '';
    var monthInfo = dataArray[index];
    var m = document.createElement("h3");    
    m.innerHTML = months[index+1];
    document.querySelector(".monthDetail").appendChild(m);
    for(key in monthInfo){
      
      if (monthInfo[key] != null){
        var day = document.createElement("h5");
        day.innerHTML = key;
        var div =  document.createElement("div");
        div.appendChild(day);
        var c = 0;
        monthInfo[key].forEach(p => {
          try{
            if (p.name != undefined){

              var person = displayClass(p,key, c);
              div.appendChild(person);
              
            }
            c++; 
          }catch(err){}
         
        })
        div.style.width = "90%";
        document.querySelector(".monthDetail").appendChild(div);



      } 
    }
    var Addbutton = document.createElement("button");
    Addbutton.innerHTML = "pridať hodinu";
    Addbutton.classList.add("mainButtons");
    document.querySelector(".monthDetail").appendChild(Addbutton);
    Addbutton.addEventListener("click", () => {
      displayForm(index)
    });
}


async function addDataByMonthAndDay(month, day, newData) {
  try {
    const dayRef = dbRef2.child(month).child(day);

    const snapshot = await dayRef.once('value');
    const currentData = snapshot.val() || {};

    // Get all numeric indexes
    const indexes = Object.keys(currentData).map(Number);

    // Find the first available index
    let nextIndex = 0;
    while (indexes.includes(nextIndex)) {
      nextIndex++;
    }

    // Add data to the first available index
    await dayRef.child(nextIndex).set(newData);

    console.log(`Data added to month ${month}, day ${day} at index ${nextIndex}:`, newData);
  } catch (error) {
    console.error('Error adding data:', error);
  }
}



async function createForm(month) {
  const form = document.createElement('form');
  form.id = 'dynamicForm';

  const fields = [
    { label: 'Deň', type: 'number', name: 'day' },
    { label: 'Začiatok', type: 'time', name: 'start' },
    { label: 'Koniec', type: 'time', name: 'end' }
  ];

  var validPeople = await LoadPersons();
  var people = validPeople.filter(person => person !== null);
  const names = people.map(person => person.name); 

  const nameLabel = document.createElement('label');
  nameLabel.textContent = 'Meno: ';
  nameLabel.setAttribute('for', 'name');

  const nameDropdown = document.createElement('select');
  nameDropdown.name = 'name';
  nameDropdown.id = 'name';

  names.forEach((name, index) => {
    const option = document.createElement('option');
    option.value = index; 
    option.textContent = name;
    nameDropdown.appendChild(option);
  });

  form.appendChild(nameLabel);
  form.appendChild(nameDropdown);
  form.appendChild(document.createElement('br'));

  const inputFields = {}; 
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

    inputFields[field.name] = input; 
  });

  nameDropdown.addEventListener('change', () => {
    const selectedIndex = nameDropdown.value; 
    const selectedPerson = people[selectedIndex]; 

    if (selectedPerson) {
      inputFields['day'].value =  parseInt(parseFloat(today.getDate())); 
      inputFields['start'].value = selectedPerson.time || ''; 
      inputFields['end'].value = addDurationToTime(selectedPerson.time, selectedPerson.duration) || ''; 
    }
  });

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Pridať';
  submitButton.classList.add('mainButtons');
  form.appendChild(submitButton);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    addDataByMonthAndDay(month, formData.get('day'), {
      name: people[nameDropdown.value].name,
      start: formData.get('start'),
      end: formData.get('end')
    });
    document.querySelector(".formClass").innerHTML = "";
    document.querySelector(".formClass").style.display = "none";
  });

  return form;
}

function addDurationToTime(time, duration) {
  const [hours, minutes] = time.split(":").map(Number);

  const totalMinutes = hours * 60 + minutes +  parseInt(parseFloat(duration));
  parseInt(parseFloat(duration))

  const updatedHours = Math.floor(totalMinutes / 60) % 24; 
  const updatedMinutes = totalMinutes % 60;

  const formattedHours = String(updatedHours).padStart(2, "0");
  const formattedMinutes = String(updatedMinutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}


async function displayForm(month){
  
  var cancel = document.createElement("button");
  cancel.innerHTML = "Zrušiť";
  cancel.classList.add("mainButtons");
  cancel.style.backgroundColor = "red";
  var form = await createForm(month);
  document.querySelector(".formClass").appendChild(cancel);
  cancel.addEventListener("click", () => {
    document.querySelector(".formClass").innerHTML = "";
    document.querySelector(".formClass").style.display = "none";
  });
  form.classList.add("form");
  document.querySelector(".formClass").appendChild(form);
  document.querySelector(".formClass").style.display = "flex";
}


