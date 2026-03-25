import { Category } from "@/type/category-type";

export const flattenCategories = (
    categories: Category[],
    level = 0
): (Category & { level: number })[] => {
    let flat: (Category & { level: number })[] = [];
    categories.forEach((cat) => {
        flat.push({ ...cat, level });
        if (cat.children && cat.children.length > 0) {
            flat = flat.concat(flattenCategories(cat.children, level + 1));
        }
    });
    return flat;
};
