const rutineModel = require('../../src/modules/rutines/rutineModel');
const rutineService = require('../../src/modules/rutines/rutineService');
const clientService = require('../../src/modules/clients/clientService');

jest.mock('../../src/modules/clients/clientService');
jest.mock('../../src/modules/rutines/rutineModel');

describe('createRutine', ()=>{
    it('Should create a rutine successfully', async()=>{
        const rutineData = {
            name : 'Rutine',
            notes : 'None'
        };

        clientService.getClientById.mockResolvedValue({id : 1});

        rutineModel.findRutineByUniqueData.mockResolvedValue(null);
        rutineModel.createRutine.mockResolvedValue({id : 1});

        const result = await rutineService.createRutine(1, rutineData);

        expect(result).toEqual({id : 1});
    });

    it('Should fail if rutine name already exists', async()=>{
        const rutineData = {
            name : 'Rutine',
            notes : 'None'
        };

        clientService.getClientById.mockResolvedValue({id : 1});

        rutineModel.findRutineByUniqueData.mockResolvedValue({1 : 1});

        await expect(rutineService.createRutine(1, rutineData)
        ).rejects.toThrow('Rutine name already exists');
    })
});

describe('getRutinesByClient', ()=>{
    it('Should return rutines by client', async()=>{
        const rutines = [
            {
                id : 1,
                idCliente : 1,
                nombre : 'Monday',
                estado : 'A'
            },
            {
                id : 10,
                idCliente : 1,
                nombre : 'Special',
                observaciones : 'Rutina especial',
                estado : 'B'
            }
        ]

        clientService.getClientById.mockResolvedValue({id : 1});
        rutineModel.getRutinesByClient.mockResolvedValue(rutines);

        const result = await rutineService.getRutinesByClient(1);

        expect(result).toEqual(rutines);
        expect(clientService.getClientById).toHaveBeenCalledWith(1);
    });
});

describe('getRutineById', ()=>{
    it('Should return rutine by id', async()=>{
        const rutine = {
            id : 1,
            idCliente : 1,
            nombre : 'Rutina',
            observaciones : 'Ninguna',
            estado : 'A'
        };

        rutineModel.getRutineById.mockResolvedValue(rutine);

        const result = await rutineService.getRutineById(1);

        expect(result).toEqual(rutine);

    });

    it('Should fail if id is not a number', async()=>{
        await expect(rutineService.getRutineById('abc')
        ).rejects.toThrow('Invalid rutine id');
    });

    it('Should fail if rutine does not exist', async()=>{
        rutineModel.getRutineById.mockResolvedValue(null);

        await expect(rutineService.getRutineById(999)
        ).rejects.toThrow('Rutine not found');
    });
});

describe('updateRutine', ()=>{
    it('Should update rutine successfully', async()=>{
        const rutineData = {
            name : 'NewName'
        };

        rutineModel.getRutineById.mockResolvedValue({id : 1});
        rutineModel.findRutineByUniqueData.mockResolvedValue(null);
        rutineModel.updateRutine.mockResolvedValue({id : 1});

        const result = await rutineService.updateRutine(1, rutineData);

        expect(result).toEqual({id : 1});
        expect(rutineModel.updateRutine).toHaveBeenCalled();
    });
    
    it('Should fail if rutine name already exists', async()=>{
        const rutineData = {
            name : 'NewName'
        };

        rutineModel.getRutineById.mockResolvedValue({id : 1});
        rutineModel.findRutineByUniqueData.mockResolvedValue({1 : 1});

        await expect(rutineService.updateRutine(1, rutineData)
        ).rejects.toThrow('Rutine name already exists');
    });
});

describe('deactivateRutine', ()=>{
    it('Should deactivate rutine', async()=>{
        rutineModel.getRutineById.mockResolvedValue({
            id : 1,
            estado : 'A'
        });

        rutineModel.updateRutineStatus.mockResolvedValue();

        const result = await rutineService.deactivateRutine(1);

        expect(result).toEqual({
            message : 'Rutine deactivated successfully'
        });
    });

    it('Should fail if rutine is already deactivate', async()=>{
        rutineModel.getRutineById.mockResolvedValue({
            id : 1,
            estado : 'B'
        });

        await expect(rutineService.deactivateRutine(1)
        ).rejects.toThrow('Rutine is already inactive');
    });
});

describe('activateRutine', ()=>{
    it('Should activate rutine', async()=>{
        rutineModel.getRutineById.mockResolvedValue({
            id : 1,
            estado : 'B'
        });

        rutineModel.updateRutineStatus.mockResolvedValue();

        const result = await rutineService.activateRutine(1);

        expect(result).toEqual({
            message : 'Rutine activated successfully'
        });
    });

    it('Should fail if rutine is already activate', async()=>{
        rutineModel.getRutineById.mockResolvedValue({
            id : 1,
            estado : 'A'
        });

        await expect(rutineService.activateRutine(1)
        ).rejects.toThrow('Rutine is already active');
    });
});

describe('deleteRutine', ()=>{
    it('Should delete rutine successfully', async()=>{
        rutineModel.getRutineById.mockResolvedValue({id : 1});
        rutineModel.deleteRutine.mockResolvedValue();

        const result = await rutineService.deleteRutine(1);

        expect(result).toEqual({
            message: 'Rutine deleted successfully'
        });
        expect(rutineModel.deleteRutine).toHaveBeenCalled();
    });
});
