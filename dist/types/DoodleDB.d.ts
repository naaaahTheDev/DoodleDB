export interface SearchQuery {
    [key: string]: string | number;
}
export declare class DoodleDB {
    path: string;
    constructor(options: {
        filePath: string;
    });
    /**
     * Pushes data to the JSON file.
     * @returns {Promise<string>} Error / success message
     */
    push(options: {
        collectionName: string;
        data: {
            id?: number;
            [key: string]: any;
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
     * Retrieve the entire collection from the JSON file
     */
    getCollection(options: {
        collectionName: string;
    }): Promise<any[]>;
    /**
     * Edit an existing collection in the JSON file.
     * @returns {Promise<string>} Error / success message
     */
    edit(options: {
        collectionName: string;
        objectID: number;
        editObject: {
            [key: string]: string | number;
        };
    }): Promise<string>;
    /**
     * Delete an entire collection from the JSON file.
     * @returns {Promise<string>} Error / success message
     */
    deleteCollection(options: {
        collectionName: string;
        objectID: number;
    }): Promise<string>;
    /**
     * Deletes specific properties from an existing dataset in the JSON file.
     * @returns {Promise<string>} Error / success message
     */
    delete(options: {
        collectionName: string;
        objectID: number;
        deleteObject: object;
    }): Promise<string>;
    /**
     * Creates an index for faster searching
     * @returns {Promise<string>} Error / success message
     */
    createIndex(options: {
        collectionName: string;
        fieldName: string;
    }): Promise<string>;
    /** @ignore */
    private readDataObject;
    /** @ignore */
    private saveDataObject;
}
