export const adjustHours = (date, direction) => {
    while (![2, 5, 8, 11, 14, 17, 20, 23].includes(date.getHours()))
        date.setHours(date.getHours() + direction)
}

export const formatTimestamp = (timestamp) => {
    return timestamp.toISOString().slice(0, 16) + "Z"
}
