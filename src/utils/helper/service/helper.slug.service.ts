
export class HelperSlugService {
    constructor() { }



    createSlug(text: string): string {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    }

    async checkSlug(title: string, service: any): Promise<Record<string, any>> {
        const slug: string = this.createSlug(title)
        const find: Record<string, any> = await service.findOne({ slug: slug });

        return {
            slug,
            find
        };
    }

}
