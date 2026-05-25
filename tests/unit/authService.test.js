const authService = require('../../src/modules/auth/authService');
const authModel = require('../../src/modules/auth/authModel');

jest.mock('../../src/modules/auth/authModel');

describe("AuthService ", () =>{
    it("Should login successfully", async()=>{
        authModel.findUser.mockResolvedValue({
            id : 1,
            password : await require('bcryptjs').hash('1234',10),
            type : 'admin' 
        });

        const result = await authService.login(
            'juan123',
            '1234'
        );

        expect(result).toHaveProperty('token');
    });

    it("Should fail if user does not exist", async()=>{
        authModel.findUser.mockResolvedValue(null);

        expect(
            authService.login(
            'juan12',
            '1234'
            )
        ).rejects.toThrow('Invalid credentials');
    });

    it("Should fail with wrong password", async()=>{
        authModel.findUser.mockResolvedValue({
            id : 1,
            password : await require('bcryptjs').hash('5678',10),
            type : 'admin' 
        });

        expect(
            authService.login(
            'juan123',
            '1234'
            )
        ).rejects.toThrow('Invalid credentials');
    });
});