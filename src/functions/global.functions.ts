// Function for change number to bolean value
export const changeNumberToBolean = (number: number) => {
    if (number) { return true } else { return false };
}

// Function for change boolean to zero or one
export const changeBooleanToNumber = (boolean: boolean) => {
    if (boolean) { return 1 } else { return 0 };
}