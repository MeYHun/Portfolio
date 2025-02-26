const tabs = document.querySelectorAll('nav ul li a');
const tabContents = document.querySelectorAll('.tab-content');
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const body = document.body;
const bio = document.querySelector('.bio');
        
//Menu tab for projects
document.addEventListener("DOMContentLoaded", function() {
    let projectLinks = document.querySelectorAll(".project-link");
    let projects = document.querySelectorAll(".project");
    let mainContent = document.querySelector("#main");
    let projectsTab = document.getElementById("projects");

    function hideAllProjects() {
        projects.forEach(project => project.style.display = "none");
        if (mainContent) {
            mainContent.style.display = "none";
        }
    }

    projectLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            hideAllProjects();

            if (projectsTab) {
                projectsTab.classList.add("active");
            }

            let targetProject = document.getElementById(this.dataset.target);
            if (targetProject) {
                targetProject.style.display = "block";

                // Ensure Algorithm Visualizer canvas resets correctly
                if (targetProject.id === "algorithm-visualizer") {
                    setTimeout(() => {
                        resizeCanvas();
                        drawCanvasPlaceholder();
                    }, 100);
                }
            }
        });
    });
});


function resizeCanvas() {
    const canvas = document.getElementById("algorithm-canvas");

    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        console.error("Canvas not found or not a valid canvas element.");
        return;
    }

    canvas.width = canvas.parentElement.clientWidth - 20; // Adjust width dynamically
    canvas.height = 400; // Maintain consistent height
}

document.addEventListener("DOMContentLoaded", function () {
    const algorithmSelect = document.getElementById("algorithm");
    const runButton = document.getElementById("run-algorithm");

    function runAlgorithm() {
        console.log("Algorithm Run Button Clicked");

        const selectedAlgorithm = algorithmSelect.value;
        console.log("Selected Algorithm:", selectedAlgorithm);

        switch (selectedAlgorithm) {
            case "insertion":
                visualizeInsertionSort();
                break;
            case "binary":
                visualizeBinarySearch();
                break;
            case "bfs":
                visualizeBreadthFirstSearch();
                break;
            case "merge":
                visualizeMergeSort();
                break;
            case "quick":
                visualizeQuickSort();
                break;
            case "greedy":
                visualizeGreedyAlgorithm();
                break;
            case "dfs":
                visualizeDepthFirstSearch();
                break;
            default:
                alert("Please select an algorithm.");
        }
    }

    // ✅ Ensure only ONE event listener is attached
    runButton.onclick = runAlgorithm;
});


function drawCanvasPlaceholder() {
    const canvas = document.getElementById("algorithm-canvas");

    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        console.error("Algorithm visualizer canvas not found!");
        return;
    }

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#aaa";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Select an Algorithm and Click Run", canvas.width / 2, canvas.height / 2);
}
// 다크 모드 토글 함수
function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    darkModeToggle.textContent = isDarkMode ? 'LIGHT' : 'DARK';

    const skills = document.querySelectorAll('.skill');
    skills.forEach(skill => {
        skill.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--skill-bg');
        skill.style.color = getComputedStyle(document.documentElement).getPropertyValue('--skill-text');
    });
}
        
// 저장된 다크 모드 설정 불러오기
const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === 'true') {
    body.classList.add('dark-mode');
    darkModeToggle.textContent = 'LIGHT';
}
        
// 다크 모드 버튼 이벤트 리스너
darkModeToggle.addEventListener('click', toggleDarkMode);
        
// ... (기존 탭 관련 스크립트 유지) ...
        
function showContent(tabId) {
    tabContents.forEach(content => content.classList.remove('active'));
    const selectedContent = document.getElementById(tabId);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
    bio.style.display = tabId === 'main' ? 'block' : 'none';
}
        
tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = tab.getAttribute('href').substring(1);
                
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        if (tabId === 'about') {
            const youngPhoto = document.getElementById('young-photo');
            const currentPhoto = document.getElementById('current-photo');
                    
            youngPhoto.style.animation = 'none';
            currentPhoto.style.animation = 'none';
                    
            setTimeout(() => {
                youngPhoto.style.animation = '';
                currentPhoto.style.animation = '';
            }, 10);
        }
                
        showContent(tabId);
    });
});
        
function showMainContent() {
    showContent('main');
    tabs.forEach(t => t.classList.remove('active'));
}
        
// 페이지 로드시 메인 컨텐츠 표시
showMainContent();
        
// 이름/제목 클릭시 메인 페이지로 돌아가기
document.querySelector('h1').addEventListener('click', showMainContent);


//Algorithm Visualization Part
const algorithmSelect = document.getElementById('algorithm');
const runButton = document.getElementById('run-algorithm');
const canvas = document.getElementById('algorithm-canvas');
const stepsContainer = document.getElementById("steps-container");
const ctx = canvas.getContext('2d');

// runButton.addEventListener('click', () => {
//     const selectedAlgorithm = algorithmSelect.value;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
            
//     switch (selectedAlgorithm) {
//         case 'insertion':
//             visualizeInsertionSort();
//             break;
//         case 'binary':
//             visualizeBinarySearch();
//             break;
//         case 'bfs':
//             visualizeBreadthFirstSearch();
//             break;
//         case 'merge':
//             visualizeMergeSort();
//             break;
//         case 'quick':
//             visualizeQuickSort();
//             break;
//         case 'greedy':
//             visualizeGreedyAlgorithm();
//             break;
//         case 'dfs':
//             visualizeDepthFirstSearch();
//             break;
//         default:
//             alert('Please select a valid algorithm.');
//     }
// });







function visualizeInsertionSort() {
    console.log('Starting Insertion Sort visualization.\n');
    console.log('\n');


    const barCount = parseInt(prompt('Enter the number of bars (e.g., 5, 10, 15):', '10')) || 10;
    const array = Array.from({ length: barCount }, () => Math.floor(Math.random() * 20) + 1);
    const canvas = document.getElementById('algorithm-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 400;
    const barWidth = canvas.width / array.length;
    const delay = 500;

    // Create or reset the steps container
    let stepsElement = document.getElementById('steps-container');
    if (!stepsElement) {
        stepsElement = document.createElement('div');
        stepsElement.id = 'steps-container';
        stepsElement.style.marginTop = '20px';
        stepsElement.style.fontSize = '16px';
        stepsElement.style.textAlign = 'center';
        stepsElement.style.color = 'var(--text-color)';
        document.getElementById('visualizer-container').appendChild(stepsElement);
    } else {
        console.log('Clearing previous steps.');
        stepsElement.innerHTML = '';
    }

    // Function to append a step
    function addStep(message) {
        console.log('Step:', message);
        const step = document.createElement('div');
        step.textContent = message;
        stepsElement.appendChild(step);
    }

    // Function to draw the array bars
    function drawArray(arr, highlightIndex = -1) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        arr.forEach((value, index) => {
            // Modern color theme
            ctx.fillStyle = index === highlightIndex ? '#cbf3dc' : '#aed6f1'; // Highlight in green and bars in light blue
            ctx.strokeStyle = '#ffffff'; // White border for bars
            ctx.lineWidth = 2;

            // Draw bar with rounded corners
            const x = index * barWidth;
            const barHeight = value * 15; // Adjust height scaling
            const y = canvas.height - barHeight;

            ctx.beginPath();
            ctx.moveTo(x, y); // Top left corner
            ctx.lineTo(x, canvas.height); // Bottom left corner
            ctx.lineTo(x + barWidth - 4, canvas.height); // Bottom right corner
            ctx.lineTo(x + barWidth - 4, y); // Top right corner
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        });
    }

    // Function to perform insertion sort with visualization
    async function sortArray() {
        addStep('Starting Insertion Sort...');
        for (let i = 1; i < array.length; i++) {
            let key = array[i];
            let j = i - 1;

            addStep(`Picking element ${key} at index ${i}.`);
            console.log(`Element picked: ${key} at index ${i}`);
            await new Promise(resolve => setTimeout(resolve, delay));

            while (j >= 0 && array[j] > key) {
                console.log(`Comparing ${array[j]} > ${key}. Shifting element.`);
                array[j + 1] = array[j];
                drawArray(array, j + 1);
                addStep(`Comparing and shifting: ${array[j]} > ${key}`);
                await new Promise(resolve => setTimeout(resolve, delay));
                j = j - 1;
            }

            array[j + 1] = key;
            drawArray(array, i);
            addStep(`Placed ${key} at position ${j + 1}.`);
            console.log(`Element ${key} placed at position ${j + 1}.`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        drawArray(array);
        addStep('Insertion Sort Completed!');
        console.log('Insertion Sort Completed.');
    }

    drawArray(array); // Draw the initial array
    sortArray(); // Start sorting
}






function visualizeBinarySearch() {
    console.log('Starting Binary Search visualization.');

    // Dynamic array length input
    console.log("Prompting user for array length...");
    const arrayLength = parseInt(prompt('Enter the number of elements in the array (e.g., 5, 10, 15):', '10')) || 10;

    // Generate sorted random array
    const array = Array.from({ length: arrayLength }, () => Math.floor(Math.random() * 100))
        .sort((a, b) => a - b);

    // Target element to search
    console.log("Prompting user for target value...");
    const target = parseInt(prompt('Enter the target value to search for:', '50')) || 50;

    console.log("Binary Search: User entered array length:", arrayLength);
    console.log("Binary Search: User entered target value:", target);

    console.log("Starting binary search on array:", array);

            


    const barWidth = canvas.width / array.length; // Calculate bar width
    const delay = 500; // Delay for visualization steps

    // Create or reset the steps container
    let stepsElement = document.getElementById('steps-container');
    if (!stepsElement) {
        stepsElement = document.createElement('div');
        stepsElement.id = 'steps-container';
        stepsElement.style.marginTop = '20px';
        stepsElement.style.fontSize = '16px';
        stepsElement.style.textAlign = 'center';
        stepsElement.style.color = 'var(--text-color)';
        document.getElementById('visualizer-container').appendChild(stepsElement);
    } else {
        console.log('Clearing previous steps.');
        stepsElement.innerHTML = ''; // Clear previous steps
    }

    // Function to append a step
    function addStep(message) {
        console.log('Step:', message);
        const step = document.createElement('div');
        step.textContent = message;
        stepsElement.appendChild(step);
    }

    // Function to draw the array
    function drawArray(arr, low, high, mid) {
        console.log('Drawing array:', arr, 'Low:', low, 'High:', high, 'Mid:', mid);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        arr.forEach((value, index) => {
            ctx.fillStyle = index === mid ? '#cbf3dc' : (index >= low && index <= high ? '#aed6f1' : 'gray');
            ctx.fillRect(index * barWidth, canvas.height - value * 5, barWidth - 2, value * 5);
        });
    }

    // Perform binary search with visualization
    async function binarySearch(arr, target) {
        let low = 0;
        let high = arr.length - 1;

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            drawArray(arr, low, high, mid);
            addStep(`Checking middle index ${mid}, value: ${arr[mid]}`);

            await new Promise(resolve => setTimeout(resolve, delay));

            if (arr[mid] === target) {
                addStep(`Target ${target} found at index ${mid}`);
                console.log(`Target ${target} found at index ${mid}`);
                return;
            } else if (arr[mid] < target) {
                addStep(`Target ${target} is greater than ${arr[mid]}, searching right half.`);
                low = mid + 1;
            } else {
                addStep(`Target ${target} is less than ${arr[mid]}, searching left half.`);
                high = mid - 1;
            }
        }

        addStep(`Target ${target} not found in the array.`);
        console.log(`Target ${target} not found.`);
    }

    drawArray(array, 0, array.length - 1, -1); // Draw initial array
    binarySearch(array, target); // Start Binary Search
}




        







    

function visualizeBreadthFirstSearch() {
    console.log('Starting Breadth-First Search visualization.');

    const nodeCount = parseInt(prompt('Enter the number of nodes (e.g., 5, 10):', '10')) || 10;
    const arr = Array.from({ length: nodeCount }, (_, i) => i + 1);

    const tree = createBinaryTree(arr);
    const positions = {};
    const visited = [];
    const delay = 500;
    const canvas = document.getElementById('algorithm-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 400;

    const stepsContainer = document.getElementById('steps-container');
    if (!stepsContainer) {
        console.error('Steps container not found!');
        return;
    }
    stepsContainer.innerHTML = '<h4>Visited Nodes</h4>'; // Initialize steps container

    function calculatePositions(node, level, xOffset, width) {
        if (!node) return;
        positions[node.value] = { x: xOffset, y: level * 80 + 50 };
        const gap = width / 2;
        calculatePositions(node.left, level + 1, xOffset - gap, gap);
        calculatePositions(node.right, level + 1, xOffset + gap, gap);
    }

    function drawTree(current) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        function drawEdges(node) {
            if (!node) return;
            const pos = positions[node.value];
            if (node.left) {
                const leftPos = positions[node.left.value];
                ctx.strokeStyle = '#ccc';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
                ctx.lineTo(leftPos.x, leftPos.y);
                ctx.stroke();
            }
            if (node.right) {
                const rightPos = positions[node.right.value];
                ctx.strokeStyle = '#ccc';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
                ctx.lineTo(rightPos.x, rightPos.y);
                ctx.stroke();
            }
            drawEdges(node.left);
            drawEdges(node.right);
        }
        drawEdges(tree);

        function drawNodes(node) {
            if (!node) return;
            const { x, y } = positions[node.value];
            ctx.fillStyle = visited.includes(node.value) ? '#aed6f1' : '#e0e0e0';
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, 2 * Math.PI);
            ctx.fill();
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = '#333';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.value, x, y);
            drawNodes(node.left);
            drawNodes(node.right);
        }
        drawNodes(tree);

        if (current !== undefined) {
            const { x, y } = positions[current];
            ctx.strokeStyle = '#6bdd9c ';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, 24, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }

    async function bfs(root) {
        const queue = [root];
        while (queue.length > 0) {
            const current = queue.shift();
            if (!visited.includes(current.value)) {
                visited.push(current.value);
                stepsContainer.innerHTML += `<p>Visited Node: ${current.value}</p>`; // Add node to the steps container
                drawTree(current.value);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
            if (current.left) queue.push(current.left);
            if (current.right) queue.push(current.right);
        }
    }

    calculatePositions(tree, 0, canvas.width / 2, canvas.width / 4);
    drawTree();
    bfs(tree);
}







        
function visualizeMergeSort() {
    console.log('Starting Merge Sort visualization.');

    // Prompt the user for the array size
    const arraySize = parseInt(prompt('Enter the size of the array to sort (e.g., 5, 10):', '10')) || 10;

    // Generate a random array of integers
    const array = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100));
    console.log('Array to sort:', array);

    const delay = 500;

    // Create or reset the steps container below the canvas
    let stepsElement = document.getElementById('steps-container');
    if (!stepsElement) {
        stepsElement = document.createElement('div');
        stepsElement.id = 'steps-container';
        stepsElement.style.marginTop = '20px';
        stepsElement.style.fontSize = '16px';
        stepsElement.style.textAlign = 'center';
        stepsElement.style.color = 'var(--text-color)';
        document.getElementById('visualizer-container').appendChild(stepsElement);
    } else {
        console.log('Clearing previous steps.');
        stepsElement.innerHTML = ''; // Clear previous steps
    }

    // Add a step to the steps container
    function addStep(message) {
        console.log('Step:', message);
        const step = document.createElement('div');
        step.textContent = message;
        stepsElement.appendChild(step);
    }

    // Draw the array on the canvas
    function drawArray(highlightIndices = []) {
        const canvas = document.getElementById('algorithm-canvas');
        const ctx = canvas.getContext('2d');
        const barWidth = canvas.width / arraySize;
        const maxBarHeight = canvas.height - 20;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        array.forEach((value, index) => {
            const barHeight = (value / 100) * maxBarHeight;
            ctx.fillStyle = highlightIndices.includes(index) ? '#cbf3dc' : '#aed6f1'; // Highlight the current indices
            ctx.fillRect(index * barWidth, canvas.height - barHeight, barWidth - 2, barHeight); // Draw the bar
        });
    }

    // Perform Merge Sort
    async function mergeSort(left, right) {
        if (left >= right) return;

        const mid = Math.floor((left + right) / 2);

        // Divide the array
        await mergeSort(left, mid);
        await mergeSort(mid + 1, right);

        // Merge the sorted halves
        await merge(left, mid, right);
    }

    // Merge two sorted subarrays
    async function merge(left, mid, right) {
        const leftArray = array.slice(left, mid + 1);
        const rightArray = array.slice(mid + 1, right + 1);

        let i = 0, j = 0, k = left;

        while (i < leftArray.length && j < rightArray.length) {
            if (leftArray[i] <= rightArray[j]) {
                array[k] = leftArray[i];
                i++;
            } else {
                array[k] = rightArray[j];
                j++;
            }
            addStep(`Merged ${array[k]} into position ${k}`);
            drawArray([k]); // Highlight the current bar being updated
            k++;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }

        while (i < leftArray.length) {
            array[k] = leftArray[i];
            addStep(`Copied ${array[k]} from left subarray to position ${k}`);
            drawArray([k]);
            i++;
            k++;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }

        while (j < rightArray.length) {
            array[k] = rightArray[j];
            addStep(`Copied ${array[k]} from right subarray to position ${k}`);
            drawArray([k]);
            j++;
            k++;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    // Initialize the visualization
    async function startVisualization() {
        console.log('Starting Merge Sort...');
        drawArray(); // Initial array
        addStep(`Initial Array: ${array.join(', ')}`);
        await mergeSort(0, array.length - 1);
        addStep(`Sorted Array: ${array.join(', ')}`);
        drawArray(); // Final sorted array
    }

    startVisualization();
}








function visualizeQuickSort() {
    console.log('Starting Quick Sort visualization.');

    // Prompt the user for the array size
    const arraySize = parseInt(prompt('Enter the size of the array to sort (e.g., 5, 10):', '10')) || 10;

    // Generate a random array of integers
    const array = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100));
    console.log('Array to sort:', array);

    const delay = 500;

    // Create or reset the steps container below the canvas
    let stepsElement = document.getElementById('steps-container');
    if (!stepsElement) {
        stepsElement = document.createElement('div');
        stepsElement.id = 'steps-container';
        stepsElement.style.marginTop = '20px';
        stepsElement.style.fontSize = '16px';
        stepsElement.style.textAlign = 'center';
        stepsElement.style.color = 'var(--text-color)';
        document.getElementById('visualizer-container').appendChild(stepsElement);
    } else {
        console.log('Clearing previous steps.');
        stepsElement.innerHTML = ''; // Clear previous steps
    }

    // Add a step to the steps container
    function addStep(message) {
        console.log('Step:', message);
        const step = document.createElement('div');
        step.textContent = message;
        stepsElement.appendChild(step);
    }

    // Draw the array on the canvas
    function drawArray(highlightIndices = [], pivotIndex = -1) {
        const canvas = document.getElementById('algorithm-canvas');
        const ctx = canvas.getContext('2d');
        const barWidth = canvas.width / arraySize;
        const maxBarHeight = canvas.height - 20;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        array.forEach((value, index) => {
            const barHeight = (value / 100) * maxBarHeight;

            // Highlight the pivot element
            if (index === pivotIndex) {
                ctx.fillStyle = '#cbf3dc '; // Pivot in red
            } else if (highlightIndices.includes(index)) {
                ctx.fillStyle = '#aed6f1 '; // Current elements being compared
            } else {
                ctx.fillStyle = '#d3d3d3'; // Default bar color
            }

            ctx.fillRect(index * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
        });
    }

    // Perform Quick Sort
    async function quickSort(left, right) {
        if (left >= right) return;

        // Partition the array
        const pivotIndex = await partition(left, right);

        // Recursively sort the left and right partitions
        await quickSort(left, pivotIndex - 1);
        await quickSort(pivotIndex + 1, right);
    }

    // Partition the array
    async function partition(left, right) {
        const pivot = array[right]; // Last element as pivot
        let i = left - 1;

        addStep(`Pivot selected: ${pivot} at index ${right}`);
        drawArray([], right); // Highlight the pivot element
        await new Promise((resolve) => setTimeout(resolve, delay));

        for (let j = left; j < right; j++) {
            if (array[j] < pivot) {
                i++;
                [array[i], array[j]] = [array[j], array[i]]; // Swap smaller elements with i
                addStep(`Swapped ${array[i]} and ${array[j]}`);
                drawArray([i, j], right); // Highlight elements being swapped
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }

        // Place the pivot element in its correct position
        [array[i + 1], array[right]] = [array[right], array[i + 1]];
        addStep(`Placed pivot ${array[i + 1]} at index ${i + 1}`);
        drawArray([i + 1], i + 1); // Highlight the pivot's final position
        await new Promise((resolve) => setTimeout(resolve, delay));

        return i + 1; // Return the pivot index
    }

    // Initialize the visualization
    async function startVisualization() {
        console.log('Starting Quick Sort...');
        drawArray(); // Initial array
        addStep(`Initial Array: ${array.join(', ')}`);
        await quickSort(0, array.length - 1);
        addStep(`Sorted Array: ${array.join(', ')}`);
        drawArray(); // Final sorted array
    }

    startVisualization();
}





function visualizeGreedyAlgorithm() {
    console.log('Starting Greedy Coin Change visualization.');

    // Prompt the user for the target amount
    const targetAmount = parseFloat(prompt('Enter the target amount (e.g., 47.65):', '47.65')) || 47.65;
    const coinDenominations = [100, 50, 25, 10, 5, 1, 0.50, 0.25, 0.10, 0.05, 0.01]; // Expanded coin denominations
    console.log('Target amount:', targetAmount);
    console.log('Coin denominations:', coinDenominations);

    const delay = 500; // Delay for visualization
    let remainingAmount = targetAmount.toFixed(2); // Ensure precision for decimals
    const selectedCoins = [];

    // Initialize canvas
    const canvas = document.getElementById('algorithm-canvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 200;

    // Clear previous steps and canvas
    const stepsElement = document.getElementById('steps-container');
    if (!stepsElement) {
        console.error('Steps container not found!');
        return;
    }
    stepsElement.innerHTML = ''; // Clear steps container
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Helper function to add a step message
    function addStep(message) {
        console.log('Step:', message);
        const step = document.createElement('div');
        step.textContent = message;
        stepsElement.appendChild(step);
    }

    // Helper function to draw coins and remaining amount
    function drawVisualization() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        const coinRadius = 25; // Size of each coin
        const coinSpacing = 60; // Spacing between coins
        const startX = 50; // Starting X position for coins
        const startY = canvas.height / 2; // Y position for coins

        // Draw each coin denomination
        coinDenominations.forEach((denomination, index) => {
            const x = startX + index * coinSpacing;

            // Draw coin circle
            ctx.beginPath();
            ctx.arc(x, startY, coinRadius, 0, 2 * Math.PI);
            ctx.fillStyle = selectedCoins.includes(denomination)
                ? '#aed6f1 ' // Blue for selected coins
                : '#d3d3d3'; // Gray for unselected coins
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.stroke();

            // Draw coin text
            ctx.fillStyle = 'black';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(denomination.toFixed(2), x, startY);
        });

        // Draw remaining amount
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Remaining Amount: ${remainingAmount}`, 50, 40);
    }

    // Greedy algorithm for coin change
    async function greedyCoinChange() {
        addStep(`Target amount: ${targetAmount}`);
        drawVisualization();
        await new Promise((resolve) => setTimeout(resolve, delay));

        for (const coin of coinDenominations) {
            while (remainingAmount >= coin) {
                selectedCoins.push(coin);
                remainingAmount = (remainingAmount - coin).toFixed(2); // Ensure precision
                addStep(`Selected coin: ${coin.toFixed(2)}, Remaining amount: ${remainingAmount}`);
                drawVisualization(); // Update visualization
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }

        addStep(`Change complete: ${selectedCoins.map((c) => c.toFixed(2)).join(', ')}`);
        drawVisualization(); // Final visualization
    }

    drawVisualization(); // Initial visualization
    greedyCoinChange(); // Start the greedy algorithm
}








function logStep(message) {
    const stepElement = document.createElement("div");
    stepElement.textContent = message;
    stepsContainer.appendChild(stepElement);
}



        
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function createBinaryTree(arr) {
  if (!arr.length) return null;

  const root = new Node(arr[0]);
  const queue = [root];
  let i = 1;

  while (i < arr.length) {
    const current = queue.shift();

    if (arr[i] !== null) {
      current.left = new Node(arr[i]);
      queue.push(current.left);
    }
    i++;

    if (i < arr.length && arr[i] !== null) {
      current.right = new Node(arr[i]);
      queue.push(current.right);
    }
    i++;
  }

  return root;
}

// Visualization Function
function visualizeDepthFirstSearch() {
    console.log('Starting Depth-First Search visualization.');

    // Prompt the user for the number of nodes
    const nodeCount = parseInt(prompt('Enter the number of nodes in the tree (e.g., 5, 10):', '10')) || 10;

    // Generate an array with node values
    const arr = Array.from({ length: nodeCount }, (_, i) => i + 1);

    // Create the binary tree
    const tree = createBinaryTree(arr);

    console.log('Generated Binary Tree:', tree);

    const positions = {};
    const visited = [];
    const delay = 500;

    // Initialize canvas
    const canvas = document.getElementById('algorithm-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 400;

    // Initialize the steps container for visited nodes
    const stepsContainer = document.getElementById('steps-container');
    if (!stepsContainer) {
        console.error('Steps container not found!');
        return;
    }
    stepsContainer.innerHTML = '<h4>Visited Nodes</h4>'; // Reset and add heading

    // Calculate positions for tree nodes
    function calculatePositions(node, level, xOffset, width) {
        if (!node) return;

        positions[node.value] = { x: xOffset, y: level * 80 + 50 };

        const gap = width / 2;
        calculatePositions(node.left, level + 1, xOffset - gap, gap);
        calculatePositions(node.right, level + 1, xOffset + gap, gap);
    }

    // Draw the tree on the canvas
    function drawTree(current) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        function drawEdges(node) {
            if (!node) return;
            const pos = positions[node.value];
            if (node.left) {
                const leftPos = positions[node.left.value];
                ctx.strokeStyle = '#ccc';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
                ctx.lineTo(leftPos.x, leftPos.y);
                ctx.stroke();
            }
            if (node.right) {
                const rightPos = positions[node.right.value];
                ctx.strokeStyle = '#ccc';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
                ctx.lineTo(rightPos.x, rightPos.y);
                ctx.stroke();
            }
            drawEdges(node.left);
            drawEdges(node.right);
        }
        drawEdges(tree);

        function drawNodes(node) {
            if (!node) return;

            const { x, y } = positions[node.value];
            ctx.fillStyle = visited.includes(node.value) ? '#aed6f1' : '#e0e0e0';
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, 2 * Math.PI);
            ctx.fill();
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = '#333';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.value, x, y);

            drawNodes(node.left);
            drawNodes(node.right);
        }
        drawNodes(tree);

        if (current !== undefined) {
            const { x, y } = positions[current];
            ctx.strokeStyle = '#1abc9c'; // Highlight current node in teal
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, 24, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }

    // Perform Depth-First Search
    async function dfs(node) {
        if (!node || visited.includes(node.value)) return;

        visited.push(node.value);

        // Update steps container with the visited node
        stepsContainer.innerHTML += `<p>Visited Node: ${node.value}</p>`;

        drawTree(node.value);
        await new Promise((resolve) => setTimeout(resolve, delay));

        await dfs(node.left);
        await dfs(node.right);
    }

    calculatePositions(tree, 0, canvas.width / 2, canvas.width / 4); // Calculate positions for all nodes
    drawTree(); // Draw the initial tree
    dfs(tree); // Start DFS from the root node
}
