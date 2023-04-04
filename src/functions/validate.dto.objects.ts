

// Function for validation objects property types
export const validateObjectPropertyType = (object, objectTemplate) => {
    let validationChecker: boolean = false;
    for (const property in object) {
        for (const templateProperty in objectTemplate) {
            if (property === templateProperty) {
                if (typeof object[property] !== objectTemplate[templateProperty].type) {
                    validationChecker = true;
                }
                if (typeof object[property] === 'string') {
                    if (object[property].length > objectTemplate[templateProperty].length) {
                        validationChecker = true;
                    }
                }
                // if (typeof object[property] === 'number') {
                //     validationChecker = false;
                // }
            }
        }
    }
    return validationChecker;
}