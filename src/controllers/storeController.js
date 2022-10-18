const { cloudinary_js_config } = require("../lib/cloudinary");
const Store = require("../models/Store");
const responseGenerate = require("../utils/responseGenerate");



const createStore = async (req, res, next) => {
	try{
		const owner = req.user._id;
		const body = { ...req.body, owner };
		const upload = await cloudinary_js_config.uploader.upload(req.file.path);
		
		body.image = upload.public_id;
		const store = new Store(body);
		await store.save();
		return res.status(201).json(createResponse(store, 'Store Added successfully!', false));
	} catch(err) {
		next(err);
	}
};


const deleteStore = async (req, res, next) => {
	try{
		const { id } = req.params;
		const store =  await Store.deleteOne({_id: id});
		if(store.deletedCount) {
			return res.status(200).json(responseGenerate(null, 'Store Deleted successfully!', false));
		}
		return res.status(404).json(responseGenerate(null, 'No Store found with this Id!', true));
	} catch(err) {
		next(err);
	}
};


const getStoreById = async (req, res, next) => {
	try{
		const { id } = req.params;
		const store = await Store.findOne({_id: id});
		if(!store) throw new Error('No store found with this id!');
		return res.json(responseGenerate(store));
	} catch(err){
		next(err);
	}
};

const getStores = async (req, res, next) => {
	try{
		const query = req.query;
		const stores = await Store.find(query);
		return res.json(responseGenerate(stores));
	} catch(err){
		next(err);
	}
};


module.exports = {
  createStore,
  deleteStore,
  getStoreById,
  getStores

};