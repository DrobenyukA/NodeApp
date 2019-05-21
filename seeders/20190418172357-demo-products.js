'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            'Products',
            [
                {
                    title: 'A book',
                    description: 'Simple book',
                    imageSrc: 'https://heathbrothers.com/ot/wp-content/uploads/2013/01/book-mts.png',
                    imageAlt: 'a book',
                    price: 11.99,
                    userId: 1,
                },
                {
                    title: 'Feel the fear',
                    description: 'Book about humans fears',
                    imageSrc: 'https://cdn.lifehack.org/wp-content/uploads/2014/10/fear.jpg',
                    imageAlt: 'fear book',
                    price: 59.99,
                    userId: 1,
                },
            ],
            {},
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Products', null, {});
    },
};
