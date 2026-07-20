const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAllMembers = async (req, res) => {
    const results = await mongodb
        .getDatabase()
        .collection("members")
        .find();

    const lists = await results.toArray();

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
};

const getSingleMember = async (req, res) => {
    const memberId = req.params.id;

    const result = await mongodb
        .getDatabase()
        .collection("members")
        .findOne({ _id: new ObjectId(memberId) });

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
};

const createMember = async (req, res) => {
    const member = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        membershipDate: req.body.membershipDate,
        gender: req.body.gender,
        age: req.body.age,
    };

    const response = await mongodb
        .getDatabase()
        .collection("members")
        .insertOne(member);

    if (response.acknowledged) {
        res.status(201).json({
            message: "Member created successfully",
            id: response.insertedId
        });
    } else {
        res.status(500).json(response.error || "Failed to create member.");
    }
};

  const updateMember = async (req, res) => {
    const memberId = new ObjectId(req.params.id);

    const member = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        membershipDate: req.body.membershipDate,
        gender: req.body.gender,
        age: req.body.age,
    };

    const response = await mongodb
        .getDatabase()
        .collection("members")
        .replaceOne({ _id: memberId }, member);

    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || "Failed to update member.");
    }
};

const deleteMember = async (req, res) => {
    const memberId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().collection("members").deleteOne({ _id: memberId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || "Failed to delete member.");
    }
};


module.exports = {
    getAllMembers,
    getSingleMember,
    createMember,
    updateMember,
    deleteMember
};