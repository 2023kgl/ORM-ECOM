const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// GET ALL CATEGORIES

router.get('/', async (req, res) => {
  try {
  const categoryData = await Category.findAll({
    include: [{ model: Product}]
  });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET CATEGORY BY ID

router.get('/:id', async(req, res) => {
  try {
  const categoryData = await Category.findByPk(req.params.id , {
    include: [{ model: Product, attributes: ['product_name'] }]
  })
  if (!categoryData) {
    res.status(404).json({ message: 'No category found with this id!' });
    return;
  }
  res.status(200).json(categoryData);
} catch (err) {
  res.status(500).json(err);
}
});

// CREATE NEW CATEGORY

router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(500).json(err)
  }
})

// UPDATE BY ID 
router.put('/:id', async (req, res) => {
 try {
  const categoryData = await Category.update(req.body,
    { 
      where: { category_id: req.params.id } 
    }
  )
  if (!categoryData) {
    res.status(404).json({ message: 'No category found with this id!' });
    return;
  }
  res.status(200).json(categoryData)
 } catch (err) {
  res.status(500).json(err)
  console.log(err)
 }
});

// DELETE BY ID 
router.delete('/:id', async (req, res) => {
  try {
    const categoryData = await Category.destroy(
      { 
        where: { category_id: req.params.id } 
      }
    )
    if (!categoryData) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }
    res.status(200).json(categoryData)
   } catch (err) {
    res.status(500).json(err)
   }
});

module.exports = router;
