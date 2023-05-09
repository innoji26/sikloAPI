module.exports = (sequelize, DataType) => {
    const News = sequelize.define(
        "news", {
            id: {
                type: DataType.STRING,
                primaryKey: true,
                autoIncrement: false,
            },
            idUser: {
                type: DataType.STRING,
            },
            title: {
                type: DataType.STRING,
            },
            // tags: {
            //     type: DataType.STRING,
            // },
            description: {
                type: DataType.STRING,
            },
            image: {
                type: DataType.STRING,
            },
        }, {
            freezeTableName: true,
        }
    );
    return News;
};