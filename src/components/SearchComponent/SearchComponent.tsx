import React, { useState, useEffect } from "react";
import "./SearchComponent.css";

interface SearchComponentProps {
  onFilterChange: (name: string, categories: string[], availability: string) => void;
  availableCategories: string[];
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onFilterChange, availableCategories }) => {
  // Local state to manage input values before applying filters
  const [nameInput, setNameInput] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All');

  useEffect(() => {
      if (selectedCategories.length === 0 && !availableCategories.includes('All')) {
          setSelectedCategories(['All']);
      }
  }, [selectedCategories, availableCategories]);


  const handleSearch = () => {
    const categoriesToSearch = selectedCategories.includes('All') || selectedCategories.length === 0
      ? []
      : selectedCategories;

    onFilterChange(
      nameInput,
      categoriesToSearch,
      selectedAvailability
    );
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === 'All') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([value]);
    }
  };


  return (
    <div className="container">
      <div className="nameContainer">
        <label>Product name:</label>
        <input
          type="search"
          className="inputName"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
      </div>
      <div className="categoryContainer">
        <label>Category:</label>
        <select
          className="inputCategory"
          value={selectedCategories.length === 0 ? 'All' : selectedCategories[0]}
          onChange={handleCategoryChange}
        >
          <option key="All" value="All">All</option>
          {availableCategories.filter(category => category !== 'All').map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="availabilityContainer">
        <label>Availability:</label>
        <select
          className="inputAvailability"
          value={selectedAvailability}
          onChange={(e) => setSelectedAvailability(e.target.value)}
        >
          <option value="All">All</option>
          <option value="In stock">In stock</option>
          <option value="Out of stock">Out of stock</option>
        </select>
      </div>
      <button className="searchButton" onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchComponent;