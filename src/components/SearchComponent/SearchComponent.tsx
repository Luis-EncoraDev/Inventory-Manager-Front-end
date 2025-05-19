import React, {useState, useEffect} from "react";
import "./SearchComponent.css"
import axios from "axios";

const rows = [
  {
    id: 1,
    name: "Organic Gala Apples",
    category: "Produce",
    unitPrice: 1.99,
    expirationDate: "2025-05-23",
    stockQuantity: 1,
  },
  {
    id: 2,
    name: "Whole Wheat Bread Loaf",
    category: "Bakery",
    unitPrice: 3.50,
    expirationDate: "2025-05-19",
    stockQuantity: 4,
  },
  {
    id: 3,
    name: "Cheddar Cheese Block",
    category: "Dairy & Cheese",
    unitPrice: 6.75,
    expirationDate: "2025-06-10",
    stockQuantity: 8,
  },
  {
    id: 4,
    name: "Ground Coffee (Medium Roast)",
    category: "Pantry",
    unitPrice: 8.99,
    expirationDate: "2026-01-15",
    stockQuantity: 20,
  },
  {
    id: 5,
    name: "Boneless Chicken Breast (1kg)",
    category: "Meat & Seafood",
    unitPrice: 12.50,
    expirationDate: "2025-05-18",
    stockQuantity: 100,
  },
  {
    id: 6,
    name: "Almond Milk (Unsweetened)",
    category: "Beverages",
    unitPrice: 4.25,
    expirationDate: "2025-06-01",
    stockQuantity: 250,
  },
  {
    id: 7,
    name: "Pasta (Spaghetti)",
    category: "Pantry",
    unitPrice: 1.79,
    expirationDate: "2026-03-20",
    stockQuantity: 16,
  },
  {
    id: 8,
    name: "Greek Yogurt (Plain)",
    category: "Dairy & Cheese",
    unitPrice: 3,
    expirationDate: "2025-05-25",
    stockQuantity: 180,
  },
  {
    id: 9,
    name: "Frozen Broccoli Florets",
    category: "Frozen Foods",
    unitPrice: 3.29,
    expirationDate: "2026-11-01",
    stockQuantity: 350,
  },
  {
    id: 10,
    name: "Olive Oil (Extra Virgin)",
    category: "Pantry",
    unitPrice: 15.99,
    expirationDate: "2027-04-05",
    stockQuantity: 10,
  }
];

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