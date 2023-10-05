import { faker } from "@faker-js/faker";
import * as rentalRepo from "../../src/repositories/rentals-repository";
import * as movieRepo from "../../src/repositories/movies-repository";
import * as userRepo from "../../src/repositories/users-repository";
import rentalService from "../../src/services/rentals-service"
import dayjs from "dayjs";

describe("Testis unitarios", () => {

  const mock = jest.spyOn(rentalRepo.default, "createRental")
  mock.mockImplementation((): any => { });

  it("Menor de idade não pode alugar filme adulto", async () => {

    const mock = jest.spyOn(movieRepo.default, "getById")
    mock.mockImplementationOnce((): any => {
      return {
        name: faker.music.songName(),
        adultsOnly: true,
        rentalId: null
      }
    })

    const mock1 = jest.spyOn(userRepo.default, "getById")
    mock1.mockImplementationOnce((): any => {
        return {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          cpf: faker.string.numeric(11),
          birthDate: dayjs('2018-09-18').toDate()
        }
      });

    const mock2 = jest.spyOn(rentalRepo.default, "getRentalsByUserId")
    mock2.mockImplementationOnce((): any => { return [] });

    const rental = {
      userId: faker.number.int(),
      moviesId: [faker.number.int()]
    }

    const promise = rentalService.createRental(rental)
    expect(promise).rejects.toEqual({
      name: "InsufficientAgeError",
      message: "Cannot see that movie."
    });
  })


  it("Não pode alugar um filme que não existe", async () => {

    jest.clearAllMocks()

    
    const mock = jest.spyOn(rentalRepo.default, "createRental")
    mock.mockImplementation((): any => { });

    
    const mock1 = jest.spyOn(movieRepo.default, "getById")
    mock1.mockImplementationOnce((): any => { return undefined })

   
    const mock2 = jest.spyOn(userRepo.default, "getById")
    mock2.mockImplementationOnce((): any => {
        return {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          cpf: faker.string.numeric(11),
          birthDate: dayjs("2006-10-10").toDate()
        }
      });

   
    const mock3 = jest.spyOn(rentalRepo.default, "getRentalsByUserId")
    mock3.mockImplementationOnce((): any => {
        return []
      });

    const rental = {
      userId: faker.number.int(),
      moviesId: [faker.number.int()]
    }
    const promise = await rentalService.createRental(rental)

    expect(promise).toBe(undefined);
  })

  it("Não pode alugar um filme que ja ta alugado", async () => {

    jest.clearAllMocks()

  
    const mock = jest.spyOn(rentalRepo.default, "createRental")
    mock.mockImplementation((): any => { });


    const mock1 = jest.spyOn(movieRepo.default, "getById")
    mock1.mockImplementationOnce((): any => {
        return {
          name: faker.music.songName(),
          adultsOnly: false,
          rentalId: 123
        }
      })

   
    const mock2 = jest.spyOn(userRepo.default, "getById")
    mock2.mockImplementationOnce((): any => {
        return {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          cpf: faker.string.numeric(11),
          birthDate: dayjs("2006-10-10").toDate()
        }
      });

    
    const mock3 = jest.spyOn(rentalRepo.default, "getRentalsByUserId")
    mock3.mockImplementationOnce((): any => {
        return []
      });

    const rental = {
      userId: faker.number.int(),
      moviesId: [faker.number.int()]
    }
    const promise = rentalService.createRental(rental)
    await expect(promise).rejects.toEqual({
      name: "MovieInRentalError",
      message: "Movie already in a rental."
    });
  })

  it("alugar se estiver tudo certo", async () => {
    jest.clearAllMocks()

    
    const mock = jest.spyOn(rentalRepo.default, "createRental")
    mock.mockImplementation((): any => { });


    
    const mock1 = jest.spyOn(movieRepo.default, "getById")
    mock1.mockImplementationOnce((): any => {
        return {
          name: faker.music.songName(),
          adultsOnly: false,
          rentalId: null
        }
      })

   
    const mock2 = jest.spyOn(userRepo.default, "getById")
    mock2.mockImplementationOnce((): any => {
        return {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          cpf: faker.string.numeric(11),
          birthDate: dayjs("2006-10-10").toDate()
        }
      });

    
    const mock3 = jest.spyOn(rentalRepo.default, "getRentalsByUserId")
    mock3.mockImplementationOnce((): any => {
        return []
      });

    const rental = {
      userId: faker.number.int(),
      moviesId: [faker.number.int()]
    }
    const result = await rentalService.createRental(rental)
    expect(result).toMatchObject({
      id: expect.any(Number),
      date: expect.any(Date),
      endDate: expect.any(Date),
      userId: expect.any(Number),
      closed: expect.any(Boolean)
    })
  })

})