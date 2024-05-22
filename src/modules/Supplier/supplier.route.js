import express from 'express'

export const router = express.Router();

import {
    findAllSupplier,
    findOneSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier
} from './supplier.controller.js'

import { validateExistSupplier, protect } from './supplier.middleware.js'

router.route('/')
    .get(findAllSupplier)
router.route('/:id')
    .get(validateExistSupplier, findOneSupplier)

router.route('/')
    .post(protect, createSupplier)

router.route('/:id')
    .patch(protect, updateSupplier)
router.route('/:id')
    .delete(protect, deleteSupplier)