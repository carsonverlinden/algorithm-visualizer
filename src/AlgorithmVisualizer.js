import React, { useState } from 'react';
import './App.css';

const algorithms = [
	{ value: 'bubble', label: 'Bubble Sort' },
	{ value: 'quick', label: 'Quick Sort' },
	{ value: 'bst', label: 'Binary Search Tree' },
];

function AlgorithmVisualizer() {
	const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithms[0].value);
	const [data, setData] = useState([5, 3, 8, 1, 2]);
	const [customInput, setCustomInput] = useState('5,3,8,1,2');
	const [step, setStep] = useState(0);
	const [steps, setSteps] = useState([]);

	function getBubbleSortSteps(arr) {
		const steps = [];
		const a = [...arr];
		steps.push([...a]);
		for (let i = 0; i < a.length; i++) {
			for (let j = 0; j < a.length - i - 1; j++) {
				if (a[j] > a[j + 1]) {
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
				if (a[j] < pivot) {
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
			if (val < root.val) root.left = insert(root.left, val);
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
		const arr = e.target.value.split(',').map(Number).filter(n => !isNaN(n));
		setData(arr);
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
		<div className="visualizer-container">
			<h1>Algorithm Visualizer</h1>
			<div className="controls">
				<label>
					Algorithm:
					<select value={selectedAlgorithm} onChange={handleAlgorithmChange}>
						{algorithms.map(algo => (
							<option key={algo.value} value={algo.value}>{algo.label}</option>
						))}
					</select>
				</label>
				<label>
					Data (comma separated):
					<input type="text" value={customInput} onChange={handleInputChange} />
				</label>
				<button onClick={runAlgorithm}>Visualize</button>
			</div>
			<div className="visualization">
				{/* Visualization area */}
				<ul className="data-list">
					{(steps[step] || data).map((num, idx) => (
						<li key={idx} className="data-item">{num}</li>
					))}
				</ul>
			</div>
			<div className="step-controls">
				<button onClick={prevStep} disabled={step === 0}>Previous</button>
				<span>Step {step + 1} / {steps.length || 1}</span>
				<button onClick={nextStep} disabled={step >= steps.length - 1}>Next</button>
			</div>
		</div>
	);
}

export default AlgorithmVisualizer;
