import React, { useState } from 'react';
import './App.css';

// Algorithm options for dropdown
const algorithms = [
    { value: 'bubble', label: 'Bubble Sort' },
    { value: 'quick', label: 'Quick Sort' },
    { value: 'merge', label: 'Merge Sort' },
    { value: 'bst', label: 'Binary Search Tree' }
];

/**
 * @function getMergeSortStepsWithPreview
 * @description Generates step-by-step states for Merge Sort algorithm with preview steps before each merge.
 * @param {Array} arr Array to sort
 * @returns {Array} Step objects showing array state and merges
 */
function getMergeSortStepsWithPreview(arr) {
    const steps = [];
    const a = [...arr];
    steps.push({ array: [...a], highlights: [] });
    // Recursive merge sort helper
    function mergeSort(low, high) {
        if (low >= high) return;
        const mid = Math.floor((low + high) / 2);
        mergeSort(low, mid);
        mergeSort(mid + 1, high);
        merge(low, mid, high);
    }
    // Merge helper for merge sort
    function merge(low, mid, high) {
        let left = a.slice(low, mid + 1);
        let right = a.slice(mid + 1, high + 1);
        let i = 0, j = 0, k = low;
        // Preview step: show which indices will be merged
        let mergeIndices = [];
        for (let idx = low; idx <= high; idx++) mergeIndices.push(idx);
        steps.push({ array: [...a], highlights: mergeIndices, preview: true });
        while (i < left.length && j < right.length) {
            if (compare(left[i], right[j])) {
                a[k] = right[j];
                j++;
            } else {
                a[k] = left[i];
                i++;
            }
            k++;
        }
        while (i < left.length) {
            a[k] = left[i];
            i++; k++;
        }
        while (j < right.length) {
            a[k] = right[j];
            j++; k++;
        }
        // Actual move step: no highlights
        steps.push({ array: [...a], highlights: [], preview: false });
    }
    mergeSort(0, a.length - 1);
    return steps;
}



// Data type options for dropdown
const dataTypes = [
    { value: 'int', label: 'Integer' },
    { value: 'double', label: 'Float' },
    { value: 'string', label: 'String' },
    { value: 'char', label: 'Char' },
];



/**
 * @function compare
 * @description Compares two values for sorting, handling numbers, strings, and chars.
 * @param {any} a First value
 * @param {any} b Second value
 * @returns {boolean} True if a > b
 */
function compare(a, b) {
    // Handles int, float, string, char
    if (typeof a === 'number' && typeof b === 'number') {
        return a > b;
    }
    return String(a) > String(b);
}



/**
 * @function getBubbleSortStepsWithPreview
 * @description Generates step-by-step states for Bubble Sort algorithm with preview steps before each swap.
 * @param {Array} arr Array to sort
 * @returns {Array} Step objects showing array state and swaps
 */
function getBubbleSortStepsWithPreview(arr) {
    const steps = [];
    const a = [...arr];
    steps.push({ array: [...a], highlights: [] });
    for (let i = 0; i < a.length - 1; i++) {
        for (let j = 0; j < a.length - i - 1; j++) {
            if (compare(a[j], a[j + 1])) {
                // Preview only if a swap will happen
                steps.push({ array: [...a], highlights: [j, j + 1], preview: true });
                // Actual move step: swap
                [a[j], a[j + 1]] = [a[j + 1], a[j]];
                steps.push({ array: [...a], highlights: [], preview: false });
            }
        }
    }
    return steps;
}



/**
 * @function getQuickSortStepsWithPreview
 * @description Generates step-by-step states for Quick Sort algorithm with preview steps before each swap and pivot selection.
 * @param {Array} arr Array to sort
 * @returns {Array} Step objects showing array state, swaps, and pivots
 */
function getQuickSortStepsWithPreview(arr) {
    const steps = [];
    const a = [...arr];
    steps.push({ array: [...a], highlights: [] });
    // Recursive quick sort helper
    function quickSort(low, high) {
        if (low < high) {
            const pi = partition(low, high);
            quickSort(low, pi - 1);
            quickSort(pi + 1, high);
        }
    }
    // Partition helper for quick sort
    function partition(low, high) {
        let pivot = a[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            if (!compare(a[j], pivot)) {
                // Only preview if a swap will happen
                steps.push({
                    array: [...a],
                    highlights: [j, high],
                    preview: true,
                    pivotIndex: high,
                    swapDirection: 'left'
                });
                i++;
                [a[i], a[j]] = [a[j], a[i]];
                steps.push({ array: [...a], highlights: [], preview: false });
            }
            // No preview for comparisons where no swap of elements occurs
        }
        // Final pivot swap preview (if needed)
        if (i + 1 !== high && a[i + 1] !== a[high]) {
            steps.push({
                array: [...a],
                highlights: [i + 1, high],
                preview: true,
                pivotIndex: high,
                swapDirection: 'left'
            });
            [a[i + 1], a[high]] = [a[high], a[i + 1]];
            steps.push({ array: [...a], highlights: [], preview: false });
        } else {
            // No preview for unnecessary pivot swaps
            steps.push({ array: [...a], highlights: [], preview: false });
        }
        return i + 1;
    }
    quickSort(0, a.length - 1);
    return steps;
}



// Build BST and generate traversal steps
function getBSTSteps(arr, setBstRoot) {
    // BST node constructor
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
    // Get sorted values by inorder traversal
    function inorderList(node, result) {
        if (!node) return;
        inorderList(node.left, result);
        result.push(node.val);
        inorderList(node.right, result);
    }
    const sorted = [];
    inorderList(root, sorted);
    // For each value in sorted order, highlight the root node and then move down the tree, highlighting each node along the way until the desired value is reached, then add that value to the list.
    const steps = [];
    const visited = [];
    sorted.forEach(val => {
        let curr = root;
        const searchPath = [];
        while (curr) {
            searchPath.push(curr.val);
            steps.push({ array: [...visited], highlights: [curr.val], traversal: 'search', target: val });
            if (curr.val === val) break;
            if (compare(curr.val, val)) curr = curr.left;
            else curr = curr.right;
        }
        visited.push(val);
        steps.push({ array: [...visited], highlights: [val], traversal: 'visit', target: val });
    });
    return steps.length ? steps : [{ array: arr, highlights: [] }];
}



/**
 * @component AlgorithmVisualizer
 * @description Main React component for the algorithm visualizer UI and logic.
 * @returns {JSX.Element} The visualizer app
 */
function AlgorithmVisualizer() {
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');
    const [selectedType, setSelectedType] = useState('int');
    const [customInput, setCustomInput] = useState('');
    const [data, setData] = useState([]);
    const [steps, setSteps] = useState([]);
    const [step, setStep] = useState(0);
    const [bstRoot, setBstRoot] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [searchSteps, setSearchSteps] = useState([]);

    // Handle algorithm selection change
    const handleAlgorithmChange = (e) => {
        setSelectedAlgorithm(e.target.value);
        setSteps([]);
        setStep(0);
        setBstRoot(null);
        setSearchSteps([]);
    };

    // Handle data type selection change
    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
        setSteps([]);
        setStep(0);
        setBstRoot(null);
        setSearchSteps([]);
    };

    // Handle custom input change
    const handleInputChange = (e) => {
        setCustomInput(e.target.value);
        let arr = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
        if (selectedType === 'int') arr = arr.map(Number);
        else if (selectedType === 'double') arr = arr.map(parseFloat);
        else if (selectedType === 'char') arr = arr.map(s => s[0]);
        setData(arr);
        setSteps([]);
        setStep(0);
        setBstRoot(null);
        setSearchSteps([]);
    };



    // Run selected algorithm and generate steps
    const runAlgorithm = () => {
        let generatedSteps = [];
        if (selectedAlgorithm === 'bubble') {
            generatedSteps = getBubbleSortStepsWithPreview(data);
        } else if (selectedAlgorithm === 'quick') {
            generatedSteps = getQuickSortStepsWithPreview(data);
        } else if (selectedAlgorithm === 'merge') {
            generatedSteps = getMergeSortStepsWithPreview(data);
        } else if (selectedAlgorithm === 'bst') {
            generatedSteps = getBSTSteps(data, setBstRoot);
        }
        setSteps(generatedSteps);
        setSearchSteps([]);
    };



    // Go to next visualization step
    const nextStep = () => {
        if (step < steps.length - 1) setStep(step + 1);
    };
    // Go to previous visualization step
    const prevStep = () => {
        if (step > 0) setStep(step - 1);
    };
    // Handle BST search value input change
    const handleSearchValueChange = (e) => {
        setSearchValue(e.target.value);
    };



    /**
     * @function getBSTSearchSteps
     * @description Records the path taken during BST search.
     * @param {Object} root BST root
     * @param {any} value Value to search for
     * @returns {Array} Array of visited node values
     */
    // Generate steps for BST search path
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
    };



    // Run BST search and update steps
    const runBSTSearch = () => {
        let val = searchValue;
        if (selectedType === 'int') val = parseInt(val, 10);
        else if (selectedType === 'double') val = parseFloat(val);
        else if (selectedType === 'char') val = val.length > 0 ? val[0] : '';
        const path = getBSTSearchSteps(bstRoot, val);
        setSearchSteps(path);
        setStep(0);
    };



    // Compute layout positions for BST SVG rendering
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
        // Detect singly linked tree (degenerate chain)
        let isSingleChain = true;
        let curr = root;
        while (curr) {
            if ((curr.left && curr.right) || (curr.left && curr.left.right) || (curr.right && curr.right.left)) {
                isSingleChain = false;
                break;
            }
            curr = curr.left || curr.right;
        }
        let topOffset = 0;
        if (isSingleChain && levels.length >= 4) {
            topOffset = nodeRadius * 2; // Force top node to be near top
        }
        for (let d = 0; d < levels.length; d++) {
            let nodes = levels[d];
            let horizontalGap = width / (nodes.length + 1);
            for (let i = 0; i < nodes.length; i++) {
                layout.push({
                    node: nodes[i].node,
                    x: horizontalGap * (i + 1),
                    y: verticalGap * (d + 1) - (isSingleChain ? (verticalGap * (levels.length - 1) / 2 - topOffset) : 0),
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
    };



    // SVG component for rendering BST
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
            <svg width={width} height={height} style={{background: '#c3dac3'}}>
                <g transform="scale(0.9,0.9) translate(30,30)">
                    {/* Edges */}
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
                    {/* Nodes */}
                    {layout.map((n, idx) => (
                        <g key={'node-' + idx}>
                            <circle
                                cx={n.x}
                                cy={n.y}
                                r={nodeRadius}
                                fill={highlight === n.node.val ? "#929487" : "#f9f9f9"}
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
                </g>
            </svg>
        );
    }
    
    // Recursively count nodes in BST
    function countNodes(node) {
        if (!node) return 0;
        return 1 + countNodes(node.left) + countNodes(node.right);
    }



    /**
     * @function renderArrows
     * @description Renders directional arrows for swap previews in sorting visualizations.
     * @param {Array} highlights Indices being swapped
     * @param {string} swapDirection Direction of swap ('left' or 'right')
     * @param {number} pivotIndex Index of pivot (for quick sort)
     * @returns {JSX.Element|null} Arrow element or null
     */
    // Render directional arrows for sorting steps
    // Render per-element directional arrows for sorting steps
    const renderArrows = (idx, highlights, stepIdx) => {
        if (!highlights || highlights.length < 2) return null;
        // Only show arrow if this index is highlighted
        if (!highlights.includes(idx)) return null;
        // Find direction by comparing current and next step
        if (steps[stepIdx + 1] && steps[stepIdx]?.preview) {
            const currArr = steps[stepIdx].array;
            const nextArr = steps[stepIdx + 1].array;
            const value = currArr[idx];
            const currPos = idx;
            const nextPos = nextArr.indexOf(value);
            if (nextPos > currPos) {
                return <span className="arrow" style={{ marginLeft: 4, marginRight: 4, color: '#222' }}>⇢</span>;
            } else if (nextPos < currPos) {
                return <span className="arrow" style={{ marginLeft: 4, marginRight: 4, color: '#222' }}>⇠</span>;
            }
        }
        return null;
    };



    /**
     * @function renderBST
     * @description Recursively renders a binary search tree as nested divs for visualization.
     * @param {Object} node BST node
     * @param {any} highlight Value to highlight
     * @returns {JSX.Element|null} Tree visualization or null
     */
    // Recursively render BST as nested divs
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
                background: isHighlighted ? '#929487' : '#f9f9f9',
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

    

/**
 * @function getBSTSteps
 * @description Constructs a binary search tree from the array and returns steps of inorder traversal.
 * @param {Array} arr Input array
 * @returns {Array} Step objects representing visited nodes
 */
function getBSTSearchSteps(root, value) {
        const steps = [];
        const path = [];
        function search(node) {
            if (!node) return;
            path.push(node.val);
            steps.push({ highlights: [node.val], path: [...path], found: node.val === value });
            if (node.val === value) return;
            if (compare(node.val, value)) search(node.left);
            else search(node.right);
        }
        search(root);
        return steps;
    }



/**
 * @function computeTreeLayout
 * @description Computes (x, y) positions for rendering BST nodes in an SVG tree layout.
 * @param {Object} root BST root node
 * @param {number} width SVG width
 * @param {number} height SVG height
 * @param {number} nodeRadius Radius of each tree node
 * @returns {Array} Array of positioned nodes for visualization
 */
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
    // For small trees, increase vertical and horizontal gaps to center and scale nodes
    let minVerticalGap = nodeRadius * 4;
    let verticalGap = Math.max(minVerticalGap, height / (maxDepth + 2));
    for (let d = 0; d < levels.length; d++) {
        let nodes = levels[d];
        // For small trees, use larger horizontal gap to center nodes
        let minHorizontalGap = nodeRadius * 4;
        let horizontalGap = Math.max(minHorizontalGap, width / (nodes.length + 1));
        // Center nodes horizontally
        let totalWidth = horizontalGap * nodes.length;
        let offsetX = (width - totalWidth) / 2 + horizontalGap / 2;
        for (let i = 0; i < nodes.length; i++) {
            layout.push({
                node: nodes[i].node,
                x: offsetX + horizontalGap * i,
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



/**
 * @component BSTSVG
 * @description Renders a Binary Search Tree using SVG. Highlights current node if specified.
 * @param {Object} props.root Root of BST
 * @param {any} props.highlight Value to highlight
 * @param {number} props.width SVG width
 * @param {number} props.height SVG height
 * @returns {JSX.Element} SVG element representing the tree
*/
function BSTSVG({ root, highlight, width = 600, height = 400 }) {
    function getDepth(node) {
        if (!node) return 0;
        return 1 + Math.max(getDepth(node.left), getDepth(node.right));
    }
    const nodeCount = root ? countNodes(root) : 0;
    const treeDepth = root ? getDepth(root) : 0;

    let nodeRadius = 8;
    if (nodeCount > 15 || treeDepth > 5) {
        nodeRadius = Math.max(3.2, 96 / Math.max(nodeCount, treeDepth * 2));
    } else if (nodeCount > 7 || treeDepth > 3) {
        nodeRadius = Math.max(4.8, 128 / Math.max(nodeCount, treeDepth * 2));
    } else if (treeDepth >= 4) {
        nodeRadius = Math.max(4, 80 / treeDepth);
    }

    const layout = computeTreeLayout(root, width, height, nodeRadius);

    // Main render return for AlgorithmVisualizer
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
                        fill={highlight === n.node.val ? "#929487" : "#f9f9f9"}
                        stroke="#888"
                        strokeWidth={2}
                    />
                    <text
                        x={n.x}
                        y={n.y + 6}
                        textAnchor="middle"
                        style={{
                            fontWeight: highlight === n.node.val ? "bold" : "normal",
                            fontSize: Math.max(10, nodeRadius),
                            fill: highlight === n.node.val ? "#222" : "#555"
                        }}
                    >
                        {n.node.val}
                    </text>
                </g>
            ))}
        </svg>
    );
}



/**
 * @function countNodes
 * @description Recursively counts the number of nodes in a binary tree.
 * @param {Object} node Root node
 * @returns {number} Number of nodes
 */
function countNodes(node) {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
}



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
                                        <p>
                                            BST Inorder Traversal (step {step + 1} / {steps.length || 1})<br />
                                            <span style={{ fontStyle: 'italic', color: '#888' }}>
                                                Traversal: {steps[step]?.traversal === 'enter' ? 'Entering node' : steps[step]?.traversal === 'visit' ? 'Visiting node (add to list)' : ''}
                                            </span>
                                        </p>
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
                                            <BSTSVG root={bstRoot} highlight={steps[step]?.highlights?.[0] ?? null} width={600} height={400} />
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
                        {(steps[step]?.array || data).map((num, idx) => {
                            const isPivot = steps[step]?.pivotIndex === idx;
                            const isHighlighted = steps[step]?.highlights?.includes(idx);
                            const highlightColor = '#6b6054';
                            return (
                                <li key={idx} className="data-item" style={{
                                    position: 'relative',
                                    display: 'inline-block',
                                    marginRight: 8,
                                    background: (isPivot || isHighlighted) ? highlightColor : '#f9f9f9',
                                    color: (isPivot || isHighlighted) ? '#222' : '#555',
                                    fontWeight: (isPivot || isHighlighted) ? 'bold' : 'normal',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #888'
                                }}>
                                    {String(num)}
                                    {/* Show per-element arrow for swaps in preview steps */}
                                    {steps[step]?.preview && steps[step]?.highlights?.length === 2 && steps[step]?.highlights?.includes(idx) &&
                                        renderArrows(idx, steps[step].highlights, step)
                                    }
                                    {/* Always show pivot label in preview steps */}
                                    {steps[step]?.preview && isPivot && (
                                        <span style={{ marginLeft: 4, color: '#d2691e', fontWeight: 'bold' }}>(pivot)</span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>
            <nav className="step-controls">
                <button className="step-btn" onClick={prevStep} disabled={step === 0}>Previous</button>
                <span className="step-indicator">
                    Step {(() => {
                        if (searchSteps.length > 0) return step;
                        let nonPreviewCount = 0;
                        for (let i = 0; i <= step; i++) {
                            if (!steps[i]?.preview) nonPreviewCount++;
                        }
                        return Math.max(0, nonPreviewCount - 1);
                    })()} / {searchSteps.length > 0 ? searchSteps.length - 1 : Math.max(0, steps.filter(s => !s.preview).length - 1)}
                </span>
                <button className="step-btn" onClick={nextStep} disabled={step >= ((searchSteps.length > 0 ? searchSteps.length : steps.length) - 1)}>Next</button>
            </nav>
        </main>
    );
}

export default AlgorithmVisualizer;