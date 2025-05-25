import React, { useState, useEffect } from "react";
import "./SearchComponent.css";
import { TextField, Button, Select, MenuItem, InputLabel } from '@mui/material';

interface SearchComponentProps {
  onFilterChange: (name: string, categories: string[], availability: string) => void;
  availableCategories: string[];
  handleCreateButtonClick: () => void
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onFilterChange, availableCategories, handleCreateButtonClick }) => {
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

  const handleCategoryChange = (event: any) => {
    const value = event.target.value;
    if (value === 'All') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([value]);
    }
  };

  return (
    <div className="container">
      <TextField
        type="search"
        label="Product name"
        className="inputName"
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
      />
      <div className="categoryContainer">
        <InputLabel>Category:</InputLabel>
        <Select
          className="inputCategory"
          value={selectedCategories.length === 0 ? 'All' : selectedCategories[0]}
          onChange={handleCategoryChange}
          style={{width: "10rem"}}
        >
          <MenuItem key="All" value="All">All</MenuItem>
          {availableCategories.filter(category => category !== 'All').map(category => (
            <MenuItem key={category} value={category}>{category}</MenuItem>
          ))}
        </Select>
      </div>
      <div className="availabilityContainer">
        <InputLabel>Availability:</InputLabel>
        <Select
          className="inputAvailability"
          value={selectedAvailability}
          onChange={(e) => setSelectedAvailability(e.target.value)}
          style={{width: "10rem"}}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="In stock">In stock</MenuItem>
          <MenuItem value="Out of stock">Out of stock</MenuItem>
        </Select>
      </div>
      <Button 
      className="searchButton" 
      onClick={handleSearch}
      variant="contained"
      style={{backgroundColor: "black"}}
      >Search
      </Button>
      <Button 
      className="createButton" 
      onClick={handleCreateButtonClick}
      variant="outlined"
      style={{backgroundColor: "rgb(29, 15, 231)", color: "white", transition: "ease 0.3s"}}
      >Create new product
      </Button>
    </div>
  );
}

export default SearchComponent;