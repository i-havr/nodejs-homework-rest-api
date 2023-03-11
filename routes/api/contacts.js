const express = require('express');

const router = express.Router();

const {
  checkNewContactData,
  checkEditedContactData,
} = require('../../middlewares/contactsMiddlewares');

const {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
} = require('../../models/contacts');

router.get('/', listContacts);

router.get('/:id', getById);

router.post('/', checkNewContactData);
router.post('/', addContact);

router.delete('/:id', removeContact);

router.put('/:id', checkEditedContactData);
router.put('/:id', updateContact);

// router.get('/', async (_, res) => {
//   try {
//     const contacts = await listContacts();
//     res.status(200).json(contacts);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// });

// router.get('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const contact = await getById(id);
//     return contact
//       ? res.status(200).json(contact)
//       : res.status(404).json({ message: 'Not found' });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// });

// router.post('/', async (req, res) => {
//   try {
//     const { name, email, phone } = req.body;

//     if (!name || !email || !phone) {
//       return res.status(400).json({ message: 'missing required name field' });
//     } else {
//       const idKeys = (await listContacts()).map(contact => +contact.id);
//       const newContact = {
//         id: String(Math.max(...idKeys) + 1),
//         name,
//         email,
//         phone,
//       };
//       await addContact(newContact);
//       res.status(201).json(newContact);
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// });

// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const contact = await removeContact(id);

//     return contact
//       ? res.status(200).json({ message: 'contact deleted' })
//       : res.status(404).json({
//           message: 'Not found',
//         });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// });

// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!req.body || Object.keys(req.body).length === 0) {
//       return res.status(400).json({ message: 'missing fields' });
//     } else {
//       const updatedContact = await updateContact(id, req.body);

//       return updatedContact
//         ? res.status(200).json(updatedContact)
//         : res.status(404).json({
//             message: 'Not found',
//           });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// });

module.exports = router;
