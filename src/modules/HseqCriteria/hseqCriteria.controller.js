import { AppError, catchAsync } from '../../errors/index.js'
import { qualificationHseqResults } from '../../utils/qualificationHseqCriteria.js'
import { validateHseqCriteria, validatePartialHseqCriteria } from './hseqCriteria.schema.js'
import { HseqCriteriaService } from './hseqCriteria.service.js'
import { supplierService } from '../Supplier/supplier.controller.js'
import HseqCriteria from './hseqCriteria.model.js'

const hseqCriteriaService = new HseqCriteriaService()

export const findAllHseqCriteria = catchAsync(async (req, res, next) => {
    const hseqCriteria = await hseqCriteriaService.findAllHseq()

    return res.status(200).json(hseqCriteria)
})

export const findOneHseqCriteria = catchAsync(async (req, res, next) => {

    const { id } = req.params

    const hseqCriteria = await hseqCriteriaService.findOneHseq(id)

    if (!hseqCriteria) {
        next(new AppError(`Hseq Criteria whit id ${id} not found`, 404))
    }

    return res.status(200).json({
        ok: true,
        hseqCriteria
    })
})

export const createHseqCriteria = catchAsync(async (req, res, next) => {
    const { hasError, errorMessages, hseqCriteriaData } = validateHseqCriteria(req.body)

    if (hasError) {
        return res.status(422).json({
            status: 'error',
            message: errorMessages
        })
    }

    const { id } = req.params;

    const supplier = await supplierService.finOneSupplier(id);

    if (!supplier) {
        return next(new AppError(`Supplier whit id ${id} not found`, 404));
    }

    const existingCriteria = await HseqCriteria.findOne({ where: { supplier_id: id } });

    if (existingCriteria) {
        return next(new AppError('This supplier has already created its Comercial Criteria', 409));
    }

    const qualificationResults = await qualificationHseqResults(hseqCriteriaData)

    hseqCriteriaData.qualificationResults = qualificationResults;

    const hseqCriteria = await hseqCriteriaService.createHseq({ ...hseqCriteriaData, supplier_id: id })

    await hseqCriteriaService.updateHseq(hseqCriteria)

    return res.status(201).json({
        ok: true,
        hseqCriteria,
        qualificationResults
    })
})

export const updateHseqCriteria = catchAsync(async (req, res, next) => {
    const { hasError, errorMessages, hseqCriteriaData } = validatePartialHseqCriteria(req.body)

    if (hasError) {
        return res.status(422).json({
            status: 'error',
            message: errorMessages
        })
    }

    const { id } = req.params

    const hseqCriteria = await hseqCriteriaService.findOneHseq(id)

    if (!hseqCriteria) {
        next(new AppError(`Hseq Criteria whit id ${id} not found`, 404))
    }

    const qualificationResults = await qualificationHseqResults(hseqCriteria)

    hseqCriteria.qualificationResults = qualificationResults;

    await hseqCriteriaService.updateHseq(hseqCriteria, hseqCriteriaData)

    return res.status(200).json({
        status: 'succes',
        message: 'Hseq Criteria updated successfully',
        hseqCriteria,
        qualificationResults
    })
})

export const deleteHseqCriteria = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const hseqCriteria = await hseqCriteriaService.findOneHseq(id)

    if (!hseqCriteria) {
        next(new AppError(`Hseq Criteria whit id ${id} not found`, 404))
    }

    await hseqCriteriaService.deleteHseq(hseqCriteria)

    return res.status(200).json({
        status: 'success',
        message: 'Hseq Criteria deleted successfullys'
    })
})