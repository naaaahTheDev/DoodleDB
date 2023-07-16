declare const _default: {
    push(filePath: string, dataCollectionName: string, data: {
        [key: string]: any;
        id?: number | undefined;
    }): void;
    get(filePath: string, dataCollectionName: string, searchQuery: {
        [key: string]: string | number;
    }, callback: (foundData: any[]) => void): void;
    getCollection(filePath: string, dataCollectionName: string, callback: (dataCollection: any[]) => void): void;
    edit(filePath: string, dataCollectionName: string, objectID: number, editObject: {
        [key: string]: string | number;
    }): void;
    delCollection(filePath: string, dataCollectionName: string, objectID: number): void;
    del(filePath: string, dataCollectionName: string, objectID: number, deleteObject: object): void;
};
export default _default;
