class Result {
    constructor(className, classRate) {
        this.className = className;
        this.classRate = classRate;
    }
}

let resultsList = [];

class Animal {
    constructor(image, title, description) {
        this.image = image;
        this.title = title;
        this.description = description;
    }
}

let animalsList = [
    new Animal("images/axolotl/axoRes.png", "Axolotl", "Fluide comme l'eau, tu t'adaptes à tout, et avec le sourire !"),
    new Animal("images/artace/artRes.png", "Artace", "Libre comme le vent, tu suis ton propre style !"),
    new Animal("images/lapin/lapRes.png", "Jorunna", "Surprenant, tu n'es jamais là où on t'attend !"),
    new Animal("images/moloch/molRes.png", "Moloch Horridus", "T'es patient et calme ... Jusqu'à ce que tu ne le sois plus !"),
    new Animal("images/panda/panRes.png", "Panda Roux", "Ta joie de vivre n'a d'égal que ta maladresse !"),
    new Animal("images/secretaire/secRes.png", "Messager Sagittaire", "Toujours classe, jamais une plume de travers ! Mais on te trouve quand même un peu snob ...")
]

function pop() {
    let pop = document.getElementById("pop");
    pop.play();
    console.log("pop!");
}


function addWebcam() {
    let webcamDiv = document.createElement("div");
    let labelDiv = document.createElement("div");
    let mainContent = document.getElementById("mainContent");
    let button = document.getElementById("button");

    webcamDiv.id = "webcam-container";
    labelDiv.id = "label-container";

    mainContent.appendChild(webcamDiv);
    mainContent.appendChild(labelDiv);
    mainContent.removeChild(button);
}

function count() {
    let mainContent = document.getElementById("mainContent");
    let count = document.createElement("div");
    let countLabel = document.createElement("h1");

    mainContent.appendChild(count);
    count.appendChild(countLabel);
    countLabel.id = "countH"; 

    let i = 3; 

    let intervalId = setInterval(function() {
        countLabel.textContent = i;
        i--; 
        if (i < 0) { 
            clearInterval(intervalId);
            mainContent.removeChild(count);
        }
    }, 900);
}

function removeWebcam() {
    let webCamDiv = document.getElementById("webcam-container");
    let labelDiv = document.getElementById("label-container");
    let mainContent = document.getElementById("mainContent");

    mainContent.removeChild(webCamDiv);
    mainContent.removeChild(labelDiv); 
}

function chooseClass() {
    let maxClassRate = 0;
    let maxResult;
    let index;
    let result = document.createElement("div");
    let home = document.createElement("div");
    let classPicture = document.createElement("img");
    let className = document.createElement("h3")
    let classDescription = document.createElement("p");
    let homeIcon = document.createElement("img");
    let mainContent = document.getElementById("mainContent");
    // let pop = document.createElement('audio');

    result.id = "result";
    home.id = "home";
    // pop.id = "pop";

    for (let result of resultsList) {
        if (result.classRate > maxClassRate) {
            maxClassRate = result.classRate;
            maxResult = result;
        }
    }

    index = resultsList.indexOf(maxResult);

    mainContent.appendChild(result);
    mainContent.appendChild(home);
    // mainContent.appendChild(pop);

    classPicture.src = animalsList[index].image;
    className.textContent = animalsList[index].title;
    classDescription.textContent = animalsList[index].description;
    homeIcon.src = "images/home.png";
    homeIcon.id = "homeIcon";
    // pop.src = "sounds/pop.wav";

    result.appendChild(classPicture);
    result.appendChild(className);
    result.appendChild(classDescription);
    home.appendChild(homeIcon);

    // document.getElementById("pop").play();

    pop();
    refresh();

}

// refresh page

function refresh() {
    let homeIcon = document.getElementById("homeIcon");
    homeIcon.addEventListener("click", function() {
        location.reload();
    })
}



const URL = "https://teachablemachine.withgoogle.com/models/88AnIDQi_/";

let model, webcam, labelContainer, maxPredictions;

        // Load the image model and setup the webcam
        async function init() {
            const modelURL = URL + "model.json";
            const metadataURL = URL + "metadata.json";
    
            // load the model and metadata
            model = await tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();
    
            // Convenience function to setup a webcam
            const flip = true;
            webcam = new tmImage.Webcam(300, 300, flip);
            await webcam.setup();
            await webcam.play();
            window.requestAnimationFrame(loop);

            pop();

            // // append elements to the DOM
            document.getElementById("webcam-container").appendChild(webcam.canvas);
            labelContainer = document.getElementById("label-container");
            for (let i = 0; i < maxPredictions; i++) { // and class labels
                labelContainer.appendChild(document.createElement("div"));
            }

            count(); 

            setTimeout(async() => {
                webcam.update();
                await predict();
                await webcam.stop();
                removeWebcam()
            }, 3000);

            
            
        }
    
        async function loop() {
            webcam.update(); // update the webcam frame
            window.requestAnimationFrame(loop);
        }
    
        // run the webcam image through the image model
        async function predict() {
            // predict can take in an image, video or canvas html element
            const prediction = await model.predict(webcam.canvas);
            let results = [];
            let className = "";
            let classRate = 0;

            for (let i = 0; i < maxPredictions; i++) {
                className = prediction[i].className;
                classRate = prediction[i].probability.toFixed(2);
                
                let newResult = new Result(className, classRate);

                resultsList.push(newResult);
                console.log(newResult);
            }
            chooseClass();
        }

        