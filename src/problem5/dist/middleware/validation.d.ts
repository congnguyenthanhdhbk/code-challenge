import { Request, Response, NextFunction } from 'express';
export declare const validateCreateResource: import("express-validator").ValidationChain[];
export declare const validateUpdateResource: import("express-validator").ValidationChain[];
export declare const validateResourceId: import("express-validator").ValidationChain[];
export declare const validateResourceFilters: import("express-validator").ValidationChain[];
export declare const handleValidationErrors: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validation.d.ts.map