var UserModel = require('../models/UserModel').UserModel;

var add_user = function () {
    var user = new UserModel(
        {
            name : "Developer",
            email : "dev@example.com",
            password: "123456",
            role: UserModel.roles.dev,
            status: UserModel.statuses.Active
        }
    );

    user.gen();
    user.setPassword("123456");
    user.save(function (err, model) {
        if (err){
            console.error(err);
            return console.error(err);
        }
        console.error("Added dev user OK");
    });

    user = new UserModel(
        {
            name : "Admin",
            email : "admin@example.com",
            password: "123456",
            role: UserModel.roles.admin,
            status: UserModel.statuses.Active
        }
    );

    user.gen();
    user.setPassword("123456");
    user.save(function (err, model) {
        if (err){
            console.error(err.toJSON());
            return console.error(err);
        }
        console.error("Added admin user OK");
    });

    user = new UserModel(
        {
            name : "Manager",
            email : "manager@example.com",
            password: "123456",
            role: UserModel.roles.manager,
            status: UserModel.statuses.Active
        }
    );

    user.gen();
    user.setPassword("123456");
    user.save(function (err, model) {
        if (err){
            console.error(err.toJSON());
            return console.error(err);
        }
        console.error("Added manager user OK");
    });

    user = new UserModel(
        {
            name : "User",
            email : "user@example.com",
            password: "123456",
            role: UserModel.roles.user,
            status: UserModel.statuses.Active
        }
    );

    user.gen();
    user.setPassword("123456");

    user.save(function (err, model) {
        if (err){
            console.error(err.toJSON());
            return console.error(err);
        }
        console.error("Added user user OK");
    });


    user = new UserModel(
        {
            name : "User2",
            email : "user2@example.com",
            password: "123456",
            role: UserModel.roles.user,
            status: UserModel.statuses.Active
        }
    );

    user.gen();
    user.setPassword("123456");
    user.save(function (err, model) {
        if (err){
            console.error(err.toJSON());
            return console.error(err);
        }
        console.error("Added user user OK");
    });
};

// add_user();
// return;
UserModel.find().remove().exec(function (err) {
    UserModel.ensureIndexes(function (err) {
        add_user();
    });
});