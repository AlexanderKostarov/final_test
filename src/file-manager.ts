import path from "path";
import { faker } from "@faker-js/faker";
import { promises as fs } from "fs";

export class FileManager {

    fileObject: { folderPath: string; filePath: string; fileName: string, fileText: string };

    constructor(folderPath: string) {
        // Initializing the object in the constructor
        this.fileObject = {
            folderPath: folderPath,
            filePath: '',
            fileName: '',
            fileText: '',
        };
    }
    
    async createFileData() {
        this.fileObject.fileName = faker.string.alphanumeric(5) + '.txt'
        this.fileObject.fileText = faker.string.alphanumeric(30)
        this.fileObject.filePath = path.join(this.fileObject.folderPath, this.fileObject.fileName);
    }

    async createRandomFile() {
        this.createFileData()
        await fs.writeFile(this.fileObject.filePath, this.fileObject.fileText)
        return {
            fileName: this.fileObject.fileName,
            fileText: this.fileObject.fileText,
        }
    }

    async deleteFile() {
        const deleteFilePath = this.fileObject.filePath
        await fs.unlink(deleteFilePath);
    }


}
