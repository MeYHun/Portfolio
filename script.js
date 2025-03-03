// Add this at the beginning of the file
// Custom prompt function that works in iframes
function customPrompt(message, defaultValue, callback) {
	// Check if we're in an iframe
	const isInIframe = window !== window.parent;

	// If not in iframe or prompt is available, try using native prompt
	if (!isInIframe) {
		try {
			const result = prompt(message, defaultValue);
			callback(result);
			return;
		} catch (e) {
			console.log("Native prompt failed, using custom prompt");
			// Fall through to custom implementation
		}
	}

	// Create custom modal for iframe environment
	const modal = document.createElement("div");
	modal.style.position = "fixed";
	modal.style.top = "0";
	modal.style.left = "0";
	modal.style.width = "100%";
	modal.style.height = "100%";
	modal.style.backgroundColor = "rgba(0,0,0,0.7)";
	modal.style.zIndex = "10000";
	modal.style.display = "flex";
	modal.style.justifyContent = "center";
	modal.style.alignItems = "center";

	const dialog = document.createElement("div");
	dialog.style.backgroundColor = "var(--container-bg, white)";
	dialog.style.color = "var(--text-color, black)";
	dialog.style.padding = "20px";
	dialog.style.borderRadius = "8px";
	dialog.style.width = "300px";
	dialog.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";

	const messageEl = document.createElement("p");
	messageEl.textContent = message;
	messageEl.style.marginBottom = "15px";

	const input = document.createElement("input");
	input.type = "text";
	input.value = defaultValue || "";
	input.style.width = "100%";
	input.style.padding = "8px";
	input.style.marginBottom = "15px";
	input.style.borderRadius = "4px";
	input.style.border = "1px solid #ccc";

	const buttonContainer = document.createElement("div");
	buttonContainer.style.display = "flex";
	buttonContainer.style.justifyContent = "flex-end";
	buttonContainer.style.gap = "10px";

	const cancelButton = document.createElement("button");
	cancelButton.textContent = "Cancel";
	cancelButton.style.padding = "8px 15px";
	cancelButton.style.borderRadius = "4px";
	cancelButton.style.border = "none";
	cancelButton.style.backgroundColor = "#f0f0f0";
	cancelButton.style.cursor = "pointer";

	const okButton = document.createElement("button");
	okButton.textContent = "OK";
	okButton.style.padding = "8px 15px";
	okButton.style.borderRadius = "4px";
	okButton.style.border = "none";
	okButton.style.backgroundColor = "var(--highlight-color, #5eb5da)";
	okButton.style.color = "white";
	okButton.style.cursor = "pointer";

	cancelButton.onclick = function () {
		document.body.removeChild(modal);
		callback(null);
	};

	okButton.onclick = function () {
		document.body.removeChild(modal);
		callback(input.value);
	};

	// Handle Enter key
	input.addEventListener("keyup", function (event) {
		if (event.key === "Enter") {
			okButton.click();
		}
	});

	buttonContainer.appendChild(cancelButton);
	buttonContainer.appendChild(okButton);

	dialog.appendChild(messageEl);
	dialog.appendChild(input);
	dialog.appendChild(buttonContainer);
	modal.appendChild(dialog);

	document.body.appendChild(modal);
	input.focus();
}

const tabs = document.querySelectorAll("nav ul li a");
const tabContents = document.querySelectorAll(".tab-content");
const darkModeToggle = document.querySelector(".dark-mode-toggle");
const body = document.body;
const bio = document.querySelector(".bio");

// Add this global variable near the top of the file, with other global variables
let isAlgorithmRunning = false;
let currentTimeouts = []; // Track all timeouts to be able to clear them

//Menu tab for projects
document.addEventListener("DOMContentLoaded", function () {
	// Mobile menu toggle functionality
	const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
	const leftColumn = document.querySelector(".left-column");

	// Initialize dark mode for mobile menu
	const isDarkMode = localStorage.getItem("darkMode") === "true";
	if (isDarkMode && mobileMenuToggle) {
		mobileMenuToggle.classList.add("dark-mode");
	}

	if (mobileMenuToggle) {
		mobileMenuToggle.addEventListener("click", function () {
			leftColumn.classList.toggle("mobile-visible");

			// Get the corner logo element
			const cornerLogo = document.querySelector(".corner-logo");

			// Change the icon when menu is open
			const isOpen = leftColumn.classList.contains("mobile-visible");
			if (isOpen) {
				mobileMenuToggle.innerHTML = `
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
				`;

				// Hide the corner logo when menu is open
				if (cornerLogo) {
					cornerLogo.style.display = "none";
				}
			} else {
				mobileMenuToggle.innerHTML = `
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="3" y1="12" x2="21" y2="12"></line>
					<line x1="3" y1="6" x2="21" y2="6"></line>
					<line x1="3" y1="18" x2="21" y2="18"></line>
				</svg>
				`;

				// Show the corner logo when menu is closed
				if (cornerLogo) {
					cornerLogo.style.display = "flex";
				}
			}
		});

		// Close menu when clicking on a menu item (for mobile)
		const navLinks = document.querySelectorAll("nav ul li a");
		navLinks.forEach((link) => {
			link.addEventListener("click", function () {
				if (window.innerWidth <= 768) {
					leftColumn.classList.remove("mobile-visible");
					mobileMenuToggle.innerHTML = `
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<line x1="3" y1="12" x2="21" y2="12"></line>
							<line x1="3" y1="6" x2="21" y2="6"></line>
							<line x1="3" y1="18" x2="21" y2="18"></line>
						</svg>
					`;
				}
			});
		});
	}

	// Handle window resize to reset mobile menu state
	window.addEventListener("resize", function () {
		if (window.innerWidth > 768) {
			leftColumn.classList.remove("mobile-visible");
			mobileMenuToggle.innerHTML = `
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="3" y1="12" x2="21" y2="12"></line>
					<line x1="3" y1="6" x2="21" y2="6"></line>
					<line x1="3" y1="18" x2="21" y2="18"></line>
				</svg>
			`;
		}
	});

	let projectLinks = document.querySelectorAll(".project-link");
	let projects = document.querySelectorAll(".project");
	let mainContent = document.querySelector("#main");
	let projectsTab = document.getElementById("projects");
	let projectNavBtns = document.querySelectorAll(".project-nav-btn");

	function hideAllProjects() {
		projects.forEach((project) => {
			project.style.display = "none";
			project.classList.remove("active");
		});

		// Reset active state on nav buttons
		projectNavBtns.forEach((btn) => btn.classList.remove("active"));

		if (mainContent) {
			mainContent.style.display = "none";
		}
	}

	projectLinks.forEach((link) => {
		link.addEventListener("click", function (event) {
			event.preventDefault();
			hideAllProjects();

			if (projectsTab) {
				projectsTab.classList.add("active");
			}

			let targetId = this.dataset.target;
			let targetProject = document.getElementById(targetId);

			if (targetProject) {
				targetProject.style.display = "block";
				targetProject.classList.add("active");

				// Scroll to the top of the selected project
				targetProject.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});

				// If the project is inside a scrollable container, also scroll the container
				if (projectsTab) {
					projectsTab.scrollTop = 0;
				}

				// Also activate the corresponding nav button
				const matchingBtn = document.querySelector(
					`.project-nav-btn[data-target="${targetId}"]`
				);
				if (matchingBtn) {
					matchingBtn.classList.add("active");
				}

				// Ensure Algorithm Visualizer canvas resets correctly
				if (targetId === "algorithm-visualizer") {
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

	// Get the parent container width and adjust canvas width
	const parentWidth = canvas.parentElement.clientWidth;
	canvas.width = parentWidth - 10; // Slightly smaller than parent to avoid overflow
	canvas.height = 400; // Maintain consistent height

	// If there's an active algorithm, redraw it
	const algorithm = document.getElementById("algorithm").value;
	if (algorithm && canvas.getContext) {
		drawCanvasPlaceholder();
	}
}

// Add window resize event listener to handle responsive canvas
window.addEventListener("resize", function () {
	// Debounce the resize event to avoid excessive redraws
	clearTimeout(window.resizeTimeout);
	window.resizeTimeout = setTimeout(function () {
		resizeCanvas();
	}, 250);
});

// Function to stop the current algorithm
function stopCurrentAlgorithm() {
	// Clear all pending timeouts
	currentTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
	currentTimeouts = [];

	// Reset the running flag
	isAlgorithmRunning = false;

	// Clear the canvas
	const canvas = document.getElementById("algorithm-canvas");
	if (canvas) {
		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	console.log("Current algorithm stopped");
}

// Modified setTimeout wrapper to track timeouts
function trackableSetTimeout(callback, delay) {
	const timeoutId = setTimeout(() => {
		// Remove this timeout from the tracking array when it executes
		const index = currentTimeouts.indexOf(timeoutId);
		if (index > -1) {
			currentTimeouts.splice(index, 1);
		}
		callback();
	}, delay);

	// Add to tracking array
	currentTimeouts.push(timeoutId);
	return timeoutId;
}

document.addEventListener("DOMContentLoaded", function () {
	const algorithmSelect = document.getElementById("algorithm");
	const runButton = document.getElementById("run-algorithm");

	function runAlgorithm() {
		console.log("Algorithm Run Button Clicked");

		// If an algorithm is already running, stop it
		if (isAlgorithmRunning) {
			stopCurrentAlgorithm();
			// Add a small message to the steps container
			addStep("Previous algorithm stopped", "current-step");
		}

		const selectedAlgorithm = algorithmSelect.value;
		console.log("Selected Algorithm:", selectedAlgorithm);

		// Set the flag to indicate an algorithm is running
		isAlgorithmRunning = true;

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
				isAlgorithmRunning = false; // Reset flag if no algorithm is selected
		}
	}

	// Ensure only ONE event listener is attached
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
	ctx.fillText(
		"Select an Algorithm and Click Run",
		canvas.width / 2,
		canvas.height / 2
	);
}
// 다크 모드 토글 함수
function toggleDarkMode() {
	body.classList.toggle("dark-mode");
	const isDarkMode = body.classList.contains("dark-mode");
	localStorage.setItem("darkMode", isDarkMode);
	darkModeToggle.textContent = isDarkMode ? "LIGHT" : "DARK";

	// Change the logo image based on dark mode
	const personalLogo = document.querySelector(".personal-logo");
	if (personalLogo) {
		personalLogo.src = isDarkMode
			? "images/my-notion-face-transparent.png"
			: "images/white_portrait.png";
	}

	// Update mobile menu toggle styling for dark mode
	const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
	if (mobileMenuToggle) {
		if (isDarkMode) {
			mobileMenuToggle.classList.add("dark-mode");
		} else {
			mobileMenuToggle.classList.remove("dark-mode");
		}
	}

	// Apply dark mode to all elements that need specific styling
	const skills = document.querySelectorAll(".skill");
	skills.forEach((skill) => {
		skill.style.backgroundColor = getComputedStyle(
			document.documentElement
		).getPropertyValue("--skill-bg");
		skill.style.color = getComputedStyle(
			document.documentElement
		).getPropertyValue("--skill-text");
	});

	// Directly set CSS variables for immediate effect
	if (isDarkMode) {
		document.documentElement.style.setProperty("--bg-color", "#1a1a1a");
		document.documentElement.style.setProperty("--text-color", "#f0f0f0");
		document.documentElement.style.setProperty("--container-bg", "#2a2a2a");
		document.documentElement.style.setProperty(
			"--highlight-color",
			"#7ec8e3"
		);
		document.documentElement.style.setProperty("--skill-bg", "#4a4a4a");
		document.documentElement.style.setProperty("--skill-text", "#f0f0f0");
		document.documentElement.style.setProperty("--contact-bg", "#2a2a2a");
		document.documentElement.style.setProperty("--contact-text", "#f0f0f0");
		document.documentElement.style.setProperty("--input-bg", "#3a3a3a");
		document.documentElement.style.setProperty("--input-text", "#f0f0f0");
		document.documentElement.style.setProperty("--button-bg", "#7ec8e3");
		document.documentElement.style.setProperty("--button-text", "#1a1a1a");
		document.documentElement.style.setProperty("--link-color", "#7ec8e3");
	} else {
		document.documentElement.style.setProperty("--bg-color", "#f0f0f0");
		document.documentElement.style.setProperty("--text-color", "#333");
		document.documentElement.style.setProperty("--container-bg", "#fff");
		document.documentElement.style.setProperty(
			"--highlight-color",
			"#5eb5da"
		);
		document.documentElement.style.setProperty("--skill-bg", "#e0e0e0");
		document.documentElement.style.setProperty("--skill-text", "#333");
		document.documentElement.style.setProperty("--contact-bg", "#ffffff");
		document.documentElement.style.setProperty("--contact-text", "#333333");
		document.documentElement.style.setProperty("--input-bg", "#f0f0f0");
		document.documentElement.style.setProperty("--input-text", "#333333");
		document.documentElement.style.setProperty("--button-bg", "#5eb5da");
		document.documentElement.style.setProperty("--button-text", "#ffffff");
		document.documentElement.style.setProperty("--link-color", "#5eb5da");
	}

	// Redraw canvas if it exists and is visible
	const canvas = document.getElementById("algorithm-canvas");
	if (canvas && canvas.getContext) {
		// Check if algorithm visualizer is active
		const algorithmVisualizer = document.getElementById(
			"algorithm-visualizer"
		);
		if (
			algorithmVisualizer &&
			algorithmVisualizer.classList.contains("active")
		) {
			const algorithm = document.getElementById("algorithm")?.value;
			if (algorithm && isAlgorithmRunning) {
				// If an algorithm is running, let it continue with updated colors
			} else {
				// Otherwise just redraw the placeholder
				drawCanvasPlaceholder();
			}
		}
	}

	console.log("Dark mode toggled:", isDarkMode);
}

// 저장된 다크 모드 설정 불러오기
const savedDarkMode = localStorage.getItem("darkMode");
if (savedDarkMode === "true") {
	body.classList.add("dark-mode");
	darkModeToggle.textContent = "LIGHT";

	// Set the dark mode logo
	const personalLogo = document.querySelector(".personal-logo");
	if (personalLogo) {
		personalLogo.src = "images/my-notion-face-transparent.png";
	}

	// Apply dark mode CSS variables directly for immediate effect
	document.documentElement.style.setProperty("--bg-color", "#1a1a1a");
	document.documentElement.style.setProperty("--text-color", "#f0f0f0");
	document.documentElement.style.setProperty("--container-bg", "#2a2a2a");
	document.documentElement.style.setProperty("--highlight-color", "#7ec8e3");
	document.documentElement.style.setProperty("--skill-bg", "#4a4a4a");
	document.documentElement.style.setProperty("--skill-text", "#f0f0f0");
	document.documentElement.style.setProperty("--contact-bg", "#2a2a2a");
	document.documentElement.style.setProperty("--contact-text", "#f0f0f0");
	document.documentElement.style.setProperty("--input-bg", "#3a3a3a");
	document.documentElement.style.setProperty("--input-text", "#f0f0f0");
	document.documentElement.style.setProperty("--button-bg", "#7ec8e3");
	document.documentElement.style.setProperty("--button-text", "#1a1a1a");
	document.documentElement.style.setProperty("--link-color", "#7ec8e3");
} else {
	// Set the light mode logo
	const personalLogo = document.querySelector(".personal-logo");
	if (personalLogo) {
		personalLogo.src = "images/white_portrait.png";
	}
}

// 다크 모드 버튼 이벤트 리스너
darkModeToggle.addEventListener("click", toggleDarkMode);

// ... (기존 탭 관련 스크립트 유지) ...

function showContent(tabId) {
	tabContents.forEach((content) => content.classList.remove("active"));
	const selectedContent = document.getElementById(tabId);
	if (selectedContent) {
		selectedContent.classList.add("active");
	}
	bio.style.display = tabId === "main" ? "block" : "none";
}

tabs.forEach((tab) => {
	tab.addEventListener("click", (e) => {
		e.preventDefault();
		const tabId = tab.getAttribute("href").substring(1);

		tabs.forEach((t) => t.classList.remove("active"));
		tab.classList.add("active");

		if (tabId === "about") {
			const youngPhoto = document.getElementById("young-photo");
			const currentPhoto = document.getElementById("current-photo");

			youngPhoto.style.animation = "none";
			currentPhoto.style.animation = "none";

			setTimeout(() => {
				youngPhoto.style.animation = "";
				currentPhoto.style.animation = "";
			}, 10);
		}

		showContent(tabId);
	});
});

function showMainContent() {
	showContent("main");
	tabs.forEach((t) => t.classList.remove("active"));
}

// 페이지 로드시 메인 컨텐츠 표시
showMainContent();

// 이름/제목 클릭시 메인 페이지로 돌아가기
document.querySelector("h1").addEventListener("click", showMainContent);

//Algorithm Visualization Part
const algorithmSelect = document.getElementById("algorithm");
const runButton = document.getElementById("run-algorithm");
const canvas = document.getElementById("algorithm-canvas");
const stepsContainer = document.getElementById("steps-container");
const ctx = canvas.getContext("2d");

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

// Custom prompt function that works in iframes
function customPrompt(message, defaultValue, callback) {
	// Check if we're in an iframe
	const isInIframe = window !== window.parent;

	// If not in iframe or prompt is available, try using native prompt
	if (!isInIframe) {
		try {
			const result = prompt(message, defaultValue);
			callback(result);
			return;
		} catch (e) {
			console.log("Native prompt failed, using custom prompt");
			// Fall through to custom implementation
		}
	}

	// Create custom modal for iframe environment
	const modal = document.createElement("div");
	modal.style.position = "fixed";
	modal.style.top = "0";
	modal.style.left = "0";
	modal.style.width = "100%";
	modal.style.height = "100%";
	modal.style.backgroundColor = "rgba(0,0,0,0.7)";
	modal.style.zIndex = "10000";
	modal.style.display = "flex";
	modal.style.justifyContent = "center";
	modal.style.alignItems = "center";

	const dialog = document.createElement("div");
	dialog.style.backgroundColor = "var(--container-bg, white)";
	dialog.style.color = "var(--text-color, black)";
	dialog.style.padding = "20px";
	dialog.style.borderRadius = "8px";
	dialog.style.width = "300px";
	dialog.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";

	const messageEl = document.createElement("p");
	messageEl.textContent = message;
	messageEl.style.marginBottom = "15px";

	const input = document.createElement("input");
	input.type = "text";
	input.value = defaultValue || "";
	input.style.width = "100%";
	input.style.padding = "8px";
	input.style.marginBottom = "15px";
	input.style.borderRadius = "4px";
	input.style.border = "1px solid #ccc";

	const buttonContainer = document.createElement("div");
	buttonContainer.style.display = "flex";
	buttonContainer.style.justifyContent = "flex-end";
	buttonContainer.style.gap = "10px";

	const cancelButton = document.createElement("button");
	cancelButton.textContent = "Cancel";
	cancelButton.style.padding = "8px 15px";
	cancelButton.style.borderRadius = "4px";
	cancelButton.style.border = "none";
	cancelButton.style.backgroundColor = "#f0f0f0";
	cancelButton.style.cursor = "pointer";

	const okButton = document.createElement("button");
	okButton.textContent = "OK";
	okButton.style.padding = "8px 15px";
	okButton.style.borderRadius = "4px";
	okButton.style.border = "none";
	okButton.style.backgroundColor = "var(--highlight-color, #5eb5da)";
	okButton.style.color = "white";
	okButton.style.cursor = "pointer";

	cancelButton.onclick = function () {
		document.body.removeChild(modal);
		callback(null);
	};

	okButton.onclick = function () {
		document.body.removeChild(modal);
		callback(input.value);
	};

	// Handle Enter key
	input.addEventListener("keyup", function (event) {
		if (event.key === "Enter") {
			okButton.click();
		}
	});

	buttonContainer.appendChild(cancelButton);
	buttonContainer.appendChild(okButton);

	dialog.appendChild(messageEl);
	dialog.appendChild(input);
	dialog.appendChild(buttonContainer);
	modal.appendChild(dialog);

	document.body.appendChild(modal);
	input.focus();
}

// Replace prompt calls with customPrompt
// For Insertion Sort
function runInsertionSort() {
	// ... existing code ...

	// Replace this:
	// const numElements = parseInt(
	//   prompt("Enter number of elements for Insertion Sort (5-20):", "15")
	// );

	// With this:
	customPrompt(
		"Enter number of elements for Insertion Sort (5-20):",
		"15",
		function (result) {
			const numElements = parseInt(result || "15");
			// Continue with the rest of your insertion sort code here
			// Move the rest of the function body inside this callback

			// Generate random array
			const array = [];
			for (let i = 0; i < numElements; i++) {
				array.push(Math.floor(Math.random() * 100) + 1);
			}

			// Run the algorithm and get steps
			const steps = insertionSortWithSteps(array);

			// Visualize the algorithm
			visualizeAlgorithm(steps);
		}
	);
}

function visualizeBinarySearch() {
	clearSteps();

	// Replace native prompt with customPrompt
	customPrompt(
		"Enter number of elements for Binary Search (5-20):",
		"15",
		function (result) {
			const numElements = parseInt(result || "15");

			// Check if user clicked Cancel
			if (numElements === null || isNaN(numElements)) {
				addStep("Visualization canceled", "current-step");
				algorithmComplete(); // Reset flag if canceled
				return;
			}

			// Validate input and use default if invalid
			const validatedNumElements =
				numElements && numElements >= 5 && numElements <= 20
					? numElements
					: 15;

			// Create a sorted array for binary search
			const array = [];
			for (let i = 0; i < validatedNumElements; i++) {
				array.push(Math.floor(Math.random() * 100) + 1);
			}
			array.sort((a, b) => a - b); // Sort the array
			drawArray(array);

			// Choose a random target from the array
			const targetIndex = Math.floor(Math.random() * array.length);
			const target = array[targetIndex];

			addStep(
				`Starting Binary Search for target ${target} in array: ${array.join(
					", "
				)}`
			);

			let left = 0;
			let right = array.length - 1;
			let found = false;

			function binarySearchStep() {
				if (left <= right && !found) {
					const mid = Math.floor((left + right) / 2);
					drawSortedArrayWithPointers(array, left, mid, right);

					addStep(
						`Checking middle element at index ${mid}: ${array[mid]}`,
						"current-step"
					);

					if (array[mid] === target) {
						addStep(
							`Found target ${target} at index ${mid}!`,
							"path-node"
						);
						drawSortedArrayWithTarget(array, mid);
						found = true;
						algorithmComplete(); // Reset flag when complete
					} else if (array[mid] < target) {
						addStep(
							`${array[mid]} < ${target}, search in right half`,
							"visited-node"
						);
						left = mid + 1;
						trackableSetTimeout(binarySearchStep, 500);
					} else {
						addStep(
							`${array[mid]} > ${target}, search in left half`,
							"visited-node"
						);
						right = mid - 1;
						trackableSetTimeout(binarySearchStep, 500);
					}
				} else if (!found) {
					addStep(
						`Target ${target} not found in the array`,
						"current-step"
					);
					algorithmComplete(); // Reset flag when complete
				}
			}

			trackableSetTimeout(binarySearchStep, 500);
		}
	);
}

function visualizeBreadthFirstSearch() {
	clearSteps();

	// Use a default value instead of prompting
	const validatedNumNodes = 7;

	// Create a binary tree for BFS visualization with the specified number of nodes
	const root = generateBalancedBinaryTree(validatedNumNodes);

	// Canvas dimensions
	const width = canvas.width;
	const height = canvas.height;

	// Node positions
	const nodePositions = {};

	// Visited nodes array
	const visited = [];

	// Calculate positions for each node
	calculatePositions(root, 0, 0, width);

	// Draw the initial tree
	drawTree(root, visited);

	// Add initial step
	addStep(
		`Starting Breadth-First Search on binary tree with ${validatedNumNodes} nodes`,
		"current-step"
	);

	// Start BFS after a delay
	trackableSetTimeout(() => bfs(root), 500); // Faster animation (was 1000)

	// Function to calculate node positions
	function calculatePositions(node, level, xOffset, width) {
		if (!node) return;

		const y = 60 + level * 80;
		const x = xOffset + width / 2;

		nodePositions[node.value] = { x, y };

		const nextWidth = width / 2;
		calculatePositions(node.left, level + 1, xOffset, nextWidth);
		calculatePositions(node.right, level + 1, xOffset + nextWidth, nextWidth);
	}

	// Function to draw the tree
	function drawTree(current, visitedNodes) {
		ctx.clearRect(0, 0, width, height);

		// Draw edges first
		function drawEdges(node) {
			if (!node) return;

			if (node.left) {
				const startPos = nodePositions[node.value];
				const endPos = nodePositions[node.left.value];

				ctx.beginPath();
				ctx.moveTo(startPos.x, startPos.y);
				ctx.lineTo(endPos.x, endPos.y);
				ctx.strokeStyle = "rgba(94, 181, 218, 1.0)";
				ctx.lineWidth = 2;
				ctx.stroke();
			}

			if (node.right) {
				const startPos = nodePositions[node.value];
				const endPos = nodePositions[node.right.value];

				ctx.beginPath();
				ctx.moveTo(startPos.x, startPos.y);
				ctx.lineTo(endPos.x, endPos.y);
				ctx.strokeStyle = "rgba(94, 181, 218, 1.0)";
				ctx.lineWidth = 2;
				ctx.stroke();
			}

			drawEdges(node.left);
			drawEdges(node.right);
		}

		// Draw nodes
		function drawNodes(node) {
			if (!node) return;

			const pos = nodePositions[node.value];

			// Draw node circle
			ctx.beginPath();
			ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);

			if (current && node.value === current.value) {
				ctx.fillStyle = "#79dc7c"; // Current node - bright blue
			} else if (visitedNodes.includes(node.value)) {
				ctx.fillStyle = "#8ce88f"; // Visited node - bright green
			} else {
				ctx.fillStyle = "#7fa9d9"; // Default node - lighter blue
			}

			ctx.fill();
			ctx.strokeStyle = "#2a6f97"; // Darker blue for border
			ctx.lineWidth = 2;
			ctx.stroke();

			// Draw node value with white text for better contrast
			if (
				(current && node.value === current.value) ||
				visitedNodes.includes(node.value)
			) {
				ctx.fillStyle = "#ffffff"; // White text on colored backgrounds
			} else {
				ctx.fillStyle = "#333333"; // Dark text on light backgrounds
			}
			ctx.font = "bold 14px Inter";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(node.value, pos.x, pos.y);

			drawNodes(node.left);
			drawNodes(node.right);
		}

		drawEdges(root);
		drawNodes(root);
	}

	// BFS implementation
	async function bfs(root) {
		if (!root) {
			addStep("Tree is empty", "current-step");
			algorithmComplete(); // Reset flag if tree is empty
			return;
		}

		const queue = [root];

		while (queue.length > 0) {
			const current = queue.shift();

			// Skip if already visited
			if (visited.includes(current.value)) continue;

			// Mark as visited
			visited.push(current.value);

			// Update visualization
			drawTree(current, visited);
			addStep(`Visiting node ${current.value}`, "visited-node");

			// Add left child to queue
			if (current.left) {
				queue.push(current.left);
				addStep(`Adding left child ${current.left.value} to queue`);
			}

			// Add right child to queue
			if (current.right) {
				queue.push(current.right);
				addStep(`Adding right child ${current.right.value} to queue`);
			}

			// Wait before processing next node
			await new Promise((resolve) => trackableSetTimeout(resolve, 500)); // Faster animation (was 1000)
		}

		// Draw final state
		drawTree(null, visited);
		addStep("Breadth-First Search complete!", "path-node");
		algorithmComplete(); // Reset flag when complete
	}
}

function visualizeMergeSort() {
	clearSteps();

	// Replace native prompt with customPrompt
	customPrompt(
		"Enter number of elements for Merge Sort (5-15):",
		"12",
		function (result) {
			const numElements = parseInt(result || "12");

			// Check if user clicked Cancel
			if (numElements === null || isNaN(numElements)) {
				addStep("Visualization canceled", "current-step");
				algorithmComplete(); // Reset flag if canceled
				return;
			}

			// Validate input and use default if invalid
			const validatedNumElements =
				numElements && numElements >= 5 && numElements <= 15
					? numElements
					: 12;

			const array = generateRandomArray(validatedNumElements, 10, 100);
			drawArray(array);
			addStep(
				`Starting Merge Sort with ${validatedNumElements} elements: ${array.join(
					", "
				)}`
			);

			// Start merge sort
			mergeSort(array, 0, array.length - 1);

			// Merge sort implementation
			async function mergeSort(arr, left, right) {
				if (left >= right) return;

				const mid = Math.floor((left + right) / 2);

				// Add step for division
				addStep(
					`Dividing array at index ${mid}: [${arr
						.slice(left, mid + 1)
						.join(", ")}] and [${arr
						.slice(mid + 1, right + 1)
						.join(", ")}]`
				);

				// Recursively sort left and right halves
				await mergeSort(arr, left, mid);
				await mergeSort(arr, mid + 1, right);

				// Merge the sorted halves
				await merge(arr, left, mid, right);
			}

			// Merge function
			async function merge(arr, left, mid, right) {
				addStep(
					`Merging subarrays: [${arr
						.slice(left, mid + 1)
						.join(", ")}] and [${arr
						.slice(mid + 1, right + 1)
						.join(", ")}]`,
					"visited-node"
				);

				// Create temporary arrays
				const leftArray = arr.slice(left, mid + 1);
				const rightArray = arr.slice(mid + 1, right + 1);

				let i = 0,
					j = 0,
					k = left;

				// Merge the arrays back into arr[left...right]
				while (i < leftArray.length && j < rightArray.length) {
					if (leftArray[i] <= rightArray[j]) {
						arr[k] = leftArray[i];
						addStep(
							`Placing ${leftArray[i]} from left array at position ${k}`
						);
						i++;
					} else {
						arr[k] = rightArray[j];
						addStep(
							`Placing ${rightArray[j]} from right array at position ${k}`
						);
						j++;
					}

					// Update visualization
					drawArray(arr, k);

					// Wait for animation
					await new Promise((resolve) =>
						trackableSetTimeout(resolve, 250)
					); // Faster animation (was 500)
					k++;
				}

				// Copy remaining elements from left array
				while (i < leftArray.length) {
					arr[k] = leftArray[i];
					addStep(
						`Copying remaining ${leftArray[i]} from left array to position ${k}`
					);
					drawArray(arr, k);
					await new Promise((resolve) =>
						trackableSetTimeout(resolve, 250)
					); // Faster animation (was 500)
					i++;
					k++;
				}

				// Copy remaining elements from right array
				while (j < rightArray.length) {
					arr[k] = rightArray[j];
					addStep(
						`Copying remaining ${rightArray[j]} from right array to position ${k}`
					);
					drawArray(arr, k);
					await new Promise((resolve) =>
						trackableSetTimeout(resolve, 250)
					); // Faster animation (was 500)
					j++;
					k++;
				}

				// Show the merged subarray
				addStep(
					`Merged subarray: [${arr.slice(left, right + 1).join(", ")}]`,
					"current-step"
				);

				// If we've sorted the entire array, mark as complete
				if (left === 0 && right === arr.length - 1) {
					addStep("Merge Sort Complete!", "path-node");
					drawArray(arr);
					algorithmComplete(); // Reset flag when complete
				}
			}
		}
	);
}

function visualizeQuickSort() {
	clearSteps();

	// Replace native prompt with customPrompt
	customPrompt(
		"Enter number of elements for Quick Sort (5-15):",
		"12",
		function (result) {
			const numElements = parseInt(result || "12");

			// Check if user clicked Cancel
			if (numElements === null || isNaN(numElements)) {
				addStep("Visualization canceled", "current-step");
				algorithmComplete(); // Reset flag if canceled
				return;
			}

			// Validate input and use default if invalid
			const validatedNumElements =
				numElements && numElements >= 5 && numElements <= 15
					? numElements
					: 12;

			const array = generateRandomArray(validatedNumElements, 10, 100);
			drawArray(array);
			addStep(
				`Starting Quick Sort with ${validatedNumElements} elements: ${array.join(
					", "
				)}`
			);

			// Start quick sort
			quickSort(array, 0, array.length - 1);

			// Quick sort implementation
			async function quickSort(arr, left, right) {
				if (left >= right) return;

				// Partition the array and get pivot index
				const pivotIndex = await partition(arr, left, right);

				// Recursively sort the sub-arrays
				await quickSort(arr, left, pivotIndex - 1);
				await quickSort(arr, pivotIndex + 1, right);

				// If we've sorted the entire array, mark as complete
				if (left === 0 && right === arr.length - 1) {
					addStep("Quick Sort Complete!", "path-node");
					drawArray(arr);
					algorithmComplete(); // Reset flag when complete
				}
			}

			// Partition function
			async function partition(arr, left, right) {
				// Choose rightmost element as pivot
				const pivot = arr[right];
				addStep(
					`Selected pivot: ${pivot} at index ${right}`,
					"current-step"
				);

				// Draw array with pivot highlighted
				drawArray(arr, right);
				await new Promise((resolve) => trackableSetTimeout(resolve, 250)); // Faster animation (was 500)

				// Index of smaller element
				let i = left - 1;

				// Process each element except the pivot
				for (let j = left; j < right; j++) {
					// If current element is smaller than the pivot
					if (arr[j] < pivot) {
						// Increment index of smaller element
						i++;

						// Swap elements
						if (i !== j) {
							addStep(
								`Swapping ${arr[i]} and ${arr[j]} (smaller than pivot ${pivot})`,
								"visited-node"
							);
							[arr[i], arr[j]] = [arr[j], arr[i]];
							drawArray(arr, right, i, j);
							await new Promise((resolve) =>
								trackableSetTimeout(resolve, 250)
							); // Faster animation (was 500)
						}
					} else {
						addStep(`${arr[j]} >= pivot ${pivot}, no swap needed`);
						drawArray(arr, right, j);
						await new Promise((resolve) =>
							trackableSetTimeout(resolve, 150)
						); // Faster animation (was 300)
					}
				}

				// Swap the pivot element with the element at (i+1)
				if (i + 1 !== right) {
					addStep(
						`Placing pivot ${pivot} at its correct position (index ${
							i + 1
						})`,
						"current-step"
					);
					[arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
					drawArray(arr, i + 1);
					await new Promise((resolve) =>
						trackableSetTimeout(resolve, 250)
					); // Faster animation (was 500)
				}

				// Return the position of the pivot
				return i + 1;
			}
		}
	);
}

function visualizeGreedyAlgorithm() {
	clearSteps();

	// Replace native prompt with customPrompt
	customPrompt(
		"Enter target amount for Coin Change (1-100):",
		"47.65",
		function (result) {
			const targetAmount = parseFloat(result || "47.65");

			// Check if user clicked Cancel
			if (targetAmount === null || isNaN(targetAmount)) {
				addStep("Visualization canceled", "current-step");
				algorithmComplete(); // Reset flag if canceled
				return;
			}

			// Validate input and use default if invalid
			const validatedAmount =
				targetAmount && targetAmount > 0 && targetAmount <= 100
					? targetAmount
					: 47.65;

			// Set up coin change problem
			const coins = [25, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];
			const coinNames = {
				25: "Quarter ($0.25)",
				10: "Dime ($0.10)",
				5: "Nickel ($0.05)",
				1: "Penny ($0.01)",
				0.25: "Quarter ($0.25)",
				0.1: "Dime ($0.10)",
				0.05: "Nickel ($0.05)",
				0.01: "Penny ($0.01)",
			};

			let remainingAmount = validatedAmount;
			const selectedCoins = [];

			// Add initial step
			addStep(
				`Starting Greedy Coin Change for amount: $${validatedAmount.toFixed(
					2
				)}`,
				"current-step"
			);
			addStep(
				`Available coins: ${coins
					.map((c) => `$${c.toFixed(2)}`)
					.join(", ")}`
			);

			// Draw initial state
			drawCoinChangeState(coins, selectedCoins, remainingAmount);

			// Start greedy algorithm
			trackableSetTimeout(
				() => greedyCoinChange(coins, validatedAmount),
				500
			); // Faster animation (was 1000)

			// Greedy coin change algorithm
			async function greedyCoinChange(coins, amount) {
				let remaining = amount;
				const result = [];

				// Sort coins in descending order
				const sortedCoins = [...coins].sort((a, b) => b - a);

				for (const coin of sortedCoins) {
					// Use as many of this coin as possible
					while (remaining >= coin) {
						result.push(coin);
						remaining = parseFloat((remaining - coin).toFixed(2)); // Fix floating point precision

						// Update visualization
						selectedCoins.push(coin);
						remainingAmount = remaining;

						addStep(
							`Selected ${coinNames[coin]} (${coin.toFixed(
								2
							)}), remaining: $${remaining.toFixed(2)}`,
							"visited-node"
						);
						drawCoinChangeState(sortedCoins, selectedCoins, remaining);

						await new Promise((resolve) =>
							trackableSetTimeout(resolve, 400)
						); // Faster animation (was 800)
					}
				}

				// Show final result
				addStep(
					`Coin change complete! Used ${result.length} coins: ${result
						.map((c) => `$${c.toFixed(2)}`)
						.join(", ")}`,
					"path-node"
				);
				drawCoinChangeState(sortedCoins, selectedCoins, 0);
				algorithmComplete(); // Reset flag when complete
			}
		}
	);
}

function drawCoinChangeState(availableCoins, selectedCoins, remainingAmount) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw remaining amount
	ctx.font = "bold 18px Inter";
	ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(
		"--text-color"
	);
	ctx.textAlign = "center";
	ctx.fillText(
		`Remaining: $${remainingAmount.toFixed(2)}`,
		canvas.width / 2,
		30
	);

	// Count selected coins
	const coinCounts = {};
	for (const coin of selectedCoins) {
		coinCounts[coin] = (coinCounts[coin] || 0) + 1;
	}

	// Draw available coins
	const coinRadius = 30;
	const startY = 80;

	// Calculate how many coins to display per row based on canvas width
	const coinsPerRow = Math.min(4, Math.floor(canvas.width / 120));
	const horizontalSpacing = canvas.width / (coinsPerRow + 1);
	const verticalSpacing = 100;

	availableCoins.forEach((coin, index) => {
		const row = Math.floor(index / coinsPerRow);
		const col = index % coinsPerRow;

		// Center the coins horizontally
		const x = horizontalSpacing * (col + 1);
		const y = startY + row * verticalSpacing;

		// Draw coin
		ctx.beginPath();
		ctx.arc(x, y, coinRadius, 0, Math.PI * 2);

		// Color based on selection
		const count = coinCounts[coin] || 0;
		if (count > 0) {
			ctx.fillStyle = "rgba(94, 181, 218, 0.8)";
		} else {
			ctx.fillStyle = "rgba(94, 181, 218, 0.2)";
		}

		ctx.fill();
		ctx.strokeStyle = "rgba(94, 181, 218, 1)";
		ctx.lineWidth = 2;
		ctx.stroke();

		// Draw coin value
		ctx.font = "bold 14px Inter";
		ctx.fillStyle =
			count > 0
				? "#ffffff"
				: getComputedStyle(document.documentElement).getPropertyValue(
						"--text-color"
				  );
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(`$${coin.toFixed(2)}`, x, y);

		// Draw count if selected
		if (count > 0) {
			ctx.font = "bold 14px Inter";
			ctx.fillStyle = "#4CAF50";
			ctx.textAlign = "center";
			ctx.fillText(`× ${count}`, x, y + coinRadius + 20);
		}
	});

	// Draw total coins used
	if (selectedCoins.length > 0) {
		ctx.font = "16px Inter";
		ctx.fillStyle = getComputedStyle(
			document.documentElement
		).getPropertyValue("--text-color");
		ctx.textAlign = "center";
		ctx.fillText(
			`Total coins used: ${selectedCoins.length}`,
			canvas.width / 2,
			canvas.height - 30
		);
	}
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
	clearSteps();

	// Use a default value instead of prompting
	const validatedNumNodes = 7;

	// Create a binary tree for DFS visualization with the specified number of nodes
	const root = generateBalancedBinaryTree(validatedNumNodes);

	// Canvas dimensions
	const width = canvas.width;
	const height = canvas.height;

	// Node positions
	const nodePositions = {};

	// Visited nodes
	const visited = [];

	// Flag to track if completion message has been shown
	let completionMessageShown = false;

	// Calculate positions for each node
	calculatePositions(root, 0, 0, width);

	// Draw the initial tree
	drawTree(root, visited);

	// Add initial step
	addStep(
		`Starting Depth-First Search on binary tree with ${validatedNumNodes} nodes`,
		"current-step"
	);

	// Start DFS after a delay
	trackableSetTimeout(() => dfs(root), 500); // Faster animation (was 1000)

	// Function to calculate node positions
	function calculatePositions(node, level, xOffset, width) {
		if (!node) return;

		const y = 60 + level * 80;
		const x = xOffset + width / 2;

		nodePositions[node.value] = { x, y };

		const nextWidth = width / 2;
		calculatePositions(node.left, level + 1, xOffset, nextWidth);
		calculatePositions(node.right, level + 1, xOffset + nextWidth, nextWidth);
	}

	// Function to draw the tree
	function drawTree(current, visitedNodes) {
		ctx.clearRect(0, 0, width, height);

		// Draw edges first
		function drawEdges(node) {
			if (!node) return;

			if (node.left) {
				const startPos = nodePositions[node.value];
				const endPos = nodePositions[node.left.value];

				ctx.beginPath();
				ctx.moveTo(startPos.x, startPos.y);
				ctx.lineTo(endPos.x, endPos.y);
				ctx.strokeStyle = "rgba(94, 181, 218, 1.0)";
				ctx.lineWidth = 2;
				ctx.stroke();
			}

			if (node.right) {
				const startPos = nodePositions[node.value];
				const endPos = nodePositions[node.right.value];

				ctx.beginPath();
				ctx.moveTo(startPos.x, startPos.y);
				ctx.lineTo(endPos.x, endPos.y);
				ctx.strokeStyle = "rgba(94, 181, 218, 1.0)";
				ctx.lineWidth = 2;
				ctx.stroke();
			}

			drawEdges(node.left);
			drawEdges(node.right);
		}

		// Draw nodes
		function drawNodes(node) {
			if (!node) return;

			const pos = nodePositions[node.value];

			// Draw node circle
			ctx.beginPath();
			ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);

			// Use more vibrant colors that match the step tracking
			if (current && node.value === current.value) {
				ctx.fillStyle = "#79dc7c"; // Current node - bright blue
			} else if (visitedNodes.includes(node.value)) {
				ctx.fillStyle = "#8ce88f"; // Visited node - bright green
			} else {
				ctx.fillStyle = "#7fa9d9"; // Default node - lighter blue
			}

			ctx.fill();
			ctx.strokeStyle = "#2a6f97"; // Darker blue for border
			ctx.lineWidth = 2;
			ctx.stroke();

			// Draw node value with white text for better contrast
			if (
				(current && node.value === current.value) ||
				visitedNodes.includes(node.value)
			) {
				ctx.fillStyle = "#ffffff"; // White text on colored backgrounds
			} else {
				ctx.fillStyle = "#333333"; // Dark text on light backgrounds
			}
			ctx.font = "bold 14px Inter";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(node.value, pos.x, pos.y);

			drawNodes(node.left);
			drawNodes(node.right);
		}

		drawEdges(root);
		drawNodes(root);
	}

	// DFS implementation
	async function dfs(node) {
		if (!node) return;

		// Mark current node as visited
		visited.push(node.value);

		// Update visualization
		drawTree(node, visited);
		addStep(`Visiting node ${node.value}`, "visited-node");

		// Wait before continuing
		await new Promise((resolve) => trackableSetTimeout(resolve, 500)); // Faster animation (was 1000)

		// Visit left subtree
		if (node.left) {
			addStep(`Moving to left child ${node.left.value}`);
			await dfs(node.left);
		}

		// Visit right subtree
		if (node.right) {
			addStep(`Moving to right child ${node.right.value}`);
			await dfs(node.right);
		}

		// Backtracking
		if (node.left || node.right) {
			addStep(`Backtracking from node ${node.value}`, "current-step");
		}

		// If we've visited all nodes, mark as complete
		if (visited.length === Object.keys(nodePositions).length) {
			addStep("Depth-First Search complete!", "path-node");
			drawTree(null, visited);
			algorithmComplete(); // Reset flag when complete
		}
	}
}

// Helper function to generate a balanced binary tree with n nodes
function generateBalancedBinaryTree(n) {
	if (n <= 0) return null;

	// Create an array of values from 1 to n
	const values = Array.from({ length: n }, (_, i) => i + 1);

	// Shuffle the array to get random values
	for (let i = values.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[values[i], values[j]] = [values[j], values[i]];
	}

	// Build a balanced tree from the values
	return buildBalancedTree(values, 0, values.length - 1);
}

// Helper function to build a balanced binary tree from a sorted array
function buildBalancedTree(values, start, end) {
	if (start > end) return null;

	// Get the middle element as the root
	const mid = Math.floor((start + end) / 2);

	// Create the root node
	const node = {
		value: values[mid],
		left: null,
		right: null,
	};

	// Recursively build left and right subtrees
	node.left = buildBalancedTree(values, start, mid - 1);
	node.right = buildBalancedTree(values, mid + 1, end);

	return node;
}

document.addEventListener("DOMContentLoaded", function () {
	// Tab navigation
	const navLinks = document.querySelectorAll("nav ul li a");
	const tabContents = document.querySelectorAll(".tab-content");

	navLinks.forEach((link) => {
		link.addEventListener("click", function (e) {
			e.preventDefault();
			const targetId = this.getAttribute("href").substring(1);

			// Remove active class from all links and contents
			navLinks.forEach((link) => link.classList.remove("active"));
			tabContents.forEach((content) => content.classList.remove("active"));

			// Add active class to clicked link and corresponding content
			this.classList.add("active");
			document.getElementById(targetId).classList.add("active");
		});
	});

	// Project navigation buttons
	const projectNavBtns = document.querySelectorAll(".project-nav-btn");
	const projects = document.querySelectorAll(".project");

	// Initialize - show only the active project
	function initializeProjects() {
		// First hide all projects
		projects.forEach((project) => {
			project.style.display = "none";
			project.classList.remove("active");
		});

		// Then show only the active one
		const activeBtn = document.querySelector(".project-nav-btn.active");
		if (activeBtn) {
			const targetId = activeBtn.getAttribute("data-target");
			const targetProject = document.getElementById(targetId);
			if (targetProject) {
				targetProject.style.display = "block";
				targetProject.classList.add("active");
			}
		} else if (projects.length > 0) {
			// If no active button, activate the first one
			projectNavBtns[0]?.classList.add("active");
			const firstProject = document.getElementById(
				projectNavBtns[0]?.getAttribute("data-target")
			);
			if (firstProject) {
				firstProject.style.display = "block";
				firstProject.classList.add("active");
			}
		}
	}

	// Handle project navigation button clicks
	projectNavBtns.forEach((btn) => {
		btn.addEventListener("click", function () {
			const targetId = this.getAttribute("data-target");

			// Remove active class from all buttons and hide all projects
			projectNavBtns.forEach((btn) => btn.classList.remove("active"));
			projects.forEach((project) => {
				project.style.display = "none";
				project.classList.remove("active");
			});

			// Add active class to clicked button and show corresponding project
			this.classList.add("active");
			const targetProject = document.getElementById(targetId);
			if (targetProject) {
				targetProject.style.display = "block";
				targetProject.classList.add("active");

				// Scroll to the top of the selected project
				targetProject.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});

				// If the project is inside a scrollable container, also scroll the container
				const projectsTab = document.getElementById("projects");
				if (projectsTab) {
					projectsTab.scrollTop = 0;
				}
			}

			// If it's the algorithm visualizer, reset the canvas
			if (targetId === "algorithm-visualizer") {
				setTimeout(() => {
					resizeCanvas();
					drawCanvasPlaceholder();
				}, 100);
			}
		});
	});

	// Initialize projects on page load
	initializeProjects();

	// Photo transition on hover
	const photoContainer = document.querySelector(".photo-container");
	const youngPhoto = document.getElementById("young-photo");
	const currentPhoto = document.getElementById("current-photo");

	if (photoContainer) {
		photoContainer.addEventListener("mouseenter", function () {
			youngPhoto.style.opacity = "0";
			currentPhoto.style.opacity = "1";
		});

		photoContainer.addEventListener("mouseleave", function () {
			youngPhoto.style.opacity = "1";
			currentPhoto.style.opacity = "0";
		});
	}

	// Add this to the existing project navigation code
	projectNavBtns.forEach((btn) => {
		btn.addEventListener("click", function () {
			const targetId = this.dataset.target;

			// If Algorithm Visualizer is selected, initialize it
			if (targetId === "algorithm-visualizer") {
				setTimeout(() => {
					initializeAlgorithmVisualizer();
				}, 100);
			}
		});
	});

	// Initialize the visualizer if it's the active project on page load
	if (
		document
			.getElementById("algorithm-visualizer")
			.classList.contains("active")
	) {
		setTimeout(() => {
			initializeAlgorithmVisualizer();
		}, 100);
	}
});

// Function to add a step with index to the steps container
function addStep(text, className = "") {
	// Clear the container if it's the first step
	if (document.querySelectorAll(".step-item").length === 0) {
		stepsContainer.innerHTML = "<h4>Visited Nodes</h4>";
	}

	const stepItem = document.createElement("div");
	stepItem.className = `step-item ${className}`;
	stepItem.textContent = text;

	// Set the data-index attribute for the step counter
	const stepCount = document.querySelectorAll(".step-item").length + 1;
	stepItem.setAttribute("data-index", stepCount);

	stepsContainer.appendChild(stepItem);

	// Scroll to the bottom to show the latest step
	stepsContainer.scrollTop = stepsContainer.scrollHeight;
}

// Function to clear steps
function clearSteps() {
	stepsContainer.innerHTML = "<h4>Visited Nodes</h4>";
}

// Initialize the algorithm visualizer when the tab is shown
function initializeAlgorithmVisualizer() {
	resizeCanvas();
	drawCanvasPlaceholder();
	clearSteps();
}

// Helper functions for visualizations

// Generate a random array of integers
function generateRandomArray(length, min, max) {
	return Array.from(
		{ length },
		() => Math.floor(Math.random() * (max - min + 1)) + min
	);
}

// Draw an array as bars
function drawArray(array, highlightIndex1 = -1, highlightIndex2 = -1) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	const barWidth = (canvas.width - 40) / array.length;
	const maxValue = Math.max(...array);
	const scaleFactor = (canvas.height - 60) / maxValue;

	array.forEach((value, index) => {
		const x = 20 + index * barWidth;
		const barHeight = value * scaleFactor;
		const y = canvas.height - 30 - barHeight;

		// Determine bar color based on highlight status
		if (index === highlightIndex1 || index === highlightIndex2) {
			ctx.fillStyle = "rgba(94, 181, 218, 0.8)"; // Highlight color
		} else {
			ctx.fillStyle = "rgba(94, 181, 218, 0.4)"; // Regular color
		}

		// Draw bar
		ctx.beginPath();
		ctx.roundRect(x, y, barWidth - 4, barHeight, 4);
		ctx.fill();

		// Draw value text
		ctx.fillStyle = getComputedStyle(
			document.documentElement
		).getPropertyValue("--text-color");
		ctx.font = "12px Inter";
		ctx.textAlign = "center";
		ctx.fillText(value.toString(), x + (barWidth - 4) / 2, y - 5);
	});
}

// Draw a sorted array for binary search
function drawSortedArray(array) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	const boxWidth = (canvas.width - 40) / array.length;
	const boxHeight = 40;
	const y = (canvas.height - boxHeight) / 2;

	array.forEach((value, index) => {
		const x = 20 + index * boxWidth;

		// Draw box
		ctx.fillStyle = "rgba(94, 181, 218, 0.2)";
		ctx.strokeStyle = "rgba(94, 181, 218, 0.8)";
		ctx.lineWidth = 2;

		ctx.beginPath();
		ctx.roundRect(x, y, boxWidth - 4, boxHeight, 4);
		ctx.fill();
		ctx.stroke();

		// Draw value
		ctx.fillStyle = getComputedStyle(
			document.documentElement
		).getPropertyValue("--text-color");
		ctx.font = "14px Inter";
		ctx.textAlign = "center";
		ctx.fillText(
			value.toString(),
			x + (boxWidth - 4) / 2,
			y + boxHeight / 2 + 5
		);

		// Draw index
		ctx.font = "12px Inter";
		ctx.fillText(
			index.toString(),
			x + (boxWidth - 4) / 2,
			y + boxHeight + 15
		);
	});
}

// Draw sorted array with pointers for binary search
function drawSortedArrayWithPointers(array, left, mid, right) {
	drawSortedArray(array);

	const boxWidth = (canvas.width - 40) / array.length;
	const boxHeight = 40;
	const y = (canvas.height - boxHeight) / 2;

	// Highlight the search range
	for (let i = left; i <= right; i++) {
		const x = 20 + i * boxWidth;

		ctx.fillStyle = "rgba(94, 181, 218, 0.3)";
		ctx.beginPath();
		ctx.roundRect(x, y, boxWidth - 4, boxHeight, 4);
		ctx.fill();
	}

	// Highlight mid element
	const midX = 20 + mid * boxWidth;
	ctx.fillStyle = "rgba(94, 181, 218, 0.8)";
	ctx.beginPath();
	ctx.roundRect(midX, y, boxWidth - 4, boxHeight, 4);
	ctx.fill();

	// Draw labels
	ctx.font = "12px Inter";
	ctx.fillStyle = "#4CAF50";
	ctx.fillText("L", 20 + left * boxWidth + (boxWidth - 4) / 2, y - 15);

	ctx.fillStyle = "#FF5722";
	ctx.fillText("R", 20 + right * boxWidth + (boxWidth - 4) / 2, y - 15);

	ctx.fillStyle = "#9C27B0";
	ctx.fillText("M", midX + (boxWidth - 4) / 2, y - 15);
}

// Draw sorted array with target highlighted
function drawSortedArrayWithTarget(array, targetIndex) {
	drawSortedArray(array);

	if (targetIndex >= 0 && targetIndex < array.length) {
		const boxWidth = (canvas.width - 40) / array.length;
		const boxHeight = 40;
		const y = (canvas.height - boxHeight) / 2;
		const x = 20 + targetIndex * boxWidth;

		// Highlight target element
		ctx.fillStyle = "#4CAF50";
		ctx.beginPath();
		ctx.roundRect(x, y, boxWidth - 4, boxHeight, 4);
		ctx.fill();

		// Draw value in white
		ctx.fillStyle = "white";
		ctx.font = "14px Inter";
		ctx.textAlign = "center";
		ctx.fillText(
			array[targetIndex].toString(),
			x + (boxWidth - 4) / 2,
			y + boxHeight / 2 + 5
		);

		// Draw "Found!" label
		ctx.fillStyle = "#4CAF50";
		ctx.font = "bold 14px Inter";
		ctx.fillText("Found!", x + (boxWidth - 4) / 2, y - 15);
	}
}

// Add this function to reset the algorithm running flag
function algorithmComplete() {
	isAlgorithmRunning = false;
	currentTimeouts = []; // Clear the timeouts array
	console.log("Algorithm completed, ready for next run");
}

// Experience tab enhancements
document.addEventListener("DOMContentLoaded", function () {
	const experienceTab = document.getElementById("experience");
	const jobs = document.querySelectorAll(".job");

	// Add hover effect for job items
	jobs.forEach((job, index) => {
		// Add data attribute for animation sequencing
		job.setAttribute("data-index", index);

		// Add click event to expand/collapse job details on mobile
		job.addEventListener("click", function () {
			if (window.innerWidth <= 768) {
				this.classList.toggle("expanded");
			}
		});
	});

	// Add scroll effect for the timeline
	if (experienceTab) {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const job = entry.target;
						const delay = parseInt(job.getAttribute("data-index")) * 200;

						setTimeout(() => {
							job.classList.add("in-view");
						}, delay);
					}
				});
			},
			{ threshold: 0.2 }
		);

		jobs.forEach((job) => {
			observer.observe(job);
		});
	}

	// Add tech tag hover effect
	const techTags = document.querySelectorAll(".tech-tag");
	techTags.forEach((tag) => {
		tag.addEventListener("mouseenter", function () {
			// Add a subtle pulse animation
			this.style.animation = "pulse 0.5s ease-in-out";

			// Highlight related skills in the skills section
			const skill = this.textContent.trim();
			const skillElements = document.querySelectorAll(".skill");

			skillElements.forEach((element) => {
				if (element.textContent.trim() === skill) {
					element.classList.add("highlighted");
				}
			});
		});

		tag.addEventListener("mouseleave", function () {
			this.style.animation = "";

			// Remove highlight from skills
			const skillElements = document.querySelectorAll(".skill");
			skillElements.forEach((element) => {
				element.classList.remove("highlighted");
			});
		});
	});
});

// Add a pulse animation for tech tags
const styleSheet = document.styleSheets[0];
const pulseKeyframes = `
@keyframes pulse {
	0% { transform: scale(1); }
	50% { transform: scale(1.1); }
	100% { transform: scale(1); }
}`;

try {
	styleSheet.insertRule(pulseKeyframes, styleSheet.cssRules.length);
} catch (e) {
	console.warn("Could not add keyframe animation", e);
}

// Store original form HTML
let originalFormHTML = "";

// Function to validate form inputs
function validateContactForm(name, email, message) {
	const errors = [];

	// Validate name
	if (!name.trim()) {
		errors.push("Please enter your name");
	}

	// Validate email
	if (!email.trim()) {
		errors.push("Please enter your email address");
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		errors.push("Please enter a valid email address");
	}

	// Validate message
	if (!message.trim()) {
		errors.push("Please enter your message");
	} else if (message.trim().length < 10) {
		errors.push("Your message is too short (minimum 10 characters)");
	} else if (message.length > 500) {
		errors.push("Your message is too long (maximum 500 characters)");
	}

	return errors;
}

// Function to attach event listener to contact form
function attachContactFormListener() {
	const contactForm = document.getElementById("contact-form");
	if (contactForm) {
		// Store original form HTML if not already stored
		if (!originalFormHTML) {
			originalFormHTML = contactForm.innerHTML;
		}

		contactForm.addEventListener("submit", function (event) {
			event.preventDefault();

			// Get form values
			const name = document.getElementById("name").value;
			const email = document.getElementById("email").value;
			const message = document.getElementById("message").value;

			// Validate form inputs
			const validationErrors = validateContactForm(name, email, message);
			if (validationErrors.length > 0) {
				// Show error notification with the first error
				showNotification(validationErrors[0], "error");
				return;
			}

			// Show loading state
			const submitButton = contactForm.querySelector(
				"button[type='submit']"
			);
			const originalButtonText = submitButton.innerHTML;
			submitButton.innerHTML = '<span class="spinner"></span> Sending...';
			submitButton.disabled = true;

			// Prepare template parameters
			const templateParams = {
				from_name: name,
				from_email: email,
				message: message,
				to_email: "yna08@terpmail.umd.edu", // Your email address
			};

			// Send email using EmailJS
			emailjs
				.send("yong_mail", "template_pearheq", templateParams)
				.then(function (response) {
					console.log("Email sent successfully!", response);
					showNotification(
						"Message sent successfully! I'll get back to you soon.",
						"success"
					);

					// Show success message in the form
					const successMessage = document.createElement("div");
					successMessage.className = "form-success-message";
					successMessage.innerHTML = `
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
							<polyline points="22 4 12 14.01 9 11.01"></polyline>
						</svg>
						<span>Message sent successfully! I'll get back to you soon.</span>
					`;

					// Clear form and append success message
					contactForm.innerHTML = "";
					contactForm.appendChild(successMessage);

					// Reset form after 5 seconds
					setTimeout(() => {
						contactForm.innerHTML = originalFormHTML;
						// Re-attach event listener to the new form
						attachContactFormListener();
						// Re-add character counter
						addMessageCharCounter();
					}, 5000);
				})
				.catch(function (error) {
					console.error("Email failed to send:", error);
					showNotification(
						"Failed to send message. Please try again later.",
						"error"
					);
				})
				.finally(function () {
					// Reset button state
					submitButton.innerHTML = originalButtonText;
					submitButton.disabled = false;
				});
		});
	}
}

// Function to add character counter to message textarea
function addMessageCharCounter() {
	const messageTextarea = document.getElementById("message");
	if (!messageTextarea) return;

	// Create counter element
	const counterContainer = document.createElement("div");
	counterContainer.className = "char-counter";
	counterContainer.innerHTML = `<span>0</span> / 500 characters`;

	// Insert counter after textarea
	messageTextarea.parentNode.insertBefore(
		counterContainer,
		messageTextarea.nextSibling
	);

	// Update counter on input
	messageTextarea.addEventListener("input", function () {
		const count = this.value.length;
		const counterSpan = counterContainer.querySelector("span");
		counterSpan.textContent = count;

		// Add warning class if approaching limit
		if (count > 400) {
			counterContainer.classList.add("warning");
		} else {
			counterContainer.classList.remove("warning");
		}

		// Add error class if exceeding limit
		if (count > 500) {
			counterContainer.classList.add("error");
		} else {
			counterContainer.classList.remove("error");
		}
	});
}

// Update the DOMContentLoaded event handler
document.addEventListener("DOMContentLoaded", function () {
	// Initialize EmailJS with your public key
	try {
		emailjs.init("EYQS8cgo8Vb9c4Uow");
		console.log("EmailJS initialized successfully");
	} catch (error) {
		console.error("Failed to initialize EmailJS:", error);
	}

	// Attach event listener to contact form
	attachContactFormListener();

	// Add character counter to message textarea
	addMessageCharCounter();
});

// Function to show notification
function showNotification(message, type) {
	// Check if notification container exists, create if not
	let notificationContainer = document.querySelector(
		".notification-container"
	);
	if (!notificationContainer) {
		notificationContainer = document.createElement("div");
		notificationContainer.className = "notification-container";
		document.body.appendChild(notificationContainer);
	}

	// Create notification element
	const notification = document.createElement("div");
	notification.className = `notification ${type}`;
	notification.textContent = message;

	// Add notification to container
	notificationContainer.appendChild(notification);

	// Remove notification after 5 seconds
	setTimeout(() => {
		notification.classList.add("fade-out");
		setTimeout(() => {
			notification.remove();
			// Remove container if empty
			if (notificationContainer.children.length === 0) {
				notificationContainer.remove();
			}
		}, 500);
	}, 5000);
}
