module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Game', {
        title: {
            type: DataTypes.STRING(25),
            allowNull: false,
        },

        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        studio: {
            type: DataTypes.STRING,
            allowNull: false,            
        },

        esrbRating: {
            type: DataTypes.CHAR(5),
            allowNull: false,
        },

        userRating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },

        havePlayed : {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    })
}