
// line audit results 返回结果数据类型---------------------------------------------------------------------------------


export interface LineAuditResult {
    success: boolean,
    result: LineAuditFaultDto[]
}



export interface LineAuditFaultDto {
    equipmentBizId: string,
    faultCode: number,
    occurences: number,
    occurencesPercentage: number,
    duration: string,
    timePercentage: number,
    equipment: LineEquipmentDto,
    reason: ReasonEquipmentDto,
    interval: IntervalDto,
    category: categoryDto
}
export interface LineEquipmentDto {
    bizId: string,
    code: number,
    name: string,
    line: LineDto,
}
export interface ReasonEquipmentDto {
    code: number,
    name: string,
    equipment: LineEquipmentDto
}
export interface IntervalDto {
    from: string
    to: string,
    duration: string
}

export interface LineDto {
    code: number,
    name: string,
    plant: PlantDto,
}
export interface PlantDto {
    code: number,
    name: string
}
export interface categoryDto {
    "categoryGroupCode": string,
    "code": string,
    "name": string,
    "mappings": {}
}

//设备公式返回数据结构-----------------------------------------------------------------------------------------------
// export interface LineEquipmentFormulaResult {
//     success: boolean,
//     result: LineEquipmentFormulaResultDtoMiddle[]
// }
export interface ResponseResult<T> {
    success: boolean,
    result: T[]
}
export interface LineEquipmentFormulaResultDtoMiddle{
    FormData: string,
    to: string,
    name:string,
    result:LineEquipmentFormulaResultDto[]
}

export interface LineEquipmentFormulaResultDto {
    lineEquipment: LineEquipmentDto,
    formula: FormulaDto,
    value: ValueUnitDto,
    target: ValueUnitDto,
    warning: ValueUnitDto,
    targetRange: string,
    interval: IntervalDto
}
export interface LineEquipmentDto {
    bizId: string,
    code: number,
    name: string,
    line: LineDto
}
export interface FormulaDto {
    code: string,
    formulaGroupCode: string,
    name: string
}
export interface ValueUnitDto {
    displayValue: number,
    unit: UnitDto,
    isNaNValue: boolean
}
export interface IntervalDto {
    from: string,
    to: string,
    duration: string,
}
export interface LineDto {
    code: number,
    name: string,
    plant: PlantDto
}
export interface UnitDto {
    code: number,
    name: string,
}
export interface PlantDto {
    code: number,
    name: string
}


/**
 * Machine reason summary feedback result
 */

export interface RawReasonDto {
    reason :ReasonEquipmentDto, 
    category :CategoryDto,
    comment :CommentDto,
    interval :IntervalDto
    }
    export interface ReasonEquipmentDto {
    code :number,
    name :string, 
    equipment :LineEquipmentDto,
    }
    export interface CategoryDto {
    categoryGroupCode :string
    code :string,
    name:string, 
    mappings :inline_model, 
    }
    export interface CommentDto {
    comment :string,
    operator :string,
    user :string,
    predefinedCode :number, 
    predefinedText :string,
    }
    export interface IntervalDto {
    from :string,
    to :string, 
    duration :string
    }
    export interface LineEquipmentDto {
    bizId :string, 
    code :number, 
    name :string, 
    line :LineDto, 
    }
    export interface inline_model {}
    export interface LineDto {
    code :number, 
    name :string, 
    plant :PlantDto, 
    }
    export interface PlantDto {
    code :number, 
    name :string
    }