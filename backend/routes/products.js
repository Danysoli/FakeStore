const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Search = require('../models/Search'); 
const sequelize = require('../db'); 

router.post('/search', async (req, res) => {
    const { searchTerm, productId } = req.body;
  
    try {
      if (!searchTerm) {
        return res.status(400).json({ message: 'searchTerm es requerido.' });
      }
  
      const newSearch = await Search.create({
        search_term: searchTerm,
        product_id: productId || null,
      });
      res.status(201).json({ message: 'Búsqueda registrada exitosamente', newSearch });
    } catch (err) {
      console.error('Error registrando búsqueda:', err);
      res.status(500).json({ message: 'Error registrando búsqueda' });
    }
  });
  
router.get('/top-searches', async (req, res) => {
    try {
      const topSearches = await Search.findAll({
        attributes: [
          'search_term',
          [sequelize.fn('COUNT', sequelize.col('id')), 'search_count'],
        ],
        group: ['search_term'],
        order: [[sequelize.literal('search_count'), 'DESC']],
        limit: 5,
      });
  
      const formattedSearches = topSearches.map(search => ({
        searchTerm: search.search_term,
        searchCount: search.dataValues.search_count,
      }));
  
      res.status(200).json(formattedSearches);
    } catch (err) {
      console.error('Error fetching top searches:', err);
      res.status(500).json({ message: 'Error fetching top searches' });
    }
  });

module.exports = router;
