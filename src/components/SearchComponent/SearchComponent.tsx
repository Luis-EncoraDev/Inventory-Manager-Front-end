import React, {useState, useEffect} from "react";
import "./SearchComponent.css"
import axios from "axios";

interface Product {
  id: number;
  name: string;
  category: string;
  unitPrice: number;
  expirationDate?: string; // Optional property
  stockQuantity: number;
  // You might have other properties like creationDate, updateDate
}

const SearchComponent = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:9090/api/products");
        setProducts(response.data);
      } catch (err: any) {
        console.error("Error fetching data:", err);
      }
    };

    fetchProducts();
  }, []);

    useEffect(() => {
        const uniqueCategories: string[] = ["All"];
        products.forEach(product => {
            if (!uniqueCategories.includes(product.category)) uniqueCategories.push(product.category);
        })
        setCategories(uniqueCategories);
    }, [products]);

    return(
        <div className="container">
            <div className="nameContainer">
                <label>Product name:</label>
                <input type="search" className="inputName"/>
            </div>
            <div className="categoryContainer">
                <label>Category:</label>
                <select className="inputCategory">
                    {
                        categories.map(category => (
                            <option key={category}>{category}</option>
                        ))
                    }
                </select>
            </div>
            <div className="availabilityContainer">
                <label>Availability:</label>
                <select className="inputAvailability">
                    <option>All</option>
                    <option>In stock</option>
                    <option>Out of stock</option>
                </select>
            </div>
            <button className="searchButton">Search</button>
        </div>
    )
}


export default SearchComponent;