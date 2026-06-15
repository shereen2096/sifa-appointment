const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = 7000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb://sifashereen12_db_user:shereen20@ac-3bl53eq-shard-00-00.hfejmig.mongodb.net:27017,ac-3bl53eq-shard-00-01.hfejmig.mongodb.net:27017,ac-3bl53eq-shard-00-02.hfejmig.mongodb.net:27017/?ssl=true&replicaSet=atlas-14bhim-shard-0&authSource=admin&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const appointmentCollection = client
      .db("MedicarePlus")
      .collection("Appointments");

    // Add Appointment
    app.post("/addappointment", async (req, res) => {
      const appointment = req.body;

      const result = await appointmentCollection.insertOne(appointment);

      res.send(result);
    });

    // Get All Appointments
    app.get("/appointments", async (req, res) => {
      const result = await appointmentCollection.find().toArray();

      res.send(result);
    });

    // Get Single Appointment
    app.get("/appointments/:id", async (req, res) => {
      const id = req.params.id;

      const query = {
        _id: new ObjectId(id),
      };

      const result = await appointmentCollection.findOne(query);

      res.send(result);
    });

    // Update Appointment
    app.patch("/updateappointment/:id", async (req, res) => {
      const id = req.params.id;

      const filter = {
        _id: new ObjectId(id),
      };

      const updatedAppointment = req.body;

      const updateDoc = {
        $set: {
          ...updatedAppointment,
        },
      };

      const options = {
        upsert: true,
      };

      const result = await appointmentCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });

    // Delete Appointment
    app.delete("/appointment/:id", async (req, res) => {
      const result = await appointmentCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });

      res.send(result);
    });

    // MongoDB Connection Test
    await client.db("admin").command({ ping: 1 });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error(error);
  }
}

run();

// Home Route
app.get("/", (req, res) => {
  res.send("Doctor Appointment Management Server Running");
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});