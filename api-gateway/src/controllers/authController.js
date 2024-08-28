const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { tokenBlacklistRepository, userRepository } = require('../repository/index');

const doLogin = async (req, res) => {
    try {
        const user = await userRepository.getUser(req.body.email);
        if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({ error: 'Wrong USER and/or PASSWORD' });
        }

        const token = jwt.sign({ userId: user._id, profileId: user.profileId }, process.env.SECRET);
        res.status(200).json({ token });
    } catch (err) {
        console.error('Unexpected error during login:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

async function doLogout(req, res, next) {
    let token = req.headers['authorization'];
    token = token.replace('Bearer', '').trim();
    await tokenBlacklistRepository.addTokenToBlacklist(token);
    res.sendStatus(200);
}

module.exports = {
    doLogin,
    doLogout
}
