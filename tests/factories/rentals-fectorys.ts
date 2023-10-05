import { faker } from "@faker-js/faker";
import prisma from "database";
import dayjs from "dayjs";

export async function createRandomMovie(adult?: boolean){
    const movie = await prisma.movie.create({
        data: {
            name: faker.music.songName(),
            adultsOnly: adult || faker.datatype.boolean()
        }
    });
    return movie;
}



export async function createRental(userId: number, moviesIds: number[], closed?: boolean){
    const date = dayjs();
    const rental = await prisma.rental.create({
        data: {
            date: date.toDate(),
            endDate: date.add(2, 'day').toDate(),
            userId,
            closed: closed || false
        }
    });
    moviesIds.forEach(movieId => {
        prisma.movie.update({
            data: {
                rentalId: rental.id
            },
            where: {
                id: movieId
            }
        })
    })

    return rental;
}

export async function createRandomUser(adult?: boolean){
    const birthDate = adult ? dayjs("2000-10-10").toDate() : faker.date.birthdate();
    const user = await prisma.user.create({
        data: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            cpf: faker.string.numeric(11),
            birthDate
        }
    })
    return user;
}