const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// GET ALL PRODUCTS
router.get('/', async(req, res) => {
  try {
    const productData = await Product.findAll({
      include: [ 
        {model: Category} 
      ]
    })
    res.status(200).json(productData)
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET PRODUCT BY ID
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [ {model: Category}]
    })
    if (!productData) {
      res.status(404).json({message: 'No produdct found with this id!'})
      return;
    }
    res.status(200).json(productData)
  }catch (err) {
    res.status(500).json(err)
  }
});

// CREATE NEW PRODUCT
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// UPDATE PRODUCT

router.put('/:id', (req, res) => {
  Product.update(req.body, { where: { product_id: req.params.id} } )
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll( { where: { product_id: req.params.id } } )
        .then((productTags) => {
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }
      return res.json(product);
    })
    .catch((err) => {
      res.status(400).json(err)
      console.log(err)
    });
});

// DELETE BY ID

router.delete('/:id', async(req, res) => {
  try {
    const productData = await Product.destroy(
      {
        where: {product_id: req.params.id}
      }
    )
    res.status(200).json(productData)
  } catch (error) {
    res.status(404).json(err)
  }
});

module.exports = router;
