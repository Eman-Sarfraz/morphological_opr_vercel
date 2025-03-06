import React from 'react';

function Grid({ grid, onCellClick, small = false }) {
  return (
    <div className="inline-block bg-white rounded-lg p-4 shadow-lg">
      <div 
        className="grid gap-1" 
        style={{ 
          gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
          transform: small ? 'scale(0.8)' : 'scale(0.9)',
          transition: 'transform 0.2s ease-in-out',
        }}
      >
        {grid.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => onCellClick?.(rowIndex, colIndex)}
              disabled={!onCellClick}
              className={`
                ${small ? 'w-5 h-5' : 'w-6 h-6'} 
                rounded-sm transition-all duration-200 transform
                ${cell ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md scale-105' : 'bg-gray-50 hover:bg-gray-100'}
                ${onCellClick ? 'hover:scale-110 cursor-pointer' : ''}
                border border-gray-200
              `}
            />
          ))
        ))}
      </div>
    </div>
  );
}

export default Grid;