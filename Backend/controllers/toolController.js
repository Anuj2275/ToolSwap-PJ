import Tool from '../models/toolModel.js';

export const listNewTool = async (req, res, next) => {
  const { name, category, description, condition, longitude, latitude } = req.body;
  try {
    const tool = new Tool({
      name,
      category,
      description,
      condition,
      owner: req.user._id, 
      imageUrl: req.file.path, 
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
    });

    const createdTool = await tool.save();
    res.status(201).json(createdTool);
  } catch (error) {
    next(error);
  }
};

export const getNearbyTools = async (req, res, next) => {
  const { lng, lat, dist } = req.query; 
  try {
    const tools = await Tool.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          
          $maxDistance: parseInt(dist) || 10000,
        },
      },
      availability: true,
    }).populate('owner', 'name trustScore'); 

    res.json(tools);
  } catch (error) {
    next(error);
  }
};

export const getToolById = async (req, res, next) => {
  try {
    const tool = await Tool.findById(req.params.id).populate(
      'owner',
      'name trustScore'
    );

    if (tool) {
      res.json(tool);
    } else {
      res.status(404);
      throw new Error('Tool not found');
    }
  } catch (error) {
    next(error);
  }
};