import { TService } from "./service.interface";
import { ServiceModel } from "./service.model";

const createServiceInDB = async (data: TService) => {
    const result = await ServiceModel.create(data);
    console.log(result);
    return result
};

const getAllServicesFromDB = async () => {
    const result = await ServiceModel.find({ isDeleted: false });
    return result
}


const getServiceByIdFromDB = async (id: string) => {
    const result = await ServiceModel.findById(id);
    return result
}

const updateServiceInDB = async (id: string, payload: Partial<TService>) => {
    const result = await ServiceModel.findByIdAndUpdate(id, payload, { new: true });
    return result
};

const deleteServiceFromDB = async (id: string) => {
    const result = await ServiceModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result
}

export const serviceServices = {
    createServiceInDB,
    getAllServicesFromDB,
    getServiceByIdFromDB,
    updateServiceInDB,
    deleteServiceFromDB
}