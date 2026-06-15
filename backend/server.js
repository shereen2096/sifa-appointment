const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = 7000;

app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection String
const uri = "mongodb+srv://sifashereen12_db_user:shereen@cluster0.hfejmig.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

let appointmentsCollection;
let usersCollection;

// ================= CONNECT DB =================
async function connectDB() {
    try {
        await client.connect();
        console.log("MongoDB Connected");

        const db = client.db("appointmentDB");

        appointmentsCollection = db.collection("appointments");
        usersCollection = db.collection("users");

    } catch (error) {
        console.error(error);
    }
}

connectDB();

// ================= HOME =================
app.get("/", (req, res) => {
    res.send("Server Running Successfully");
});

// ================= GET APPOINTMENTS =================
app.get("/appointments", async (req, res) => {
    try {
        const appointments = await appointmentsCollection.find({}).toArray();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments" });
    }
});

// ================= ADD APPOINTMENT =================
app.post("/Addappointments", async (req, res) => {
    try {

        const appointmentData = {
            ...req.body,
            status: "Pending"
        };

        const result = await appointmentsCollection.insertOne(appointmentData);

        res.json({
            success: true,
            message: "Appointment Booked Successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed To Save Appointment"
        });
    }
});

// ================= REGISTER =================
app.post("/register", async (req, res) => {
    try {

        const userData = req.body;

        const existingUser = await usersCollection.findOne({
            email: userData.email
        });

        if (existingUser) {
            return res.json({
                success: false,
                message: "Email Already Registered"
            });
        }

        await usersCollection.insertOne(userData);

        res.json({
            success: true,
            message: "User Registered Successfully"
        });

    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await usersCollection.findOne({ email, password });

        if (user) {
            res.json({
                success: true,
                message: "Login Successful",
                name: user.name
            });
        } else {
            res.json({
                success: false,
                message: "Invalid Email Or Password"
            });
        }

    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// ================= UPDATE STATUS =================
app.put("/appointment-status/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        await appointmentsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status } }
        );

        res.json({
            success: true,
            message: "Status Updated"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Status Update Failed"
        });
    }
});

// ================= DELETE APPOINTMENT =================
app.delete("/appointments/:id", async (req, res) => {
    try {

        const { id } = req.params;

        await appointmentsCollection.deleteOne({
            _id: new ObjectId(id)
        });

        res.json({
            success: true,
            message: "Appointment Deleted Successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Delete Failed"
        });
    }
});

// ================= START SERVER =================
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});