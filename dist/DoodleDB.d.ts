export interface SearchQuery {
    [key: string]: string | number;
}
export declare class DoodleDB {
    path: string;
    constructor(options: {
        /**
         * The path to the database.
         * A file will be created to the directory if it does not exist already.
        */
        filePath: string;
    });
    /**
     * Pushes data to a collection in the JSON file.
     * @returns {Promise<string>} Success / Error message
     */
    push(options: {
        collectionName: string;
        data: {
            id?: number;
            [key: string]: unknown;
        };
    }): Promise<string>;
    /**
     *
     * Retrieves data from the JSON database based on a search query.
     * @returns An array of objects matching the search query.
     */
    get(options: {
        collectionName: string;
        searchQuery: SearchQuery;
    }): Promise<any[] | string>;
    /**
     * Retrieves an entire collection from the JSON file.
     * @returns The entire collection matching the collectionName.
     */
    getCollection(options: {
        collectionName: string;
    }): Promise<any[] | string>;
    /**
     * Edit an object from an existing collection in the JSON file.
     * @returns {Promise<string>} Success / Error message.
     */
    edit(options: {
        collectionName: string;
        /** The ID of the object to edit inside the collection */
        targetID: number;
        /** Data to add or replace */
        updatedData: {
            [key: string]: string | number;
        };
    }): Promise<string>;
    /**
     * Delete a collection from a JSON file.
     * @returns {Promise<string>} Success / Error message.
     */
    deleteObject(options: {
        collectionName: string;
        targetID: number;
    }): Promise<string>;
    /**
     * Delete specific properties from a dataset in the JSON file.
     * @returns {Promise<string>} Success / Error message.
     */
    delete(options: {
        collectionName: string;
        /** The ID of the object the property is on */
        targetID: number;
        /** The keys you would like to delete. */
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
    private readJSONData;
    /** @ignore */
    private saveJSONData;
}
