import React, { useState, useCallback } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Grid from './components/Grid';
import { performMorphologicalOperation } from './utils/morphology';

const MIN_GRID_SIZE = 5;
const MAX_GRID_SIZE = 10;
const KERNEL_SIZE = 3;

const operations = [
  { name: 'Erosion', value: 'erosion' },
  { name: 'Dilation', value: 'dilation' },
  { name: 'Opening', value: 'opening' },
  { name: 'Closing', value: 'closing' },
  { name: 'Boundary Extraction', value: 'boundary' },
  { name: 'Hole Filling', value: 'holeFilling' },
];

function App() {
  const [gridSize, setGridSize] = useState(5);
  const [grid, setGrid] = useState(Array(gridSize).fill().map(() => Array(gridSize).fill(0)));
  const [kernel, setKernel] = useState(Array(KERNEL_SIZE).fill().map(() => Array(KERNEL_SIZE).fill(1)));
  const [operation, setOperation] = useState(operations[0]);
  const [result, setResult] = useState(null);

  const handleGridSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setGridSize(newSize);
    setGrid(Array(newSize).fill().map(() => Array(newSize).fill(0)));
    setResult(null);
  };

  const handleCellClick = useCallback((row, col) => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(r => [...r]);
      newGrid[row][col] = newGrid[row][col] === 1 ? 0 : 1;
      return newGrid;
    });
  }, []);

  const handleKernelClick = useCallback((row, col) => {
    setKernel(prevKernel => {
      const newKernel = prevKernel.map(r => [...r]);
      newKernel[row][col] = newKernel[row][col] === 1 ? 0 : 1;
      return newKernel;
    });
  }, []);

  const handleOperation = () => {
    const resultGrid = performMorphologicalOperation(grid, operation.value, kernel);
    setResult(resultGrid);
  };

  const handleClear = () => {
    setGrid(Array(gridSize).fill().map(() => Array(gridSize).fill(0)));
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-3">
            Morphological Operations
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create binary images by clicking the tiles, configure the kernel, and apply various morphological operations
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
          <div className="mb-6">
            <label htmlFor="grid-size" className="block text-sm font-medium text-gray-700 mb-2">
              Grid Size: {gridSize} × {gridSize}
            </label>
            <input
              type="range"
              id="grid-size"
              min={MIN_GRID_SIZE}
              max={MAX_GRID_SIZE}
              value={gridSize}
              onChange={handleGridSizeChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Input Image</h2>
                <div className="flex items-center justify-center bg-gray-50 rounded-xl p-6 shadow-inner">
                  <Grid grid={grid} onCellClick={handleCellClick} />
                </div>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Structuring Element (Kernel)</h2>
                <div className="flex items-center justify-center bg-gray-50 rounded-xl p-6 shadow-inner">
                  <Grid grid={kernel} onCellClick={handleKernelClick} small />
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Click to toggle kernel elements (1 = white, 0 = gray)
                </p>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Result</h2>
                <div className="flex items-center justify-center bg-gray-50 rounded-xl p-6 shadow-inner min-h-[300px]">
                  {result ? (
                    <Grid grid={result} onCellClick={null} />
                  ) : (
                    <div className="text-gray-400 italic">
                      Apply an operation to see the result
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
            <div className="relative">
              <select
                value={operation.value}
                onChange={(e) => setOperation(operations.find(op => op.value === e.target.value))}
                className="block w-64 rounded-lg border-0 py-3 pl-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white/50 backdrop-blur-sm"
              >
                {operations.map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>

            <button
              onClick={handleOperation}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              Apply Operation
            </button>

            <button
              onClick={handleClear}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              Clear Grid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;