const clientService = require('../../src/modules/clients/clientService');
const clientModel = require('../../src/modules/clients/clientModel');

jest.mock('../../src/modules/clients/clientModel');

beforeEach(() => {
    jest.clearAllMocks();
});

describe("CreateClient", ()=>{
    it('Should create a client successfully', async()=>{
        const client = {
            name : "Juan",
            surname : "Test",
            documentType : "DNI",
            dni : "12345678",
            mail : "juan@test.com"
        };

        clientModel.findExistingClient.mockResolvedValue(null);
        clientModel.createClient.mockResolvedValue({id : 1});

        const result = await clientService.createClient(client);

        expect(result).toEqual({id : 1});
    });

    it('Should fail if dni already exists', async()=>{
        clientModel.findExistingClient.mockResolvedValue({dni : "12345678"});

        await expect(clientService.createClient({
            name : "Juan",
            surname : "Test",
            documentType : "DNI",
            dni : "12345678",
            mail : "juan@test.com"
        })).rejects.toThrow('DNI already exists');
    });
});

describe("getAllClients", ()=>{
    it('Should return all clients', async()=>{
        const mockClients = [
            {
                id : 1,
                nombres : 'Juan',
                apellidos : 'Test'
            },
            {
                id : 2,
                nombres : 'Pepe',
                apellidos : 'TestTwo'
            }
        ];

        clientModel.getAllClients.mockResolvedValue(mockClients);

        const result = await clientService.getAllClients();

        expect(result).toEqual(mockClients);
        expect(clientModel.getAllClients).toHaveBeenCalled();
    });
});

describe("getClientById", ()=>{
    it('Should return client by id', async()=>{
        const client = {
            id : 1,
            name : "Juan",
            dni : "12345678"
        };

        clientModel.getClientById.mockResolvedValue(client);

        const result = await clientService.getClientById(1);

        expect(result).toEqual(client);
    });

    it('Should fail if client does not exist', async()=>{
        clientModel.getClientById.mockResolvedValue(null);

        await expect(clientService.getClientById(999))
            .rejects.toThrow('Client not found');
    });

    it('Should fail if id is not a number', async()=>{
        await expect(clientService.getClientById('abc'))
            .rejects.toThrow('Invalid client id');
    });
});

describe("updateClient", ()=>{
    it('Should update client successfully', async()=>{
        clientModel.getClientById.mockResolvedValue({id : 1});
        clientModel.findClientByUniqueData.mockResolvedValue(null);
        clientModel.updateClient.mockResolvedValue({id : 1});

        const result = await clientService.updateClient(
            1,
            {
                name : "Juan",
                surname : "Test",
                documentType : "DNI",
                dni : "12345678",
                phone : "12345678901",
                address : "test 123",
                mail : "juan@test.com"
            }
        );

        expect(result).toEqual({id : 1});
        expect(clientModel.updateClient).toHaveBeenCalled();
    });

    it('Should fail if unique data already exists', async()=>{
        clientModel.getClientById.mockResolvedValue({id : 1});
        clientModel.findClientByUniqueData.mockResolvedValue({id : 2});

        await expect(
            clientService.updateClient(
                1,
                {
                    name : "Juan",
                    surname : "Test",
                    documentType : "DNI",
                    dni : "12345678",
                    phone : "12345678901",
                    address : "test 123",
                    mail : "juan@test.com"
                }
            )
        ).rejects.toThrow('Client data already exists');
    });
});

describe("deactivateClient", ()=>{
    it('Should deactivate client successfully', async()=>{
        clientModel.getClientById.mockResolvedValue({
            id : 1,
            status : 'A'
        });

        clientModel.updateClientStatus.mockResolvedValue();

        const result = await clientService.deactivateClient(1);
        
        expect(result).toEqual({
            message: 'Client deactivated successfully'
        });
    });

    it('Should fail if client is already deactivate', async()=>{
        clientModel.getClientById.mockResolvedValue({
            id : 1,
            status : 'B'
        });

        await expect(clientService.deactivateClient(1))
            .rejects.toThrow('Client is already inactive');
    })
});

describe("activateClient", ()=>{
    it('Should activate client successfully', async()=>{
        clientModel.getClientById.mockResolvedValue({
            id : 1,
            status : 'B'
        });

        clientModel.updateClientStatus.mockResolvedValue();

        const result = await clientService.activateClient(1);
        
        expect(result).toEqual({
            message: 'Client activated successfully'
        });
    });

    it('Should fail if client is already activate', async()=>{
        clientModel.getClientById.mockResolvedValue({
            id : 1,
            status : 'A'
        });

        await expect(clientService.activateClient(1))
            .rejects.toThrow('Client is already active');
    })
});