const router = require('express').Router();
const { Tag, Product } = require('../../models');

// The /api/tags endpoint

//GET  ALL TAGS

router.get('/', async (req, res) => {
try {
  const tagData = await Tag.findAll()
  res.status(200).json(tagData)
} catch (err){
  res.status(500).json(err)
}
});

// GET TAG BY ID

router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id)
  if (!tagData) {
    res.status(404).json({ message: 'No tag found with this id!' });
    return;
  }
  res.status(200).json(tagData)
} catch (err) {
  res.status(500).json(err)
}
});

// CREATE NEW TAG

router.post('/', async (req, res) => {
  try {
    const tagData = await Tag.create(req.body)
    res.status(200).json(tagData)
  } catch (err) {
    res.status(500).json(err)
  }
});

// UPDATE TAG BY ID

router.put('/:id', async(req, res) => {
  try {
    const tagData = await Tag.update(req.body, 
      {where:{tag_id: req.params.id}}
    )
    if (!tagData) {
      res.status(404).json({ message: 'No tag found to update with this id!'})
      return
    }
    res.status(200).json(tagData)
  } catch (err) {
    res.status(500).json(err)
  }
});

// DELETE BY TAG ID

router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy(
      {where:{tag_id: req.params.id}}
    )
    if (!tagData) {
      res.status(404).json({message: 'No tag found with this id!'})
      return;
    }
    res.status(200).json(tagData)
  } catch (error) {
    res.status(500).json(err)
  }
});

module.exports = router;
