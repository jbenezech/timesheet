export class JoinValueConverter {
    toView(value) {
        if (
            value === undefined ||
            !Array.isArray(value)
        ) {
            return '';
        }
        return value.join(', ');
    }
}