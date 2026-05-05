import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../models/users.models.js";
import dotenv from "dotenv";
dotenv.config();

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email" });
        }
        const isMatch = await user.checkPassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }
        const token = jwt.sign(
            { user: { id: user._id, email: user.email, firstname: user.firstname, lastname: user.lastname, role: user.role  } },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );
        const refreshToken = jwt.sign(
            { user: { id: user._id, email: user.email } },
            process.env.REFRESH_TOKEN,
            { expiresIn: "7d" }
        );
        await User.findOneAndUpdate({ email: email }, { refreshToken: refreshToken }, { new: true }).then(updatedUser => {
            console.log("Refresh token updated for user:", updatedUser.email);
        });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 jours
        return res.json({ message: "Logged in", token });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.status(204).json({ message: "No content" });
    const refreshToken = cookies.refreshToken;
    try {
        const user = await User.findOne({ refreshToken: refreshToken });
        if (!user) {
            res.clearCookie("refreshToken", { httpOnly: true, secure: true });
            return res.status(204).json({ message: "No content" });
        }
        await User.findOneAndUpdate({ refreshToken: refreshToken }, { refreshToken: null }, { new: true })
        res.clearCookie("refreshToken", { httpOnly: true, secure: true });
        return res.status(204).json({ message: "Logged out" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const handleSignup = async (req, res) => {
    const { email, password, firstname, lastname } = req.body;
    // si le password n’est pas fourni, bcrypt plante.
    // pensez à tester tous les champs !
    if (!password || password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }
    const hash = await bcrypt.hash(password, 10);
    // création de l’utilisateur dans un try catch au cas où la requête plante
    try {
        if (await User.findOne({ email })) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const user = await User.create({
            email,
            password: hash,
            firstname,
            lastname,
            role: "user"
        });

        return res.json({ message: "User created", user: user.toJSON() });

    } catch (error) {

        return res.status(500).json({ error: error.message });

    }

}

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.status(401).json({ error: "Unauthorized" });
    const refreshToken = cookies.refreshToken;
    try {
        const user = await User.findOne({ refreshToken: refreshToken });
        if (!user) {
            return res.status(403).json({ error: "Forbidden" });
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
            if (err || user.email !== decoded.user.email) {
                return res.status(403).json({ error: "Forbidden" });
            }
            const token = jwt.sign(
                { user: { id: user._id, email: user.email, firstname: user.firstname, lastname: user.lastname, role: user.role } },
                process.env.JWT_SECRET,
                { expiresIn: "15m" }
            );
            return res.json({ token });
        }
        )
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export { handleLogin, handleLogout, handleSignup, handleRefreshToken };