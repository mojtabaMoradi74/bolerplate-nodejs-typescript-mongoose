
import sharp from 'sharp';
import path from 'path';

class Resize {
    folder
    constructor(folder: any) {
        this.folder = folder;
    }
    async save(buffer: Buffer) {
        const filename = Resize.filename();
        const filepath = this.filepath(filename);

        await sharp(buffer)
            .resize(300, 300, {
                fit: sharp.fit.inside,
                withoutEnlargement: true
            })
            .toFile(filepath);

        return filename;
    }
    static filename() {
        return `${Math.random()}.png`;
    }
    filepath(filename: string) {
        return path.resolve(`${this.folder}/${filename}`)
    }
}
module.exports = Resize;