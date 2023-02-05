const { Contact } = require('../model/mongooseSchema');

const getAll = async (req, res, next) => {
  try {
    let contacts = null;
    const { _id } = req.user;
    const { page = 1, limit = 5, favorite } = req.query;
    const skip = (page - 1) * limit;
    if (favorite) {
      contacts = await Contact.find({ owner: _id, favorite: favorite },
        "-__v").populate(
          "owner", "_id email");
      res.json(contacts);
    }
    console.log(favorite)
    contacts = await Contact.find({ owner: _id },
      "-__v", { skip, limit: Number(limit) }).populate(
        "owner", "_id email");
    res.json(contacts);
  } catch (error) {
    next(error)
  }
};

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findOne({ _id: contactId }, "-__v");

    if (!result) {
      return res.status(404).json({
        status: "error",
        code: 404,
        massage: `Contacts with id = ${contactId} not found`
      })
    }
    return res.status(200).json(result)

  } catch (error) {
    next(error)
  }

};

const createContacts = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const result = await Contact.create({ ...req.body, owner: _id });
    return res.status(201).json(result)

  } catch (error) {
    next(error);
  }

};

const deleteContacts = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
    if (!result) {
      return res.status(404).json({
        status: "error",
        code: 404,
        massage: `Contacts with id = ${contactId} not found`
      })
    }
    return res.status(200).json(result)
  } catch (error) {

  }
};

const updateContact = async (req, res, next) => {
  try {

    const { contactId } = req.params;
    const updateContact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
    if (!updateContact) {
      return res.status(404).json({
        status: "error",
        code: 404,
        massage: `Contacts with id = ${contactId} not found`
      })
    }
    return res.status(200).json(updateContact)

  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;
    const updateContact = await Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });
    if (!updateContact) {
      return res.status(404).json({
        status: "error",
        code: 404,
        massage: `Contacts with id = ${contactId} not found`
      })
    }
    return res.status(200).json(updateContact)

  } catch (error) {
    next(error);

  }
};


module.exports = {
  getAll,
  getById,
  createContacts,
  deleteContacts,
  updateContact,
  updateStatusContact
}