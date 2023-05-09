module.exports = (sequelize, DataType) => {
    const User = sequelize.define(
        "user", {
            id: {
                type: DataType.STRING,
                primaryKey: true,
                autoIncrement: false,
            },
            name: {
                type: DataType.STRING,
            },
            username: {
                type: DataType.STRING,
            },
            password: {
                type: DataType.STRING,
            },
            email: {
                type: DataType.STRING,
            },
            role: {
                type: DataType.STRING,
            },
            avatar: {
                type: DataType.STRING,
            },
        }, {
            freezeTableName: true,
            timestamps: false,
        }
    );
    return User;
};