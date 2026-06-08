const professorService = require('../../src/modules/professors/professorService');
const professorModel = require('../../src/modules/professors/professorModel');
const bcrypt = require('bcryptjs');

jest.mock('../../src/modules/professors/professorModel');
jest.mock('bcryptjs');

beforeEach(() => {
    jest.clearAllMocks();
});

describe("CreateProfessor", ()=>{
    it('Should create a professor successfully', async()=>{
        const professor = {
            name: "Juan",
            surname: "Test",
            dni: "12345678",
            mail: "juan@test.com",
            user: "juantest",
            password: "123456"
        };

        professorModel.findExistingProfessor.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('hashedPassword');
        professorModel.createProfessor.mockResolvedValue({id: 1});
        
        const result = await professorService.createProfessor(professor);

        expect(result).toEqual({id: 1});
        expect(bcrypt.hash).toHaveBeenCalledWith('123456',10);
        expect(professorModel.createProfessor)
            .toHaveBeenCalledWith(
                expect.objectContaining({password: "hashedPassword"})
            );
    });

    it('Should fail if username already exists', async()=>{
        professorModel.findExistingProfessor.mockResolvedValue({usuario: "juantest"});

        await expect(professorService.createProfessor({
            name: "Juan",
            surname: "Test",
            dni: "12345678",
            mail: "juan@test.com",
            user: "juantest",
            password: "123456"
        })).rejects.toThrow('Username already exists');
    });

    it('Should fail if DNI already exists', async()=>{
        professorModel.findExistingProfessor.mockResolvedValue({dni: "12345678"});

        await expect(professorService.createProfessor({
            name: "Juan",
            surname: "Test",
            dni: "12345678",
            mail: "juan@test.com",
            user: "juantest",
            password: "123456"
        })).rejects.toThrow('DNI already exists');
    });

    it('Should fail if mail already exists', async()=>{
        professorModel.findExistingProfessor.mockResolvedValue({mail: "juan@test.com"});

        await expect(professorService.createProfessor({
            name: "Juan",
            surname: "Test",
            dni: "12345678",
            mail: "juan@test.com",
            user: "juantest",
            password: "123456"
        })).rejects.toThrow('Email already exists');
    });
});

describe("GetAllProfessors", ()=>{
    it('Should return all professors', async()=>{
        const mockProfessors = [
            {
                id: 1,
                nombres: 'Juan',
                apellidos: 'Perez'
            },
            {
                id: 2,
                nombres: 'Maria',
                apellidos: 'Castro'
            }
        ];

        professorModel.getAllProfessors.mockResolvedValue(mockProfessors);

        const result =  await professorModel.getAllProfessors();

        expect(result).toEqual(mockProfessors);
        expect(professorModel.getAllProfessors).toHaveBeenCalled();
    })
});

describe("GetprofessorById", ()=>{
    it('Should return professor by id', async()=>{
        const professor = {
            id : 1,
            nombres : 'Juan'
        };

        professorModel.getProfessorById.mockResolvedValue(professor);

        const result = await professorService.getProfessorById(1);

        expect(result).toEqual(professor);
    });

    it('Should fail if professor does not exist', async()=>{
        professorModel.getProfessorById.mockResolvedValue(null);

        await expect(professorService.getProfessorById(999)).rejects.toThrow('Professor not found');
    });

    it('Should fail if id is not a number', async()=>{
        await expect(professorService.getProfessorById('abc')).rejects.toThrow('Invalid professor id');

        expect(professorModel.getProfessorById).not.toHaveBeenCalled();
    })
});