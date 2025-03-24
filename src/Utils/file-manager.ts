import path from "path";
import { faker } from "@faker-js/faker";
import { promises as fs } from "fs";

export class FileManager {
    static async createRandomFile(folderPath: string): Promise<FileConfig> {
        const fileName = faker.string.alphanumeric(5) + ".txt";
        const fileText = faker.string.alphanumeric(30);
        const filePath = path.join(folderPath, fileName);
        await fs.writeFile(filePath, fileText);
        return {fileName, filePath};
    }

    static async deleteFile(filePath: string) {
        await fs.unlink(filePath);
    }
}

export type FileConfig = {
    fileName: string;
    filePath: string;
};
