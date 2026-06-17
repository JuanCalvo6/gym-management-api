const professorService = require('../../src/modules/professors/professorService');
const professorModel = require('../../src/modules/professors/professorModel');
const bcrypt = require('bcryptjs');

jest.mock('../../src/modules/professors/professorModel');
jest.mock('bcryptjs');

beforeEach(() => {
    jest.clearAllMocks();
});

describe("createProfessor", ()=>{
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

describe("getAllProfessors", ()=>{
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

describe("getprofessorById", ()=>{
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

describe("updateProfessor", ()=>{
    it('Should update professor successfully', async()=>{
        professorModel.getProfessorById.mockResolvedValue({
            id : 1
        });

        professorModel.findProfessorByUniqueData.mockResolvedValue(null);

        professorModel.updateProfessor.mockResolvedValue({id: 1});

        const result = await professorService.updateProfessor(
            1,
            {
                name: "Juan",
                surname: "Test",
                dni:"37094226",
                address: "Avenida Test 123",
                phone: "3881234567",
                mail: "juan231@test.com",
                user: "juantest"
            }
        );

        expect(result).toEqual({id: 1});
        expect(professorModel.updateProfessor).toHaveBeenCalled();
    });

    it('Should fail if id is not a number', async()=>{
        await expect(
            professorService.updateProfessor(
                'abc',
                {}
            )
        ).rejects.toThrow('Invalid professor id');
    });

    it('Should fail if professor is not exist', async()=>{
        professorModel.getProfessorById.mockResolvedValue(null);

        await expect(
            professorService.updateProfessor(
                999,
                {}
            )
        ).rejects.toThrow('Professor not found');
    });

    it('Should fail if unique data already exists', async()=>{
        professorModel.getProfessorById.mockResolvedValue({
            id : 1
        });

        professorModel.findProfessorByUniqueData.mockResolvedValue({
            id : 2
        });

        await expect(
            professorService.updateProfessor(
                1,
                {
                    name: "Juan",
                    surname: "Test",
                    dni:"37094226",
                    address: "Avenida Test 123",
                    phone: "3881234567",
                    mail: "juan231@test.com",
                    user: "juantest"
                }
            )
        ).rejects.toThrow('Professor data already exists');
    })
});

describe("deactivateProfessor", ()=>{
    it('Should deactivate professor', async()=>{
        professorModel.getProfessorById.mockResolvedValue({id : 1});

        professorModel.updateProfessorStatus.mockResolvedValue();

        const result = await professorService.deactivateProfessor(1);

        expect(result).toEqual({
            message : 'Professor deactivated successfully'
        });
    });

    it('Should fail if professor is already deactivate', async()=>{
        professorModel.getProfessorById.mockResolvedValue({
            id : 1,
            estado : 'B'
        });

        await expect(professorService.deactivateProfessor(1))
            .rejects.toThrow('Professor is already inactive');
    })

    it('Should fail if id is not a number', async()=>{
        await expect(professorService.deactivateProfessor('abc'))
            .rejects.toThrow('Invalid professor id');
    });

    it('Should fail if professor does not exist', async()=>{
        professorModel.getProfessorById.mockResolvedValue(null);

        await expect(professorService.deactivateProfessor(9999))
            .rejects.toThrow('Professor not found');
    });
});

describe("activateProfessor", ()=>{
    it('Should activate professor', async()=>{
        professorModel.getProfessorById.mockResolvedValue({id : 1});

        professorModel.updateProfessorStatus.mockResolvedValue();

        const result = await professorService.activateProfessor(1);

        expect(result).toEqual({
            message : 'Professor activated successfully'
        });
    });

    it('Should fail if professor is already activate', async()=>{
        professorModel.getProfessorById.mockResolvedValue({
            id : 1,
            estado : 'A'
        });

        await expect(professorService.activateProfessor(1))
            .rejects.toThrow('Professor is already active');
    })

    it('Should fail if id is not a number', async()=>{
        await expect(professorService.activateProfessor('abc'))
            .rejects.toThrow('Invalid professor id');
    });

    it('Should fail if professor does not exist', async()=>{
        professorModel.getProfessorById.mockResolvedValue(null);

        await expect(professorService.activateProfessor(9999))
            .rejects.toThrow('Professor not found');
    });
});

describe("updateProfessorPassword", ()=>{
    it('Should update password successfully', async()=>{
        professorModel.getProfessorById.mockResolvedValue({id: 1});
        bcrypt.hash.mockResolvedValue('hashedpassword');
        professorModel.updateProfessorPassword.mockResolvedValue();

        const result = await professorService.updateProfessorPassword(1, '123456');

        expect(result).toEqual({message: 'Password update successfully'});
        
        expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);

        expect(professorModel.updateProfessorPassword).toHaveBeenCalledWith(
            1,
            'hashedpassword'
        );
    });

    it('Should fail if id is not a number', async()=>{
        
        await expect(professorService.updateProfessorPassword('abc', '123456'))
            .rejects.toThrow('Invalid professor id');
    });

    it('Should fail if professor does not exist', async()=>{
        professorModel.getProfessorById.mockResolvedValue(null);

        await expect(professorService.updateProfessorPassword(999, '123456'))
            .rejects.toThrow('Professor not found');
    });

    it('Should not hash password if professor does not exist', async()=>{
        professorModel.getProfessorById.mockResolvedValue(null);

        await expect(professorService.updateProfessorPassword(999, '123456'))
            .rejects.toThrow('Professor not found');
        
        expect(bcrypt.hash).not.toHaveBeenCalled();
    });
});