
const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);

    return hours * 60 + minutes;
};

const formatDateToSQL = (date) => {
    return date.toISOString().split('T')[0];
};

module.exports = {
    timeToMinutes,
    formatDateToSQL
};