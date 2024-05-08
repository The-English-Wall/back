import express from 'express';
import { router as criteriaComercialRoute } from '../modules/ComercialCriteria/comercialCriteria.route.js'
import { router as supplierRoute } from '../modules/Supplier/supplier.route.js';
import { router as taxInformationRoute } from '../modules/TaxInformation/taxInformation.route.js';
import { router as safetyCriteria } from '../modules/SafetyCriteria/safetyCriteria.route.js';
import { router as hseqCriteria } from '../modules/HseqCriteria/hseqCriteria.route.js';

export const router = express.Router()

router.use('/criteria-comercial', criteriaComercialRoute)
router.use('/taxinformation', taxInformationRoute)
router.use('/safetycriteria', safetyCriteria)
router.use('/hseqcriteria', hseqCriteria)
router.use('/supplier', supplierRoute)


