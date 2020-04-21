const colors = ['blue', 'green', 'red', 'pink', 'purple', 'cyan', 'indigo', 'teal', 'lime', 'yellow', 'amber', 'orange', 'brown', 'grey', 'blue-grey'];

const randomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
};

module.exports = randomColor;