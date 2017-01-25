export class LimitToValueConverter {
    toView(array, count) {
        if (array == null || array === undefined) {
            return [];
        }
        return array.slice(0, count);
    }
}