import path from "path";
import { faker } from "@faker-js/faker";
import { promises as fs } from "fs";

export class FileManager {

    async createRandomFile() {
        const fileName = faker.location.zipCode();;
        const fileText = faker.location.zipCode();;
        const folderPath = path.join(__dirname, "../test-data");
        const filePath = path.join(folderPath, fileName);
        await fs.writeFile(filePath, fileText);
        return fileName
    }

    async deleteFile(name: string) {
        const filePath = path.join(__dirname, "../test-data", name);
        await fs.unlink(filePath);
    }
}