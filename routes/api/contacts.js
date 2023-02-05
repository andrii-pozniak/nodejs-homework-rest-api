const express = require('express');
const { auth } = require("../../middleware/auth");
const ctrlConstants = require("../../controllers/ContactsControllers")
const { addValidationContacts, validateToggleFavorite } = require("../../middleware/validationContactSchemaJoi");

const router = express.Router();

router.get('/', auth, ctrlConstants.getAll);

router.get('/:contactId', ctrlConstants.getById);

router.post('/', auth, addValidationContacts, ctrlConstants.createContacts);

router.delete('/:contactId', ctrlConstants.deleteContacts);

router.put('/:contactId', addValidationContacts, ctrlConstants.updateContact);

router.patch('/:contactId/favorite', auth, validateToggleFavorite, ctrlConstants.updateStatusContact);




module.exports = router;

