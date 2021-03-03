const users = [];

// A user contains - id, username, friends list

const addUser = (user) => {
    users.push(user);
    return user;
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getUser = (id) => users.find((user) => user.id === id);

const getFriendsConnected = (friends) => {
    const friendsConnected = [];
    let index;
    for(let i = 0; i < friends.length; i++) {
        index = users.findIndex((user) => user.username === friends[i]);
        if(index !== -1) {
            friendsConnected.push({username: friends[i], id: users[index].id});
        }
    }
    return friendsConnected;
};

module.exports = {addUser, removeUser, getUser, getFriendsConnected};