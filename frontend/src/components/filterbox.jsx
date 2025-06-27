import React, { useState } from 'react';


const CheckboxColumnFilter = ({ column, data }) => {
  const [showOptions, setShowOptions] = useState(false);

  // Get unique values for this column
  const uniqueValues = Array.from(new Set(data.map(row => row[column.id])));

  const filterValue = column.getFilterValue() || [];

  const handleCheckboxChange = (val) => {
    if (filterValue.includes(val)) {
      column.setFilterValue(filterValue.filter(v => v !== val));
    } else {
      column.setFilterValue([...filterValue, val]);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="rounded px-1 py-0.5 text-xs bg-blue-500"
      >
        Filter
      </button>
      {showOptions && (
        <div className="absolute z-10 bg-white rounded text-black border p-4 w-60 max-h-80 overflow-auto shadow">
          {uniqueValues.map((val) => (
            <label key={val} className="block text-xs  mb-1">
              <input
                type="checkbox"
                checked={filterValue.includes(val)}
                onChange={() => handleCheckboxChange(val)}
                className="mr-1 bg-white-500 border bprder-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              {val}
            </label>
          ))}
          <button
            onClick={() => column.setFilterValue(undefined)}
            className="text-xs text-blue-500 mt-1"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckboxColumnFilter;