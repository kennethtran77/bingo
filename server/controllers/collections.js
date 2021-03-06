import CollectionModel from '../models/collection.js';
import ConceptModel from '../models/concept.js';

export const getCollections = async (req, res) => {
    try {
        const collections = await CollectionModel.find({
            'creator': req.user.id
        })

        res.status(200).json(collections);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createCollection = async (req, res) => {
    const newCollection = new CollectionModel({
        title: 'New Collection',
        concepts: [],
        tags: [],
        creator: req.user.id
    });

    try {
        await newCollection.save();

        res.status(201).json(newCollection);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const updateCollection = async (req, res) => {
    const { collectionId } = req.params;
    const { title, tags } = req.body;

    try {
        const collection = await CollectionModel.findById(collectionId);

        // Check to see if the collection with given id exists
        if (!collection)
            return res.status(404).send(`No collection found with id ${collectionId}`);

        if (req.user.id !== collection.creator.toString())
            return res.status(403).json({ message: 'Unauthorized action' });
        
        if (title.length < 3)
            return res.status(200).json({ message: 'Save failed: title must be at least 3 characters long.' });

        const updatedCollection = {
            creator: collection.creator,
            concepts: collection.concepts,
            title,
            tags,
            _id: collection._id
        };

        await CollectionModel.findByIdAndUpdate(collectionId, updatedCollection, { new: true });

        res.status(200).json({ updatedCollection, message: 'Saved collection.' });
    } catch (error) {
        res.status(409).json({ message: error.message });
    };
}

export const addToCollection = async (req, res) => {
    const { collectionId } = req.params;
    const { conceptId } = req.body;

    try {
        const collection = await CollectionModel.findById(collectionId);

        // Check to see if the collection with given id exists
        if (!collection)
            return res.status(404).send(`No collection found with id ${collectionId}`);

        // Check to see if the concept with given id exists
        if (!await ConceptModel.findById(conceptId))
            return res.status(404).send(`No concept found with id ${conceptId}`);

        if (req.user.id !== collection.creator.toString())
            return res.status(403).json({ message: 'Unauthorized action' });
    
        collection.concepts.push(conceptId);

        await collection.save();
        res.status(200).json({ message: 'Successfully added concept.' });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const removeFromCollection = async (req, res) => {
    const { collectionId } = req.params;
    const { conceptId } = req.body;

    try {
        const collection = await CollectionModel.findById(collectionId);

        // Check to see if the collection with given id exists
        if (!collection)
            return res.status(404).send(`No collection found with id ${collectionId}`);

        // Check to see if the concept with given id exists
        if (!await ConceptModel.findById(conceptId))
            return res.status(404).send(`No concept found with id ${conceptId}`);

        if (req.user.id !== collection.creator.toString())
            return res.status(403).json({ message: 'Unauthorized action' });
    
        if (!collection.concepts.includes(conceptId))
            return res.status(404).send(`This collection does not contain the given concept`);
        
        collection.concepts = collection.concepts.filter(c => c.toString() !== conceptId);

        await collection.save();
        res.status(200).json({ message: 'Successfully removed concept.' });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const deleteCollection = async (req, res) => {
    const { collectionId } = req.params;

    try {
        const collection = await CollectionModel.findById(collectionId);
        
        // Check to see if the collection with given id exists
        if (!collection)
            return res.status(404).send(`No collection found with id ${collectionId}`);

        if (req.user.id !== collection.creator.toString())
            return res.status(403).json({ message: 'Unauthorized action' });
        
        await collection.delete();
        res.json({ message: 'Collection deleted successfully.' })
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};