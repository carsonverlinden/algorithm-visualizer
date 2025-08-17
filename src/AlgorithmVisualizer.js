import React, { useState } from 'react';
import './App.css';


const algorithms = [
	{ value: 'bubble', label: 'Bubble Sort' },
	{ value: 'quick', label: 'Quick Sort' },
	{ value: 'bst', label: 'Binary Search Tree' },
];

const dataTypes = [
	{ value: 'int', label: 'Integer' },
	{ value: 'double', label: 'Double' },
	{ value: 'string', label: 'String' },
	{ value: 'char', label: 'Char' },
];


function AlgorithmVisualizer() {
	const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithms[0].value);
	const [selectedType, setSelectedType] = useState(dataTypes[0].value);
	const [data, setData] = useState([5, 3, 8, 1, 2]);
	const [customInput, setCustomInput] = useState('5,3,8,1,2');
	const [step, setStep] = useState(0);
	const [steps, setSteps] = useState([]);


	function compare(a, b) {
		if (selectedType === 'int' || selectedType === 'double') {
			return a > b;
		} else {
			return String(a) > String(b);
		}
	}

	function getBubbleSortSteps(arr) {
		const steps = [];
		const a = [...arr];
		steps.push([...a]);
		for (let i = 0; i < a.length; i++) {
			for (let j = 0; j < a.length - i - 1; j++) {
				if (compare(a[j], a[j + 1])) {
					[a[j], a[j + 1]] = [a[j + 1], a[j]];
					steps.push([...a]);
				}
			}
		}
		return steps;
	}


	function getQuickSortSteps(arr) {
		const steps = [];
		const a = [...arr];
		steps.push([...a]);
		function quickSort(low, high) {
			if (low < high) {
				const pi = partition(low, high);
				quickSort(low, pi - 1);
				quickSort(pi + 1, high);
			}
		}
		function partition(low, high) {
			const pivot = a[high];
			let i = low;
			for (let j = low; j < high; j++) {
				if (!compare(pivot, a[j])) {
					[a[i], a[j]] = [a[j], a[i]];
					steps.push([...a]);
					i++;
				}
			}
			[a[i], a[high]] = [a[high], a[i]];
			steps.push([...a]);
			return i;
		}
		quickSort(0, a.length - 1);
		return steps;
	}


	function getBSTSteps(arr) {
		function TreeNode(val) {
			this.val = val;
			this.left = null;
			this.right = null;
		}
		function insert(root, val) {
			if (!root) return new TreeNode(val);
			if (compare(root.val, val)) root.left = insert(root.left, val);
			else root.right = insert(root.right, val);
			return root;
		}
		let root = null;
		arr.forEach(val => {
			root = insert(root, val);
		});
		const steps = [];
		function inorder(node, visited) {
			if (!node) return;
			inorder(node.left, visited);
			visited.push(node.val);
			steps.push([...visited]);
			inorder(node.right, visited);
		}
		inorder(root, []);
		return steps.length ? steps : [arr];
	}


	const runAlgorithm = () => {
		let generatedSteps = [];
		if (selectedAlgorithm === 'bubble') {
			generatedSteps = getBubbleSortSteps(data);
		} else if (selectedAlgorithm === 'quick') {
			generatedSteps = getQuickSortSteps(data);
		} else if (selectedAlgorithm === 'bst') {
			generatedSteps = getBSTSteps(data);
		}
		setSteps(generatedSteps);
		setStep(0);
	};


	const handleInputChange = (e) => {
		setCustomInput(e.target.value);
		let arr = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
		if (selectedType === 'int') {
			arr = arr.map(v => parseInt(v, 10)).filter(n => !isNaN(n));
		} else if (selectedType === 'double') {
			arr = arr.map(v => parseFloat(v)).filter(n => !isNaN(n));
		} else if (selectedType === 'char') {
			arr = arr.map(v => v.length > 0 ? v[0] : '').filter(c => c !== '');
		}
		setData(arr);
	};

	const handleTypeChange = (e) => {
		setSelectedType(e.target.value);
		// Re-parse input for new type
		handleInputChange({ target: { value: customInput } });
		setSteps([]);
		setStep(0);
	};

	const handleAlgorithmChange = (e) => {
		setSelectedAlgorithm(e.target.value);
		setSteps([]);
		setStep(0);
	};

	const nextStep = () => {
		if (step < steps.length - 1) setStep(step + 1);
	};
	const prevStep = () => {
		if (step > 0) setStep(step - 1);
	};



		return (
			<main className="visualizer-container">
				<header className="visualizer-header">
					<h1>Algorithm Visualizer</h1>
					<p className="subtitle">Explore and visualize sorting and searching algorithms interactively.</p>
				</header>
				<section className="controls">
					<div className="control-group">
						<label htmlFor="algorithm-select">Algorithm</label>
						<select id="algorithm-select" value={selectedAlgorithm} onChange={handleAlgorithmChange}>
							{algorithms.map(algo => (
								<option key={algo.value} value={algo.value}>{algo.label}</option>
							))}
						</select>
					</div>
					<div className="control-group">
						<label htmlFor="type-select">Data Type</label>
						<select id="type-select" value={selectedType} onChange={handleTypeChange}>
							{dataTypes.map(type => (
								<option key={type.value} value={type.value}>{type.label}</option>
							))}
						</select>
					</div>
					<div className="control-group">
						<label htmlFor="data-input">Data (comma separated)</label>
						<input id="data-input" type="text" value={customInput} onChange={handleInputChange} placeholder="e.g. 5,3,8,1,2" />
					</div>
					<button className="visualize-btn" onClick={runAlgorithm}>Visualize</button>
				</section>
				<section className="visualization">
					<h2 className="vis-title">Visualization</h2>
					<ul className="data-list">
						{(steps[step] || data).map((num, idx) => (
							<li key={idx} className="data-item">{String(num)}</li>
						))}
					</ul>
				</section>
				<nav className="step-controls">
					<button className="step-btn" onClick={prevStep} disabled={step === 0}>Previous</button>
					<span className="step-indicator">Step {step + 1} / {steps.length || 1}</span>
					<button className="step-btn" onClick={nextStep} disabled={step >= steps.length - 1}>Next</button>
				</nav>
			</main>
		);
}

export default AlgorithmVisualizer;
