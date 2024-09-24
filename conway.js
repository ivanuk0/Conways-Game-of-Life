
let size = 45;
var statusList = {}, statusListUpdated = {};
let generation_counter = 1;
//Dear wander who came here. I appreciate your time checking my code, but I have a request...
//Do not learn programming by my code. I spent too little time to optimise my program and instead used time
//On the way it will look like. It is indeed fancy, but the code is just jugles.
//Good luck :)
var background_color = "white"; //white
var block_color = "black";      //black.

var speed = 100; //initial speed :D
let was_started;
let potential_cells_memory, potential_cells_memory_memory, interval, random_paint_density = 2, move = "click", random = false;

let mouse_moves = false;
const counter = document.getElementById("counter");

const rangeValue = document.getElementById("rangeValue");
const rangeInput = document.getElementById("rangeInput");

const label_size = document.getElementById("label-size");
const size_input = document.getElementById("size-input");
size_input.placeholder = size;

document.getElementById("reset").addEventListener("click", () => {
    reset();
})

const buttons_drag = document.getElementsByClassName('buttons')[0];

let isDragging = false; // to make it fall off when I stop grabbing
let offsetX, offsetY;

buttons_drag.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - buttons_drag.getBoundingClientRect().left;
    offsetY = e.clientY - buttons_drag.getBoundingClientRect().top;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener('mousemove', (e) => { // event is the reference to the available properties
    if (isDragging) {
        buttons_drag.style.left = `${e.clientX - offsetX}px`;
        buttons_drag.style.top = `${e.clientY - offsetY}px`;
    }
});

const intro = document.getElementById("intro"); //intro
const hide = document.getElementById("hide");
const introduction_container = document.getElementById("introduction-container");
const introduction2 = document.getElementById("introduction2");
const introduction = document.getElementById("introduction");
const body = document.getElementById("convas");
intro.addEventListener("click", () => {
    introduction_container.classList.remove("an");
    introduction.classList.remove("an");
    hide.classList.remove("an");
    introduction2.classList.remove("an");
    body.classList.remove("an");
    //gives the ability to use animations again
    window.scrollTo(0, 0); //moves the user at the beginning of the page
    
    setTimeout(() => {
        body.classList.add("an");
        hide.classList.add("an");
        introduction.classList.add("an");
        introduction2.classList.add("an");
        introduction_container.classList.add("an");
    }, 10)
})

function rangeInputChange() {
    rangeValue.textContent = "Interval in ms: " + rangeInput.value;
    speed = rangeInput.value;
}

rangeInputChange();
rangeInput.addEventListener("input", rangeInputChange);

function yes_was (was) {
    was_started = was;
}

size_input.addEventListener("change", function() {
    const size_input_value = size_input.value;
    size_input.placeholder = size_input_value;

    reset();
    size = Number(size_input_value);
    statusListUpdated = {};
    statusList = {};
    generation_counter = 0;
    counter.textContent = `generation: ${generation_counter}`;
    blockField();
})

const density_select = document.getElementById("density");
density_select.addEventListener("change", function() {
    let density = density_select.value;
    statusListUpdated = {};
    statusList = {};
    random = false;
    stop_interval();
    generation_counter = 0;
    was_started = false;
    if(density === "50%") {
        random_paint_density = 2;
    }
    if(density === "33%") {
        random_paint_density = 3;
    }
    if(density === "25%") {
        random_paint_density = 4;
    }
    if(density === "20%") {
        random_paint_density = 5;
    }
    if(density === "16%") {
        random_paint_density = 6;
    }
    random_paint();
})

const theme = document.getElementById("theme"); //mode change 
theme.addEventListener('change', function() {
    const selectedValue = theme.value;
    if(selectedValue === "light") {
        background_color = "#eee"; //light
        block_color = "#212121"; //dark
        counter.style.color = "#212121";
        label_size.style.color = "#212121";
        // New properties to CSS !
        document.documentElement.style.setProperty("--background-color", "#eee"); //for light
        document.documentElement.style.setProperty("--block-color", "#212121"); //for dark
        block_control("random");
        blockStatus(statusList);
    }
    if(selectedValue === "dark") {
        background_color = "#212121"; //dark
        block_color = "#eee"; //light
        counter.style.color = "#eee";
        label_size.style.color = "#eee";
        document.documentElement.style.setProperty("--background-color", "#212121"); //for dark
        document.documentElement.style.setProperty("--block-color", "#eee"); //for light
        block_control("random");
        blockStatus(statusList);
    }
});

document.getElementById("block-container").addEventListener('click', function(event) {
    if (event.target.classList.contains('block')) {
        const blockClassName = event.target.className;
        console.log('Clicked block:', blockClassName);
    }
});

function block_control(key) {
    for(let i = 1; i <= size*size; i++) {
        let blockClass = `block${i}`;
        let blockClassAccess = document.getElementsByClassName(blockClass)[0];
        if(key === "random") { //has ability to go through all blocks and make and operation with them
            blockClassAccess.style.border = `1px solid ${block_color}`;
            blockClassAccess.style.opacity = "0.2";
        }
    }
}

function blockField() {
  const container = document.getElementById("block-container");
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  container.innerHTML = "";
  if(size>50) {
    container.style.left = "0";
    container.style.transform = "none";
  } else {
    container.style.left = "50%";
    container.style.transform = "translateX(-50%)";
  }
  for(let i = 1; i < size*size + 1; i++) {
  	const block = document.createElement("div");
    let blockName = "block" + i.toString();
    block.className = blockName;
    container.appendChild(block);
    block.addEventListener(move, (event) => {
        const className = event.target.className;
        console.log('Clicked block:', className);
        singlePaint(className);
    });
    if(random){blockStatusRandom(blockName)}; 
  }
}

function singlePaint(block) {
    const elements = document.getElementsByClassName(block);
    for (const element of elements) {
        if (statusList[block]) {
            statusList[block] = false;
            element.style.backgroundColor = background_color;
        } else {
            statusList[block] = true;
            element.style.backgroundColor = block_color;
            element.style.opacity = "1";
        }
    }
}

function blockStatusRandom(block) { //paints blocks randomly
    const elements = document.getElementsByClassName(block);
    if (elements.length > 0) {
        const element = elements[0]; // Select the first element with the class
        if (Math.floor(Math.random() * random_paint_density + 1) === 1) {
            element.style.backgroundColor = block_color;
            statusList[block] = true;
        } else {
            element.style.backgroundColor = background_color;
            statusList[block] = false;
        }
    }
}

function blockStatus(list) { //it will update all the blocks by the list
    for (const [key, value] of Object.entries(list)) {
        const elements = document.getElementsByClassName(key);
        // Loop through each element with the class name
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (value === true) {
                element.style.backgroundColor = block_color;
                element.style.opacity = "1";
            } else {
                element.style.backgroundColor = background_color;
            }
        }
    }
}

function neighborhood (block) {
    const leftBoundary = block % size === 1; //for example size 30 the block was 31. It is then the left b.
    const rightBoundary = block % size === 0; //for example the block was 29 and the 30th wants to be affected. It's the right b. It will be prevented down below.

    const neighbors = [
        !leftBoundary ? block - size - 1 : null, // Top-left    //asks "is the block part of the left boundary digga?"
        block - size,                           // Top
        !rightBoundary ? block - size + 1 : null, // Top-right
        !leftBoundary ? block - 1 : null,       // Left
        !rightBoundary ? block + 1 : null,      // Right
        !leftBoundary ? block + size - 1 : null, // Bottom-left
        block + size,                           // Bottom
        !rightBoundary ? block + size + 1 : null // Bottom-right
    ];

    return neighbors.filter(neighbor => neighbor !== null); //fancy filter where the true return will allow the value to go through filtration
}

function destiny(block) {
    let counter = 0;
    const getStatus = (blockId) => statusList[blockId] === true;
    // Computes the positions of neighbors
    const neighbors = neighborhood(block);

    // Counts the number of live neighbors
    for (const neighbor of neighbors) {
        if (neighbor > 0 && getStatus("block" + neighbor)) {
            counter++;
        }
    }

    if (getStatus("block" + block)) { //the real destiny
        // Current block is alive
        return counter === 2 || counter === 3;
    } else {
        // Current block is dead
        return counter === 3; // it returns true / false
    }
}

var potential_cells = [];

function potential_cells_update (i, list) {
    if(list["block" + i]) {
        const neighbors = neighborhood(i);
        for (const neighbor of neighbors) {
            if (neighbor > 0) {
                potential_cells.push("block" + neighbor);
            }
        }
    }
}

function update() {
    statusListUpdated = {};
    potential_cells.forEach(block => { //we need several actions. We need a key to the whole list
        const elements = document.getElementsByClassName(block);
        for (const element of elements) {
            element.style.border = "1px solid " + block_color;
            element.style.opacity = "0.2"
        }
    });
    potential_cells_memory = [...potential_cells];
    potential_cells = [];
    for(let i = 1; i < size*size + 1; i++) {
        statusListUpdated["block" + i] = destiny(i);
        document.getElementsByClassName("block" + i)[0].style.opacity = "0.2";
        potential_cells_update (i, statusListUpdated);
    }
    blockStatus(statusListUpdated);
    statusList = statusListUpdated;

    console.log(potential_cells);
    potential_cells.forEach(block => { //we need several actions. We need a key to the whole list
        const elements = document.getElementsByClassName(block);
        for (const element of elements) {
            element.style.border = "1px solid gray";
            element.style.opacity = "1"
        }
    });
    counter.textContent = `generation: ${generation_counter}`
    if(potential_cells.length !== 0 && JSON.stringify(potential_cells_memory) !== JSON.stringify(potential_cells) && JSON.stringify(potential_cells_memory_memory) !== JSON.stringify(potential_cells)){generation_counter++};
    potential_cells_memory_memory = potential_cells_memory;
}

function start_click() { //the button "Next" activates manually the next generation update
    update();
}

function random_paint() {
    statusListUpdated = {};
    statusList = {};
    random = true;
    blockField();
    stop_interval();
    generation_counter = 0;
    counter.textContent = `generation: ${generation_counter}`;
    was_started = false;
}

function start() {
    if(was_started) { //FROM HERE      already done dw ;)
        return
    }
    interval = setInterval(() => update(), speed);
}
function stop_interval () {
    clearInterval(interval);
}

function reset() {
    statusListUpdated = {};
    statusList = {};
    random = false;
    stop_interval();
    generation_counter = 0;
    update();
    was_started = false;
}

blockField(); //essential. Is the start-to-build
