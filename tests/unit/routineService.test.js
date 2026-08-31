const routineModel = require('../../src/modules/routines/routineModel');
const routineService = require('../../src/modules/routines/routineService');
const clientService = require('../../src/modules/clients/clientService');

jest.mock('../../src/modules/clients/clientService');
jest.mock('../../src/modules/routines/routineModel');

describe('createRoutine', ()=>{
    it('Should create a routine successfully', async()=>{
        const routineData = {
            name : 'Routine',
            notes : 'None'
        };

        clientService.getClientById.mockResolvedValue({id : 1});

        routineModel.findRoutineByUniqueData.mockResolvedValue(null);
        routineModel.createRoutine.mockResolvedValue({id : 1});

        const result = await routineService.createRoutine(1, routineData);

        expect(result).toEqual({id : 1});
    });

    it('Should fail if routine name already exists', async()=>{
        const routineData = {
            name : 'Routine',
            notes : 'None'
        };

        clientService.getClientById.mockResolvedValue({id : 1});

        routineModel.findRoutineByUniqueData.mockResolvedValue({1 : 1});

        await expect(routineService.createRoutine(1, routineData)
        ).rejects.toThrow('Routine name already exists');
    })
});

describe('getRoutinesByClient', ()=>{
    it('Should return routines by client', async()=>{
        const routines = [
            {
                id : 1,
                idClient : 1,
                name : 'Monday',
                status : 'A'
            },
            {
                id : 10,
                idClient : 1,
                name : 'Special',
                notes : 'Rutina especial',
                status : 'B'
            }
        ]

        clientService.getClientById.mockResolvedValue({id : 1});
        routineModel.getRoutinesByClient.mockResolvedValue(routines);

        const result = await routineService.getRoutinesByClient(1);

        expect(result).toEqual(routines);
        expect(clientService.getClientById).toHaveBeenCalledWith(1);
    });
});

describe('getRoutineById', ()=>{
    it('Should return routine by id', async()=>{
        const routine = {
            id : 1,
            idClient : 1,
            name : 'Rutina',
            notes : 'Ninguna',
            status : 'A'
        };

        routineModel.getRoutineById.mockResolvedValue(routine);

        const result = await routineService.getRoutineById(1);

        expect(result).toEqual(routine);

    });

    it('Should fail if id is not a number', async()=>{
        await expect(routineService.getRoutineById('abc')
        ).rejects.toThrow('Invalid routine id');
    });

    it('Should fail if routine does not exist', async()=>{
        routineModel.getRoutineById.mockResolvedValue(null);

        await expect(routineService.getRoutineById(999)
        ).rejects.toThrow('Routine not found');
    });
});

describe('updateRoutine', ()=>{
    it('Should update routine successfully', async()=>{
        const routineData = {
            name : 'NewName'
        };

        routineModel.getRoutineById.mockResolvedValue({id : 1});
        routineModel.findRoutineByUniqueData.mockResolvedValue(null);
        routineModel.updateRoutine.mockResolvedValue({id : 1});

        const result = await routineService.updateRoutine(1, routineData);

        expect(result).toEqual({id : 1});
        expect(routineModel.updateRoutine).toHaveBeenCalled();
    });
    
    it('Should fail if routine name already exists', async()=>{
        const routineData = {
            name : 'NewName'
        };

        routineModel.getRoutineById.mockResolvedValue({id : 1});
        routineModel.findRoutineByUniqueData.mockResolvedValue({1 : 1});

        await expect(routineService.updateRoutine(1, routineData)
        ).rejects.toThrow('Routine name already exists');
    });
});

describe('deactivateRoutine', ()=>{
    it('Should deactivate routine', async()=>{
        routineModel.getRoutineById.mockResolvedValue({
            id : 1,
            status : 'A'
        });

        routineModel.updateRoutineStatus.mockResolvedValue();

        const result = await routineService.deactivateRoutine(1);

        expect(result).toEqual({
            message : 'Routine deactivated successfully'
        });
    });

    it('Should fail if routine is already deactivate', async()=>{
        routineModel.getRoutineById.mockResolvedValue({
            id : 1,
            status : 'B'
        });

        await expect(routineService.deactivateRoutine(1)
        ).rejects.toThrow('Routine is already inactive');
    });
});

describe('activateRoutine', ()=>{
    it('Should activate routine', async()=>{
        routineModel.getRoutineById.mockResolvedValue({
            id : 1,
            status : 'B'
        });

        routineModel.updateRoutineStatus.mockResolvedValue();

        const result = await routineService.activateRoutine(1);

        expect(result).toEqual({
            message : 'Routine activated successfully'
        });
    });

    it('Should fail if routine is already activate', async()=>{
        routineModel.getRoutineById.mockResolvedValue({
            id : 1,
            status : 'A'
        });

        await expect(routineService.activateRoutine(1)
        ).rejects.toThrow('Routine is already active');
    });
});

describe('deleteRoutine', ()=>{
    it('Should delete routine successfully', async()=>{
        routineModel.getRoutineById.mockResolvedValue({id : 1});
        routineModel.deleteRoutine.mockResolvedValue();

        const result = await routineService.deleteRoutine(1);

        expect(result).toEqual({
            message: 'Routine deleted successfully'
        });
        expect(routineModel.deleteRoutine).toHaveBeenCalled();
    });
});
