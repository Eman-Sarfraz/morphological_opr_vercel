// Helper function to get neighbors based on kernel
const getNeighbors = (grid, row, col, kernel) => {
  const kernelSize = kernel.length;
  const offset = Math.floor(kernelSize / 2);
  const neighbors = [];
  
  for (let i = 0; i < kernelSize; i++) {
    for (let j = 0; j < kernelSize; j++) {
      if (kernel[i][j] === 1) {
        const newRow = row + (i - offset);
        const newCol = col + (j - offset);
        if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
          neighbors.push(grid[newRow][newCol]);
        }
      }
    }
  }
  return neighbors;
};

// Create a copy of the grid
const copyGrid = (grid) => grid.map(row => [...row]);

// Erosion operation
const erode = (grid, kernel) => {
  const result = copyGrid(grid);
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const neighbors = getNeighbors(grid, i, j, kernel);
      result[i][j] = grid[i][j] && neighbors.every(n => n === 1) ? 1 : 0;
    }
  }
  return result;
};

// Dilation operation
const dilate = (grid, kernel) => {
  const result = copyGrid(grid);
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const neighbors = getNeighbors(grid, i, j, kernel);
      result[i][j] = grid[i][j] || neighbors.some(n => n === 1) ? 1 : 0;
    }
  }
  return result;
};

// Opening operation (erosion followed by dilation)
const opening = (grid, kernel) => {
  return dilate(erode(grid, kernel), kernel);
};

// Closing operation (dilation followed by erosion)
const closing = (grid, kernel) => {
  return erode(dilate(grid, kernel), kernel);
};

// Boundary extraction
const boundary = (grid, kernel) => {
  const result = copyGrid(grid);
  const eroded = erode(grid, kernel);
  
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      result[i][j] = grid[i][j] - eroded[i][j];
    }
  }
  return result;
};

// Hole filling
const holeFilling = (grid, kernel) => {
  const result = copyGrid(grid);
  let changed;
  
  do {
    changed = false;
    const temp = copyGrid(result);
    
    for (let i = 1; i < grid.length - 1; i++) {
      for (let j = 1; j < grid[0].length - 1; j++) {
        if (result[i][j] === 0) {
          const neighbors = getNeighbors(result, i, j, kernel);
          if (neighbors.some(n => n === 1)) {
            temp[i][j] = 1;
            changed = true;
          }
        }
      }
    }
    
    if (changed) {
      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
          result[i][j] = temp[i][j];
        }
      }
    }
  } while (changed);

  return result;
};

export const performMorphologicalOperation = (grid, operation, kernel) => {
  switch (operation) {
    case 'erosion':
      return erode(grid, kernel);
    case 'dilation':
      return dilate(grid, kernel);
    case 'opening':
      return opening(grid, kernel);
    case 'closing':
      return closing(grid, kernel);
    case 'boundary':
      return boundary(grid, kernel);
    case 'holeFilling':
      return holeFilling(grid, kernel);
    default:
      return grid;
  }
};