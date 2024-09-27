import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [visibleProducts, setVisibleProducts] = useState(10); 
  const [topSearches, setTopSearches] = useState([]); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchTopSearches = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/top-searches');
        setTopSearches(response.data); 
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching top searches:', error);
      }
    };

    fetchProducts();
    fetchTopSearches();
  }, []);

  const registerSearch = async (searchTerm, productId) => {
    try {
      await axios.post('http://localhost:4000/api/search', {
        searchTerm: searchTerm,
        productId: productId || null,
      });
    } catch (error) {
      console.error('Error registering search:', error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (searchTerm) {
        registerSearch(searchTerm, filteredProducts.length > 0 ? filteredProducts[0].id : null);
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadMoreProducts = () => {
    setVisibleProducts((prevVisible) => prevVisible + 10);
  };

  return (
    <div className="App">
      <h1>Fake Store API</h1>
      
      <input
        type="text"
        placeholder="Buscar producto..."
        value={searchTerm}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        className="search-bar"
      />
      
      <div className="product-grid">
        {filteredProducts.slice(0, visibleProducts).map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.title} className="product-image" />
            <h2>{product.title}</h2>
            <p>{product.description.substring(0, 100)}...</p>
            <p><strong>${product.price}</strong></p>
          </div>
        ))}
      </div>
      
      {visibleProducts < filteredProducts.length && (
        <button onClick={loadMoreProducts} className="load-more">
          Ver más
        </button>
      )}

      <div className="top-searches">
        <h2>Top 5 búsquedas más realizadas</h2>
        <ul>
          {topSearches.map((search, index) => (
            <li key={index}>
              <strong>{search.searchTerm}</strong> - {search.searchCount} búsquedas
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
