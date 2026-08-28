const routineLineModel = require('../../src/modules/routineLines/routineLineModel');
const routineLineService = require('../../src/modules/routineLines/routineLineService');
const routineService = require('../../src/modules/routines/routineService');

jest.mock('../../src/modules/routineLines/routineLineModel');
jest.mock('../../src/modules/routines/routineService');

describe('createRoutineLine', ()=>{
    it('Should create a routineLine successfully', async()=>{
        const routileLineData = {
            exercise : 'Exercise',
            repetitions : '11',
            sets : 1,
            rest : 'None'
        };

        routineService.getRoutineById.mockResolvedValue({
            id : 1,
            idCliente : 1
        });

        routineLineModel.createRoutineLine.mockResolvedValue({id : 1});

        const result = await routineLineService.createRoutineLine(1,routileLineData);

        expect(result).toEqual({id : 1});
    });
});

describe('getRoutineLinesByRoutine', ()=>{
    it('Should return all routine lines by routine', async()=>{
        const routineLines = [
            {
                id : 1,
                exercise : 'Exercise',
                repetitions : '11',
                sets : 1,
                rest : 'None'
            },
            {
                id : 2,
                exercise : 'Exercise2',
                repetitions : '1',
                sets : 3,
                rest : '30"'
            }

        ];

        routineService.getRoutineById.mockResolvedValue({id : 1});
        routineLineModel.getRoutineLinesByRoutine.mockResolvedValue(routineLines);

        const result = await routineLineService.getRoutineLinesByRoutine(1);

        expect(result).toEqual(routineLines);
        expect(routineService.getRoutineById).toHaveBeenCalledWith(1);
    });
});

describe('getRoutineLineById', ()=>{
    it('Should return routine line by id', async()=>{
        const routineLine = {
            id : 1,
            exercise : 'Exercise',
            repetitions : '11',
            sets : 1,
            rest : 'None'
        };

        routineLineModel.getRoutineLineById.mockResolvedValue(routineLine);

        const result = await routineLineService.getRoutineLineById(1);

        expect(result).toEqual(routineLine);
    });

    it('Should fail if id is not a number', async()=>{
        await expect(routineLineService.getRoutineLineById('abc')
        ).rejects.toThrow('Invalid routineLine id');
    });

    it('Should fail if routine line does not exist', async()=>{
        routineLineModel.getRoutineLineById.mockResolvedValue(null);

        await expect(routineLineService.getRoutineLineById(999)
        ).rejects.toThrow('Routine line not found');
    });
});

describe('updateRoutineLine', ()=>{
    it('Should update routine line successfully', async()=>{
        const routineLineData = {
            repetitios : '20'
        };

        routineLineModel.getRoutineLineById.mockResolvedValue({id : 1});
        routineLineModel.updateRoutineLine.mockResolvedValue({id : 1});

        const result = await routineLineService.updateRoutineLine(1, routineLineData);

        expect(result).toEqual({id : 1});
        expect(routineLineModel.updateRoutineLine).toHaveBeenCalled();

    });
});

describe('deleteRoutineLine', ()=>{
    it('Should delete routine line successfully', async()=>{
        routineLineModel.getRoutineLineById.mockResolvedValue({id : 1});
        routineLineModel.deleteRoutineLine.mockResolvedValue();

        const result = await routineLineService.deleteRoutineLine(1);

        expect(result).toEqual({
            message : 'Routine line deleted successfully'
        });
        expect(routineLineModel.deleteRoutineLine).toHaveBeenCalled();
    });
});