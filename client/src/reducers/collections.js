const collectionsReducer = (state = { isLoading: false, collections: [] }, action) => {
    switch (action.type) {
        case 'collections/startLoading':
            return { ...state, isLoading: true };
        case 'collections/stopLoading':
            return { ...state, isLoading: false };
        case 'collections/fetchAll':
            return { ...state, collections: action.payload };
        case 'collections/create':
            return { ...state, collections: [...state.collections, action.payload ]};
        case 'collections/delete':
            return { ...state, collections: state.collections.filter(collection => collection._id !== action.payload) };
        case 'collections/addTo': {
            const { collection, conceptId } = action.payload;
            const updatedCollection = { ...collection, concepts: [...collection.concepts, conceptId] };
            return { ...state, collections: state.collections.map(c => c._id === collection._id ? updatedCollection : c) };
        } case 'collections/removeFrom': {
            const { collection, conceptId } = action.payload;
            const updatedCollection = { ...collection, concepts: collection.concepts.filter(concept => concept !== conceptId) };
            return { ...state, collections: state.collections.map(c => c._id === collection._id ? updatedCollection : c)};
        } default:
            return state;
    }
};

export default collectionsReducer;