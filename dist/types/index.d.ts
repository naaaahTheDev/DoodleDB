declare const _default: {
    push(options: {
        filePath: string;
        collectionName: string;
        data: {
            [key: string]: any;
            id?: number | undefined;
        };
    }): Promise<string>;
    get(options: {
        filePath: string;
        collectionName: string;
        searchQuery: {
            [key: string]: string | number;
        };
    }): Promise<any[]>;
    getCollection(options: {
        filePath: string;
        collectionName: string;
    }): Promise<any[]>;
    edit(options: {
        filePath: string;
        collectionName: string;
        objectID: number;
        editObject: {
            [key: string]: string | number;
        };
    }): Promise<string>;
    delCollection(options: {
        filePath: string;
        collectionName: string;
        objectID: number;
    }): Promise<string>;
    del(options: {
        filePath: string;
        collectionName: string;
        objectID: number;
        deleteObject: object;
    }): Promise<string>;
    createIndex(options: {
        filePath: string;
        collectionName: string;
        fieldName: string;
    }): Promise<string>;
};
export default _default;
