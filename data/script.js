

function makeButton(text){
    var button1 = document.createElement("button");
    button1.classList.add("mainButtons");
    button1.innerHTML = text;
    return button1;
} 

function addBaseScreen(){
    var beg = document.createElement("div");
    var button1 = makeButton("Kalendár");
    var button2 = makeButton("Moji žiaci");

    beg.style.height = "100%";
    beg.style.width = "100%";
    beg.style.position = "fixed"
    beg.style.backgroundColor = "rgb(160, 160, 160)";
    beg.style.top = "0";
    beg.style.left = "0";
    beg.style.display = "flex";
    beg.style.flexDirection = "column";
    beg.style.justifyContent = "center";
    beg.style.alignItems = "center";

    beg.appendChild(button1);
    beg.appendChild(button2);
    document.body.appendChild(beg)

    button1.addEventListener("click", () => {
        document.body.removeChild(beg);
        var backButton =  makeButton("<");
        backButton.style.width = "50px";
        document.querySelector(".back").appendChild(backButton)
        backButton.addEventListener("click", () => {
            document.querySelector(".back").removeChild(backButton);
            addBaseScreen();
        });
    });

    button2.addEventListener("click", () => {
        window.location = "addPupils.html"
    });
    
}

addBaseScreen()

