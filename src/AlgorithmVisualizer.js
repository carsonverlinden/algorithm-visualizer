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
    const [searchValue, setSearchValue] = useState('');
    const [searchSteps, setSearchSteps] = useState([]);
    const [bstRoot, setBstRoot] = useState(null);

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
        steps.push({ array: [...a], highlights: [] });
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < a.length - i - 1; j++) {
                if (compare(a[j], a[j + 1])) {
                    [a[j], a[j + 1]] = [a[j + 1], a[j]];
                    steps.push({ array: [...a], highlights: [j, j + 1] });
                } else {
                    steps.push({ array: [...a], highlights: [j, j + 1] });
                }
            }
        }
        return steps;
    }

    function getQuickSortSteps(arr) {
        const steps = [];
        const a = [...arr];
        steps.push({ array: [...a], highlights: [] });
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
                steps.push({ array: [...a], highlights: [j, high] });
                if (!compare(pivot, a[j])) {
                    [a[i], a[j]] = [a[j], a[i]];
                    steps.push({ array: [...a], highlights: [i, j] });
                    i++;
                }
            }
            [a[i], a[high]] = [a[high], a[i]];
            steps.push({ array: [...a], highlights: [i, high] });
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
        setBstRoot(root);
        const steps = [];
        function inorder(node, visited) {
            if (!node) return;
            inorder(node.left, visited);
            visited.push(node.val);
            steps.push({ array: [...visited], highlights: [node.val] });
            inorder(node.right, visited);
        }
        inorder(root, []);
        return steps.length ? steps : [{ array: arr, highlights: [] }];
    }

	function computeTreeLayout(root, width, height, nodeRadius) {
    if (!root) return [];
    let levels = [];
    let queue = [{ node: root, depth: 0, pos: 0 }];
    let maxDepth = 0;
    while (queue.length) {
        let { node, depth, pos } = queue.shift();
        if (!levels[depth]) levels[depth] = [];
        levels[depth].push({ node, pos });
        maxDepth = Math.max(maxDepth, depth);
        if (node.left) queue.push({ node: node.left, depth: depth + 1, pos: pos * 2 });
        if (node.right) queue.push({ node: node.right, depth: depth + 1, pos: pos * 2 + 1 });
    }
    let layout = [];
    let verticalGap = Math.max(nodeRadius * 3, height / (maxDepth + 2));
    for (let d = 0; d < levels.length; d++) {
        let nodes = levels[d];
        let horizontalGap = width / (nodes.length + 1);
        for (let i = 0; i < nodes.length; i++) {
            layout.push({
                node: nodes[i].node,
                x: horizontalGap * (i + 1),
                y: verticalGap * (d + 1),
                depth: d,
                pos: nodes[i].pos,
                parent: null
            });
        }
    }
    let nodeMap = new Map();
    layout.forEach(n => nodeMap.set(n.node, n));
    layout.forEach(n => {
        if (n.node.left) nodeMap.get(n.node.left).parent = n;
        if (n.node.right) nodeMap.get(n.node.right).parent = n;
    });
    return layout;
}

function BSTSVG({ root, highlight, width = 600, height = 400 }) {
    function getDepth(node) {
        if (!node) return 0;
        return 1 + Math.max(getDepth(node.left), getDepth(node.right));
    }
    const nodeCount = root ? countNodes(root) : 0;
    const treeDepth = root ? getDepth(root) : 0;

    let nodeRadius = 24;
    if (nodeCount > 15 || treeDepth > 5) {
        nodeRadius = Math.max(8, 200 / Math.max(nodeCount, treeDepth * 2));
    } else if (nodeCount > 7 || treeDepth > 3) {
        nodeRadius = Math.max(12, 300 / Math.max(nodeCount, treeDepth * 2));
    }

    const layout = computeTreeLayout(root, width, height, nodeRadius);

    return (
        <svg width={width} height={height} style={{background: '#c3dac3' }}>
            {}
            {layout.map((n, idx) =>
                n.parent ? (
                    <line
                        key={'edge-' + idx}
                        x1={n.parent.x}
                        y1={n.parent.y}
                        x2={n.x}
                        y2={n.y}
                        stroke="#888"
                        strokeWidth={2}
                    />
                ) : null
            )}
            {}
            {layout.map((n, idx) => (
                <g key={'node-' + idx}>
                    <circle
                        cx={n.x}
                        cy={n.y}
                        r={nodeRadius}
                        fill={highlight === n.node.val ? "#ffd700" : "#f9f9f9"}
                        stroke="#888"
                        strokeWidth={2}
                    />
                    <text
                        x={n.x}
                        y={n.y + 6}
                        textAnchor="middle"
                        fontWeight={highlight === n.node.val ? "bold" : "normal"}
                        fontSize={Math.max(10, nodeRadius)}
                        fill={highlight === n.node.val ? "#222" : "#555"}
                    >
                        {n.node.val}
                    </text>
                </g>
            ))}
        </svg>
    );
}

function countNodes(node) {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
}

function getBSTSearchSteps(root, value) {
        const steps = [];
        function search(node) {
            if (!node) return;
            steps.push(node.val);
            if (node.val === value) return;
            if (compare(node.val, value)) search(node.left);
            else search(node.right);
        }
        search(root);
        return steps;
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
        setSearchSteps([]);
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
        handleInputChange({ target: { value: customInput } });
        setSteps([]);
        setStep(0);
    };

    const handleAlgorithmChange = (e) => {
        setSelectedAlgorithm(e.target.value);
        setSteps([]);
        setStep(0);
        setSearchSteps([]);
    };

    const nextStep = () => {
        if (step < steps.length - 1) setStep(step + 1);
    };
    const prevStep = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleSearchValueChange = (e) => {
        setSearchValue(e.target.value);
    };

    const runBSTSearch = () => {
        let val = searchValue;
        if (selectedType === 'int') val = parseInt(val, 10);
        else if (selectedType === 'double') val = parseFloat(val);
        else if (selectedType === 'char') val = val.length > 0 ? val[0] : '';
        const path = getBSTSearchSteps(bstRoot, val);
        setSearchSteps(path);
        setStep(0);
    };

    const renderArrows = (highlights) => {
        if (!highlights || highlights.length < 2) return null;
        return (
            <span className="arrow" style={{ marginLeft: 4, marginRight: 4 }}>
                →
            </span>
        );
    };

    const renderBST = (node, highlight) => {
        if (!node) return null;
        const isHighlighted = highlight === node.val;
        return (
            <div className="bst-node" style={{
                display: 'inline-block',
                margin: '8px',
                padding: '8px',
                border: '1px solid #888',
                borderRadius: '50%',
                background: isHighlighted ? '#ffd700' : '#f9f9f9',
                color: isHighlighted ? '#222' : '#555',
                fontWeight: isHighlighted ? 'bold' : 'normal'
            }}>
                {node.val}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
                    {node.left && (
                        <div style={{ marginRight: 16 }}>
                            {renderBST(node.left, highlight)}
                        </div>
                    )}
                    {node.right && (
                        <div style={{ marginLeft: 16 }}>
                            {renderBST(node.right, highlight)}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <main className="visualizer-container">
            <header className="visualizer-header">
                <h1>Algorithm Visualizer</h1>
                <p className="subtitle">Let's get this shit sorted out.</p>
            </header>
            <section className="controls">
                {}
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
                <button className="visualize-btn" onClick={runAlgorithm}>Go!</button>
                {selectedAlgorithm === 'bst' && (
                    <div className="control-group" style={{ marginTop: 16 }}>
                        <label htmlFor="search-input">Search Value</label>
                        <input id="search-input" type="text" value={searchValue} onChange={handleSearchValueChange} placeholder="Enter value to search" />
                        <button className="visualize-btn" style={{ marginLeft: 8 }} onClick={runBSTSearch}>Search</button>
                    </div>
                )}
            </section>
            <section className="visualization">
                <h2 className="vis-title">Visualization</h2>
                {selectedAlgorithm === 'bst' ? (
                    <div style={{ marginTop: 24 }}>
                        {bstRoot ? (
                            <div>
                                {searchSteps.length > 0 ? (
                                    <div>
                                        <p className="search-step-label">
											Step {step + 1} / {searchSteps.length}: Searching for <strong>{searchValue}</strong>
										</p>
                                        <BSTSVG root={bstRoot} highlight={searchSteps[step]} width={600} height={400} />
                                    </div>
                                ) : (
                                    <div>
                                        <p>BST Inorder Traversal (step {step + 1} / {steps.length || 1})</p>
                                        <ul className="data-list">
                                            {(steps[step]?.array || data).map((num, idx) => (
                                                <li key={idx} className="data-item">
                                                    {String(num)}
                                                    {steps[step]?.highlights?.includes(num) && (
                                                        <span className="arrow" style={{ color: '#6b6054', marginLeft: 4 }}>★</span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                        <div style={{ marginTop: 24 }}>
                                            <BSTSVG root={bstRoot} highlight={null} width={600} height={400} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p>No BST to display.</p>
                        )}
                    </div>
                ) : (
                    <ul className="data-list">
                        {(steps[step]?.array || data).map((num, idx) => (
                            <li key={idx} className="data-item" style={{
                                position: 'relative',
                                display: 'inline-block',
                                marginRight: 8,
                                background: steps[step]?.highlights?.includes(idx) ? '#6b6054' : '#f9f9f9',
                                color: steps[step]?.highlights?.includes(idx) ? '#222' : '#555',
                                fontWeight: steps[step]?.highlights?.includes(idx) ? 'bold' : 'normal',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #888'
                            }}>
                                {String(num)}
                                {steps[step]?.highlights?.length === 2 && steps[step]?.highlights?.includes(idx) && (
                                    renderArrows(steps[step].highlights)
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
            <nav className="step-controls">
                <button className="step-btn" onClick={prevStep} disabled={step === 0}>Previous</button>
                <span className="step-indicator">Step {step + 1} / {searchSteps.length > 0 ? searchSteps.length : (steps.length || 1)}</span>
                <button className="step-btn" onClick={nextStep} disabled={step >= ((searchSteps.length > 0 ? searchSteps.length : steps.length) - 1)}>Next</button>
            </nav>
        </main>
    );
}

export default AlgorithmVisualizer;
