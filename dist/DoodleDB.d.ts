export interface SearchQuery {
    [key: string]: string | number;
}
export declare class DoodleDB {
    path: string;
    constructor(options: {
        /** The path to the database. A file will be created here if it doesn't exist. */
        filePath: string;
    });
    /**
     * Pushes data to a collection in the JSON file.
     * @returns {Promise<string>} Error / success message
     */
    push(options: {
        collectionName: string;
        data: {
            id?: number;
            [key: string]: unknown;
        };
    }): Promise<string>;
    /**
     * Retrieves data from the JSON database based on a search query.
     * @returns An array of objects matching the search query.
     */
    get(options: {
        collectionName: string;
        searchQuery: SearchQuery;
    }): Promise<any[] | string>;
    /**
     * Retrieve an entire collection from the JSON file
     */
    getCollection(options: {
        collectionName: string;
    }): Promise<any[]>;
    /**
     * Edit an object from an existing collection in the JSON file.
     * @returns {Promise<string>} Error / success message
     */
    edit(options: {
        collectionName: string;
        /** The ID of the object to edit inside the collection. */
        objectID: number;
        /** Data to add to the object with ID `objectID` */
        editObject: {
            [key: string]: string | number;
        };
    }): Promise<string>;
    /**
     * Delete an object from a collection in the JSON file.
     * @returns {Promise<string>} Error / success message
     */
    deleteObject(options: {
        collectionName: string;
        /** The ID of the object to delete. */
        objectID: number;
    }): Promise<string>;
    /**
     * Deletes specific properties from an existing dataset in the JSON file.
     * @returns {Promise<string>} Error / success message
     */
    delete(options: {
        collectionName: string;
        /** The ID of the object the property is on. */
        objectID: number;
        /** A list of keys that will be deleted from the object. */
        targetKeys: string[];
    }): Promise<string>;
    /**
     * Creates an index for faster searching
     * @returns {Promise<string>} Error / success message
     */
    createIndex(options: {
        collectionName: string;
        /** The property on each object in the collection to index. */
        fieldName: string;
    }): Promise<string>;
    /** @ignore */
    private readDataObject;
    /** @ignore */
    private saveDataObject;
}
