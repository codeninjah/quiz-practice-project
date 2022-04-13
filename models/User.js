const { Model, DataTypes } = require('sequelize')
const bcrypt = require('bcryptjs')

module.exports = database => {
    class User extends Model{
        static async authenticate(username, password){
            const user = await User.findOne({where: {username}})
            if(!user){
                throw new Error('Invalid username')
            }
            if(!bcrypt.compareSync(password, user.password_hash)){
                throw new Error('Invalid password')
            }
            return user
        }
    }

    User.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            password_hash: {
                type: DataTypes.TEXT,
                allowNull: false
            },
        },
        {
            sequelize: database,
            modelName: 'User',
            hooks: {
                beforeCreate(instance, options){
                    instance.password_hash = bcrypt.hashSync(instance.password_hash)
                }
            }
        }
    )

    return User
}